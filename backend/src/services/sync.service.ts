// Sync Service - Orchestrate data synchronization from all providers
import prisma from '../db/client.js';
import redis from '../utils/redis.js';
import { logger } from '../utils/logger.js';
import {
  worldBankProvider,
  unProvider,
  oecdProvider,
  ciaProvider,
  gfpProvider,
  henleyProvider,
  whoProvider,
  numbeoProvider,
  CountryDataUpdate,
} from '../providers/index.js';
import { realtimeService } from '../realtime/realtime.service.js';

// Map of alpha-3 to alpha-2 codes
const alpha3ToAlpha2: Record<string, string> = {
  USA: 'US', DEU: 'DE', GBR: 'GB', FRA: 'FR', JPN: 'JP',
  CHN: 'CN', IND: 'IN', BRA: 'BR', RUS: 'RU', AUS: 'AU',
};

class SyncService {
  private isRunning = false;

  async syncAll(): Promise<{
    success: boolean;
    results: Array<{ provider: string; success: boolean; count: number; error?: string }>;
  }> {
    if (this.isRunning) {
      logger.warn('Sync already in progress, skipping');
      return { success: false, results: [] };
    }

    this.isRunning = true;
    const startTime = Date.now();
    const results: Array<{ provider: string; success: boolean; count: number; error?: string }> = [];

    try {
      logger.info('Starting full data synchronization...');

      // Run all providers in parallel
      const [
        worldBankResult,
        unResult,
        oecdResult,
        ciaResult,
        gfpResult,
        henleyResult,
        whoResult,
        numbeoResult,
      ] = await Promise.allSettled([
        worldBankProvider.sync(),
        unProvider.sync(),
        oecdProvider.sync(),
        ciaProvider.sync(),
        gfpProvider.sync(),
        henleyProvider.sync(),
        whoProvider.sync(),
        numbeoProvider.sync(),
      ]);

      // Process results and merge data
      const allUpdates = new Map<string, CountryDataUpdate>();

      const processResult = (
        result: PromiseSettledResult<{ success: boolean; data?: CountryDataUpdate[]; provider: string; error?: string }>,
        providerName: string
      ) => {
        if (result.status === 'fulfilled' && result.value.success && result.value.data) {
          results.push({ provider: providerName, success: true, count: result.value.data.length });
          
          for (const update of result.value.data) {
            const existing = allUpdates.get(update.countryCode) || { countryCode: update.countryCode };
            allUpdates.set(update.countryCode, this.mergeUpdates(existing, update));
          }
        } else {
          const error = result.status === 'rejected' 
            ? result.reason?.message 
            : result.value.error;
          results.push({ provider: providerName, success: false, count: 0, error });
        }
      };

      processResult(worldBankResult, 'worldbank');
      processResult(unResult, 'un');
      processResult(oecdResult, 'oecd');
      processResult(ciaResult, 'cia');
      processResult(gfpResult, 'gfp');
      processResult(henleyResult, 'henley');
      processResult(whoResult, 'who');
      processResult(numbeoResult, 'numbeo');

      // Apply updates to database
      for (const [countryCode, update] of allUpdates) {
        await this.applyUpdate(countryCode, update);
      }

      // Invalidate all caches
      await redis.invalidateAllCache();

      // Broadcast update to all WebSocket clients
      realtimeService.broadcast({
        type: 'data-updated',
        timestamp: new Date().toISOString(),
        message: 'Country data has been refreshed',
        providers: results.filter(r => r.success).map(r => r.provider),
      });

      const duration = Date.now() - startTime;
      logger.info(`Full sync completed in ${duration}ms`, { results });

      return { success: true, results };
    } catch (err) {
      logger.error('Full sync failed', err);
      return { success: false, results };
    } finally {
      this.isRunning = false;
    }
  }

  private mergeUpdates(existing: CountryDataUpdate, incoming: CountryDataUpdate): CountryDataUpdate {
    return {
      ...existing,
      demographics: { ...existing.demographics, ...incoming.demographics },
      economy: { ...existing.economy, ...incoming.economy },
      military: { ...existing.military, ...incoming.military },
      politics: { ...existing.politics, ...incoming.politics },
      crime: { ...existing.crime, ...incoming.crime },
      health: { ...existing.health, ...incoming.health },
      education: { ...existing.education, ...incoming.education },
    };
  }

  private async applyUpdate(countryCode: string, update: CountryDataUpdate): Promise<void> {
    try {
      // Find the country by code
      const alpha2Code = alpha3ToAlpha2[countryCode] || countryCode;
      const country = await prisma.country.findFirst({
        where: {
          OR: [
            { code: alpha2Code },
            { code3: countryCode },
          ],
        },
      });

      if (!country) {
        logger.warn(`Country not found for code: ${countryCode}`);
        return;
      }

      // Update demographics
      if (update.demographics && Object.keys(update.demographics).length > 0) {
        await prisma.demographics.upsert({
          where: { countryId: country.id },
          update: update.demographics as any,
          create: {
            countryId: country.id,
            ...update.demographics as any,
          },
        });
      }

      // Update economy
      if (update.economy && Object.keys(update.economy).length > 0) {
        await prisma.economy.upsert({
          where: { countryId: country.id },
          update: update.economy as any,
          create: {
            countryId: country.id,
            ...update.economy as any,
          },
        });
      }

      // Update military
      if (update.military && Object.keys(update.military).length > 0) {
        await prisma.military.upsert({
          where: { countryId: country.id },
          update: update.military as any,
          create: {
            countryId: country.id,
            ...update.military as any,
          },
        });
      }

      // Update politics
      if (update.politics && Object.keys(update.politics).length > 0) {
        await prisma.politics.upsert({
          where: { countryId: country.id },
          update: update.politics as any,
          create: {
            countryId: country.id,
            ...update.politics as any,
          },
        });
      }

      // Update crime
      if (update.crime && Object.keys(update.crime).length > 0) {
        const { categories, ...crimeData } = update.crime;
        
        const crime = await prisma.crime.upsert({
          where: { countryId: country.id },
          update: crimeData as any,
          create: {
            countryId: country.id,
            ...crimeData as any,
          },
        });

        // Update crime categories
        if (categories && categories.length > 0) {
          // Delete existing categories
          await prisma.crimeCategory.deleteMany({
            where: { crimeId: crime.id },
          });

          // Insert new categories
          await prisma.crimeCategory.createMany({
            data: categories.map(cat => ({
              crimeId: crime.id,
              category: cat.category,
              percentage: cat.percentage,
              count: cat.count,
            })),
          });
        }
      }

      // Update health stats
      if (update.health && Object.keys(update.health).length > 0) {
        await prisma.healthStats.upsert({
          where: { countryId: country.id },
          update: update.health as any,
          create: {
            countryId: country.id,
            ...update.health as any,
          },
        });
      }

      // Update education
      if (update.education && Object.keys(update.education).length > 0) {
        await prisma.education.upsert({
          where: { countryId: country.id },
          update: update.education as any,
          create: {
            countryId: country.id,
            ...update.education as any,
          },
        });
      }

      logger.debug(`Updated country: ${countryCode}`);
    } catch (err) {
      logger.error(`Failed to apply update for ${countryCode}`, err);
    }
  }

  isInProgress(): boolean {
    return this.isRunning;
  }
}

export const syncService = new SyncService();
export default syncService;
