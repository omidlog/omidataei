const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const { setupTelegramHandlers } = require('./services/telegramService');
const { setupInstagramHandlers } = require('./services/instagramService');
const { setupWebhookServer } = require('./services/serverService');
const logger = require('./utils/logger');

// Initialize bot and express app
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const adminId = process.env.ADMIN_ID;

// Validate environment variables
if (!process.env.BOT_TOKEN || !adminId) {
  logger.error('لطفاً BOT_TOKEN و ADMIN_ID را در فایل .env تنظیم کنید');
  process.exit(1);
}

// Setup middleware
app.use(bodyParser.json());

// Setup handlers
setupTelegramHandlers(bot, adminId);
setupInstagramHandlers(app, bot, adminId);

// Setup webhook server
const port = process.env.PORT || 3000;
setupWebhookServer(app, port);

// Start bot
bot.launch()
  .then(() => {
    logger.success('ربات با موفقیت راه‌اندازی شد');
    return bot.telegram.sendMessage(adminId, 'ربات پشتیبانی فعال شد و آماده دریافت پیام است.');
  })
  .catch(error => {
    if (error.description?.includes('chat not found')) {
      logger.warning('\n⚠️ مهم: لطفاً مراحل زیر را انجام دهید:');
      logger.info('1. به ربات خود در تلگرام مراجعه کنید');
      logger.info('2. دکمه Start را بزنید یا دستور /start را ارسال کنید');
      logger.info('3. سپس ربات را مجدداً راه‌اندازی کنید\n');
    } else {
      logger.error('خطا در راه‌اندازی ربات:', error);
    }
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));