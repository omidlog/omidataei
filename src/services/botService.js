const logger = require('../utils/logger');

class BotService {
  constructor(bot, adminId) {
    this.bot = bot;
    this.adminId = adminId;
  }

  async start() {
    try {
      // First launch the bot
      await this.bot.launch();
      logger.success('ربات راه‌اندازی شد');
      
      // Then try to send a message to admin
      await this.sendMessageToAdmin('ربات پشتیبانی فعال شد. برای شروع روی /start کلیک کنید.');
      logger.success('دسترسی ادمین تأیید شد');
      return true;
    } catch (error) {
      if (error.description?.includes('chat not found')) {
        logger.warning('\n⚠️ مهم: لطفاً مراحل زیر را انجام دهید:');
        logger.info('1. به ربات خود در تلگرام مراجعه کنید');
        logger.info('2. دکمه Start را بزنید یا دستور /start را ارسال کنید');
        logger.info('3. سپس ربات را مجدداً راه‌اندازی کنید\n');
      } else {
        logger.error('خطا در راه‌اندازی ربات:', error);
      }
      throw error;
    }
  }

  async sendMessageToAdmin(message, extra = {}) {
    try {
      await this.bot.telegram.sendMessage(this.adminId, message, extra);
      return true;
    } catch (error) {
      logger.error('خطا در ارسال پیام به ادمین:', error);
      return false;
    }
  }
}

module.exports = { BotService };