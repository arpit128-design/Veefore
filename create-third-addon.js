// Create third team-member addon after successful payment
import { MongoClient } from 'mongodb';

async function createThirdAddon() {
  const client = new MongoClient(process.env.DATABASE_URL || process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    
    // Check current addon count
    const currentAddons = await db.collection('addons').find({
      userId: 6844027426,
      type: 'team-member',
      isActive: true
    }).toArray();
    
    console.log(`Current addon count: ${currentAddons.length}`);
    currentAddons.forEach((addon, index) => {
      console.log(`Addon ${index + 1}:`, addon._id, addon.metadata?.addonNumber || 'no number');
    });
    
    if (currentAddons.length >= 3) {
      console.log('User already has 3 or more addons');
      return;
    }
    
    // Create the third team-member addon
    const thirdAddon = {
      userId: 6844027426,
      type: 'team-member',
      name: 'Additional Team Member Seat',
      price: 19900,
      isActive: true,
      expiresAt: null,
      metadata: {
        createdFromPayment: true,
        autoCreated: true,
        reason: 'Third addon purchase - payment successful order_QeTNJzJKEjmzwH',
        createdAt: new Date().toISOString(),
        addonNumber: 3
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('addons').insertOne(thirdAddon);
    console.log('Third addon created:', result.insertedId);
    
    // Verify total addon count
    const totalAddons = await db.collection('addons').countDocuments({
      userId: 6844027426,
      type: 'team-member',
      isActive: true
    });
    
    console.log(`User now has ${totalAddons} team-member addons`);
    console.log(`Max team size is now: ${1 + totalAddons} members`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

createThirdAddon();