# Instagram OAuth Troubleshooting Guide

## Current Issue
Your Instagram app (ID: 1092222062745554) is returning "Invalid platform app" errors.

## Required Configuration

### Domain Information
- **Current Domain**: `15a46e73-e0eb-45c2-8225-17edc84946f6-00-1dy2h828k4y1r.worf.replit.dev`
- **Required Redirect URI**: `https://15a46e73-e0eb-45c2-8225-17edc84946f6-00-1dy2h828k4y1r.worf.replit.dev/api/instagram/callback`

### Instagram Developer Console Steps
1. Go to [Instagram Developer Console](https://developers.facebook.com/apps/)
2. Select your app (ID: 1092222062745554)
3. Navigate to "Instagram Basic Display" or "Instagram Business" settings
4. Add the redirect URI above to "Valid OAuth Redirect URIs"
5. Ensure the app is approved for production use
6. Verify the app type matches your intended usage

### App Type Requirements
- **Basic Display API**: For personal Instagram content access
- **Business API**: For business Instagram accounts with advanced features

### Troubleshooting Checklist
- [ ] Redirect URI configured correctly
- [ ] App is approved and live
- [ ] Correct app type selected
- [ ] Domain whitelisted in app settings
- [ ] App credentials (ID/Secret) are current

## Alternative Solution
If OAuth continues to fail, use the manual connection option with a valid access token.