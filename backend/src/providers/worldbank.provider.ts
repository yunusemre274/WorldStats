// World Bank API Provider
// Provides: GDP, literacy, education, demographics, economic indicators
import { BaseProvider, ProviderResult, CountryDataUpdate } from './base.provider.js';
import { logger } from '../utils/logger.js';
import { worldBankIndicators, parseNumeric } from '../utils/helpers.js';

interface WorldBankResponse {
  [0]: {
    page: number;
    pages: number;
    per_page: string;
    total: number;
  };
  [1]: WorldBankDataPoint[] | null;
}

interface WorldBankDataPoint {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export class WorldBankProvider extends BaseProvider {
  constructor() {
    super('worldbank', 'https://api.worldbank.org/v2');
  }

  private async fetchIndicator(
    indicator: string,
    countryCodes: string[],
    startYear: number = 2018,
    endYear: number = 2024
  ): Promise<Map<string, number | null>> {
    const results = new Map<string, number | null>();
    
    try {
      const countries = countryCodes.join(';');
      const endpoint = `/country/${countries}/indicator/${indicator}?format=json&date=${startYear}:${endYear}&per_page=1000`;
      
      const cached = await this.getCachedData<WorldBankResponse>(endpoint);
      let data: WorldBankResponse;
      
      if (cached) {
        data = cached;
      } else {
        data = await this.fetchWithRetry<WorldBankResponse>(endpoint);
        await this.cacheData(endpoint, data, 24);
      }

      if (data[1]) {
        // Group by country and get most recent non-null value
        const countryData = new Map<string, WorldBankDataPoint[]>();
        
        for (const point of data[1]) {
          const code = point.countryiso3code || point.country.id;
          if (!countryData.has(code)) {
            countryData.set(code, []);
          }
          countryData.get(code)!.push(point);
        }

        for (const [code, points] of countryData) {
          // Sort by date descending and get first non-null value
          const sorted = points.sort((a, b) => parseInt(b.date) - parseInt(a.date));
          const validPoint = sorted.find(p => p.value !== null);
          results.set(code, validPoint?.value ?? null);
        }
      }
    } catch (err) {
      logger.error(`Failed to fetch World Bank indicator ${indicator}`, err);
    }

    return results;
  }

  private async fetchGdpHistory(
    countryCode: string,
    years: number = 10
  ): Promise<Array<{ year: number; value: number }>> {
    const history: Array<{ year: number; value: number }> = [];
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - years;

    try {
      const endpoint = `/country/${countryCode}/indicator/${worldBankIndicators.gdpPerCapita}?format=json&date=${startYear}:${currentYear}&per_page=50`;
      const data = await this.fetchWithRetry<WorldBankResponse>(endpoint);

      if (data[1]) {
        for (const point of data[1]) {
          if (point.value !== null) {
            history.push({
              year: parseInt(point.date),
              value: point.value,
            });
          }
        }
        history.sort((a, b) => a.year - b.year);
      }
    } catch (err) {
      logger.error(`Failed to fetch GDP history for ${countryCode}`, err);
    }

    return history;
  }

