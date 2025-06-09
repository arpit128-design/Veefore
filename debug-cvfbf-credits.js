// Direct credit check for cvfbf workspace using existing MongoDB connection
import { MongoClient } from 'mongodb';

async function debugCvfbfCredits() {
  const mongoose = await import('mongoose');
  
  try {
    // Use existing connection or create new one
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DATABASE_URL);
    }
    
    console.log('=== CVFBF WORKSPACE CREDIT DEBUG ===');
    
    // Direct MongoDB query for cvfbf workspace
    const db = mongoose.connection.db;
    const workspace = await db.collection('workspaces').findOne({
      name: 'cvfbf',
      userId: '6844027426cae0200f88b5db'
    });
    
    if (workspace) {
      console.log('✓ Found cvfbf workspace:');
      console.log(`  - ID: ${workspace._id}`);
      console.log(`  - Name: ${workspace.name}`);
      console.log(`  - Credits: ${workspace.credits}`);
      console.log(`  - Is Default: ${workspace.isDefault}`);
      console.log(`  - User ID: ${workspace.userId}`);
      
      // If credits are 0, update to 2
      if (workspace.credits === 0) {
        console.log('\n⚠️ Credits are 0, updating to 2...');
        const updateResult = await db.collection('workspaces').updateOne(
          { _id: workspace._id },
          { 
            $set: { 
              credits: 2,
              updatedAt: new Date()
            }
          }
        );
        console.log(`✓ Update result: ${updateResult.modifiedCount} document(s) modified`);
      }
      
      // Verify final state
      const updatedWorkspace = await db.collection('workspaces').findOne({
        _id: workspace._id
      });
      console.log(`\n✅ Final credits: ${updatedWorkspace.credits}`);
      
    } else {
      console.log('❌ cvfbf workspace not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugCvfbfCredits();