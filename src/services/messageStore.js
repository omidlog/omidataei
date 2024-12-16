/**
 * MessageStore class for managing message mappings and user sessions
 */
class MessageStore {
  constructor() {
    this.messageMap = new Map();
    this.userSessions = new Map();
  }

  storeMessage(forwardedMessageId, userId, originalMessageId) {
    this.messageMap.set(forwardedMessageId, {
      userId,
      originalMessageId,
      timestamp: Date.now()
    });
  }

  getMessage(messageId) {
    return this.messageMap.get(messageId);
  }

  // Clean up old messages (older than 24 hours)
  cleanup() {
    const DAY_IN_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    for (const [key, value] of this.messageMap.entries()) {
      if (now - value.timestamp > DAY_IN_MS) {
        this.messageMap.delete(key);
      }
    }
  }
}

// Create a singleton instance
const store = new MessageStore();

// Run cleanup every hour
setInterval(() => store.cleanup(), 60 * 60 * 1000);

module.exports = store;