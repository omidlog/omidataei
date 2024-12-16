const { Telegraf } = require('telegraf');
const config = require('./config');
const { BotService } = require('./services/botService');
const { InstagramService } = require('./services/instagramService');
const { WebhookServer } = require('./services/webhookServer');
const logger = require('./utils/logger');

async function startServices() {
  try {
    // Initialize Telegram bot
    const bot = new Telegraf(config.botToken);
    const botService = new BotService(bot, config.adminId);
    await botService.start();

    // Initialize webhook server and Instagram service if enabled
    if (config.instagram.enabled) {
      const webhookServer = new WebhookServer(config.port);
      const instagramService = new InstagramService(bot, config.adminId, config.instagram);
      
      // Setup webhook handler
      webhookServer.setupWebhookHandler((data) => {
        instagramService.handleInstagramMessage(data);
      });
      
      // Start webhook server
      await webhookServer.start();
      logger.success('سرویس اینستاگرام با موفقیت راه‌اندازی شد');
    }

    // Enable graceful stop
    process.once('SIGINT', () => {
      bot.stop('SIGINT');
      if (config.instagram.enabled) {
        webhookServer.stop();
      }
    });
    process.once('SIGTERM', () => {
      bot.stop('SIGTERM');
      if (config.instagram.enabled) {
        webhookServer.stop();
      }
    });

  } catch (error) {
    logger.error('خطا در راه‌اندازی سرویس‌ها:', error);
    process.exit(1);
  }
}

startServices();