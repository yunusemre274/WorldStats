// Redis Cache Client (with in-memory fallback)
import Redis from 'ioredis';
import { config } from './config.js';

// Simple in-memory cache for when Redis is disabled
class MemoryCache {
  private cache = new Map<string, { value: string; expiresAt: number | null }>();

  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: string, ttlSeconds?: number): void {
    this.cache.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  keys(pattern: string): string[] {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return Array.from(this.cache.keys()).filter((k) => regex.test(k));
  }

  flush(): void {
    this.cache.clear();
  }
}

class RedisClient {
  private client: Redis | null = null;
  private memoryCache = new MemoryCache();
  private isConnected = false;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = config.redis.enabled !== false;
  }

  async connect(): Promise<Redis | null> {
    if (!this.isEnabled) {
      console.log('📦 Redis disabled, using in-memory cache');
      return null;
    }

    if (this.client && this.isConnected) {
      return this.client;
    }

    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password || undefined,
      db: config.redis.db,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      this.isConnected = false;
      console.log('🔌 Redis connection closed');
    });

    try {
      await this.client.connect();
      return this.client;
    } catch (err) {
      console.log('📦 Redis unavailable, falling back to in-memory cache');
      this.isEnabled = false;
      this.client = null;
      return null;
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      let data: string | null;
      if (this.client && this.isConnected) {
        data = await this.client.get(key);
      } else {
        data = this.memoryCache.get(key);
      }
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Cache GET error:', err);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (this.client && this.isConnected) {
        if (ttlSeconds) {
          await this.client.setex(key, ttlSeconds, serialized);
        } else {
          await this.client.set(key, serialized);
        }
      } else {
        this.memoryCache.set(key, serialized, ttlSeconds);
      }
      return true;
    } catch (err) {
      console.error('Cache SET error:', err);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (this.client && this.isConnected) {
        await this.client.del(key);
      } else {
        this.memoryCache.del(key);
      }
      return true;
    } catch (err) {
      console.error('Cache DEL error:', err);
      return false;
    }
  }

  async delPattern(pattern: string): Promise<number> {
    try {
      if (this.client && this.isConnected) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
        return keys.length;
      } else {
        const keys = this.memoryCache.keys(pattern);
        keys.forEach((k) => this.memoryCache.del(k));
        return keys.length;
      }
    } catch (err) {
      console.error('Cache DEL pattern error:', err);
      return 0;
    }
  }

  async invalidateCountryCache(countryCode?: string): Promise<void> {
    if (countryCode) {
      await this.delPattern(`country:${countryCode}:*`);
      await this.del(`country:${countryCode}`);
    } else {
      await this.delPattern('country:*');
      await this.delPattern('countries:*');
    }
  }

  async invalidateAllCache(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.flushdb();
    } else {
      this.memoryCache.flush();
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }
}

export const redis = new RedisClient();
export default redis;
