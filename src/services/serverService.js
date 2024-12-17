const logger = require('../utils/logger');

function setupWebhookServer(app, port) {
  // Log all requests
  app.use((req, res, next) => {
    logger.info(`📥 ${req.method} ${req.path}`);
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`📤 ${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`);
    });
    
    next();
  });

  // Error handler
  app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // Start server
  app.listen(port, () => {
    logger.success(`Webhook server running on port ${port}`);
  });
}

module.exports = { setupWebhookServer };