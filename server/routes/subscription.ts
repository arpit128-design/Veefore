import { Request, Response, Router, NextFunction } from 'express';
import { 
  SUBSCRIPTION_PLANS, 
  CREDIT_PACKAGES, 
  ADDONS, 
  validateFeatureAccess,
  calculateYearlySavings,
  getPlanById,
  getCreditPackageById,
  getAddonById,
  hasEnoughCredits,
  calculateCreditDeduction
} from '../subscription-config';
import { SUBSCRIPTION_PLANS as PRICING_PLANS } from '../pricing-config';
import { z } from 'zod';
import { storage } from '../storage';
import { firebaseAdmin } from '../firebase-admin';

const router = Router();

// Authentication middleware
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    const user = await storage.getUserByFirebaseUid(decodedToken.uid);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[SUBSCRIPTION AUTH] Error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get all subscription plans
router.get('/plans', async (req: Request, res: Response) => {
  try {
    // Use the pricing config directly for correct pricing display
    const plans = Object.values(PRICING_PLANS);
    
    // Convert to object with plan IDs as keys for frontend compatibility
    const plansObject = {};
    plans.forEach(plan => {
      plansObject[plan.id] = plan;
    });
    
    res.json({ 
      plans: plansObject,
      creditPackages: CREDIT_PACKAGES,
      addons: ADDONS
    });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
});

// Get credit packages
router.get('/credit-packages', async (req: Request, res: Response) => {
  try {
    res.json({ packages: CREDIT_PACKAGES });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error fetching credit packages:', error);
    res.status(500).json({ error: 'Failed to fetch credit packages' });
  }
});

// Get available addons
router.get('/addons', async (req: Request, res: Response) => {
  try {
    res.json({ addons: Object.values(ADDONS) });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error fetching addons:', error);
    res.status(500).json({ error: 'Failed to fetch addons' });
  }
});

// Get current user subscription
router.get('/current', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const currentPlan = getPlanById(user.plan || 'free');
    
    // Calculate total credits
    const totalCredits = user.credits || 0;
    const monthlyCredits = currentPlan?.credits || 0;
    
    // Format subscription data for frontend
    const subscriptionData = {
      id: user.id,
      userId: user.id,
      plan: user.plan || 'free',
      planStatus: user.planStatus || 'active',
      credits: totalCredits,
      nextBillingDate: null, // Will be set when payment system is integrated
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        plan: user.plan || 'free',
        planStatus: user.planStatus || 'active',
        credits: totalCredits
      },
      subscription: subscriptionData,
      plan: currentPlan,
      addons: [],
      billing: {
        monthlyCredits,
        totalCredits,
        nextBillingDate: subscriptionData.nextBillingDate
      }
    });
    
    console.log('[SUBSCRIPTION] Returned subscription data:', {
      plan: user.plan || 'free',
      credits: totalCredits,
      planStatus: user.planStatus || 'active'
    });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error fetching current subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

// Validate feature access
router.post('/validate-feature', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { featureId, creditsRequired = 0 } = req.body;
    if (!featureId) {
      return res.status(400).json({ error: 'Feature ID is required' });
    }

    const userPlan = user.plan || 'free';
    const currentPlan = getPlanById(userPlan);
    const userCredits = user.credits || 0;
    
    // Check if feature is allowed on current plan
    const featureConfig = currentPlan?.features?.[featureId];
    const isFeatureAllowed = featureConfig?.allowed || false;
    
    // Check if user has enough credits
    const hasEnoughCredits = userCredits >= creditsRequired;
    
    // Final access decision
    const hasAccess = isFeatureAllowed && hasEnoughCredits;
    
    // Track feature usage if access is granted
    if (hasAccess && creditsRequired > 0) {
      try {
        await storage.trackFeatureUsage(user.id, featureId, creditsRequired);
      } catch (error) {
        console.error('[FEATURE ACCESS] Error tracking usage:', error);
      }
    }
    
    res.json({
      hasAccess,
      isFeatureAllowed,
      hasEnoughCredits,
      userCredits,
      creditsRequired,
      currentPlan: userPlan,
      requiredPlan: featureConfig?.upgrade || null,
      reason: !hasAccess ? 
        (!isFeatureAllowed ? `Feature requires ${featureConfig?.upgrade || 'pro'} plan` : 'Insufficient credits') : 
        'Access granted'
    });
    
    console.log('[FEATURE ACCESS] Validation result:', {
      featureId,
      userId: user.id,
      hasAccess,
      isFeatureAllowed,
      hasEnoughCredits,
      userCredits,
      creditsRequired,
      currentPlan: userPlan
    });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error validating feature access:', error);
    res.status(500).json({ error: 'Failed to validate feature access' });
  }
});

