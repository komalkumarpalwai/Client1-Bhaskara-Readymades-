import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { logger } from './utils/logger.js';
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

// Enable CORS for frontend application (supports dynamic localhost ports in development)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow configured CLIENT_URL or any localhost / 127.0.0.1 port in development
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (isLocalhost || origin === ENV.CLIENT_URL) {
      return callback(null, true);
    }
    
    return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
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

// API Routes mounted on /api
app.use('/api', apiRouter);

// Root path fallback
app.get('/', (req, res) => {
  res.json({
    name: 'Readymades E-Commerce Backend API',
    status: 'online',
    documentation: '/api'
  });
});

// 404 Handler
app.use(notFoundMiddleware);

// Centralized Error Handler
app.use(errorMiddleware);

export default app;
