function setupAdminHandlers(bot, adminId) {
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
        let userId;

        // Get user ID from forwarded message
        if (repliedMsg.forward_from) {
          userId = repliedMsg.forward_from.id;
        } else {
          // Try to get from info message
          const userIdMatch = repliedMsg.text?.match(/آیدی: (\d+)/);
          if (userIdMatch) {
            userId = userIdMatch[1];
          }
        }

        if (!userId) {
          return await ctx.reply('❌ لطفاً روی پیام اصلی کاربر یا پیام اطلاعات کاربر ریپلای کنید.');
        }

        try {
          // Send the reply to user
          if (ctx.message.text) {
            await bot.telegram.sendMessage(userId, ctx.message.text);
          } else if (ctx.message.photo) {
            await bot.telegram.sendPhoto(userId, ctx.message.photo[0].file_id, {
              caption: ctx.message.caption
            });
          } else if (ctx.message.document) {
            await bot.telegram.sendDocument(userId, ctx.message.document.file_id, {
              caption: ctx.message.caption
            });
          }

          await ctx.reply(`✅ پیام به کاربر ${userId} ارسال شد.`);
        } catch (sendError) {
          console.error('خطا در ارسال پیام به کاربر:', sendError);
          await ctx.reply('❌ خطا در ارسال پیام به کاربر. ممکن است ربات را بلاک کرده باشد.');
        }
      }
    } catch (error) {
      console.error('خطا در پردازش پیام ادمین:', error);
      await ctx.reply('❌ خطا در پردازش پیام. لطفاً دوباره تلاش کنید.');
    }
  });
}

module.exports = { setupAdminHandlers };