/**
 * Instagram Permission Helper
 * Provides clear guidance and alternative solutions for Instagram API limitations
 */

export class InstagramPermissionHelper {
  static getVideoPublishingError(): {
    error: string;
    solution: string;
    alternatives: string[];
    technicalReason: string;
  } {
    return {
      error: "Video publishing requires advanced Instagram API permissions",
      solution: "Your Instagram app needs approval for video publishing permissions from Meta/Facebook",
      alternatives: [
        "Use Instagram Creator Studio for manual video publishing",
        "Schedule posts as drafts for manual publication",
        "Export content for use in other social media management tools",
        "Publish image posts (which work with current permissions)"
      ],
      technicalReason: "Current app permissions only allow basic Instagram operations. Video publishing requires 'publish_video' and 'instagram_graph_user_media' permissions that need Meta app review."
    };
  }

  static getRequiredPermissions(): string[] {
    return [
      'instagram_graph_user_media',
      'publish_video',
      'instagram_manage_insights',
      'instagram_business_content_publish'
    ];
  }

  static getAppReviewGuidance(): {
    steps: string[];
    requirements: string[];
    timeline: string;
  } {
    return {
      steps: [
        "Go to Facebook Developers Console (developers.facebook.com)",
        "Select your Instagram app",
        "Navigate to 'App Review' section",
        "Request the required video publishing permissions",
        "Provide business justification and use case documentation",
        "Submit app for Meta review"
      ],
      requirements: [
        "Valid business Instagram account",
        "Clear explanation of video publishing use case",
        "Privacy policy and terms of service",
        "App screenshots showing video publishing functionality"
      ],
      timeline: "Meta app review typically takes 7-14 business days"
    };
  }

  static canPublishImages(): boolean {
    return true; // Current permissions support image publishing
  }

  static canPublishVideos(): boolean {
    return false; // Requires advanced permissions
  }

  static generateFallbackContent(originalContent: any): any {
    // Generate image-based alternative for video content
    return {
      ...originalContent,
      type: 'post',
      contentData: {
        ...originalContent.contentData,
        imageUrl: originalContent.contentData.thumbnailUrl || 
                 originalContent.contentData.imageUrl || 
                 'https://via.placeholder.com/1080x1080/6366f1/ffffff?text=Video+Content',
        caption: `${originalContent.contentData.caption || ''}\n\n⚠️ Video publishing requires additional permissions. This is a preview of your content.`
      }
    };
  }
}