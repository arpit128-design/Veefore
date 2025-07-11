/**
 * Find Mystery User - Backend is finding user 6847b9cdfabaede1706f2990 but our queries don't find it
 * 
 * The backend logs show it's finding user 6847b9cdfabaede1706f2990 with isOnboarded: false,
 * but our database queries only find user 686fadc75a78f3701c4cb261 with isOnboarded: true.
 * 
 * This suggests there might be a caching issue or the user exists in a different collection/database.
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/veefore';

async function findMysteryUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    const mysteryUserId = '6847b9cdfabaede1706f2990';
    const correctUserId = '686fadc75a78f3701c4cb261';
    const email = 'arpit9996363@gmail.com';
    const firebaseUid = 'skO8UqUZMBMmPVfSEQxTlPcercq2';
    
    console.log('\n=== FINDING MYSTERY USER ===');
    console.log('Backend finds:', mysteryUserId, '(isOnboarded: false)');
    console.log('Database has:', correctUserId, '(isOnboarded: true)');
    
    // 1. Check all collections for the mystery user
    console.log('\n1. Checking all collections for mystery user...');
    const collections = await db.listCollections().toArray();
    
    for (const collInfo of collections) {
      const collName = collInfo.name;
      console.log(`\nChecking collection: ${collName}`);
      
      const collection = db.collection(collName);
      
      // Try to find by _id
      try {
        const userById = await collection.findOne({ _id: new ObjectId(mysteryUserId) });
        if (userById) {
          console.log(`✅ Found mystery user in ${collName}:`, userById);
        }
      } catch (error) {
        // Not all collections have ObjectId format
      }
      
      // Try to find by string id
      try {
        const userByStringId = await collection.findOne({ _id: mysteryUserId });
        if (userByStringId) {
          console.log(`✅ Found mystery user (string ID) in ${collName}:`, userByStringId);
        }
      } catch (error) {
        // Ignore
      }
      
      // If it's a users-like collection, check by email/firebaseUid
      if (collName.includes('user') || collName === 'users') {
        const userByEmail = await collection.find({ email }).toArray();
        if (userByEmail.length > 0) {
          console.log(`Found users by email in ${collName}:`, userByEmail.length);
          userByEmail.forEach((user, index) => {
            console.log(`  User ${index + 1}: ${user._id} - isOnboarded: ${user.isOnboarded}`);
          });
        }
        
        const userByFirebaseUid = await collection.find({ firebaseUid }).toArray();
        if (userByFirebaseUid.length > 0) {
          console.log(`Found users by firebaseUid in ${collName}:`, userByFirebaseUid.length);
          userByFirebaseUid.forEach((user, index) => {
            console.log(`  User ${index + 1}: ${user._id} - isOnboarded: ${user.isOnboarded}`);
          });
        }
      }
    }
    
    // 2. Check if we can find the mystery user by direct ObjectId search
    console.log('\n2. Direct ObjectId search for mystery user...');
    const usersCollection = db.collection('users');
    
    try {
      const directSearch = await usersCollection.findOne({ _id: new ObjectId(mysteryUserId) });
      if (directSearch) {
        console.log('✅ Found mystery user by direct ObjectId search:', directSearch);
      } else {
        console.log('❌ Mystery user not found by direct ObjectId search');
      }
    } catch (error) {
      console.log('❌ Error in direct ObjectId search:', error.message);
    }
    
    // 3. Check if there are any caching issues by using different query methods
    console.log('\n3. Testing different query methods...');
    
    // Method 1: findOne with firebaseUid
    const method1 = await usersCollection.findOne({ firebaseUid });
    console.log('Method 1 (findOne firebaseUid):', method1 ? `${method1._id} - isOnboarded: ${method1.isOnboarded}` : 'null');
    
    // Method 2: find with firebaseUid
    const method2 = await usersCollection.find({ firebaseUid }).toArray();
    console.log('Method 2 (find firebaseUid):', method2.length, 'users found');
    method2.forEach((user, index) => {
      console.log(`  User ${index + 1}: ${user._id} - isOnboarded: ${user.isOnboarded}`);
    });
    
    // Method 3: findOne with email
    const method3 = await usersCollection.findOne({ email });
    console.log('Method 3 (findOne email):', method3 ? `${method3._id} - isOnboarded: ${method3.isOnboarded}` : 'null');
    
    // Method 4: find with email
    const method4 = await usersCollection.find({ email }).toArray();
    console.log('Method 4 (find email):', method4.length, 'users found');
    method4.forEach((user, index) => {
      console.log(`  User ${index + 1}: ${user._id} - isOnboarded: ${user.isOnboarded}`);
    });
    
    // 4. Check database name and connection
    console.log('\n4. Database connection info...');
    console.log('Database name:', db.databaseName);
    console.log('Connection URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    // 5. Check if there's an issue with the storage layer
    console.log('\n5. Testing storage layer functions...');
    
    // Simulate the exact function call from the backend
    console.log('Testing getUserByFirebaseUid function...');
    
    // This should match the backend function
    const backendUser = await usersCollection.findOne({ firebaseUid });
    
    if (backendUser) {
      console.log('Backend function would return:', {
        id: backendUser._id.toString(),
        email: backendUser.email,
        username: backendUser.username,
        isOnboarded: backendUser.isOnboarded,
        firebaseUid: backendUser.firebaseUid
      });
    } else {
      console.log('Backend function would return: null');
    }
    
    // 6. Final analysis
    console.log('\n=== FINAL ANALYSIS ===');
    
    if (method1 && method1._id.toString() === correctUserId) {
      console.log('✅ Database queries return correct user');
      console.log('❌ Backend is somehow finding different user');
      console.log('Possible causes:');
      console.log('1. Backend is connected to different database');
      console.log('2. Backend has stale cache');
      console.log('3. Backend storage layer has bug');
      console.log('4. Connection string points to different database');
      console.log('5. There was a database switch during the session');
      
      console.log('\nRecommended fix:');
      console.log('1. Restart the server to clear any cache');
      console.log('2. Check if backend is using correct database connection');
      console.log('3. Add more logging to storage layer to see what\'s happening');
    } else {
      console.log('❌ Database queries also return different user');
      console.log('Something changed in the database since our last check');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

findMysteryUser();