const logger = require('../utils/logger');
const { InstagramHandler } = require('../handlers/instagramHandler');
const { InstagramApiService } = require('./instagramApiService');

function setupInstagramHandlers(app, bot, adminId) {
  const instagramHandler = new InstagramHandler(bot, adminId);
  const apiService = new InstagramApiService(process.env.INSTAGRAM_ACCESS_TOKEN);

  // Test endpoint
  app.get('/test/instagram', async (req, res) => {
    try {
      logger.info('تست اتصال به API اینستاگرام...');
      
      const connectionTest = await apiService.testConnection();
      if (!connectionTest.success) {
        return res.status(400).json({
          status: 'error',
          message: 'خطا در اتصال به API اینستاگرام',
          details: connectionTest.error
        });
      }

      const accountInfo = await apiService.getAccountInfo();
      if (!accountInfo.success) {
        return res.status(400).json({
          status: 'error',
          message: 'خطا در دریافت اطلاعات اکانت',
          details: accountInfo.error
        });
      }

      res.json({
        status: 'success',
        connection: connectionTest.data,
        account: accountInfo.data
      });
      
      logger.success('تست API اینستاگرام موفقیت‌آمیز بود');
    } catch (error) {
      logger.error('خطا در تست API:', error);
      res.status(500).json({
        status: 'error',
        message: 'خطای سیستمی',
        error: error.message
      });
    }
  });

  // Verify webhook
  app.get('/webhook/instagram', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      logger.success('Instagram webhook verified');
      res.status(200).send(challenge);
    } else {
      logger.error('Instagram webhook verification failed');
      res.sendStatus(403);
    }
  });

  // Handle webhook updates
  app.post('/webhook/instagram', async (req, res) => {
    try {
      await instagramHandler.handleWebhookUpdate(req, res);
    } catch (error) {
      logger.error('Error processing Instagram update:', error);
      res.sendStatus(500);
    }
  });

  return instagramHandler;
}

module.exports = { setupInstagramHandlers };
