const mongoose = require('mongoose');

async function fixTeamAddon() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const userId = '6844027426cae0200f88b5db';

    // Check payments collection
    const paymentsCollection = mongoose.connection.db.collection('payments');
    const teamMemberPayments = await paymentsCollection.find({
      userId: userId,
      purpose: { $regex: /team-member|Team Member/i },
      status: 'captured'
    }).sort({ createdAt: -1 }).toArray();

    console.log('Team member payments found:', teamMemberPayments.length);

    // Check addons collection
    const addonsCollection = mongoose.connection.db.collection('addons');
    const existingTeamAddons = await addonsCollection.find({
      userId: userId,
      type: 'team-member'
    }).toArray();

    console.log('Existing team addons:', existingTeamAddons.length);

    if (teamMemberPayments.length > 0 && existingTeamAddons.length === 0) {
      console.log('Creating missing team member addon...');
      
      const payment = teamMemberPayments[0];
      const newAddon = {
        userId: userId,
        name: 'Additional Team Member Seat',
        type: 'team-member',
        price: 19900,
        isActive: true,
        expiresAt: null,
        metadata: {
          paymentId: payment.razorpayPaymentId || payment._id.toString(),
          orderId: payment.razorpayOrderId,
          createdFromPayment: true,
          originalPaymentDate: payment.createdAt
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await addonsCollection.insertOne(newAddon);
      console.log('Team member addon created successfully:', result.insertedId);
    } else {
      console.log('No action needed - addon already exists or payment not found');
    }

    await mongoose.disconnect();
    console.log('Database operation completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixTeamAddon();