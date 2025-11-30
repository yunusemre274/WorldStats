// WebSocket Compare Handler - Real-time country comparison
import { WebSocket } from 'ws';
import { comparisonService } from '../services/comparison.service.js';
import { logger } from '../utils/logger.js';

interface CompareMessage {
  type: 'compare';
  c1: string;
  c2: string;
  requestId?: string;
}

export async function handleCompareWebSocket(
  ws: WebSocket,
  message: CompareMessage
): Promise<void> {
  const { c1, c2, requestId } = message;

  if (!c1 || !c2) {
    ws.send(JSON.stringify({
      type: 'error',
      requestId,
      message: 'Both country codes (c1 and c2) are required',
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  try {
    // Send acknowledgment
    ws.send(JSON.stringify({
      type: 'compare-started',
      requestId,
      c1: c1.toUpperCase(),
      c2: c2.toUpperCase(),
      timestamp: new Date().toISOString(),
    }));

    // Perform comparison
    const result = await comparisonService.compare(c1, c2);

    // Send result
    ws.send(JSON.stringify({
      type: 'compare-result',
      requestId,
      data: result,
      timestamp: new Date().toISOString(),
    }));
  } catch (err) {
    logger.error('WebSocket compare error', err);
    ws.send(JSON.stringify({
      type: 'compare-error',
      requestId,
      message: err instanceof Error ? err.message : 'Comparison failed',
      timestamp: new Date().toISOString(),
    }));
  }
}
