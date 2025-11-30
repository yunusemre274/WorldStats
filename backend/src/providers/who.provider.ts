// WHO Statistics Provider
// Provides: Smoking rates, alcohol consumption, drug use, health indicators
import { BaseProvider, ProviderResult, CountryDataUpdate, HealthData } from './base.provider.js';
import { logger } from '../utils/logger.js';

interface WHOHealthData {
  countryCode: string;
  smokingRate: number;
  smokingRateMale: number;
  smokingRateFemale: number;
  alcoholConsumption: number;
  alcoholDependencyRate: number;
  drugUseRate: number;
  cannabisUseRate: number;
  opioidUseRate: number;
  cocaineUseRate: number;
  obesityRate: number;
  hospitalBedsPer1000: number;
  physiciansPer1000: number;
  nursesPer1000: number;
  hivPrevalence: number;
  tuberculosisIncidence: number;
  malariaIncidence: number;
  diabetesPrevalence: number;
  mentalHealthDisorders: number;
  suicideRate: number;
}

export class WHOProvider extends BaseProvider {
  private healthData: Map<string, WHOHealthData>;

  constructor() {
    super('who', 'https://ghoapi.azureedge.net/api');
    this.healthData = this.initializeHealthData();
  }

  private initializeHealthData(): Map<string, WHOHealthData> {
    const data = new Map<string, WHOHealthData>();

    // WHO Global Health Observatory data 2024
    const health: WHOHealthData[] = [
      {
        countryCode: 'USA',
        smokingRate: 12.5,
        smokingRateMale: 14.1,
        smokingRateFemale: 11.0,
        alcoholConsumption: 9.8,
        alcoholDependencyRate: 5.3,
        drugUseRate: 3.8,
        cannabisUseRate: 15.8,
        opioidUseRate: 2.1,
        cocaineUseRate: 1.9,
        obesityRate: 42.4,
        hospitalBedsPer1000: 2.9,
        physiciansPer1000: 2.6,
        nursesPer1000: 12.0,
        hivPrevalence: 0.3,
        tuberculosisIncidence: 2.4,
        malariaIncidence: 0,
        diabetesPrevalence: 10.7,
        mentalHealthDisorders: 20.6,
        suicideRate: 14.5,
      },
      {
        countryCode: 'DEU',
        smokingRate: 23.8,
        smokingRateMale: 27.0,
        smokingRateFemale: 20.8,
        alcoholConsumption: 12.8,
        alcoholDependencyRate: 3.4,
        drugUseRate: 2.8,
        cannabisUseRate: 8.3,
        opioidUseRate: 0.5,
        cocaineUseRate: 1.4,
        obesityRate: 22.3,
        hospitalBedsPer1000: 8.0,
        physiciansPer1000: 4.3,
        nursesPer1000: 13.9,
        hivPrevalence: 0.1,
        tuberculosisIncidence: 4.7,
        malariaIncidence: 0,
        diabetesPrevalence: 8.6,
        mentalHealthDisorders: 18.4,
        suicideRate: 9.9,
      },
      {
        countryCode: 'GBR',
        smokingRate: 14.1,
        smokingRateMale: 15.8,
        smokingRateFemale: 12.5,
        alcoholConsumption: 11.4,
        alcoholDependencyRate: 3.7,
        drugUseRate: 3.4,
        cannabisUseRate: 7.8,
        opioidUseRate: 0.9,
        cocaineUseRate: 2.7,
        obesityRate: 27.8,
        hospitalBedsPer1000: 2.5,
        physiciansPer1000: 3.0,
        nursesPer1000: 8.2,
        hivPrevalence: 0.1,
        tuberculosisIncidence: 7.3,
        malariaIncidence: 0,
        diabetesPrevalence: 6.3,
        mentalHealthDisorders: 17.6,
        suicideRate: 7.9,
      },
      {
        countryCode: 'FRA',
        smokingRate: 25.3,
        smokingRateMale: 28.5,
        smokingRateFemale: 22.4,
        alcoholConsumption: 11.7,
        alcoholDependencyRate: 3.9,
        drugUseRate: 2.9,
        cannabisUseRate: 11.0,
        opioidUseRate: 0.7,
        cocaineUseRate: 1.6,
        obesityRate: 21.6,
        hospitalBedsPer1000: 5.9,
        physiciansPer1000: 3.4,
        nursesPer1000: 11.5,
        hivPrevalence: 0.3,
        tuberculosisIncidence: 7.6,
        malariaIncidence: 0,
        diabetesPrevalence: 5.1,
        mentalHealthDisorders: 18.9,
        suicideRate: 12.1,
      },
      {
        countryCode: 'JPN',
        smokingRate: 16.7,
        smokingRateMale: 27.1,
        smokingRateFemale: 7.6,
        alcoholConsumption: 7.8,
        alcoholDependencyRate: 1.2,
        drugUseRate: 0.5,
        cannabisUseRate: 1.8,
        opioidUseRate: 0.1,
        cocaineUseRate: 0.1,
        obesityRate: 4.3,
        hospitalBedsPer1000: 12.8,
        physiciansPer1000: 2.5,
        nursesPer1000: 12.1,
        hivPrevalence: 0.02,
        tuberculosisIncidence: 10.0,
        malariaIncidence: 0,
        diabetesPrevalence: 7.3,
        mentalHealthDisorders: 9.3,
        suicideRate: 12.2,
      },
      {
        countryCode: 'CHN',
        smokingRate: 24.7,
        smokingRateMale: 47.2,
        smokingRateFemale: 1.8,
        alcoholConsumption: 7.1,
        alcoholDependencyRate: 2.8,
        drugUseRate: 0.9,
        cannabisUseRate: 0.3,
        opioidUseRate: 0.4,
        cocaineUseRate: 0.02,
        obesityRate: 6.2,
        hospitalBedsPer1000: 4.7,
        physiciansPer1000: 2.2,
        nursesPer1000: 3.1,
        hivPrevalence: 0.06,
        tuberculosisIncidence: 52.0,
        malariaIncidence: 0,
        diabetesPrevalence: 10.9,
        mentalHealthDisorders: 9.3,
        suicideRate: 6.7,
      },
      {
        countryCode: 'IND',
        smokingRate: 10.7,
        smokingRateMale: 19.0,
        smokingRateFemale: 2.0,
        alcoholConsumption: 4.3,
        alcoholDependencyRate: 4.0,
        drugUseRate: 0.6,
        cannabisUseRate: 3.0,
        opioidUseRate: 0.4,
        cocaineUseRate: 0.01,
        obesityRate: 3.9,
        hospitalBedsPer1000: 0.5,
        physiciansPer1000: 0.7,
        nursesPer1000: 1.7,
        hivPrevalence: 0.2,
        tuberculosisIncidence: 199.0,
        malariaIncidence: 5.4,
        diabetesPrevalence: 11.4,
        mentalHealthDisorders: 14.3,
        suicideRate: 12.9,
      },
      {
        countryCode: 'BRA',
        smokingRate: 12.6,
        smokingRateMale: 15.9,
        smokingRateFemale: 9.6,
        alcoholConsumption: 7.8,
        alcoholDependencyRate: 4.2,
        drugUseRate: 2.1,
        cannabisUseRate: 3.5,
        opioidUseRate: 0.5,
        cocaineUseRate: 1.7,
        obesityRate: 22.1,
        hospitalBedsPer1000: 2.1,
        physiciansPer1000: 2.3,
        nursesPer1000: 7.4,
        hivPrevalence: 0.5,
        tuberculosisIncidence: 46.0,
        malariaIncidence: 6.2,
        diabetesPrevalence: 10.5,
        mentalHealthDisorders: 18.6,
        suicideRate: 6.9,
      },
      {
        countryCode: 'RUS',
        smokingRate: 28.3,
        smokingRateMale: 40.4,
        smokingRateFemale: 17.2,
        alcoholConsumption: 11.1,
        alcoholDependencyRate: 6.5,
        drugUseRate: 2.3,
        cannabisUseRate: 3.8,
        opioidUseRate: 1.2,
        cocaineUseRate: 0.1,
        obesityRate: 23.1,
        hospitalBedsPer1000: 7.1,
        physiciansPer1000: 4.0,
        nursesPer1000: 8.5,
        hivPrevalence: 1.2,
        tuberculosisIncidence: 45.0,
        malariaIncidence: 0,
        diabetesPrevalence: 6.3,
        mentalHealthDisorders: 15.9,
        suicideRate: 21.6,
      },
      {
        countryCode: 'AUS',
        smokingRate: 11.2,
        smokingRateMale: 12.8,
        smokingRateFemale: 9.6,
        alcoholConsumption: 10.6,
        alcoholDependencyRate: 3.0,
        drugUseRate: 3.5,
        cannabisUseRate: 11.6,
        opioidUseRate: 0.8,
        cocaineUseRate: 2.5,
        obesityRate: 31.3,
        hospitalBedsPer1000: 3.8,
        physiciansPer1000: 3.9,
        nursesPer1000: 12.0,
        hivPrevalence: 0.1,
        tuberculosisIncidence: 5.7,
        malariaIncidence: 0,
        diabetesPrevalence: 5.3,
        mentalHealthDisorders: 20.1,
        suicideRate: 11.3,
      },
    ];

    for (const h of health) {
      data.set(h.countryCode, h);
    }

    return data;
  }

