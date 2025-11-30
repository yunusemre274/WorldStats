// SSE (Server-Sent Events) Handler - Fallback for WebSocket
import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

interface SSEClient {
  id: string;
  res: Response;
  subscribedCountries: Set<string>;
}

class SSEService {
  private clients: Map<string, SSEClient> = new Map();

  // Handle new SSE connection
  handleConnection(req: Request, res: Response): void {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    const clientId = uuidv4();
    const client: SSEClient = {
      id: clientId,
      res,
      subscribedCountries: new Set(),
    };

    this.clients.set(clientId, client);
    logger.info(`SSE client connected: ${clientId}`);

    // Send initial connection message
    this.sendToClient(client, 'connected', {
      clientId,
      message: 'Connected to WorldStats SSE server',
    });

    // Handle client disconnect
    req.on('close', () => {
      this.clients.delete(clientId);
      logger.info(`SSE client disconnected: ${clientId}`);
    });

    // Send heartbeat every 30 seconds to keep connection alive
    const heartbeatInterval = setInterval(() => {
      if (this.clients.has(clientId)) {
        this.sendToClient(client, 'heartbeat', { timestamp: new Date().toISOString() });
      } else {
        clearInterval(heartbeatInterval);
      }
    }, 30000);
  }

  // Send event to specific client
  private sendToClient(client: SSEClient, event: string, data: unknown): void {
    try {
      client.res.write(`event: ${event}\n`);
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      logger.error(`Failed to send SSE to client ${client.id}`, err);
    }
  }

  // Broadcast to all SSE clients
  broadcast(event: string, data: unknown): void {
    const payload = {
      ...data as object,
      timestamp: new Date().toISOString(),
    };

    this.clients.forEach(client => {
      this.sendToClient(client, event, payload);
    });

    logger.debug(`SSE broadcast sent to ${this.clients.size} clients: ${event}`);
  }

  // Broadcast to clients subscribed to specific countries
  broadcastToSubscribed(countryCodes: string[], event: string, data: unknown): void {
    const codes = new Set(countryCodes.map(c => c.toUpperCase()));
    const payload = {
      ...data as object,
      timestamp: new Date().toISOString(),
    };

    this.clients.forEach(client => {
      const hasSubscription = Array.from(client.subscribedCountries).some(c => codes.has(c));
      if (hasSubscription) {
        this.sendToClient(client, event, payload);
      }
    });
  }

  // Subscribe client to countries
  subscribe(clientId: string, countryCodes: string[]): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;

    countryCodes.forEach(code => client.subscribedCountries.add(code.toUpperCase()));
    this.sendToClient(client, 'subscribed', {
      countries: Array.from(client.subscribedCountries),
    });

    return true;
  }

  // Unsubscribe client from countries
  unsubscribe(clientId: string, countryCodes: string[]): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;

    countryCodes.forEach(code => client.subscribedCountries.delete(code.toUpperCase()));
    this.sendToClient(client, 'unsubscribed', {
      countries: Array.from(client.subscribedCountries),
    });

    return true;
  }

  // Get connected client count
  getClientCount(): number {
    return this.clients.size;
  }
}

export const sseService = new SSEService();
export default sseService;
