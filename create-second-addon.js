// Create second team-member addon directly
import { MongoClient } from 'mongodb';

async function createSecondAddon() {
  const client = new MongoClient(process.env.DATABASE_URL || process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    
    // Create the second team-member addon
    const secondAddon = {
      userId: 6844027426,
      type: 'team-member',
      name: 'Additional Team Member Seat',
      price: 19900,
      isActive: true,
      expiresAt: null,
      metadata: {
        createdFromPayment: true,
        autoCreated: true,
        reason: 'Second addon purchase - payment successful',
        createdAt: new Date().toISOString(),
        addonNumber: 2
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('addons').insertOne(secondAddon);
    console.log('Second addon created:', result.insertedId);
    
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

createSecondAddon();