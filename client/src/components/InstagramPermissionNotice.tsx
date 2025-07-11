import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ExternalLink, Info, CheckCircle } from "lucide-react";

interface InstagramPermissionNoticeProps {
  onDismiss?: () => void;
  showDetailed?: boolean;
}

export function InstagramPermissionNotice({ onDismiss, showDetailed = false }: InstagramPermissionNoticeProps) {
  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-200">
          Video Publishing Requires Additional Permissions
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          Your Instagram app needs advanced permissions for video publishing. Image posts work perfectly with current permissions.
        </AlertDescription>
      </Alert>

      {showDetailed && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Info className="h-5 w-5" />
              Instagram Video Publishing Requirements
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Meta requires app review for advanced video publishing permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Required Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300">
                  publish_video
                </Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300">
                  instagram_graph_user_media
                </Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300">
                  instagram_manage_insights
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">What Works Now:</h4>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span>Image posts and carousel posts</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span>AI caption and hashtag generation</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span>Content scheduling and analytics</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Alternative Solutions:</h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>• Use Instagram Creator Studio for manual video publishing</li>
                <li>• Schedule video posts as drafts for manual publication</li>
                <li>• Export content for use in other social media tools</li>
                <li>• Continue using VeeFore for image content (fully functional)</li>
              </ul>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300 hover:bg-blue-100 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-900/20"
                onClick={() => window.open('https://developers.facebook.com/docs/instagram-basic-display-api/guides/app-review', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Meta App Review Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {onDismiss && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}