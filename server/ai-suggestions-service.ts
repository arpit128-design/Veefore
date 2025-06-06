import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface SuggestionData {
  type: 'trending' | 'hashtag' | 'audio' | 'timing' | 'engagement' | 'growth';
  data: {
    suggestion: string;
    reasoning: string;
    actionItems: string[];
    expectedImpact: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeframe: string;
  };
  confidence: number;
  validUntil: Date;
}

export async function generateIntelligentSuggestions(
  workspace: any,
  socialAccounts: any[],
  recentAnalytics: any[],
  recentContent: any[]
): Promise<SuggestionData[]> {
  try {
    console.log('[AI SUGGESTIONS] Starting intelligent analysis...');
    
    // Analyze account data for AI context
    const accountAnalysis = analyzeAccountPerformance(socialAccounts, recentAnalytics, recentContent);
    
    // Generate AI suggestions using Anthropic
    const aiSuggestions = await generateAISuggestions(accountAnalysis);
    
    // Process and structure suggestions
    const structuredSuggestions = processSuggestions(aiSuggestions);
    
    console.log(`[AI SUGGESTIONS] Generated ${structuredSuggestions.length} intelligent suggestions`);
    return structuredSuggestions;
    
  } catch (error: any) {
    console.error('[AI SUGGESTIONS] Error generating suggestions:', error);
    // Return fallback suggestions based on general best practices
    return generateFallbackSuggestions();
  }
}

