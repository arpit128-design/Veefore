/**
 * Debug User Lookup - Quick check to see what's in the database
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veefore';

async function debugUserLookup() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    const email = 'arpit9996363@gmail.com';
    const firebaseUid = 'skO8UqUZMBMmPVfSEQxTlPcercq2';
    const mysteryId = '6847b9cdfabaede1706f2990';
    const correctId = '686fadc75a78f3701c4cb261';
    
    console.log('\n=== QUICK DEBUG ===');
    
    // Check by firebaseUid (this is what the backend uses)
    const userByFirebaseUid = await usersCollection.findOne({ firebaseUid });
    console.log('User by firebaseUid:', userByFirebaseUid ? {
      _id: userByFirebaseUid._id.toString(),
      email: userByFirebaseUid.email,
      isOnboarded: userByFirebaseUid.isOnboarded,
      createdAt: userByFirebaseUid.createdAt
    } : 'null');
    
    // Check if mystery user exists
    try {
      const mysteryUser = await usersCollection.findOne({ _id: new ObjectId(mysteryId) });
      console.log('Mystery user exists:', mysteryUser ? 'YES' : 'NO');
      if (mysteryUser) {
        console.log('Mystery user details:', {
          _id: mysteryUser._id.toString(),
          email: mysteryUser.email,
          isOnboarded: mysteryUser.isOnboarded,
          createdAt: mysteryUser.createdAt
        });
      }
    } catch (error) {
      console.log('Mystery user search error:', error.message);
    }
    
    // Check if correct user exists
    try {
      const correctUser = await usersCollection.findOne({ _id: new ObjectId(correctId) });
      console.log('Correct user exists:', correctUser ? 'YES' : 'NO');
      if (correctUser) {
        console.log('Correct user details:', {
          _id: correctUser._id.toString(),
          email: correctUser.email,
          isOnboarded: correctUser.isOnboarded,
          createdAt: correctUser.createdAt
        });
      }
    } catch (error) {
      console.log('Correct user search error:', error.message);
    }
    
    // Count all users with this email
    const allUsers = await usersCollection.find({ email }).toArray();
    console.log('Total users with this email:', allUsers.length);
    
    allUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        _id: user._id.toString(),
        email: user.email,
        isOnboarded: user.isOnboarded,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    });
    
    // Check database name
    console.log('\nDatabase name:', db.databaseName);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugUserLookup();