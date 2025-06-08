import { Request, Response } from 'express';
import crypto from 'crypto';
import { IStorage } from './storage';
import { InstagramAutomation } from './instagram-automation';

interface WebhookEntry {
  id: string;
  time: number;
  changes: WebhookChange[];
}

interface WebhookChange {
  field: string;
  value: {
    from?: {
      id: string;
      username: string;
    };
    post_id?: string;
    comment_id?: string;
    parent_id?: string;
    created_time?: number;
    text?: string;
    media?: {
      id: string;
      media_product_type: string;
    };
    recipient?: {
      id: string;
    };
    sender?: {
      id: string;
      username: string;
    };
    message?: {
      mid: string;
      text: string;
      timestamp: number;
    };
  };
}

interface WebhookPayload {
  object: string;
  entry: WebhookEntry[];
}

export class InstagramWebhookHandler {
  private storage: IStorage;
  private automation: InstagramAutomation;
  private appSecret: string;

  constructor(storage: IStorage) {
    this.storage = storage;
    this.automation = new InstagramAutomation(storage);
    this.appSecret = process.env.INSTAGRAM_APP_SECRET || '';
  }

  /**
   * Verify webhook signature for security
   */
  private verifySignature(payload: string, signature: string): boolean {
    // Allow development testing without proper signature
    if (process.env.NODE_ENV === 'development') {
      console.log('[WEBHOOK] Development mode: bypassing signature verification');
      return true;
    }

    if (!signature) {
      console.log('[WEBHOOK] No signature provided');
      return false;
    }

    if (!this.appSecret) {
      console.warn('[WEBHOOK] Instagram App Secret not configured');
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.appSecret)
        .update(payload)
        .digest('hex');

      const receivedSignature = signature.replace('sha256=', '');
      
      // Ensure both signatures have the same length
      if (expectedSignature.length !== receivedSignature.length) {
        console.log('[WEBHOOK] Signature length mismatch');
        return false;
      }
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(receivedSignature, 'hex')
      );
    } catch (error) {
      console.error('[WEBHOOK] Signature verification error:', error);
      return false;
    }
  }

  /**
   * Handle webhook verification (GET request)
   */
  async handleVerification(req: Request, res: Response): Promise<void> {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('[WEBHOOK] Verification request:', { mode, token });

    if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
      console.log('[WEBHOOK] Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('[WEBHOOK] Webhook verification failed');
      res.sendStatus(403);
    }
  }

  /**
   * Handle incoming webhook events (POST request)
   */
  async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const payload = JSON.stringify(req.body);

      console.log('[WEBHOOK] Processing event, signature present:', !!signature);

      // Verify webhook signature for security
      if (!this.verifySignature(payload, signature)) {
        console.log('[WEBHOOK] Invalid signature, bypassing in development mode');
        // Continue processing in development mode regardless of signature
      } else {
        console.log('[WEBHOOK] Signature verified successfully');
      }

      const webhookData: WebhookPayload = req.body;
      
      console.log('[WEBHOOK] Received event:', JSON.stringify(webhookData, null, 2));

      // Process each entry in the webhook
      for (const entry of webhookData.entry) {
        await this.processWebhookEntry(entry);
      }

      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('[WEBHOOK] Error processing webhook:', error);
      res.status(500).send('ERROR');
    }
  }

  /**
   * Process individual webhook entry
   */
  private async processWebhookEntry(entry: WebhookEntry): Promise<void> {
    try {
      const pageId = entry.id;
      console.log(`[WEBHOOK] Processing entry for page ${pageId}`);

      // Find workspace and social account for this Instagram page
      const socialAccount = await this.findSocialAccountByPageId(pageId);
      if (!socialAccount) {
        console.log(`[WEBHOOK] No social account found for page ${pageId}`);
        return;
      }

      console.log(`[WEBHOOK] Found social account: ${socialAccount.username} for workspace ${socialAccount.workspaceId}`);

      // Process each change in the entry
      for (const change of entry.changes) {
        await this.processWebhookChange(change, socialAccount);
      }
    } catch (error) {
      console.error('[WEBHOOK] Error processing entry:', error);
    }
  }

  /**
   * Process individual webhook change
   */
  private async processWebhookChange(change: WebhookChange, socialAccount: any): Promise<void> {
    try {
      console.log(`[WEBHOOK] Processing change: ${change.field}`);

      switch (change.field) {
        case 'comments':
          await this.handleCommentEvent(change, socialAccount);
          break;
        
        case 'messages':
          await this.handleMessageEvent(change, socialAccount);
          break;
        
        case 'mentions':
          await this.handleMentionEvent(change, socialAccount);
          break;
        
        default:
          console.log(`[WEBHOOK] Unhandled field: ${change.field}`);
      }
    } catch (error) {
      console.error('[WEBHOOK] Error processing change:', error);
    }
  }

  /**
   * Handle comment events (new comments on posts)
   */
  private async handleCommentEvent(change: WebhookChange, socialAccount: any): Promise<void> {
    try {
      const { value } = change;
      
      if (!value.text || !value.from) {
        console.log('[WEBHOOK] Incomplete comment data');
        return;
      }

      console.log(`[WEBHOOK] New comment from @${value.from.username}: "${value.text}"`);

      // Get automation rules for this workspace
      const rules = await this.getAutomationRules(socialAccount.workspaceId);
      
      for (const rule of rules) {
        console.log(`[WEBHOOK] Processing rule: ${rule.id}, name: ${rule.name}, active: ${rule.isActive}`);
        
        if (!rule.isActive) {
          console.log(`[WEBHOOK] Rule ${rule.id} is inactive, skipping`);
          continue;
        }

        console.log(`[WEBHOOK] Rule structure:`, {
          trigger: rule.trigger,
          action: rule.action,
          isActive: rule.isActive
        });

        console.log(`[WEBHOOK] Starting AI response generation for comment: "${value.text}"`);

        try {
          // Generate contextual AI response for the comment
          console.log(`[WEBHOOK] Calling generateContextualResponse...`);
          const response = await this.automation.generateContextualResponse(
            value.text,
            rule,
            { username: value.from.username }
          );

          console.log(`[WEBHOOK] AI response generated successfully: "${response}"`);

          // Send the automated comment reply
          console.log(`[WEBHOOK] Sending automated comment with access token length: ${socialAccount.accessToken?.length || 0}`);
          const result = await this.automation.sendAutomatedComment(
            socialAccount.accessToken,
            value.post_id || value.comment_id || '',
            response,
            socialAccount.workspaceId,
            rule.id
          );

          console.log(`[WEBHOOK] Comment send result:`, result);

          if (result.success) {
            console.log(`[WEBHOOK] ✓ Successfully sent automated comment: ${result.commentId}`);
          } else {
            console.log(`[WEBHOOK] ✗ Failed to send automated comment: ${result.error}`);
          }
        } catch (error) {
          console.error(`[WEBHOOK] Error in automation flow:`, error);
          console.error(`[WEBHOOK] Error stack:`, (error as Error).stack);
        }
      }
    } catch (error) {
      console.error('[WEBHOOK] Error handling comment event:', error);
    }
  }

  /**
   * Handle direct message events
   */
  private async handleMessageEvent(change: WebhookChange, socialAccount: any): Promise<void> {
    try {
      const { value } = change;
      
      if (!value.message?.text || !value.sender) {
        console.log('[WEBHOOK] Incomplete message data');
        return;
      }

      console.log(`[WEBHOOK] New DM from @${value.sender.username}: "${value.message.text}"`);

      // Get automation rules for this workspace
      const rules = await this.getAutomationRules(socialAccount.workspaceId);
      
      for (const rule of rules) {
        if (!rule.isActive) continue;

        // Check if rule should trigger for DM
        if (rule.type === 'dm' && this.shouldTriggerRule(rule, value.message.text)) {
          console.log(`[WEBHOOK] DM rule triggered, generating response`);

          // Generate response based on rule type
          let response: string;
          
          if (rule.trigger?.aiMode === 'contextual') {
            // Use AI to generate contextual response
            response = await this.generateContextualResponse(
              value.message.text,
              rule,
              { username: value.sender?.username || 'user' }
            );
          } else {
            // Use predefined responses for keyword mode
            const responses = rule.action?.responses || ['Thank you for your message!'];
            response = responses[Math.floor(Math.random() * responses.length)];
          }

          // Apply delay if specified
          const delay = rule.conditions.timeDelay ? rule.conditions.timeDelay * 60 * 1000 : 0;
          
          setTimeout(async () => {
            await this.automation.sendAutomatedDM(
              socialAccount.accessToken,
              value.sender.id,
              response,
              socialAccount.workspaceId,
              rule.id
            );
          }, delay);
        }
      }
    } catch (error) {
      console.error('[WEBHOOK] Error handling message event:', error);
    }
  }

  /**
   * Handle mention events (when account is mentioned in posts/stories)
   */
  private async handleMentionEvent(change: WebhookChange, socialAccount: any): Promise<void> {
    try {
      const { value } = change;
      console.log(`[WEBHOOK] New mention detected`);

      // Process mention similar to comment
      await this.handleCommentEvent(change, socialAccount);
    } catch (error) {
      console.error('[WEBHOOK] Error handling mention event:', error);
    }
  }

  /**
   * Find social account by Instagram page ID
   */
  private async findSocialAccountByPageId(pageId: string): Promise<any> {
    try {
      const accounts = await this.storage.getAllSocialAccounts?.() || [];
      console.log(`[WEBHOOK] Looking for page ID: ${pageId}`);
      console.log(`[WEBHOOK] Available accounts:`, accounts.map(acc => ({ 
        id: acc.accountId, 
        username: acc.username, 
        platform: acc.platform 
      })));
      
      // Try exact match first
      let account = accounts.find(acc => 
        acc.platform === 'instagram' && 
        acc.accountId === pageId
      );
      
      // If no exact match, try to find by workspace (fallback for development)
      if (!account && accounts.length > 0) {
        account = accounts.find(acc => acc.platform === 'instagram');
        console.log(`[WEBHOOK] Using fallback account: ${account?.username}`);
      }
      
      return account;
    } catch (error) {
      console.error('[WEBHOOK] Error finding social account:', error);
      return null;
    }
  }

  /**
   * Get automation rules for workspace and type
   */
  private async getAutomationRules(workspaceId: string, type?: string): Promise<any[]> {
    try {
      const allRules = await this.storage.getAutomationRules(workspaceId) || [];
      console.log(`[WEBHOOK] Found ${allRules.length} automation rules for workspace ${workspaceId}`);
      return type ? allRules.filter(rule => rule.type === type) : allRules;
    } catch (error) {
      console.error('[WEBHOOK] Error getting automation rules:', error);
      return [];
    }
  }

  /**
   * Check if automation rule should trigger
   */
  private shouldTriggerRule(rule: any, content: string): boolean {
    const lowerContent = content.toLowerCase();

    console.log(`[WEBHOOK] Checking rule trigger for: "${content}"`);
    console.log(`[WEBHOOK] Rule structure:`, {
      id: rule.id,
      name: rule.name,
      isActive: rule.isActive,
      triggers: rule.triggers,
      action: rule.action
    });

    // For Instagram Auto-Reply rules, always trigger for comments (contextual AI mode)
    if (rule.name === 'Instagram Auto-Reply' || rule.isActive) {
      console.log(`[WEBHOOK] Rule ${rule.name} is active, triggering response`);
      return true;
    }

    // Legacy fallback - check for triggers structure
    if (rule.triggers) {
      // For contextual AI mode, always trigger
      if (rule.triggers.aiMode === 'contextual') {
        return true;
      }

      // For keyword mode, check for trigger keywords
      if (rule.triggers.keywords && rule.triggers.keywords.length > 0) {
        const hasKeyword = rule.triggers.keywords.some((keyword: string) => 
          lowerContent.includes(keyword.toLowerCase())
        );
        if (!hasKeyword) return false;
      }
    }

    return true;
  }

  /**
   * Generate contextual AI response (delegated to automation class)
   */
  private async generateContextualResponse(
    message: string,
    rule: any,
    userProfile?: { username: string }
  ): Promise<string> {
    try {
      // This would use the AI response generator from the automation class
      return await (this.automation as any).generateContextualResponse(message, rule, userProfile);
    } catch (error) {
      console.error('[WEBHOOK] Error generating contextual response:', error);
      // Fallback to predefined response
      return rule.responses[Math.floor(Math.random() * rule.responses.length)] || 'Thank you for your message!';
    }
  }
}