function analyzeAccountPerformance(socialAccounts: any[], analytics: any[], content: any[]) {
  const instagramAccount = socialAccounts.find(acc => acc.platform === 'instagram');
  
  // Calculate engagement metrics
  const totalReach = analytics.reduce((sum, a) => sum + (a.metrics?.reach || 0), 0);
  const totalLikes = analytics.reduce((sum, a) => sum + (a.metrics?.likes || 0), 0);
  const totalComments = analytics.reduce((sum, a) => sum + (a.metrics?.comments || 0), 0);
  const avgEngagement = analytics.length > 0 ? (totalLikes + totalComments) / totalReach * 100 : 0;
  
  // Analyze posting patterns
  const postTimes = analytics.map(a => new Date(a.date)).filter(d => d);
  const postingFrequency = calculatePostingFrequency(postTimes);
  
  // Content type analysis
  const contentTypes = content.reduce((acc, c) => {
    const type = c.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  // Performance trends
  const performanceTrend = calculatePerformanceTrend(analytics);
  
  return {
    accountInfo: {
      username: instagramAccount?.username || 'unknown',
      accountType: instagramAccount?.accountType || 'personal',
      followersCount: instagramAccount?.followersCount || 0,
      mediaCount: instagramAccount?.mediaCount || 0
    },
    metrics: {
      totalReach,
      totalLikes,
      totalComments,
      avgEngagement: Math.round(avgEngagement * 100) / 100,
      postCount: analytics.length
    },
    patterns: {
      postingFrequency,
      contentTypes,
      performanceTrend
    },
    recentPerformance: analytics.slice(-5) // Last 5 posts
  };
}

function calculatePostingFrequency(postTimes: Date[]): string {
  if (postTimes.length < 2) return 'insufficient_data';
  
  const sortedTimes = postTimes.sort((a, b) => a.getTime() - b.getTime());
  const daysBetween = (sortedTimes[sortedTimes.length - 1].getTime() - sortedTimes[0].getTime()) / (1000 * 60 * 60 * 24);
  const avgDaysBetweenPosts = daysBetween / (postTimes.length - 1);
  
  if (avgDaysBetweenPosts <= 1) return 'daily';
  if (avgDaysBetweenPosts <= 3) return 'frequent';
  if (avgDaysBetweenPosts <= 7) return 'weekly';
  return 'infrequent';
}

function calculatePerformanceTrend(analytics: any[]): 'improving' | 'declining' | 'stable' | 'unknown' {
  if (analytics.length < 3) return 'unknown';
  
  const recentPosts = analytics.slice(-3);
  const olderPosts = analytics.slice(-6, -3);
  
  if (olderPosts.length === 0) return 'unknown';
  
  const recentAvgEngagement = recentPosts.reduce((sum, a) => 
    sum + ((a.metrics?.likes || 0) + (a.metrics?.comments || 0)), 0) / recentPosts.length;
  
  const olderAvgEngagement = olderPosts.reduce((sum, a) => 
    sum + ((a.metrics?.likes || 0) + (a.metrics?.comments || 0)), 0) / olderPosts.length;
  
  const improvement = (recentAvgEngagement - olderAvgEngagement) / olderAvgEngagement;
  
  if (improvement > 0.1) return 'improving';
  if (improvement < -0.1) return 'declining';
  return 'stable';
}

async function generateAISuggestions(accountAnalysis: any): Promise<any> {
  const hasAccountData = accountAnalysis.accountInfo.username !== 'unknown' && accountAnalysis.accountInfo.followersCount > 0;
  
  let prompt;
  
  if (hasAccountData) {
    // Detailed analysis for connected accounts
    prompt = `You are an expert Instagram growth strategist. Analyze this account data and provide 4-6 specific, actionable suggestions to improve engagement and growth.

Account Analysis:
- Username: ${accountAnalysis.accountInfo.username}
- Account Type: ${accountAnalysis.accountInfo.accountType}
- Followers: ${accountAnalysis.accountInfo.followersCount}
- Posts: ${accountAnalysis.accountInfo.mediaCount}
- Average Engagement Rate: ${accountAnalysis.metrics.avgEngagement}%
- Total Reach: ${accountAnalysis.metrics.totalReach}
- Posting Frequency: ${accountAnalysis.patterns.postingFrequency}
- Performance Trend: ${accountAnalysis.patterns.performanceTrend}
- Content Types: ${JSON.stringify(accountAnalysis.patterns.contentTypes)}

Based on this specific account data, provide detailed suggestions.`;
  } else {
    // Strategic guidance for new accounts or accounts without data
    prompt = `You are an expert Instagram growth strategist. The user is setting up their Instagram strategy. Provide 4-6 specific, actionable suggestions for building a successful Instagram presence from the ground up.

Current Status: New account or account not yet connected
Focus on: Foundation building, content strategy, audience growth, engagement tactics

Provide suggestions that help establish a strong Instagram presence.`;
  }

  prompt += `

Provide suggestions in JSON format:
{
  "suggestions": [
    {
      "type": "trending|hashtag|audio|timing|engagement|growth",
      "title": "Brief title",
      "suggestion": "Detailed actionable suggestion with specific steps",
      "reasoning": "Why this strategy works for Instagram growth",
      "actionItems": ["Specific step 1", "Specific step 2", "Specific step 3"],
      "expectedImpact": "What improvement to expect",
      "difficulty": "Easy|Medium|Hard",
      "timeframe": "How long to see results",
      "confidence": 75-95
    }
  ]
}

Make suggestions highly specific and immediately actionable. Include current Instagram trends and best practices for ${new Date().getFullYear()}.`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const response = await model.generateContent(prompt);
  let responseText = response.response.text();

  // Clean up markdown formatting from Gemini response
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(responseText);
  } catch (parseError) {
    console.error('[AI SUGGESTIONS] Failed to parse AI response:', parseError);
    console.error('[AI SUGGESTIONS] Raw response:', responseText);
    throw new Error('Invalid AI response format');
  }
}

function processSuggestions(aiResponse: any): SuggestionData[] {
  const suggestions: SuggestionData[] = [];
  
  if (aiResponse.suggestions && Array.isArray(aiResponse.suggestions)) {
    for (const suggestion of aiResponse.suggestions) {
      suggestions.push({
        type: suggestion.type || 'growth',
        data: {
          suggestion: suggestion.suggestion || 'No suggestion provided',
          reasoning: suggestion.reasoning || 'No reasoning provided',
          actionItems: suggestion.actionItems || [],
          expectedImpact: suggestion.expectedImpact || 'Positive impact expected',
          difficulty: suggestion.difficulty || 'Medium',
          timeframe: suggestion.timeframe || '1-2 weeks'
        },
        confidence: Math.min(95, Math.max(75, suggestion.confidence || 80)),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Valid for 1 week
      });
    }
  }
  
  return suggestions;
}

function generateFallbackSuggestions(): SuggestionData[] {
  const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const currentYear = new Date().getFullYear();
  
  return [
    {
      type: 'growth',
      data: {
        suggestion: 'Establish consistent posting schedule with content pillars strategy',
        reasoning: 'Consistent posting builds audience trust and improves algorithm ranking by 40%',
        actionItems: [
          'Post 4-7 times per week at consistent times (11 AM, 2 PM, 5 PM work best)',
          'Create 4 content pillars: Educational (40%), Behind-scenes (30%), Promotional (20%), Trending (10%)',
          'Batch create content weekly to maintain consistency'
        ],
        expectedImpact: '35-50% increase in follower growth and engagement',
        difficulty: 'Medium',
        timeframe: '3-4 weeks'
      },
      confidence: 92,
      validUntil
    },
    {
      type: 'hashtag',
      data: {
        suggestion: 'Implement strategic hashtag pyramid for maximum reach',
        reasoning: 'Proper hashtag mix increases discoverability by 12.6% and profile visits by 55%',
        actionItems: [
          'Use 20-30 hashtags: 5 competitive (1M+ posts), 15 moderate (100K-1M), 10 niche (<100K)',
          'Research competitor hashtags and create branded hashtag for community building',
          'Test hashtag performance weekly and replace low-performing ones'
        ],
        expectedImpact: '30-50% increase in reach',
        difficulty: 'Medium',
        timeframe: '2-3 weeks'
      },
      confidence: 90,
      validUntil
    },
    {
      type: 'engagement',
      data: {
        suggestion: 'Maximize Instagram Stories and Reels for algorithm boost',
        reasoning: 'Stories get 15-25% more reach than feed posts, Reels receive 22% higher engagement rates',
        actionItems: [
          'Post 2-3 Stories daily using polls, questions, and "this or that" stickers',
          'Create 3-4 Reels weekly with trending audio and current effects',
          'Use Story highlights to organize and showcase your best content permanently'
        ],
        expectedImpact: '50-80% increase in overall account engagement',
        difficulty: 'Medium',
        timeframe: '2-3 weeks'
      },
      confidence: 94,
      validUntil
    },
    {
      type: 'trending',
      data: {
        suggestion: `Leverage ${currentYear} Instagram trends for viral potential`,
        reasoning: 'Trending content receives 3x more engagement and discovery than regular posts',
        actionItems: [
          'Use current trending audio in Reels (check Instagram\'s "Audio" tab weekly)',
          'Create carousel posts with educational content (highest engagement format)',
          'Participate in relevant viral challenges and trends in your niche'
        ],
        expectedImpact: '100-200% increase in reach for trending content',
        difficulty: 'Medium',
        timeframe: '1-2 weeks'
      },
      confidence: 86,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Shorter validity for trending content
    },
    {
      type: 'growth',
      data: {
        suggestion: 'Build authentic community through strategic engagement',
        reasoning: 'Authentic engagement creates loyal followers who convert to customers at 8x higher rates',
        actionItems: [
          'Engage with 20-30 accounts in your niche daily (meaningful comments, not just likes)',
          'Collaborate with micro-influencers (1K-100K followers) in your industry',
          'Create user-generated content campaigns with branded hashtags'
        ],
        expectedImpact: '25-40% increase in high-quality followers and brand advocates',
        difficulty: 'Easy',
        timeframe: '3-4 weeks'
      },
      confidence: 89,
      validUntil
    }
  ];
}