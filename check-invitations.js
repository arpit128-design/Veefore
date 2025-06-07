// Check current team invitations and addon status
import { MongoClient } from 'mongodb';

async function checkInvitations() {
  const client = new MongoClient(process.env.DATABASE_URL || process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('veeforedb');
    
    // Check current addons
    const addons = await db.collection('addons').find({
      userId: 6844027426,
      type: 'team-member',
      isActive: true
    }).toArray();
    
    console.log(`\n=== ADDON STATUS ===`);
    console.log(`Total team-member addons: ${addons.length}`);
    console.log(`Max team size: ${1 + addons.length} members`);
    
    // Check current invitations
    const invitations = await db.collection('teaminvitations').find({
      workspaceId: 684402
    }).toArray();
    
    console.log(`\n=== INVITATIONS STATUS ===`);
    console.log(`Total invitations: ${invitations.length}`);
    invitations.forEach((inv, index) => {
      console.log(`Invitation ${index + 1}: ${inv.email} - ${inv.status} (created: ${inv.createdAt})`);
    });
    
    // Check workspace members
    const members = await db.collection('workspacemembers').find({
      workspaceId: 684402
    }).toArray();
    
    console.log(`\n=== WORKSPACE MEMBERS ===`);
    console.log(`Total members: ${members.length}`);
    members.forEach((member, index) => {
      console.log(`Member ${index + 1}: userId ${member.userId} - ${member.role} (status: ${member.status})`);
    });
    
    // Calculate current team capacity
    const pendingInvitations = invitations.filter(inv => inv.status === 'pending').length;
    const activeMembers = members.filter(m => m.status === 'active').length;
    const totalCurrent = activeMembers + pendingInvitations;
    const maxAllowed = 1 + addons.length; // owner + addons
    
    console.log(`\n=== CAPACITY CALCULATION ===`);
    console.log(`Owner: 1`);
    console.log(`Active members: ${activeMembers}`);
    console.log(`Pending invitations: ${pendingInvitations}`);
    console.log(`Total current: ${totalCurrent}`);
    console.log(`Max allowed: ${maxAllowed}`);
    console.log(`Remaining capacity: ${maxAllowed - totalCurrent}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkInvitations();