// Henley Passport Index Provider
// Provides: Passport power ranking, visa-free access
import { BaseProvider, ProviderResult, CountryDataUpdate } from './base.provider.js';
import { logger } from '../utils/logger.js';

interface PassportData {
  countryCode: string;
  passportRanking: number;
  visaFreeDestinations: number;
  visaOnArrival: number;
  visaRequired: number;
}

export class HenleyProvider extends BaseProvider {
  private passportData: Map<string, PassportData>;

  constructor() {
    super('henley', 'https://www.henleyglobal.com');
    this.passportData = this.initializePassportData();
  }

  private initializePassportData(): Map<string, PassportData> {
    const data = new Map<string, PassportData>();

    // Henley Passport Index 2024 Q4 data
    const passports: PassportData[] = [
      {
        countryCode: 'USA',
        passportRanking: 8,
        visaFreeDestinations: 186,
        visaOnArrival: 42,
        visaRequired: 41,
      },
      {
        countryCode: 'DEU',
        passportRanking: 2,
        visaFreeDestinations: 192,
        visaOnArrival: 34,
        visaRequired: 43,
      },
      {
        countryCode: 'GBR',
        passportRanking: 4,
        visaFreeDestinations: 190,
        visaOnArrival: 37,
        visaRequired: 42,
      },
      {
        countryCode: 'FRA',
        passportRanking: 2,
        visaFreeDestinations: 192,
        visaOnArrival: 34,
        visaRequired: 43,
      },
      {
        countryCode: 'JPN',
        passportRanking: 1,
        visaFreeDestinations: 194,
        visaOnArrival: 32,
        visaRequired: 43,
      },
      {
        countryCode: 'CHN',
        passportRanking: 62,
        visaFreeDestinations: 85,
        visaOnArrival: 48,
        visaRequired: 136,
      },
      {
        countryCode: 'IND',
        passportRanking: 85,
        visaFreeDestinations: 58,
        visaOnArrival: 40,
        visaRequired: 171,
      },
      {
        countryCode: 'BRA',
        passportRanking: 19,
        visaFreeDestinations: 170,
        visaOnArrival: 45,
        visaRequired: 54,
      },
      {
        countryCode: 'RUS',
        passportRanking: 52,
        visaFreeDestinations: 118,
        visaOnArrival: 45,
        visaRequired: 106,
      },
      {
        countryCode: 'AUS',
        passportRanking: 6,
        visaFreeDestinations: 187,
        visaOnArrival: 41,
        visaRequired: 41,
      },
    ];

    for (const passport of passports) {
      data.set(passport.countryCode, passport);
    }

    return data;
  }

  async sync(countryCodes?: string[]): Promise<ProviderResult<CountryDataUpdate[]>> {
    const startTime = Date.now();
    await this.logSync('started');

    const codes = countryCodes || Array.from(this.passportData.keys());
    const updates: CountryDataUpdate[] = [];

    try {
      logger.info(`Henley Passport Index sync starting for ${codes.length} countries`);

      for (const code of codes) {
        const passData = this.passportData.get(code);
        
        if (passData) {
          const update: CountryDataUpdate = {
            countryCode: code,
            politics: {
              passportRanking: passData.passportRanking,
              passportVisaFree: passData.visaFreeDestinations,
            },
          };

          updates.push(update);
        }
      }

      const duration = Date.now() - startTime;
      await this.logSync('success', updates.length, undefined, duration);

      logger.info(`Henley Passport Index sync completed: ${updates.length} countries updated in ${duration}ms`);

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

      logger.error('Henley Passport Index sync failed', err);

      return {
        success: false,
        error: errorMessage,
        provider: this.name,
        timestamp: new Date(),
      };
    }
  }
}

export const henleyProvider = new HenleyProvider();
export default henleyProvider;
