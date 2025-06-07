import { MongoStorage } from './server/mongodb-storage.ts';

async function testAddonCreation() {
  try {
    const storage = new MongoStorage();
    await storage.connect();
    console.log('Connected to MongoDB');
    
    // Test creating an addon
    const testAddon = {
      userId: '6844027426cae0200f88b5db',
      type: 'workspace',
      name: 'Additional Brand Workspace',
      price: 4900,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      metadata: { addonId: 'extra-workspace', benefit: 'Additional workspace' }
    };
    
    console.log('Creating addon with data:', testAddon);
    const createdAddon = await storage.createAddon(testAddon);
    console.log('Created addon:', createdAddon);
    
    // Check if addon exists
    const activeAddons = await storage.getActiveAddonsByUser('6844027426cae0200f88b5db');
    console.log('Active addons:', activeAddons);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAddonCreation();