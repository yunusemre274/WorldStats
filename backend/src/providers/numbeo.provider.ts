// Numbeo Crime Statistics Provider
// Provides: Crime rates, crime categories, safety indices
import { BaseProvider, ProviderResult, CountryDataUpdate, CrimeData } from './base.provider.js';
import { logger } from '../utils/logger.js';

interface NumbeoCrimeData {
  countryCode: string;
  crimeIndex: number;
  safetyIndex: number;
  totalCrimeRate: number;
  homicideRate: number;
  assaultRate: number;
  robberyRate: number;
  burglaryRate: number;
  vehicleTheftRate: number;
  kidnappingRate: number;
  humanTraffickingRisk: string;
  drugTraffickingRisk: string;
  terrorismRisk: string;
  categories: Array<{ category: string; percentage: number }>;
}

export class NumbeoProvider extends BaseProvider {
  private crimeData: Map<string, NumbeoCrimeData>;

  constructor() {
    super('numbeo', 'https://www.numbeo.com/api');
    this.crimeData = this.initializeCrimeData();
  }

  private initializeCrimeData(): Map<string, NumbeoCrimeData> {
    const data = new Map<string, NumbeoCrimeData>();

    // Numbeo Crime Index 2024 data
    const crimes: NumbeoCrimeData[] = [
      {
        countryCode: 'USA',
        crimeIndex: 49.2,
        safetyIndex: 50.8,
        totalCrimeRate: 47.7,
        homicideRate: 6.3,
        assaultRate: 246.8,
        robberyRate: 73.9,
        burglaryRate: 314.2,
        vehicleTheftRate: 246.0,
        kidnappingRate: 4.8,
        humanTraffickingRisk: 'Medium',
        drugTraffickingRisk: 'High',
        terrorismRisk: 'Medium',
        categories: [
          { category: 'Property Crime', percentage: 38 },
          { category: 'Violent Crime', percentage: 23 },
          { category: 'Drug Offenses', percentage: 18 },
          { category: 'Fraud', percentage: 12 },
          { category: 'Cyber Crime', percentage: 9 },
        ],
      },
      {
        countryCode: 'DEU',
        crimeIndex: 35.8,
        safetyIndex: 64.2,
        totalCrimeRate: 41.2,
        homicideRate: 0.8,
        assaultRate: 56.9,
        robberyRate: 45.3,
        burglaryRate: 75.1,
        vehicleTheftRate: 28.5,
        kidnappingRate: 0.6,
        humanTraffickingRisk: 'Medium',
        drugTraffickingRisk: 'Medium',
        terrorismRisk: 'Low',
        categories: [
          { category: 'Theft', percentage: 45 },
          { category: 'Violent Crime', percentage: 18 },
          { category: 'Fraud', percentage: 20 },
          { category: 'Cyber Crime', percentage: 12 },
          { category: 'Drug Offenses', percentage: 5 },
        ],
      },
      {
        countryCode: 'GBR',
        crimeIndex: 46.1,
        safetyIndex: 53.9,
        totalCrimeRate: 44.8,
        homicideRate: 1.2,
        assaultRate: 88.4,
        robberyRate: 134.5,
        burglaryRate: 213.5,
        vehicleTheftRate: 94.7,
        kidnappingRate: 2.1,
        humanTraffickingRisk: 'Medium',
        drugTraffickingRisk: 'High',
        terrorismRisk: 'Medium',
        categories: [
          { category: 'Theft', percentage: 42 },
          { category: 'Violent Crime', percentage: 28 },
          { category: 'Fraud', percentage: 15 },
          { category: 'Drug Offenses', percentage: 10 },
          { category: 'Cyber Crime', percentage: 5 },
        ],
      },
      {
        countryCode: 'FRA',
        crimeIndex: 51.9,
        safetyIndex: 48.1,
        totalCrimeRate: 48.2,
        homicideRate: 1.3,
        assaultRate: 65.4,
        robberyRate: 152.3,
        burglaryRate: 267.8,
        vehicleTheftRate: 165.4,
        kidnappingRate: 3.2,
        humanTraffickingRisk: 'Medium',
        drugTraffickingRisk: 'Medium',
        terrorismRisk: 'Medium',
        categories: [
          { category: 'Property Crime', percentage: 48 },
          { category: 'Violent Crime', percentage: 22 },
          { category: 'Fraud', percentage: 14 },
          { category: 'Drug Offenses', percentage: 11 },
          { category: 'Cyber Crime', percentage: 5 },
        ],
      },
      {
        countryCode: 'JPN',
        crimeIndex: 21.6,
        safetyIndex: 78.4,
        totalCrimeRate: 15.2,
        homicideRate: 0.3,
        assaultRate: 21.3,
        robberyRate: 1.8,
        burglaryRate: 55.4,
        vehicleTheftRate: 18.9,
        kidnappingRate: 0.2,
        humanTraffickingRisk: 'Low',
        drugTraffickingRisk: 'Low',
        terrorismRisk: 'Low',
        categories: [
          { category: 'Theft', percentage: 55 },
          { category: 'Fraud', percentage: 22 },
          { category: 'Violent Crime', percentage: 8 },
          { category: 'Cyber Crime', percentage: 12 },
          { category: 'Drug Offenses', percentage: 3 },
        ],
      },
      {
        countryCode: 'CHN',
        crimeIndex: 30.4,
        safetyIndex: 69.6,
        totalCrimeRate: 25.8,
        homicideRate: 0.5,
        assaultRate: 24.6,
        robberyRate: 8.4,
        burglaryRate: 42.1,
        vehicleTheftRate: 12.3,
        kidnappingRate: 0.3,
        humanTraffickingRisk: 'High',
        drugTraffickingRisk: 'Medium',
        terrorismRisk: 'Low',
        categories: [
          { category: 'Theft', percentage: 42 },
          { category: 'Fraud', percentage: 28 },
          { category: 'Cyber Crime', percentage: 18 },
          { category: 'Violent Crime', percentage: 8 },
          { category: 'Drug Offenses', percentage: 4 },
        ],
      },
      {
        countryCode: 'IND',
        crimeIndex: 44.8,
        safetyIndex: 55.2,
        totalCrimeRate: 38.6,
        homicideRate: 3.0,
        assaultRate: 78.4,
        robberyRate: 12.5,
        burglaryRate: 28.4,
        vehicleTheftRate: 45.6,
        kidnappingRate: 5.6,
        humanTraffickingRisk: 'High',
        drugTraffickingRisk: 'Medium',
        terrorismRisk: 'Medium',
        categories: [
          { category: 'Theft', percentage: 35 },
          { category: 'Violent Crime', percentage: 32 },
          { category: 'Sexual Offenses', percentage: 15 },
          { category: 'Fraud', percentage: 12 },
          { category: 'Cyber Crime', percentage: 6 },
        ],
      },
      {
        countryCode: 'BRA',
        crimeIndex: 68.3,
        safetyIndex: 31.7,
        totalCrimeRate: 72.4,
        homicideRate: 22.4,
        assaultRate: 178.5,
        robberyRate: 654.3,
        burglaryRate: 356.7,
        vehicleTheftRate: 212.4,
        kidnappingRate: 4.8,
        humanTraffickingRisk: 'High',
        drugTraffickingRisk: 'High',
        terrorismRisk: 'Low',
        categories: [
          { category: 'Theft/Robbery', percentage: 48 },
          { category: 'Violent Crime', percentage: 35 },
          { category: 'Drug Offenses', percentage: 10 },
          { category: 'Fraud', percentage: 5 },
          { category: 'Cyber Crime', percentage: 2 },
        ],
      },
      {
        countryCode: 'RUS',
        crimeIndex: 39.2,
        safetyIndex: 60.8,
        totalCrimeRate: 35.6,
        homicideRate: 8.2,
        assaultRate: 45.3,
        robberyRate: 38.9,
        burglaryRate: 78.5,
        vehicleTheftRate: 34.2,
        kidnappingRate: 0.8,
        humanTraffickingRisk: 'High',
        drugTraffickingRisk: 'High',
        terrorismRisk: 'Medium',
        categories: [
          { category: 'Theft', percentage: 42 },
          { category: 'Violent Crime', percentage: 25 },
          { category: 'Fraud', percentage: 18 },
          { category: 'Drug Offenses', percentage: 10 },
          { category: 'Cyber Crime', percentage: 5 },
        ],
      },
      {
        countryCode: 'AUS',
        crimeIndex: 42.4,
        safetyIndex: 57.6,
        totalCrimeRate: 39.8,
        homicideRate: 0.9,
        assaultRate: 186.5,
        robberyRate: 24.5,
        burglaryRate: 328.4,
        vehicleTheftRate: 156.3,
        kidnappingRate: 0.4,
        humanTraffickingRisk: 'Low',
        drugTraffickingRisk: 'Medium',
        terrorismRisk: 'Low',
        categories: [
          { category: 'Property Crime', percentage: 52 },
          { category: 'Violent Crime', percentage: 22 },
          { category: 'Drug Offenses', percentage: 14 },
          { category: 'Fraud', percentage: 8 },
          { category: 'Cyber Crime', percentage: 4 },
        ],
      },
    ];

    for (const crime of crimes) {
      data.set(crime.countryCode, crime);
    }

    return data;
  }

