const { IgApiClient } = require('instagram-private-api');
const logger = require('../utils/logger');

class InstagramUnofficialService {
  constructor(bot, adminId, instagramConfig) {
    this.bot = bot;
    this.adminId = adminId;
    this.username = instagramConfig.username;
    this.password = instagramConfig.password;
    this.ig = new IgApiClient();
  }

  async login() {
    try {
      this.ig.state.generateDevice(this.username);
      await this.ig.account.login(this.username, this.password);
      logger.success('ورود به اینستاگرام موفقیت‌آمیز بود');
      
      // Start checking DMs
      this.startDMCheck();
    } catch (error) {
      logger.error('خطا در ورود به اینستاگرام:', error);
    }
  }

  async startDMCheck() {
    setInterval(async () => {
      try {
        const inbox = await this.ig.feed.directInbox().items();
        
        for (const thread of inbox) {
          if (!thread.seen) {
            await this.handleNewMessage(thread);
          }
        }
      } catch (error) {
        logger.error('خطا در بررسی پیام‌های اینستاگرام:', error);
      }
    }, 30000); // چک کردن هر 30 ثانیه
  }

  async handleNewMessage(thread) {
    const lastMessage = thread.items[0];
    
    // Forward to Telegram
    await this.bot.telegram.sendMessage(this.adminId, 
      `📱 پیام جدید اینستاگرام:
👤 از: ${thread.users[0].username}
📝 پیام: ${lastMessage.text}`
    );
  }
}

module.exports = { InstagramUnofficialService };