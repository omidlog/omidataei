const logger = require('../utils/logger');

class AdminMessageService {
  constructor(bot, adminId) {
    this.bot = bot;
    this.adminId = adminId;
  }

  isAdmin(userId) {
    return userId.toString() === this.adminId;
  }

  async handleReplyCommand(ctx) {
    try {
      const args = ctx.message.text.split(' ');
      if (args.length < 3) {
        return ctx.reply(
          '❌ فرمت صحیح:\n' +
          '/reply user_id پیام\n\n' +
          'مثال:\n' +
          '/reply 123456789 سلام، پیام شما دریافت شد.'
        );
      }

      const userId = args[1];
      const message = args.slice(2).join(' ');
      await this.sendReplyToUser(ctx, userId, message);
    } catch (error) {
      logger.error('خطا در دستور reply:', error);
      throw error;
    }
  }

  async sendReplyToUser(ctx, userId, message) {
    try {
      // Send message to user
      await this.bot.telegram.sendMessage(userId, `پاسخ پشتیبانی:\n\n${message}`);
      
      // Confirm to admin
      await ctx.reply(`✅ پیام به کاربر ${userId} ارسال شد.`);
      
      // Log success
      logger.success(`پیام ادمین با موفقیت به کاربر ${userId} ارسال شد: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`);
      
      return true;
    } catch (error) {
      logger.error('خطا در ارسال پیام به کاربر:', error);
      await ctx.reply('❌ خطا در ارسال پیام به کاربر. ممکن است ربات را بلاک کرده باشد.');
      return false;
    }
  }
}

module.exports = { AdminMessageService };