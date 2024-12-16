function setupMessageHandlers(bot, adminId) {
  bot.on('message', async (ctx) => {
    try {
      const userId = ctx.from.id.toString();
      
      // Don't process admin's messages here
      if (userId === adminId) {
        return;
      }

      // Forward message to admin
      const forwardedMsg = await ctx.forwardMessage(adminId);
      
      // Send user info
      const userInfo = `👤 پیام از کاربر:
آیدی: ${userId}
نام کاربری: @${ctx.from.username || 'ندارد'}
نام: ${ctx.from.first_name || 'ندارد'}`;

      await bot.telegram.sendMessage(adminId, userInfo);

      // Send confirmation to user
      await ctx.reply('پیام شما دریافت شد. به زودی پاسخ خواهیم داد. 🙏');
      console.log(`✅ پیام از کاربر ${userId} دریافت شد`);
    } catch (error) {
      console.error('خطا در پردازش پیام کاربر:', error);
      await ctx.reply('متأسفانه در ارسال پیام مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
    }
  });
}

module.exports = { setupMessageHandlers };