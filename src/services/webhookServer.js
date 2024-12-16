const express = require('express');
const logger = require('../utils/logger');

class WebhookServer {
  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    
    // Parse JSON bodies
    this.app.use(express.json());
    
    // Basic verification endpoint
    this.app.get('/webhook', (req, res) => {
      // Verify webhook
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
      
      if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        logger.success('Webhook verified');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    });
  }

  setupWebhookHandler(callback) {
    this.app.post('/webhook', (req, res) => {
      if (req.body.object === 'instagram') {
        callback(req.body);
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.port, () => {
          logger.success(`Webhook server running on port ${this.port}`);
          resolve();
        });
      } catch (error) {
        logger.error('Failed to start webhook server:', error);
        reject(error);
      }
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}

module.exports = { WebhookServer };