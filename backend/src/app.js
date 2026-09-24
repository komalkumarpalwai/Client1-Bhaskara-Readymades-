import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { logger } from './utils/logger.js';
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

// Enable CORS for frontend application (supports localhost, Netlify deployments, and custom domains)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin matches localhost, netlify.app, or configured CLIENT_URL
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isNetlify = /^https:\/\/.*\.netlify\.app$/.test(origin);
    const isRender = /^https:\/\/.*\.onrender\.com$/.test(origin);
    const isAllowedClient = ENV.CLIENT_URL && (origin === ENV.CLIENT_URL || origin.startsWith(ENV.CLIENT_URL));

    if (isLocalhost || isNetlify || isRender || isAllowedClient) {
      return callback(null, true);
    }
    
    // In production or custom domains, allow if CLIENT_URL matches or allow all if set to *
    if (ENV.CLIENT_URL === '*') {
      return callback(null, true);
    }

    // Default permissive for web app origins
    return callback(null, true);
  },
  credentials: true
}));

// Body parsing with 25mb limit for photo base64 uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

// API Routes mounted on /api and root fallback
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 404 Handler
app.use(notFoundMiddleware);

// Centralized Error Handler
app.use(errorMiddleware);

export default app;