  async sync(countryCodes?: string[]): Promise<ProviderResult<CountryDataUpdate[]>> {
    const startTime = Date.now();
    await this.logSync('started');
    
    const codes = countryCodes || [
      'USA', 'DEU', 'GBR', 'FRA', 'JPN', 'CHN', 'IND', 'BRA', 'RUS', 'AUS'
    ];

    const updates: CountryDataUpdate[] = [];

    try {
      logger.info(`World Bank sync starting for ${codes.length} countries`);

      // Fetch all indicators in parallel
      const [
        gdpData,
        gdpPerCapitaData,
        gdpGrowthData,
        populationData,
        popGrowthData,
        lifeExpData,
        birthRateData,
        deathRateData,
        fertilityData,
        infantMortData,
        urbanPopData,
        literacyData,
        unemploymentData,
        inflationData,
        giniData,
        healthExpData,
        eduExpData,
      ] = await Promise.all([
        this.fetchIndicator(worldBankIndicators.gdp, codes),
        this.fetchIndicator(worldBankIndicators.gdpPerCapita, codes),
        this.fetchIndicator(worldBankIndicators.gdpGrowth, codes),
        this.fetchIndicator(worldBankIndicators.population, codes),
        this.fetchIndicator(worldBankIndicators.populationGrowth, codes),
        this.fetchIndicator(worldBankIndicators.lifeExpectancy, codes),
        this.fetchIndicator(worldBankIndicators.birthRate, codes),
        this.fetchIndicator(worldBankIndicators.deathRate, codes),
        this.fetchIndicator(worldBankIndicators.fertilityRate, codes),
        this.fetchIndicator(worldBankIndicators.infantMortality, codes),
        this.fetchIndicator(worldBankIndicators.urbanPopulation, codes),
        this.fetchIndicator(worldBankIndicators.literacyRate, codes),
        this.fetchIndicator(worldBankIndicators.unemployment, codes),
        this.fetchIndicator(worldBankIndicators.inflation, codes),
        this.fetchIndicator(worldBankIndicators.giniIndex, codes),
        this.fetchIndicator(worldBankIndicators.healthExpenditure, codes),
        this.fetchIndicator(worldBankIndicators.educationExpenditure, codes),
      ]);

      // Process each country
      for (const code of codes) {
        const gdpHistory = await this.fetchGdpHistory(code, 10);

        const update: CountryDataUpdate = {
          countryCode: code,
          demographics: {
            totalPopulation: parseNumeric(populationData.get(code)) ?? undefined,
            populationGrowthRate: parseNumeric(popGrowthData.get(code)) ?? undefined,
            lifeExpectancy: parseNumeric(lifeExpData.get(code)) ?? undefined,
            birthRate: parseNumeric(birthRateData.get(code)) ?? undefined,
            deathRate: parseNumeric(deathRateData.get(code)) ?? undefined,
            fertilityRate: parseNumeric(fertilityData.get(code)) ?? undefined,
            infantMortalityRate: parseNumeric(infantMortData.get(code)) ?? undefined,
            urbanPopulationPercent: parseNumeric(urbanPopData.get(code)) ?? undefined,
          },
          economy: {
            gdp: parseNumeric(gdpData.get(code)) ?? undefined,
            gdpPerCapita: parseNumeric(gdpPerCapitaData.get(code)) ?? undefined,
            gdpGrowthRate: parseNumeric(gdpGrowthData.get(code)) ?? undefined,
            gdpGrowthHistory: gdpHistory,
            inflation: parseNumeric(inflationData.get(code)) ?? undefined,
            unemploymentRate: parseNumeric(unemploymentData.get(code)) ?? undefined,
            giniIndex: parseNumeric(giniData.get(code)) ?? undefined,
          },
          education: {
            literacyRate: parseNumeric(literacyData.get(code)) ?? undefined,
            educationSpendingPercent: parseNumeric(eduExpData.get(code)) ?? undefined,
          },
          health: {
            healthcareSpendingPercent: parseNumeric(healthExpData.get(code)) ?? undefined,
          },
        };

        updates.push(update);
      }

      const duration = Date.now() - startTime;
      await this.logSync('success', updates.length, undefined, duration);

      logger.info(`World Bank sync completed: ${updates.length} countries updated in ${duration}ms`);

      return {
        success: true,
        data: updates,
        provider: this.name,
        timestamp: new Date(),
      };
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      await this.logSync('failed', 0, errorMessage, duration);

      logger.error('World Bank sync failed', err);

      return {
        success: false,
        error: errorMessage,
        provider: this.name,
        timestamp: new Date(),
      };
    }
  }
}

export const worldBankProvider = new WorldBankProvider();
export default worldBankProvider;
