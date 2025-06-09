// Pricing configuration based on the monetization document
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free Forever',
    description: 'Perfect for getting started with social media management',
    price: 0,
    currency: 'INR',
    interval: 'month',
    credits: 60,
    features: [
      '1 Workspace',
      '1 Social Account per Platform',
      'Basic Scheduling',
      'Limited Analytics',
      'Chrome Extension (Limited)',
      'Watermarked Content',
      '7-day Calendar View'
    ]
  },
  creator: {
    id: 'creator',
    name: 'Creator Pro',
    description: 'Perfect for content creators and influencers',
    price: 399,
    currency: 'INR',
    interval: 'month',
    credits: 200,
    popular: true,
    features: [
      '3 Workspaces',
      '3 Social Accounts per Platform',
      'Advanced Scheduling',
      'Full Analytics',
      'Chrome Extension (Full)',
      'No Watermarks',
      '30-day Calendar View',
      'Brand Voice Trainer',
      'A/B Testing',
      'Priority Publishing',
      'Viral Content Adapter',
      'Trend Explorer'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Agency Suite',
    description: 'Designed for agencies and teams',
    price: 899,
    currency: 'INR',
    interval: 'month',
    credits: 750,
    features: [
      'Unlimited Workspaces',
      'Unlimited Social Accounts',
      'Team Collaboration',
      'Role-based Access',
      'White Label',
      'Auto Pilot Scheduling',
      'AI Comment Replier',
      'DM Agent',
      'Unified Inbox',
      'Weekly Reports',
      'Trend Forecast',
      'API Access'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'custom',
    currency: 'INR',
    interval: 'month',
    credits: 5000,
    features: [
      'Dedicated Support',
      'Custom Integrations',
      'Bulk Generation',
      'Private AI',
      'Advanced Analytics',
      'SOC2 Compliance',
      'SLA',
      'Custom Credits'
    ]
  }
};

export const CREDIT_PACKAGES = [
  {
    id: 'credits-50',
    name: '50 Credits',
    baseCredits: 50,
    bonusCredits: 0,
    totalCredits: 50,
    price: 50,
  },
  {
    id: 'credits-150',
    name: '150 Credits',
    baseCredits: 150,
    bonusCredits: 0,
    totalCredits: 150,
    price: 150,
  },
  {
    id: 'credits-500',
    name: '500 Credits + Bonus',
    baseCredits: 500,
    bonusCredits: 50,
    totalCredits: 550,
    price: 500,
    savings: '10%',
  },
  {
    id: 'credits-2000',
    name: '2000 Credits + Bonus',
    baseCredits: 2000,
    bonusCredits: 200,
    totalCredits: 2200,
    price: 2000,
    savings: '10%',
  }
];

export const ADDONS = {
  'extra-workspace': {
    id: 'extra-workspace',
    name: 'Additional Brand Workspace',
    price: 4900, // ₹49 in paise
    type: 'workspace',
    interval: 'month',
  },
  'extra-social-account': {
    id: 'extra-social-account',
    name: 'Extra Social Account',
    price: 4900, // ₹49 in paise
    type: 'social-account',
    interval: 'month',
  },
  'viral-boost': {
    id: 'viral-boost',
    name: 'Boosted AI Content Generation',
    price: 9900, // ₹99 in paise
    type: 'ai-boost',
    interval: 'month',
  },
  'affiliate-kit': {
    id: 'affiliate-kit',
    name: 'Affiliate Growth Kit Access',
    price: 9900, // ₹99 in paise
    type: 'affiliate',
    interval: 'month',
  },
  'ai-visual': {
    id: 'ai-visual',
    name: 'Dedicated AI Visual Agent',
    price: 14900, // ₹149 in paise
    type: 'ai-visual',
    interval: 'month',
  },
  'social-crm': {
    id: 'social-crm',
    name: 'Social CRM Expansion Pack',
    price: 19900, // ₹199 in paise
    type: 'crm',
    interval: 'month',
  },
  'team-member': {
    id: 'team-member',
    name: 'Additional Team Member Seat',
    price: 19900, // ₹199 in paise
    type: 'team-member',
    interval: 'month',
  },
  'advanced-analytics': {
    id: 'advanced-analytics',
    name: 'Advanced Analytics Package',
    price: 19900, // ₹199 in paise
    type: 'analytics',
    interval: 'month',
  },
  'white-label-branding': {
    id: 'white-label-branding',
    name: 'White-label Branding',
    price: 49900, // ₹499 in paise
    type: 'branding',
    interval: 'month',
  }
};

// AI Feature Credit Costs
export const CREDIT_COSTS = {
  // AI Text and Caption Generation - 1 credit
  'ai-caption': 1,
  'ai-text-post': 1,
  'caption-optimization': 1,
  'hashtag-generation': 1,
  'ai_suggestions': 1, // AI-powered content and growth suggestions
  'story-template': 1,
  'reels-script': 2, // AI script generation - 2 credits
  
  // AI Image Generation - 8 credits
  'ai-image': 8,
  'ai-visual': 8,
  'thumbnail-creation': 8,
  'ai-carousel': 8,
  
  // AI Video/Reel Generation - 15 credits
  'ai-video': 15,
  'video-generation': 15,
  'ai-reel': 15,
  'viral-remix': 15,
  
  // Other features (unchanged)
  'trend-forecast': 4,
  'dm-auto-responder': 0.2,
  'weekly-strategy': 4,
  'brand-voice-training': 6,
  'custom-gpt-task': 2,
  'content-analysis': 2,
  'engagement-prediction': 3,
  'competitor-analysis': 4,
};

// Referral rewards
export const REFERRAL_REWARDS = {
  inviteFriend: 10, // credits
  submitFeedback: 3, // credits
};

export function getPlanByName(planName: string) {
  return SUBSCRIPTION_PLANS[planName as keyof typeof SUBSCRIPTION_PLANS];
}

export function getCreditPackageById(packageId: string) {
  return CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
}

export function getAddonById(addonId: string) {
  return ADDONS[addonId as keyof typeof ADDONS];
}

export function calculateCreditPackageTotal(packageId: string) {
  const pkg = getCreditPackageById(packageId);
  if (!pkg) return null;
  
  return {
    baseCredits: pkg.baseCredits,
    bonusCredits: pkg.bonusCredits,
    totalCredits: pkg.totalCredits,
    price: pkg.price,
  };
}

// Comprehensive addon checking utility
export async function checkUserAddonAccess(storage: any, userId: number | string, featureType: string): Promise<{
  hasAccess: boolean;
  addonType?: string;
  reason?: string;
}> {
  try {
    // Get user's purchased addons
    const userAddons = await storage.getUserAddons(userId);
    const activeAddons = userAddons.filter((addon: any) => addon.isActive);
    
    // Define feature-to-addon-type mapping
    const featureAddonMap: Record<string, string[]> = {
      'team-collaboration': ['team-member'],
      'advanced-analytics': ['analytics', 'advanced-analytics'],
      'white-label': ['branding', 'white-label-branding'],
      'extra-workspace': ['workspace', 'extra-workspace'],
      'extra-social-account': ['social-account', 'extra-social-account'],
      'ai-boost': ['ai-boost', 'viral-boost'],
      'affiliate-features': ['affiliate', 'affiliate-kit'],
      'ai-visual': ['ai-visual'],
      'social-crm': ['crm', 'social-crm']
    };
    
    const requiredAddonTypes = featureAddonMap[featureType] || [];
    
    // Check if user has any of the required addon types
    for (const addonType of requiredAddonTypes) {
      const hasAddon = activeAddons.some((addon: any) => addon.type === addonType);
      if (hasAddon) {
        return {
          hasAccess: true,
          addonType
        };
      }
    }
    
    return {
      hasAccess: false,
      reason: `This feature requires one of these addons: ${requiredAddonTypes.join(', ')}`
    };
  } catch (error) {
    console.error('[ADDON CHECK] Error checking addon access:', error);
    return {
      hasAccess: false,
      reason: 'Unable to verify addon access'
    };
  }
}