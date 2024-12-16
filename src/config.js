require('dotenv').config();

const config = {
  // Telegram Config
  botToken: process.env.BOT_TOKEN,
  adminId: process.env.ADMIN_ID,
  
  // Server Config
  port: process.env.PORT || 3000,

  // Instagram Config
  instagram: {
    enabled: false, // Set to true when Instagram credentials are configured
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    userId: process.env.INSTAGRAM_USER_ID,
    appSecret: process.env.INSTAGRAM_APP_SECRET,
    verifyToken: process.env.WEBHOOK_VERIFY_TOKEN
  }
};

if (!config.botToken) {
  throw new Error('BOT_TOKEN is not set in environment variables');
}

if (!config.adminId) {
  throw new Error('ADMIN_ID is not set in environment variables');
}

module.exports = config;