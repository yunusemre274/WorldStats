// Country Controller - Handle HTTP requests for country endpoints
import { Request, Response, NextFunction } from 'express';
import { countryService } from '../services/country.service.js';
import { chartService } from '../services/chart.service.js';
import { comparisonService } from '../services/comparison.service.js';
import { countrySummaryGenerator } from '../ai/countrySummary.generator.js';
import { syncService } from '../services/sync.service.js';
import { ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class CountryController {
  // GET /countries - Get all countries
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const countries = await countryService.getAll();
      res.json({
        success: true,
        count: countries.length,
        data: countries,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /countries/search?q= - Search countries
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 1) {
        throw new ValidationError('Search query (q) is required and must be at least 1 character');
      }

      const results = await countryService.search(query);
      res.json({
        success: true,
        query,
        count: results.length,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /country/:code - Get single country with all stats
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.params;
      
      if (!code) {
        throw new ValidationError('Country code is required');
      }

      const country = await countryService.getOne(code);
      res.json({
        success: true,
        data: country,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /country/:code/charts - Get chart data for country
  async getCharts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.params;
      
      if (!code) {
        throw new ValidationError('Country code is required');
      }

      const charts = await chartService.getCharts(code);
      res.json({
        success: true,
        countryCode: code.toUpperCase(),
        data: charts,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /country/:code/summary - Get AI-generated summary
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.params;
      
      if (!code) {
        throw new ValidationError('Country code is required');
      }

      const summary = await countrySummaryGenerator.generateSummary(code);
      res.json({
        success: true,
        countryCode: code.toUpperCase(),
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /compare?c1=&c2= - Compare two countries
  async compare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const c1 = req.query.c1 as string;
      const c2 = req.query.c2 as string;
      
      if (!c1 || !c2) {
        throw new ValidationError('Both country codes (c1 and c2) are required');
      }

      const comparison = await comparisonService.compare(c1, c2);
      res.json({
        success: true,
        data: comparison,
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /sync - Manually trigger data sync (admin only)
  async triggerSync(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (syncService.isInProgress()) {
        res.status(409).json({
          success: false,
          message: 'Sync already in progress',
        });
        return;
      }

      // Run sync in background
      syncService.syncAll().catch(err => {
        logger.error('Background sync failed', err);
      });

      res.json({
        success: true,
        message: 'Sync started in background',
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /sync/status - Get sync status
  async getSyncStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        isRunning: syncService.isInProgress(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const countryController = new CountryController();
export default countryController;
