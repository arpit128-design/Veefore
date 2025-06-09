// Direct MongoDB credit addition script
import { MongoClient } from 'mongodb';

async function addCreditsToUser() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const usersCollection = db.collection('users');
    
    // Find user by username
    const user = await usersCollection.findOne({ username: 'choudharyarpit977' });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Current user credits:', user.credits || 0);
    
    // Add 50 credits
    const newCredits = (user.credits || 0) + 50;
    
    await usersCollection.updateOne(
      { username: 'choudharyarpit977' },
      { $set: { credits: newCredits } }
    );
    
    console.log('Updated user credits to:', newCredits);
    console.log('Credits added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addCreditsToUser();