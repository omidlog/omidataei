function formatUserInfo(user) {
  const username = user.username || 'بدون نام کاربری';
  const firstName = user.first_name || 'بدون نام';
  const lastName = user.last_name || '';
  
  return `👤 پیام از کاربر:
آیدی: ${user.id}
نام کاربری: @${username}
نام کامل: ${firstName} ${lastName}`.trim();
}

function extractUserIdFromMessage(message) {
  // Try to extract from text or caption
  const content = message.text || message.caption || '';
  
  // Try different patterns
  const patterns = [
    /آیدی: (\d+)/,           // Persian format
    /ID: (\d+)/i,            // English format
    /از کاربر:[\s\S]*?(\d+)/, // Flexible format
    /(\d{6,})/              // Any long number (likely to be user ID)
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

module.exports = {
  formatUserInfo,
  extractUserIdFromMessage
};