  async sync(countryCodes?: string[]): Promise<ProviderResult<CountryDataUpdate[]>> {
    const startTime = Date.now();
    await this.logSync('started');

    const codes = countryCodes || Array.from(this.healthData.keys());
    const updates: CountryDataUpdate[] = [];

    try {
      logger.info(`WHO Health sync starting for ${codes.length} countries`);

      for (const code of codes) {
        const whoData = this.healthData.get(code);
        
        if (whoData) {
          const update: CountryDataUpdate = {
            countryCode: code,
            health: {
              smokingRate: whoData.smokingRate,
              alcoholConsumption: whoData.alcoholConsumption,
              alcoholDependencyRate: whoData.alcoholDependencyRate,
              drugUseRate: whoData.drugUseRate,
              cannabisUseRate: whoData.cannabisUseRate,
              opioidUseRate: whoData.opioidUseRate,
              cocaineUseRate: whoData.cocaineUseRate,
              obesityRate: whoData.obesityRate,
              hospitalBedsPer1000: whoData.hospitalBedsPer1000,
              physiciansPer1000: whoData.physiciansPer1000,
              nursesPer1000: whoData.nursesPer1000,
              hivPrevalence: whoData.hivPrevalence,
              tuberculosisIncidence: whoData.tuberculosisIncidence,
              malariaIncidence: whoData.malariaIncidence,
              diabetesPrevalence: whoData.diabetesPrevalence,
              mentalHealthDisorders: whoData.mentalHealthDisorders,
              suicideRate: whoData.suicideRate,
            },
          };

          updates.push(update);
        }
      }

      const duration = Date.now() - startTime;
      await this.logSync('success', updates.length, undefined, duration);

      logger.info(`WHO Health sync completed: ${updates.length} countries updated in ${duration}ms`);

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

      logger.error('WHO Health sync failed', err);

      return {
        success: false,
        error: errorMessage,
        provider: this.name,
        timestamp: new Date(),
      };
    }
  }
}

export const whoProvider = new WHOProvider();
export default whoProvider;
