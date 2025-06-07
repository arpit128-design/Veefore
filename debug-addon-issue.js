import { MongoStorage } from './server/mongodb-storage.js';

async function debugAddonIssue() {
  const storage = new MongoStorage();
  
  try {
    console.log('Checking addons for user 6844027426cae0200f88b5db...');
    
    // Get all addons for this user
    const userAddons = await storage.getUserAddons(6844027426);
    console.log('All user addons:', JSON.stringify(userAddons, null, 2));
    
    // Get active addons for this user
    const activeAddons = await storage.getActiveAddonsByUser(6844027426);
    console.log('Active addons:', JSON.stringify(activeAddons, null, 2));
    
    // Get user workspaces
    const workspaces = await storage.getWorkspacesByUserId('6844027426cae0200f88b5db');
    console.log('User workspaces:', workspaces.length);
    
    // Check recent payments
    const payments = await storage.getPaymentsByUser(6844027426);
    console.log('Recent payments:', JSON.stringify(payments.slice(-3), null, 2));
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugAddonIssue();