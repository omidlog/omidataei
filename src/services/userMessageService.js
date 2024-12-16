const logger = require('../utils/logger');
const { formatUserInfo } = require('../utils/messageFormatter');
const messageStore = require('./messageStore');

class UserMessageService {
  constructor(bot, adminId) {
    this.bot = bot;
    this.adminId = adminId;
  }

  async handleUserMessage(ctx) {
    try {
      const userId = ctx.from.id;
      const messageId = ctx.message.message_id;
      
      // Forward the original message to admin
      const forwardedMsg = await ctx.forwardMessage(this.adminId);
      
      // Store message mapping
      messageStore.storeMessage(forwardedMsg.message_id, userId, messageId);
      
      // Send user info as a reply to forwarded message
      const userInfo = formatUserInfo(ctx.from);
      await this.bot.telegram.sendMessage(this.adminId, userInfo, {
        reply_to_message_id: forwardedMsg.message_id,
        parse_mode: 'HTML'
      });
      
      // Confirm receipt to user
      await ctx.reply('پیام شما دریافت شد. به زودی پاسخ خواهیم داد. 🙏');
      logger.success(`پیام از کاربر ${userId} دریافت شد`);
    } catch (error) {
      logger.error('خطا در پردازش پیام کاربر:', error);
      throw error;
    }
  }
}

module.exports = { UserMessageService };