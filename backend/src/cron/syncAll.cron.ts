// Cron Job - Daily data synchronization
import cron from 'node-cron';
import { syncService } from '../services/sync.service.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

class SyncCron {
  private task: cron.ScheduledTask | null = null;

  start(): void {
    // Schedule: Default is "0 3 * * *" (3 AM daily)
    const schedule = config.cron.syncSchedule;
    
    logger.info(`Starting sync cron job with schedule: ${schedule}`);

    this.task = cron.schedule(schedule, async () => {
      logger.info('Cron job triggered: Starting daily data sync...');
      
      try {
        const result = await syncService.syncAll();
        
        if (result.success) {
          const successCount = result.results.filter(r => r.success).length;
          const totalRecords = result.results.reduce((sum, r) => sum + r.count, 0);
          
          logger.info(`Daily sync completed successfully`, {
            providers: successCount,
            totalRecords,
          });
        } else {
          logger.warn('Daily sync completed with issues', {
            results: result.results,
          });
        }
      } catch (err) {
        logger.error('Daily sync cron job failed', err);
      }
    }, {
      timezone: 'UTC',
    });

    logger.info('Sync cron job started');
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      logger.info('Sync cron job stopped');
    }
  }

  // Manual trigger for testing
  async triggerManual(): Promise<void> {
    logger.info('Manual sync triggered');
    await syncService.syncAll();
  }
}

export const syncCron = new SyncCron();
export default syncCron;
