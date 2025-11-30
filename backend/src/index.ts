// WorldStats Backend - Main Entry Point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

import { config } from './utils/config.js';
import { logger } from './utils/logger.js';
import redis from './utils/redis.js';
import prisma from './db/client.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { realtimeService } from './realtime/realtime.service.js';
import { syncCron } from './cron/syncAll.cron.js';

async function bootstrap(): Promise<void> {
  logger.info('Starting WorldStats Backend...');

  // Initialize Express app
  const app = express();
  const server = createServer(app);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false,
  }));

  // CORS - allow multiple origins including production
  const allowedOrigins = [
    'http://localhost:5000', 
    'http://localhost:5173', 
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    ...(Array.isArray(config.cors.origin) ? config.cors.origin : [config.cors.origin])
  ].filter(Boolean);
  
  app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (config.env === 'development') {
        callback(null, true); // Allow all in development
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  // Compression
  app.use(compression());

  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
      success: false,
      error: {
        message: 'Too many requests, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
      },
    },
  });
  app.use('/api', limiter);

  // API routes
  app.use('/api', routes);

  // Root redirect to API docs
  app.get('/', (req, res) => {
    res.redirect('/api');
  });

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Connect to Redis
  try {
    await redis.connect();
  } catch (err) {
    logger.warn('Redis connection failed, continuing without cache', err);
  }

  // Test database connection
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');
  } catch (err) {
    logger.error('❌ Database connection failed', err);
    process.exit(1);
  }

  // Initialize WebSocket server
  realtimeService.initialize(server);

  // Start cron jobs
  syncCron.start();

  // Start server
  server.listen(config.port, () => {
    logger.info(`🚀 WorldStats Backend running on port ${config.port}`);
    logger.info(`📡 API: http://localhost:${config.port}/api`);
    logger.info(`🔌 WebSocket: ws://localhost:${config.port}/ws/compare`);
    logger.info(`📊 Environment: ${config.env}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully...`);

    syncCron.stop();
    realtimeService.shutdown();

    server.close(async () => {
      await redis.disconnect();
      await prisma.$disconnect();
      logger.info('Server shut down complete');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
