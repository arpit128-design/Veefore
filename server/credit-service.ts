import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './db';
import { users, creditTransactions, subscriptions } from '@shared/schema';
import { CREDIT_COSTS, REFERRAL_REWARDS } from './pricing-config';

export class CreditService {
  
  // Get user's current credit balance
  async getUserCredits(userId: number): Promise<number> {
    const user = await db.select({ credits: users.credits }).from(users).where(eq(users.id, userId)).limit(1);
    return user[0]?.credits || 0;
  }

  // Get user's subscription and credit details
  async getUserCreditInfo(userId: number) {
    const user = await db.select({
      credits: users.credits,
      plan: users.plan
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user[0]) {
      throw new Error('User not found');
    }

    // Get current subscription
    const subscription = await db.select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      ))
      .limit(1);

    // Get recent credit transactions
    const recentTransactions = await db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(10);

    return {
      currentCredits: user[0].credits,
      plan: user[0].plan,
      subscription: subscription[0] || null,
      recentTransactions
    };
  }

  // Check if user has sufficient credits for a feature
  async hasCredits(userId: number, featureType: string, quantity: number = 1): Promise<boolean> {
    const creditCost = CREDIT_COSTS[featureType as keyof typeof CREDIT_COSTS];
    if (!creditCost) {
      throw new Error(`Unknown feature type: ${featureType}`);
    }

    const userCredits = await this.getUserCredits(userId);
    const totalCost = creditCost * quantity;
    
    return userCredits >= totalCost;
  }

  // Consume credits for a feature
  async consumeCredits(userId: number, featureType: string, quantity: number = 1, description?: string): Promise<boolean> {
    const creditCost = CREDIT_COSTS[featureType as keyof typeof CREDIT_COSTS];
    if (!creditCost) {
      throw new Error(`Unknown feature type: ${featureType}`);
    }

    const totalCost = Math.ceil(creditCost * quantity); // Round up for fractional costs
    const userCredits = await this.getUserCredits(userId);

    if (userCredits < totalCost) {
      return false; // Insufficient credits
    }

    // Deduct credits and log transaction
    await db.transaction(async (tx) => {
      // Update user credits
      await tx.update(users)
        .set({ 
          credits: sql`${users.credits} - ${totalCost}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      // Log credit transaction
      await tx.insert(creditTransactions).values({
        userId,
        type: 'used',
        amount: -totalCost,
        description: description || `${featureType} usage (${quantity}x)`,
        referenceId: `${featureType}_${Date.now()}`
      });
    });

    return true;
  }

  // Add credits to user account
  async addCredits(userId: number, amount: number, type: 'purchase' | 'earned' | 'refund' | 'bonus', description: string, referenceId?: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Update user credits
      await tx.update(users)
        .set({ 
          credits: sql`${users.credits} + ${amount}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      // Log credit transaction
      await tx.insert(creditTransactions).values({
        userId,
        type,
        amount,
        description,
        referenceId
      });
    });
  }

  // Reset monthly credits based on subscription
  async resetMonthlyCredits(userId: number): Promise<void> {
    const subscription = await db.select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      ))
      .limit(1);

    if (!subscription[0]) {
      // Free plan gets 60 credits
      await this.addCredits(userId, 60, 'earned', 'Monthly free credits reset', 'monthly_reset');
      return;
    }

    const monthlyCredits = subscription[0].monthlyCredits;
    await this.addCredits(userId, monthlyCredits, 'earned', `Monthly ${subscription[0].plan} credits reset`, 'monthly_reset');
  }

  // Handle referral rewards
  async awardReferralCredits(userId: number, type: 'inviteFriend' | 'submitFeedback'): Promise<void> {
    const credits = REFERRAL_REWARDS[type];
    if (!credits) return;

    await this.addCredits(
      userId, 
      credits, 
      'earned', 
      `Referral reward: ${type}`, 
      `referral_${type}_${Date.now()}`
    );
  }

  // Get credit transaction history
  async getCreditHistory(userId: number, limit: number = 50) {
    return await db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit);
  }

  // Calculate credit rollover (unused credits from previous month)
  async calculateCreditRollover(userId: number): Promise<number> {
    // Get last month's credit reset
    const lastReset = await db.select()
      .from(creditTransactions)
      .where(and(
        eq(creditTransactions.userId, userId),
        eq(creditTransactions.type, 'earned'),
        sql`${creditTransactions.description} LIKE '%Monthly%reset%'`
      ))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(2);

    if (lastReset.length < 2) return 0;

    // Calculate credits used between the two resets
    const startDate = lastReset[1].createdAt;
    const endDate = lastReset[0].createdAt;

    const creditsUsed = await db.select({
      total: sql`SUM(ABS(${creditTransactions.amount}))`
    })
    .from(creditTransactions)
    .where(and(
      eq(creditTransactions.userId, userId),
      eq(creditTransactions.type, 'used'),
      sql`${creditTransactions.createdAt} >= ${startDate}`,
      sql`${creditTransactions.createdAt} <= ${endDate}`
    ));

    const monthlyAllocation = lastReset[1].amount;
    const usedAmount = Number(creditsUsed[0]?.total || 0);
    const rollover = Math.max(0, monthlyAllocation - usedAmount);

    // Max rollover is 30 days worth (same as monthly allocation)
    return Math.min(rollover, monthlyAllocation);
  }

  // Preview credit cost for a feature
  getCreditCost(featureType: string, quantity: number = 1): number {
    const creditCost = CREDIT_COSTS[featureType as keyof typeof CREDIT_COSTS];
    if (!creditCost) {
      throw new Error(`Unknown feature type: ${featureType}`);
    }
    return Math.ceil(creditCost * quantity);
  }

  // Get all available features and their costs
  getAllFeatureCosts() {
    return CREDIT_COSTS;
  }
}

export const creditService = new CreditService();