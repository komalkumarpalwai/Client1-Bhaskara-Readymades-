import app from './app.js';
import { ENV, isSalesforceConfigured } from './config/env.js';
import { logger } from './utils/logger.js';

const PORT = ENV.PORT;

const server = app.listen(PORT, () => {
  logger.info(`================================================`);
  logger.info(` Readymades E-Commerce Backend Server Started`);
  logger.info(` Port: ${PORT}`);
  logger.info(` Environment: ${ENV.NODE_ENV}`);
  logger.info(` Client Origin: ${ENV.CLIENT_URL}`);
  logger.info(` Salesforce Configured: ${isSalesforceConfigured() ? 'YES' : 'NO (Placeholder mode)'}`);
  logger.info(` API Root: http://localhost:${PORT}/api`);
  logger.info(`================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
  });
});
