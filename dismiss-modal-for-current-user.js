/**
 * Dismiss Welcome Modal for Current User
 * This script sets the localStorage flag to prevent the modal from showing again
 */

// Since the current user already has 634 credits (already claimed), 
// we need to set the localStorage flag to prevent the modal from appearing

if (typeof window !== 'undefined' && window.localStorage) {
  const userEmail = 'arpitchoudhary128@gmail.com';
  const modalKey = `welcome-modal-dismissed-${userEmail}`;
  
  console.log('Setting modal dismissal flag for user:', userEmail);
  localStorage.setItem(modalKey, 'true');
  
  console.log('Modal dismissal flag set. The welcome modal will no longer appear on refresh.');
  console.log('You can verify this by checking localStorage:', localStorage.getItem(modalKey));
} else {
  console.log('This script should be run in the browser console, not in Node.js');
}