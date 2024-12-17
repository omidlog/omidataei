const logger = require('../utils/logger');
const { InstagramHandler } = require('../handlers/instagramHandler');

function setupInstagramHandlers(app, bot, adminId) {
  const instagramHandler = new InstagramHandler(bot, adminId);

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