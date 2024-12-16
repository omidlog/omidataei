# Omid Ataei Support Bot

ربات پشتیبانی تلگرام برای دریافت و پاسخ به پیام‌های کاربران

## نحوه راه‌اندازی

1. ابتدا یک ربات در تلگرام از طریق [@BotFather](https://t.me/BotFather) بسازید و توکن آن را دریافت کنید.

2. فایل `.env` را ویرایش کنید:
   - `BOT_TOKEN`: توکن ربات خود را قرار دهید
   - `ADMIN_ID`: آیدی عددی تلگرام خود را قرار دهید (می‌توانید از [@userinfobot](https://t.me/userinfobot) دریافت کنید)

3. دستورات زیر را اجرا کنید:
```bash
npm install
npm start
```

## نحوه استفاده

- کاربران می‌توانند هر نوع پیامی را به ربات ارسال کنند
- تمام پیام‌ها به ادمین فوروارد می‌شود
- ادمین می‌تواند با دستور زیر به کاربران پاسخ دهد:
```
/reply user_id پیام مورد نظر
```

## ویژگی‌ها

- پشتیبانی از انواع پیام‌ها (متن، عکس، ویدیو، صدا، استیکر، فایل)
- ارسال اطلاعات کاربر همراه با پیام
- سیستم پاسخ‌دهی ساده برای ادمین
- پیام‌های تأیید برای کاربران