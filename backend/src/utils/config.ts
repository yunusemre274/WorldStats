// Application Configuration
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',

  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/worldstats',
  },

  redis: {
    enabled: process.env.REDIS_ENABLED !== 'false',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },

  externalApis: {
    worldBank: process.env.WORLD_BANK_API_URL || 'https://api.worldbank.org/v2',
    unData: process.env.UN_DATA_API_URL || 'https://data.un.org/ws/rest',
    oecd: process.env.OECD_API_URL || 'https://stats.oecd.org/SDMX-JSON',
  },

  cache: {
    countryTtl: parseInt(process.env.CACHE_TTL_COUNTRY || '21600', 10), // 6 hours
    chartsTtl: parseInt(process.env.CACHE_TTL_CHARTS || '43200', 10), // 12 hours
    comparisonTtl: parseInt(process.env.CACHE_TTL_COMPARISON || '3600', 10), // 1 hour
    aiSummaryTtl: parseInt(process.env.CACHE_TTL_AI_SUMMARY || '86400', 10), // 24 hours
  },

  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
      : ['http://localhost:5000', 'http://localhost:5173', 'http://localhost:3000'],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  cron: {
    syncSchedule: process.env.CRON_SYNC_SCHEDULE || '0 3 * * *',
  },

  websocket: {
    port: parseInt(process.env.WS_PORT || '3002', 10),
    heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL || '30000', 10),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
} as const;

export default config;
