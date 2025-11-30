// Realtime Service - Manages WebSocket connections and broadcasts
import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';
import { v4 as uuidv4 } from 'uuid';

interface Client {
  id: string;
  ws: WebSocket;
  subscribedCountries: Set<string>;
  lastPing: Date;
  isAlive: boolean;
}

interface RealtimeMessage {
  type: string;
  data?: unknown;
  timestamp?: string;
  [key: string]: unknown;
}

class RealtimeService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, Client> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  initialize(server: Server): void {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/compare',
    });

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request);
    });

    // Start heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.checkHeartbeats();
    }, config.websocket.heartbeatInterval);

    logger.info('WebSocket server initialized');
  }

  private handleConnection(ws: WebSocket, request: IncomingMessage): void {
    const clientId = uuidv4();
    const client: Client = {
      id: clientId,
      ws,
      subscribedCountries: new Set(),
      lastPing: new Date(),
      isAlive: true,
    };

    this.clients.set(clientId, client);
    logger.info(`WebSocket client connected: ${clientId}`);

    // Send welcome message
    this.sendToClient(client, {
      type: 'connected',
      clientId,
      message: 'Connected to WorldStats realtime server',
      timestamp: new Date().toISOString(),
    });

    // Handle messages
    ws.on('message', (data: Buffer) => {
      this.handleMessage(client, data);
    });

    // Handle pong
    ws.on('pong', () => {
      client.isAlive = true;
      client.lastPing = new Date();
    });

    // Handle close
    ws.on('close', () => {
      this.clients.delete(clientId);
      logger.info(`WebSocket client disconnected: ${clientId}`);
    });

    // Handle error
    ws.on('error', (err) => {
      logger.error(`WebSocket error for client ${clientId}:`, err);
      this.clients.delete(clientId);
    });
  }

  private handleMessage(client: Client, data: Buffer): void {
    try {
      const message = JSON.parse(data.toString()) as RealtimeMessage;

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(client, message);
          break;

        case 'unsubscribe':
          this.handleUnsubscribe(client, message);
          break;

        case 'ping':
          this.sendToClient(client, { type: 'pong', timestamp: new Date().toISOString() });
          break;

        case 'compare':
          this.handleCompareRequest(client, message);
          break;

        default:
          this.sendToClient(client, { 
            type: 'error', 
            message: `Unknown message type: ${message.type}` 
          });
      }
    } catch (err) {
      logger.error('Failed to parse WebSocket message', err);
      this.sendToClient(client, { type: 'error', message: 'Invalid message format' });
    }
  }

  private handleSubscribe(client: Client, message: RealtimeMessage): void {
    const countries = message.countries as string[] | undefined;
    if (countries && Array.isArray(countries)) {
      countries.forEach(code => client.subscribedCountries.add(code.toUpperCase()));
      this.sendToClient(client, {
        type: 'subscribed',
        countries: Array.from(client.subscribedCountries),
        timestamp: new Date().toISOString(),
      });
    }
  }

  private handleUnsubscribe(client: Client, message: RealtimeMessage): void {
    const countries = message.countries as string[] | undefined;
    if (countries && Array.isArray(countries)) {
      countries.forEach(code => client.subscribedCountries.delete(code.toUpperCase()));
      this.sendToClient(client, {
        type: 'unsubscribed',
        countries: Array.from(client.subscribedCountries),
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async handleCompareRequest(client: Client, message: RealtimeMessage): Promise<void> {
    const { c1, c2 } = message as { c1?: string; c2?: string };
    
    if (!c1 || !c2) {
      this.sendToClient(client, {
        type: 'error',
        message: 'Missing country codes for comparison',
      });
      return;
    }

    // Import comparison service dynamically to avoid circular dependency
    const { comparisonService } = await import('../services/comparison.service.js');

    try {
      const comparison = await comparisonService.compare(c1, c2);
      this.sendToClient(client, {
        type: 'comparison-result',
        data: comparison,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      this.sendToClient(client, {
        type: 'error',
        message: err instanceof Error ? err.message : 'Comparison failed',
      });
    }
  }

  private sendToClient(client: Client, message: RealtimeMessage): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private checkHeartbeats(): void {
    this.clients.forEach((client, id) => {
      if (!client.isAlive) {
        client.ws.terminate();
        this.clients.delete(id);
        return;
      }
      client.isAlive = false;
      client.ws.ping();
    });
  }

  // Broadcast to all connected clients
  broadcast(message: RealtimeMessage): void {
    const payload = JSON.stringify({
      ...message,
      timestamp: message.timestamp || new Date().toISOString(),
    });

    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    });

    logger.debug(`Broadcast sent to ${this.clients.size} clients: ${message.type}`);
  }

  // Broadcast to clients subscribed to specific countries
  broadcastToSubscribed(countryCodes: string[], message: RealtimeMessage): void {
    const codes = new Set(countryCodes.map(c => c.toUpperCase()));
    const payload = JSON.stringify({
      ...message,
      timestamp: message.timestamp || new Date().toISOString(),
    });

    this.clients.forEach(client => {
      const hasSubscription = Array.from(client.subscribedCountries).some(c => codes.has(c));
      if (hasSubscription && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    });
  }

  // Get connected client count
  getClientCount(): number {
    return this.clients.size;
  }

  // Shutdown
  shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.clients.forEach(client => {
      client.ws.close(1001, 'Server shutting down');
    });
    this.clients.clear();

    if (this.wss) {
      this.wss.close();
    }

    logger.info('WebSocket server shut down');
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
