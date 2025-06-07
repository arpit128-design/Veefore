import { MongoStorage } from './server/mongodb-storage.ts';

async function connectInstagramToNewWorkspace() {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    console.log('Connected to MongoDB');
    
    const userId = '6844027426cae0200f88b5db';
    
    // Get all workspaces for the user
    const workspaces = await storage.getWorkspacesByUserId(userId);
    console.log('Found workspaces:', workspaces.length);
    
    // Find the original workspace with Instagram connection
    let originalWorkspace = null;
    let newWorkspace = null;
    
    for (const workspace of workspaces) {
      const accounts = await storage.getSocialAccountsByWorkspace(workspace.id);
      const instagramAccounts = accounts.filter(acc => acc.platform === 'instagram');
      
      console.log(`Workspace ${workspace.name} (${workspace.id}): ${instagramAccounts.length} Instagram accounts`);
      
      if (instagramAccounts.length > 0) {
        originalWorkspace = workspace;
        console.log('Original workspace found:', workspace.name);
        console.log('Instagram account:', instagramAccounts[0].username);
      } else {
        newWorkspace = workspace;
        console.log('New workspace without Instagram:', workspace.name);
      }
    }
    
    if (originalWorkspace && newWorkspace) {
      // Get the Instagram account from original workspace
      const originalAccounts = await storage.getSocialAccountsByWorkspace(originalWorkspace.id);
      const instagramAccount = originalAccounts.find(acc => acc.platform === 'instagram');
      
      if (instagramAccount) {
        console.log('Connecting Instagram account to new workspace...');
        
        // Create new social account connection for the new workspace
        const newAccountData = {
          workspaceId: parseInt(newWorkspace.id),
          platform: instagramAccount.platform,
          username: instagramAccount.username,
          accountId: instagramAccount.accountId,
          accessToken: instagramAccount.accessToken,
          refreshToken: instagramAccount.refreshToken,
          expiresAt: instagramAccount.expiresAt,
          isActive: instagramAccount.isActive,
          followersCount: instagramAccount.followersCount,
          followingCount: instagramAccount.followingCount,
          mediaCount: instagramAccount.mediaCount,
          biography: instagramAccount.biography,
          website: instagramAccount.website,
          profilePictureUrl: instagramAccount.profilePictureUrl,
          accountType: instagramAccount.accountType,
          isBusinessAccount: instagramAccount.isBusinessAccount,
          isVerified: instagramAccount.isVerified,
          avgLikes: instagramAccount.avgLikes,
          avgComments: instagramAccount.avgComments,
          avgReach: instagramAccount.avgReach,
          engagementRate: instagramAccount.engagementRate,
          lastSyncAt: instagramAccount.lastSyncAt
        };
        
        const newConnection = await storage.createSocialAccount(newAccountData);
        console.log('Successfully connected Instagram account to new workspace:', newConnection.username);
        
        // Verify the connection
        const newWorkspaceAccounts = await storage.getSocialAccountsByWorkspace(newWorkspace.id);
        console.log('New workspace now has', newWorkspaceAccounts.length, 'social accounts');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

connectInstagramToNewWorkspace();