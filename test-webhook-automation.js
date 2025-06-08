// Test webhook automation system
import fetch from 'node-fetch';

async function testInstagramWebhook() {
  console.log('Testing Instagram webhook DM automation...');
  
  // Simulate Instagram webhook payload for DM
  const webhookPayload = {
    object: 'instagram',
    entry: [{
      id: '9505923456179711', // Real Instagram Business Account ID
      time: Math.floor(Date.now() / 1000),
      messaging: [{
        sender: {
          id: '123456789',
          username: 'testuser'
        },
        recipient: {
          id: '9505923456179711'
        },
        timestamp: Math.floor(Date.now() / 1000),
        message: {
          mid: 'test_message_id_' + Date.now(),
          text: 'Hello! Can you help me with my order?'
        }
      }]
    }]
  };

  try {
    console.log('Sending webhook to /webhook/instagram...');
    const response = await fetch('http://localhost:5000/webhook/instagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': 'sha256=test_signature' // Instagram webhook signature
      },
      body: JSON.stringify(webhookPayload)
    });

    console.log('Webhook response status:', response.status);
    const responseText = await response.text();
    console.log('Webhook response:', responseText);

    if (response.status === 200) {
      console.log('✓ Webhook processed successfully');
    } else {
      console.log('✗ Webhook failed with status:', response.status);
    }

  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

async function testMultipleScenarios() {
  console.log('\n=== Testing Multiple DM Scenarios ===\n');
  
  const scenarios = [
    {
      name: 'Customer Support Query',
      message: 'Hi, I need help with my recent order. It hasn\'t arrived yet.'
    },
    {
      name: 'Product Inquiry',
      message: 'Can you tell me more about your latest product launch?'
    },
    {
      name: 'General Greeting',
      message: 'Hello! Love your content!'
    }
  ];

  for (const scenario of scenarios) {
    console.log(`Testing: ${scenario.name}`);
    
    const webhookPayload = {
      object: 'instagram',
      entry: [{
        id: '9505923456179711',
        time: Math.floor(Date.now() / 1000),
        messaging: [{
          sender: {
            id: `test_user_${Date.now()}`,
            username: 'testuser'
          },
          recipient: {
            id: '9505923456179711'
          },
          timestamp: Math.floor(Date.now() / 1000),
          message: {
            mid: `test_message_${Date.now()}`,
            text: scenario.message
          }
        }]
      }]
    };

    try {
      const response = await fetch('http://localhost:5000/webhook/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hub-Signature-256': 'sha256=test_signature'
        },
        body: JSON.stringify(webhookPayload)
      });

      console.log(`- Status: ${response.status}`);
      const responseText = await response.text();
      
      if (response.status === 200) {
        console.log(`- ✓ Processed successfully`);
      } else {
        console.log(`- ✗ Failed: ${responseText}`);
      }
      
    } catch (error) {
      console.error(`- Error: ${error.message}`);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('');
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting comprehensive DM automation test...\n');
  
  // Test basic webhook
  await testInstagramWebhook();
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test multiple scenarios
  await testMultipleScenarios();
  
  console.log('✨ DM automation testing complete!');
}

runComprehensiveTest();