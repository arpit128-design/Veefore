// Pricing configuration based on the monetization document
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free Forever',
    price: 0,
    currency: 'INR',
    interval: 'month',
    credits: 60,
    features: {
      workspaces: 1,
      socialAccountsPerPlatform: 1,
      basicScheduling: true,
      limitedAnalytics: true,
      chromeExtensionLimited: true,
      watermarkedContent: true,
      calendarView: 7, // days
    }
  },
  'creator-pro': {
    id: 'creator-pro',
    name: 'Creator Pro',
    price: 39900, // ₹399 in paise
    currency: 'INR',
    interval: 'month',
    credits: 200,
    features: {
      workspaces: 3,
      socialAccountsPerPlatform: 3,
      advancedScheduling: true,
      fullAnalytics: true,
      chromeExtensionFull: true,
      noWatermarks: true,
      calendarView: 30, // days
      brandVoiceTrainer: true,
      abTesting: true,
      priorityPublishing: true,
      viralContentAdapter: true,
      trendExplorer: true,
    }
  },
  'agency-suite': {
    id: 'agency-suite',
    name: 'Agency Suite',
    price: 89900, // ₹899 in paise
    currency: 'INR',
    interval: 'month',
    credits: 750,
    features: {
      workspaces: 'unlimited',
      socialAccountsPerPlatform: 'unlimited',
      teamCollaboration: true,
      roleBasedAccess: true,
      whiteLabel: true,
      autoPilotScheduling: true,
      aiCommentReplier: true,
      dmAgent: true,
      unifiedInbox: true,
      weeklyReports: true,
      trendForecast: true,
      apiAccess: true,
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'custom',
    currency: 'INR',
    interval: 'month',
    credits: 5000,
    features: {
      dedicatedSupport: true,
      customIntegrations: true,
      bulkGeneration: true,
      privateAI: true,
      advancedAnalytics: true,
      soc2Compliance: true,
      sla: true,
      customCredits: true,
    }
  }
};

export const CREDIT_PACKAGES = [
  {
    id: 'credits-50',
    name: '50 Credits',
    credits: 50,
    price: 5000, // ₹50 in paise
    bonusPercentage: 0,
  },
  {
    id: 'credits-150',
    name: '150 Credits',
    credits: 150,
    price: 15000, // ₹150 in paise
    bonusPercentage: 0,
  },
  {
    id: 'credits-500',
    name: '500 Credits + Bonus',
    credits: 500,
    price: 50000, // ₹500 in paise
    bonusPercentage: 10, // 10% bonus = 50 extra credits
  },
  {
    id: 'credits-2000',
    name: '2000 Credits + Bonus',
    credits: 2000,
    price: 200000, // ₹2000 in paise
    bonusPercentage: 10, // 10% bonus = 200 extra credits
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
  }
};

// AI Feature Credit Costs
export const CREDIT_COSTS = {
  'ai-text-post': 1,
  'ai-carousel': 2,
  'ai-visual': 3,
  'trend-forecast': 4,
  'viral-remix': 3,
  'dm-auto-responder': 0.2,
  'weekly-strategy': 4,
  'brand-voice-training': 6,
  'custom-gpt-task': 2, // base cost, can be 2-5 depending on complexity
  'hashtag-generation': 1,
  'caption-optimization': 1,
  'content-analysis': 2,
  'engagement-prediction': 3,
  'competitor-analysis': 4,
  'video-generation': 5,
  'thumbnail-creation': 2,
  'story-template': 1,
  'reels-script': 2,
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
  
  const bonusCredits = Math.floor(pkg.credits * (pkg.bonusPercentage / 100));
  return {
    baseCredits: pkg.credits,
    bonusCredits,
    totalCredits: pkg.credits + bonusCredits,
    price: pkg.price,
  };
}