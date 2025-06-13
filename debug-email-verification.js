/**
 * Debug Email Verification - Check OTP for test email
 */
import { MongoStorage } from './server/mongodb-storage.js';

async function debugEmailVerification() {
  console.log('[DEBUG] Checking email verification data...');
  
  try {
    const storage = new MongoStorage();
    await storage.connect();
    
    // Find user by email
    const user = await storage.getUserByEmail('test2@example.com');
    
    if (user) {
      console.log('[DEBUG] User found:');
      console.log(`  Email: ${user.email}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Is Email Verified: ${user.isEmailVerified}`);
      console.log(`  Verification Code: ${user.emailVerificationCode}`);
      console.log(`  Code Expires: ${user.emailVerificationExpiry}`);
      console.log(`  Created: ${user.createdAt}`);
    } else {
      console.log('[DEBUG] No user found with email: test@example.com');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    process.exit(1);
  }
}

debugEmailVerification();