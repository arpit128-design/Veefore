// Direct fix for DM automation rules
import { MongodbStorage } from './server/mongodb-storage.js';

async function fixDMRules() {
  console.log('Connecting to storage...');
  const storage = new MongodbStorage();
  
  try {
    // Get existing rules
    const rules = await storage.getAutomationRules('684402c2fd2cd4eb6521b386');
    console.log(`Found ${rules.length} automation rules`);
    
    // Update each rule with proper DM structure
    for (const rule of rules) {
      console.log(`Updating rule: ${rule.name} (ID: ${rule.id})`);
      
      // Use the MongoDB updateAutomationRule method
      const updated = await storage.updateAutomationRule(rule.id, {
        trigger: {
          type: 'dm',
          aiMode: 'contextual',
          keywords: [],
          hashtags: [],
          mentions: false,
          newFollowers: false,
          postInteraction: false
        },
        action: {
          type: 'dm',
          responses: [],
          aiPersonality: 'friendly',
          responseLength: 'medium'
        }
      });
      
      console.log(`✓ Updated rule: ${rule.name}`);
    }
    
    // Verify the updates
    console.log('\nVerifying updates...');
    const updatedRules = await storage.getAutomationRules('684402c2fd2cd4eb6521b386');
    updatedRules.forEach(rule => {
      console.log(`- ${rule.name}: trigger.type=${rule.trigger?.type || 'undefined'}, action.type=${rule.action?.type || 'undefined'}`);
    });
    
    console.log('\n✓ DM automation rules updated successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDMRules();