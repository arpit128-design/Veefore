import mongoose from 'mongoose';

async function debugTeamAddon() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Check payments collection
    const paymentsCollection = mongoose.connection.db.collection('payments');
    const recentPayments = await paymentsCollection.find({
      userId: '6844027426cae0200f88b5db'
    }).sort({ createdAt: -1 }).limit(5).toArray();

    console.log('\n=== RECENT PAYMENTS ===');
    recentPayments.forEach(payment => {
      console.log(`Payment: ${payment.purpose} - ₹${payment.amount} - ${payment.status} - ${payment.createdAt}`);
    });

    // Check addons collection
    const addonsCollection = mongoose.connection.db.collection('addons');
    const userAddons = await addonsCollection.find({
      userId: '6844027426cae0200f88b5db'
    }).sort({ createdAt: -1 }).toArray();

    console.log('\n=== USER ADDONS ===');
    userAddons.forEach(addon => {
      console.log(`Addon: ${addon.name} (${addon.type}) - Active: ${addon.isActive} - ${addon.createdAt}`);
    });

    // Find team member payment without addon
    const teamMemberPayment = recentPayments.find(p => 
      p.purpose.includes('team-member') || p.purpose.includes('Team Member')
    );

    if (teamMemberPayment && !userAddons.find(a => a.type === 'team-member')) {
      console.log('\n=== CREATING MISSING TEAM MEMBER ADDON ===');
      
      const newAddon = {
        userId: '6844027426cae0200f88b5db',
        name: 'Additional Team Member Seat',
        type: 'team-member',
        price: 19900,
        isActive: true,
        expiresAt: null,
        metadata: {
          paymentId: teamMemberPayment.razorpayPaymentId || teamMemberPayment.id,
          orderId: teamMemberPayment.razorpayOrderId,
          createdFromPayment: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await addonsCollection.insertOne(newAddon);
      console.log('Created team member addon:', result.insertedId);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugTeamAddon();