const logger = require('../utils/logger');
const { formatUserInfo } = require('../utils/messageFormatter');

function setupTelegramHandlers(bot, adminId) {
  // Handle /start command
  bot.command('start', async (ctx) => {
    try {
      const message = ctx.from.id.toString() === adminId 
        ? 'سلام ادمین عزیز! ربات آماده دریافت پیام‌های کاربران است.'
        : 'به ربات پشتیبانی خوش آمدید! لطفاً پیام خود را ارسال کنید.';
      
      await ctx.reply(message);
      logger.success(`کاربر ${ctx.from.id} ربات را استارت کرد`);
    } catch (error) {
      logger.error('خطا در دستور start:', error);
    }
  });

  // Handle messages from users
  bot.on('message', async (ctx) => {
    try {
      const userId = ctx.from.id.toString();
      
      // Skip if message is from admin
      if (userId === adminId) {
        return handleAdminMessage(ctx, bot, adminId);
      }

      // Forward message to admin
      const forwardedMsg = await ctx.forwardMessage(adminId);
      
      // Send user info
      const userInfo = formatUserInfo(ctx.from);
      await bot.telegram.sendMessage(adminId, userInfo, {
        reply_to_message_id: forwardedMsg.message_id
      });

      // Confirm receipt to user
      await ctx.reply('پیام شما دریافت شد. به زودی پاسخ خواهیم داد. 🙏');
      logger.success(`پیام از کاربر ${userId} دریافت شد`);
    } catch (error) {
      logger.error('خطا در پردازش پیام:', error);
      await ctx.reply('متأسفانه در ارسال پیام مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
    }
  });
}

async function handleAdminMessage(ctx, bot, adminId) {
  try {
    // Handle replies to forwarded messages
    if (ctx.message.reply_to_message) {
      const repliedMsg = ctx.message.reply_to_message;
      const userIdMatch = repliedMsg.text?.match(/آیدی: (\d+)/);
      
      if (userIdMatch) {
        const userId = userIdMatch[1];
        await bot.telegram.sendMessage(userId, `پاسخ پشتیبانی:\n\n${ctx.message.text}`);
        await ctx.reply(`✅ پیام به کاربر ${userId} ارسال شد.`);
        logger.success(`پیام ادمین به کاربر ${userId} ارسال شد`);
      }
    }
  } catch (error) {
    logger.error('خطا در پردازش پیام ادمین:', error);
    await ctx.reply('❌ خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
  }
}

module.exports = { setupTelegramHandlers };