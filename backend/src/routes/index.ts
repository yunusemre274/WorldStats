// API Routes
import { Router } from 'express';
import { countryController } from '../controllers/country.controller.js';
import { sseService } from '../realtime/sse.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Country endpoints
router.get('/countries', (req, res, next) => countryController.getAll(req, res, next));
router.get('/countries/search', (req, res, next) => countryController.search(req, res, next));
router.get('/country/:code', (req, res, next) => countryController.getOne(req, res, next));
router.get('/country/:code/charts', (req, res, next) => countryController.getCharts(req, res, next));
router.get('/country/:code/summary', (req, res, next) => countryController.getSummary(req, res, next));

// Comparison endpoint
router.get('/compare', (req, res, next) => countryController.compare(req, res, next));

// SSE endpoint (fallback for WebSocket)
router.get('/sse/updates', (req, res) => {
  sseService.handleConnection(req, res);
});

// SSE subscription management
router.post('/sse/subscribe/:clientId', (req, res) => {
  const { clientId } = req.params;
  const { countries } = req.body as { countries?: string[] };
  
  if (!countries || !Array.isArray(countries)) {
    res.status(400).json({ success: false, message: 'Countries array required' });
    return;
  }

  const success = sseService.subscribe(clientId, countries);
  res.json({ success, message: success ? 'Subscribed' : 'Client not found' });
});

router.post('/sse/unsubscribe/:clientId', (req, res) => {
  const { clientId } = req.params;
  const { countries } = req.body as { countries?: string[] };
  
  if (!countries || !Array.isArray(countries)) {
    res.status(400).json({ success: false, message: 'Countries array required' });
    return;
  }

  const success = sseService.unsubscribe(clientId, countries);
  res.json({ success, message: success ? 'Unsubscribed' : 'Client not found' });
});

// Admin endpoints
router.post('/sync', (req, res, next) => countryController.triggerSync(req, res, next));
router.get('/sync/status', (req, res, next) => countryController.getSyncStatus(req, res, next));

// API documentation
router.get('/', (req, res) => {
  res.json({
    name: 'WorldStats API',
    version: '1.0.0',
    description: 'Real-time global statistics API',
    endpoints: {
      'GET /health': 'Health check',
      'GET /countries': 'List all countries',
      'GET /countries/search?q=': 'Search countries (fuzzy)',
      'GET /country/:code': 'Get country full statistics',
      'GET /country/:code/charts': 'Get chart-ready data',
      'GET /country/:code/summary': 'Get AI-generated summary',
      'GET /compare?c1=&c2=': 'Compare two countries',
      'GET /sse/updates': 'SSE connection for real-time updates',
      'POST /sync': 'Trigger data sync (admin)',
      'GET /sync/status': 'Get sync status',
    },
    websocket: {
      endpoint: '/ws/compare',
      description: 'Real-time comparison WebSocket',
    },
  });
});

export default router;
