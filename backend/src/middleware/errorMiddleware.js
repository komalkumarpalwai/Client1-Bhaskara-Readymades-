import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';

export const errorMiddleware = (err, req, res, next) => {
  logger.error(`Error occurred on ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  return sendError(res, statusCode, message, {
    details: err.details || null
  });
};
