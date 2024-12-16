# Omid Ataei Support Bot

ربات پشتیبانی تلگرام برای دریافت و پاسخ به پیام‌های کاربران و اینستاگرام

## امکانات

- دریافت و پاسخ به پیام‌های کاربران در تلگرام
- پشتیبانی از پیام‌های متنی، عکس، ویدیو و فایل
- دریافت پیام‌های دایرکت اینستاگرام (در حال توسعه)
- پنل مدیریت برای ادمین

## نصب و راه‌اندازی

1. پروژه را کلون کنید:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/omid-ataei-support-bot.git
cd omid-ataei-support-bot
\`\`\`

2. پکیج‌های مورد نیاز را نصب کنید:
\`\`\`bash
npm install
\`\`\`

3. فایل \`.env.example\` را به \`.env\` کپی کرده و مقادیر آن را تنظیم کنید.

4. برای اجرای برنامه:
\`\`\`bash
# حالت توسعه
npm run dev

# حالت تولید
npm start
\`\`\`

## تنظیمات محیطی

برای راه‌اندازی ربات، متغیرهای محیطی زیر را در فایل \`.env\` تنظیم کنید:

- \`BOT_TOKEN\`: توکن ربات تلگرام
- \`ADMIN_ID\`: شناسه عددی ادمین در تلگرام
- \`INSTAGRAM_ACCESS_TOKEN\`: توکن دسترسی API اینستاگرام
- \`INSTAGRAM_USER_ID\`: شناسه کاربری اینستاگرام
- \`INSTAGRAM_APP_SECRET\`: کلید مخفی برنامه اینستاگرام
- \`WEBHOOK_VERIFY_TOKEN\`: توکن تأیید وب‌هوک
- \`PORT\`: پورت سرور (پیش‌فرض: 3000)

## مشارکت

از مشارکت شما در بهبود این پروژه استقبال می‌کنیم. لطفاً برای تغییرات بزرگ، ابتدا یک issue باز کنید.