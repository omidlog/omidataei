const logger = {
  info: (message) => {
    console.log(`ℹ️ ${message}`);
  },
  success: (message) => {
    console.log(`✅ ${message}`);
  },
  error: (message, error) => {
    console.error(`❌ ${message}`);
    if (error) {
      console.error(error);
    }
  },
  warning: (message) => {
    console.log(`⚠️ ${message}`);
  }
};

module.exports = logger;