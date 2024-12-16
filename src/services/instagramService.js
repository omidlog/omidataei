const axios = require('axios');
const logger = require('../utils/logger');

class InstagramService {
  constructor(bot, adminId, instagramConfig) {
    this.bot = bot;
    this.adminId = adminId;
    this.accessToken = instagramConfig.accessToken;
    this.userId = instagramConfig.userId;
  }

  async startWebhook() {
    try {
      // Subscribe to Instagram Webhook
      await this.subscribeToMessages();
      logger.success('اتصال به وبهوک اینستاگرام برقرار شد');
    } catch (error) {
      logger.error('خطا در اتصال به اینستاگرام:', error);
    }
  }

  async handleInstagramMessage(data) {
    try {
      const { from, message, timestamp } = data;
      
      // Forward Instagram DM to Telegram admin
      const text = `📱 پیام جدید اینستاگرام:
👤 از: ${from.username}
⏰ زمان: ${new Date(timestamp).toLocaleString('fa-IR')}
📝 پیام: ${message}`;

      await this.bot.telegram.sendMessage(this.adminId, text);
    } catch (error) {
      logger.error('خطا در پردازش پیام اینستاگرام:', error);
    }
  }

  async replyToInstagram(userId, message) {
    try {
      // Send reply using Instagram Graph API
      await axios.post(`https://graph.facebook.com/v12.0/${this.userId}/messages`, {
        recipient: { id: userId },
        message: { text: message }
      }, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      
      return true;
    } catch (error) {
      logger.error('خطا در ارسال پاسخ به اینستاگرام:', error);
      return false;
    }
  }
}

module.exports = { InstagramService };