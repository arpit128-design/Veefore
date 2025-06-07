import { MongoStorage } from './server/mongodb-storage.ts';

async function testWorkspaceCreation() {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    console.log('Connected to MongoDB');
    
    const userId = '6844027426cae0200f88b5db';
    console.log('Testing workspace creation for user:', userId);
    
    // Check existing workspaces
    const workspaces = await storage.getWorkspacesByUserId(userId);
    console.log('Current workspaces:', workspaces.length);
    
    // Check active addons
    const activeAddons = await storage.getActiveAddonsByUser(userId);
    console.log('Active addons found:', activeAddons.length);
    
    // Calculate workspace limit
    const planLimits = { 'Free': 1, 'Creator': 3, 'Agency': 10, 'Enterprise': 50 };
    const currentPlan = 'Free';
    let maxWorkspaces = planLimits[currentPlan] || 1;
    
    const workspaceAddons = activeAddons.filter(addon => addon.type === 'workspace');
    const additionalWorkspaces = workspaceAddons.length;
    maxWorkspaces += additionalWorkspaces;
    
    console.log(`Base limit: ${planLimits[currentPlan]}, Additional from addons: ${additionalWorkspaces}, Total: ${maxWorkspaces}`);
    console.log(`Current workspaces: ${workspaces.length}, Can create more: ${workspaces.length < maxWorkspaces}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testWorkspaceCreation();