// Update subscription plan
router.post('/update-plan', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { planId, interval = 'month' } = req.body;
    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Calculate price based on interval
    const price = interval === 'year' ? plan.yearlyPrice : plan.price;
    
    // For now, just update the user's plan (payment integration would go here)
    await storage.updateUserPlan(user.id, {
      plan: planId,
      planStatus: 'active',
      interval,
      monthlyCredits: plan.credits
    });

    res.json({ 
      success: true, 
      message: `Successfully updated to ${plan.name} plan`,
      plan: {
        id: planId,
        name: plan.name,
        price,
        interval,
        credits: plan.credits
      }
    });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update subscription plan' });
  }
});

// Purchase credits
router.post('/purchase-credits', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { packageId } = req.body;
    if (!packageId) {
      return res.status(400).json({ error: 'Package ID is required' });
    }

    const creditPackage = getCreditPackageById(packageId);
    if (!creditPackage) {
      return res.status(400).json({ error: 'Invalid credit package ID' });
    }

    // For now, just add credits (payment integration would go here)
    const newCredits = (user.credits || 0) + creditPackage.totalCredits;
    
    await storage.updateUserCredits(user.id, newCredits);
    
    // Log transaction
    await storage.createCreditTransaction({
      userId: user.id,
      type: 'purchase',
      amount: creditPackage.totalCredits,
      description: `Purchased ${creditPackage.name}`,
      referenceId: packageId
    });

    res.json({ 
      success: true, 
      message: `Successfully purchased ${creditPackage.totalCredits} credits`,
      credits: {
        previous: user.credits || 0,
        added: creditPackage.totalCredits,
        total: newCredits
      }
    });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error purchasing credits:', error);
    res.status(500).json({ error: 'Failed to purchase credits' });
  }
});

// Purchase addon
router.post('/purchase-addon', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { addonId } = req.body;
    if (!addonId) {
      return res.status(400).json({ error: 'Addon ID is required' });
    }

    const addon = getAddonById(addonId);
    if (!addon) {
      return res.status(400).json({ error: 'Invalid addon ID' });
    }

    // For now, just add addon (payment integration would go here)
    await storage.createUserAddon({
      userId: user.id,
      type: addon.type,
      name: addon.name,
      price: addon.price,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    res.json({ 
      success: true, 
      message: `Successfully purchased ${addon.name}`,
      addon: {
        id: addonId,
        name: addon.name,
        type: addon.type,
        price: addon.price
      }
    });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error purchasing addon:', error);
    res.status(500).json({ error: 'Failed to purchase addon' });
  }
});

// Get subscription usage analytics
router.get('/usage', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get feature usage for current month
    const featureUsage = await storage.getFeatureUsage(user.id);
    
    // Get recent credit transactions
    const creditTransactions = await storage.getCreditTransactions(user.id, 10);
    
    // Calculate usage statistics
    const currentPlan = getPlanById(user.plan || 'free');
    const planLimits = currentPlan?.features || {};
    
    res.json({
      currentPlan: user.plan || 'free',
      credits: user.credits || 0,
      featureUsage,
      planLimits,
      recentTransactions: creditTransactions
    });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error fetching usage:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

export default router;