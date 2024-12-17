const logger = require('../utils/logger');

class InstagramHandler {
  constructor(bot, adminId) {
    this.bot = bot;
    this.adminId = adminId;
  }

  async handleWebhookUpdate(req, res) {
    try {
      const body = req.body;
      
      // Validate webhook data
      if (!body || !body.object || body.object !== 'instagram') {
        logger.error('Invalid webhook data received');
        return res.sendStatus(400);
      }

      // Process changes
      if (body.entry && Array.isArray(body.entry)) {
        for (const entry of body.entry) {
          if (entry.changes && Array.isArray(entry.changes)) {
            for (const change of entry.changes) {
              await this.processChange(change);
            }
          }
          
          if (entry.messaging && Array.isArray(entry.messaging)) {
            for (const message of entry.messaging) {
              await this.processMessage(message);
            }
          }
        }
      }

      res.sendStatus(200);
    } catch (error) {
      logger.error('Error processing Instagram webhook:', error);
      res.sendStatus(500);
    }
  }

  async processChange(change) {
    try {
      if (change.field === 'messages') {
        const value = change.value;
        if (value && value.messages) {
          for (const message of value.messages) {
            await this.forwardToTelegram({
              sender: { id: value.from?.id || 'unknown' },
              message: message
            });
          }
        }
      }
    } catch (error) {
      logger.error('Error processing Instagram change:', error);
    }
  }

  async processMessage(messaging) {
    try {
      const { sender, message } = messaging;
      if (sender && message) {
        await this.forwardToTelegram(messaging);
      }
    } catch (error) {
      logger.error('Error processing Instagram message:', error);
    }
  }

  async forwardToTelegram(messaging) {
    try {
      const { sender, message } = messaging;
      
      let messageText = message.text || '';
      if (message.attachments) {
        messageText += '\n[پیوست: ' + message.attachments.map(a => a.type).join(', ') + ']';
      }

      const text = `📱 پیام جدید اینستاگرام:
👤 شناسه کاربر: ${sender.id}
📝 پیام: ${messageText}
⏰ زمان: ${new Date().toLocaleString('fa-IR')}
---
🆔 شناسه پیام: instagram_${sender.id}`;

      await this.bot.telegram.sendMessage(this.adminId, text);
      logger.success(`✅ پیام اینستاگرام به تلگرام فوروارد شد`);
    } catch (error) {
      logger.error('Error forwarding Instagram message to Telegram:', error);
    }
  }

  async handleAdminReply(ctx) {
    try {
      const repliedMsg = ctx.message.reply_to_message;
      if (!repliedMsg || !repliedMsg.text) {
        return false;
      }

      // Check if this is an Instagram message by looking for the message ID marker
      const messageIdMatch = repliedMsg.text.match(/🆔 شناسه پیام: instagram_([^\n]+)/);
      if (!messageIdMatch) {
        return false;
      }

      const userId = messageIdMatch[1];
      const replyText = ctx.message.text;

      // Send reply to Instagram user
      await this.sendInstagramReply(userId, replyText);
      await ctx.reply(`✅ پیام به کاربر اینستاگرام ${userId} ارسال شد.`);
      logger.success(`پاسخ ادمین به کاربر اینستاگرام ${userId} ارسال شد`);
      
      return true;
    } catch (error) {
      logger.error('خطا در ارسال پاسخ به اینستاگرام:', error);
      await ctx.reply('❌ خطا در ارسال پاسخ به اینستاگرام. لطفاً دوباره تلاش کنید.');
      return true;
    }
  }

  async sendInstagramReply(userId, message) {
    try {
      // Here you would implement the actual Instagram API call
      logger.info(`ارسال پاسخ به کاربر اینستاگرام ${userId}: ${message}`);
      
      // Placeholder for actual API implementation
      if (!userId || !message) {
        throw new Error('شناسه کاربر یا پیام نامعتبر است');
      }
      
      return true;
    } catch (error) {
      logger.error('خطا در ارسال پاسخ به اینستاگرام:', error);
      throw error;
    }
  }
}

module.exports = { InstagramHandler };