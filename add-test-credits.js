import { MongoClient } from 'mongodb';

async function addTestCredits() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('veeforedb');
    
    // Find the user by username
    const user = await db.collection('users').findOne({ 
      username: 'choudharyarpit977' 
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Found user:', user.username, 'Current credits:', user.credits);
    
    // Add 50 credits for testing
    const result = await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { credits: 50, updatedAt: new Date() } }
    );
    
    console.log('Updated user credits:', result.modifiedCount);
    
    // Verify the update
    const updatedUser = await db.collection('users').findOne({ 
      _id: user._id 
    });
    
    console.log('New credits:', updatedUser.credits);
    
  } catch (error) {
    console.error('Error adding credits:', error);
  } finally {
    await client.close();
  }
}

addTestCredits();