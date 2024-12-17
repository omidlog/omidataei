require('dotenv').config();

const botToken = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;

if (!botToken) {
  throw new Error('BOT_TOKEN is not set in environment variables');
}

if (!adminId) {
  throw new Error('ADMIN_ID is not set in environment variables');
}

module.exports = {
  botToken,
  adminId
};