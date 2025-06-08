// Direct MongoDB update script
import { MongodbStorage } from './server/mongodb-storage.js';

async function fixDMAutomationRules() {
  const storage = new MongodbStorage();
  
  try {
    console.log('Getting existing automation rules...');
    const rules = await storage.getAutomationRules('684402c2fd2cd4eb6521b386');
    console.log(`Found ${rules.length} automation rules`);
    
    for (const rule of rules) {
      console.log(`Updating rule: ${rule.name} (${rule.id})`);
      
      await storage.updateAutomationRule(rule.id, {
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
    
    console.log('Verification - checking updated rules:');
    const updatedRules = await storage.getAutomationRules('684402c2fd2cd4eb6521b386');
    updatedRules.forEach(rule => {
      console.log(`- ${rule.name}: trigger.type=${rule.trigger?.type}, action.type=${rule.action?.type}`);
    });
    
    console.log('DM automation rules updated successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error updating DM automation rules:', error);
    process.exit(1);
  }
}

fixDMAutomationRules();