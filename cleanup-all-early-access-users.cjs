/**
 * Clean up all early access users from database to allow fresh signups
 * This script removes all user entries that were created during early access period
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function cleanupAllEarlyAccessUsers() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    const usersCollection = db.collection('users');
    
    // Find all users created during early access period (before July 11, 2025)
    const earlyAccessCutoff = new Date('2025-07-11T00:00:00Z');
    
    const earlyAccessUsers = await usersCollection.find({
      createdAt: { $lt: earlyAccessCutoff }
    }).toArray();
    
    console.log(`Found ${earlyAccessUsers.length} early access users to clean up`);
    
    for (const user of earlyAccessUsers) {
      console.log(`Cleaning up user: ${user.email} (${user.username})`);
      
      // Delete from MongoDB
      await usersCollection.deleteOne({ _id: user._id });
      
      // Clean up related workspaces
      const workspacesCollection = db.collection('workspaces');
      const workspaceResult = await workspacesCollection.deleteMany({ 
        userId: user._id.toString() 
      });
      
      console.log(`  - Deleted user record`);
      console.log(`  - Deleted ${workspaceResult.deletedCount} workspace records`);
    }
    
    console.log(`\n✅ Successfully cleaned up ${earlyAccessUsers.length} early access users`);
    console.log(`✅ All these emails can now sign up fresh:`);
    earlyAccessUsers.forEach(user => {
      console.log(`   - ${user.email}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  cleanupAllEarlyAccessUsers();
}

module.exports = { cleanupAllEarlyAccessUsers };