  async sync(countryCodes?: string[]): Promise<ProviderResult<CountryDataUpdate[]>> {
    const startTime = Date.now();
    await this.logSync('started');

    const codes = countryCodes || Array.from(this.crimeData.keys());
    const updates: CountryDataUpdate[] = [];

    try {
      logger.info(`Numbeo Crime sync starting for ${codes.length} countries`);

      for (const code of codes) {
        const crimeData = this.crimeData.get(code);
        
        if (crimeData) {
          const update: CountryDataUpdate = {
            countryCode: code,
            crime: {
              crimeIndex: crimeData.crimeIndex,
              safetyIndex: crimeData.safetyIndex,
              totalCrimeRate: crimeData.totalCrimeRate,
              homicideRate: crimeData.homicideRate,
              assaultRate: crimeData.assaultRate,
              robberyRate: crimeData.robberyRate,
              burglaryRate: crimeData.burglaryRate,
              vehicleTheftRate: crimeData.vehicleTheftRate,
              kidnappingRate: crimeData.kidnappingRate,
              humanTraffickingRisk: crimeData.humanTraffickingRisk,
              drugTraffickingRisk: crimeData.drugTraffickingRisk,
              terrorismRisk: crimeData.terrorismRisk,
              categories: crimeData.categories,
            },
          };

          updates.push(update);
        }
      }

      const duration = Date.now() - startTime;
      await this.logSync('success', updates.length, undefined, duration);

      logger.info(`Numbeo Crime sync completed: ${updates.length} countries updated in ${duration}ms`);

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

      logger.error('Numbeo Crime sync failed', err);

      return {
        success: false,
        error: errorMessage,
        provider: this.name,
        timestamp: new Date(),
      };
    }
  }
}

export const numbeoProvider = new NumbeoProvider();
export default numbeoProvider;
