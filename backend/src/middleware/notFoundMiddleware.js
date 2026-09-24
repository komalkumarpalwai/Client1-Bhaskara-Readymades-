import { sendError } from '../utils/response.js';

export const notFoundMiddleware = (req, res, next) => {
  return sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
};
