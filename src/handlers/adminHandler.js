const logger = require('../utils/logger');

function setupAdminHandlers(bot, adminId, instagramHandler) {
  // Handle admin replies
  bot.on('message', async (ctx) => {
    try {
      // Check if sender is admin
      if (ctx.from.id.toString() !== adminId) {
        return;
      }

      // Handle reply to forwarded message
      if (ctx.message.reply_to_message) {
        const repliedMsg = ctx.message.reply_to_message;
        
        try {
          // First try to handle as Instagram message
          const isInstagramMessage = await instagramHandler.handleAdminReply(ctx);
          if (isInstagramMessage) {
            return; // Message was handled by Instagram handler
          }

          // If not Instagram, handle as Telegram message
          const userIdMatch = repliedMsg.text?.match(/آیدی: (\d+)/);
          
          if (userIdMatch) {
            const userId = userIdMatch[1];
            const replyText = ctx.message.text;
            
            // Send reply to Telegram user
            await bot.telegram.sendMessage(userId, `پاسخ پشتیبانی:\n\n${replyText}`);
            await ctx.reply(`✅ پیام به کاربر ${userId} ارسال شد.`);
            logger.success(`پاسخ ادمین به کاربر ${userId} ارسال شد`);
          } else {
            await ctx.reply('❌ لطفاً روی پیام اصلی یا اطلاعات کاربر ریپلای کنید.');
          }
        } catch (error) {
          logger.error('خطا در ارسال پاسخ:', error);
          await ctx.reply('❌ خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
        }
      }
      
      // Handle /reply command
      else if (ctx.message.text?.startsWith('/reply')) {
        const args = ctx.message.text.split(' ');
        if (args.length < 3) {
          return ctx.reply('فرمت صحیح: /reply user_id message');
        }

        const userId = args[1];
        const message = args.slice(2).join(' ');

        try {
          await bot.telegram.sendMessage(userId, `پاسخ پشتیبانی:\n\n${message}`);
          await ctx.reply(`✅ پیام به کاربر ${userId} ارسال شد.`);
          logger.success(`پاسخ ادمین به کاربر ${userId} ارسال شد`);
        } catch (error) {
          logger.error('خطا در ارسال پیام به کاربر:', error);
          await ctx.reply('❌ خطا در ارسال پیام. ممکن است کاربر ربات را بلاک کرده باشد.');
        }
      }
    } catch (error) {
      logger.error('خطا در پردازش پیام ادمین:', error);
      await ctx.reply('❌ خطا در پردازش پیام. لطفاً دوباره تلاش کنید.');
    }
  });
}

module.exports = { setupAdminHandlers };