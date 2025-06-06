import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  const prompt = `You are an expert Instagram growth strategist. Analyze this account data and provide 4-6 specific, actionable suggestions to improve engagement and growth.

Account Analysis:
- Username: ${accountAnalysis.accountInfo.username}
- Account Type: ${accountAnalysis.accountInfo.accountType}
- Followers: ${accountAnalysis.accountInfo.followersCount}
- Posts: ${accountAnalysis.accountInfo.mediaCount}
- Average Engagement Rate: ${accountAnalysis.metrics.avgEngagement}%
- Total Reach: ${accountAnalysis.metrics.totalReach}
- Posting Frequency: ${accountAnalysis.patterns.postingFrequency}
- Performance Trend: ${accountAnalysis.patterns.performanceTrend}

Based on this data, provide suggestions in JSON format:
{
  "suggestions": [
    {
      "type": "trending|hashtag|audio|timing|engagement|growth",
      "title": "Brief title",
      "suggestion": "Detailed actionable suggestion",
      "reasoning": "Why this will help based on the data",
      "actionItems": ["Specific step 1", "Specific step 2", "Specific step 3"],
      "expectedImpact": "What improvement to expect",
      "difficulty": "Easy|Medium|Hard",
      "timeframe": "How long to see results",
      "confidence": 75-95
    }
  ]
}

Focus on data-driven insights and practical actions they can take immediately.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  try {
    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    } else {
      throw new Error('Unexpected content type from AI');
    }
  } catch (parseError) {
    console.error('[AI SUGGESTIONS] Failed to parse AI response:', parseError);
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
  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  return [
    {
      type: 'timing',
      data: {
        suggestion: 'Post during peak engagement hours between 6-9 PM when your audience is most active',
        reasoning: 'Peak hours typically see 3x higher engagement rates than off-peak times',
        actionItems: [
          'Analyze your Instagram Insights for optimal posting times',
          'Schedule posts between 6-9 PM in your timezone',
          'Test different times and track engagement'
        ],
        expectedImpact: '25-40% increase in initial engagement',
        difficulty: 'Easy',
        timeframe: '1-2 weeks'
      },
      confidence: 85,
      validUntil
    },
    {
      type: 'hashtag',
      data: {
        suggestion: 'Use a mix of trending and niche hashtags (8-12 total) to maximize discoverability',
        reasoning: 'Balanced hashtag strategy increases reach while targeting specific audiences',
        actionItems: [
          'Research 5 trending hashtags in your niche',
          'Include 3-5 niche-specific hashtags with lower competition',
          'Add 2-3 branded or location hashtags'
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
        suggestion: 'Create more engaging captions with questions and calls-to-action to boost comments',
        reasoning: 'Comments are weighted heavily in Instagram\'s algorithm for engagement',
        actionItems: [
          'End each caption with a specific question',
          'Use "Save this post if..." or "Tag someone who..." CTAs',
          'Respond to all comments within 2 hours of posting'
        ],
        expectedImpact: '40-60% increase in comments',
        difficulty: 'Easy',
        timeframe: '1 week'
      },
      confidence: 88,
      validUntil
    }
  ];
}