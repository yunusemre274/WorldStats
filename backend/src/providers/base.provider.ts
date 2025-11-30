// Base Provider Interface and Abstract Class
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { logger } from '../utils/logger.js';
import { retryWithBackoff, sleep } from '../utils/helpers.js';
import { ExternalApiError } from '../utils/errors.js';
import prisma from '../db/client.js';

export interface ProviderResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  provider: string;
  timestamp: Date;
}

export interface CountryDataUpdate {
  countryCode: string;
  demographics?: Partial<DemographicsData>;
  economy?: Partial<EconomyData>;
  military?: Partial<MilitaryData>;
  politics?: Partial<PoliticsData>;
  crime?: Partial<CrimeData>;
  health?: Partial<HealthData>;
  education?: Partial<EducationData>;
}

export interface DemographicsData {
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  maleFemaleRatio: string;
  populationGrowthRate: number;
  medianAge: number;
  lifeExpectancy: number;
  lifeExpectancyMale: number;
  lifeExpectancyFemale: number;
  birthRate: number;
  deathRate: number;
  fertilityRate: number;
  infantMortalityRate: number;
  urbanPopulationPercent: number;
  childPopulationPercent: number;
  workingAgePercent: number;
  elderlyPercent: number;
  averageIQ: number;
}

export interface EconomyData {
  gdp: number;
  gdpPerCapita: number;
  gdpGrowthRate: number;
  gdpPpp: number;
  gdpGrowthHistory: Array<{ year: number; value: number }>;
  inflation: number;
  unemploymentRate: number;
  povertyRate: number;
  giniIndex: number;
  publicDebt: number;
  externalDebt: number;
  tradeBalance: number;
  exports: number;
  imports: number;
  foreignReserves: number;
  minimumWage: number;
  averageIncome: number;
  currency: string;
  currencyCode: string;
}

export interface MilitaryData {
  globalRank: number;
  totalMilitaryPersonnel: number;
  activeSoldiers: number;
  reservePersonnel: number;
  paramilitaryForces: number;
  defenseSpending: number;
  defenseSpendingPercent: number;
  tanks: number;
  armoredVehicles: number;
  selfPropelledArtillery: number;
  towedArtillery: number;
  rocketProjectors: number;
  totalAircraft: number;
  fighters: number;
  helicopters: number;
  attackHelicopters: number;
  navalVessels: number;
  aircraftCarriers: number;
  submarines: number;
  destroyers: number;
  frigates: number;
  nuclearWeapons: boolean;
  isNatoMember: boolean;
}

export interface PoliticsData {
  governmentType: string;
  chiefOfState: string;
  headOfGovernment: string;
  politicalSystem: string;
  legislativeBranch: string;
  judicialBranch: string;
  constitution: string;
  suffrage: string;
  independenceDate: Date | null;
  nationalHoliday: string;
  isEU: boolean;
  isUN: boolean;
  isNato: boolean;
  isG7: boolean;
  isG20: boolean;
  isBrics: boolean;
  passportRanking: number;
  passportVisaFree: number;
  democracyIndex: number;
  corruptionIndex: number;
  presssFreedomIndex: number;
  humanDevelopmentIndex: number;
}

export interface CrimeData {
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
  categories: Array<{ category: string; percentage: number; count?: number }>;
}

export interface HealthData {
  healthcareSpendingPercent: number;
  healthcareSpendingPerCapita: number;
  hospitalBedsPer1000: number;
  physiciansPer1000: number;
  nursesPer1000: number;
  obesityRate: number;
  smokingRate: number;
  alcoholConsumption: number;
  alcoholDependencyRate: number;
  drugUseRate: number;
  cannabisUseRate: number;
  opioidUseRate: number;
  cocaineUseRate: number;
  hivPrevalence: number;
  tuberculosisIncidence: number;
  malariaIncidence: number;
  diabetesPrevalence: number;
  mentalHealthDisorders: number;
  suicideRate: number;
}

export interface EducationData {
  literacyRate: number;
  literacyRateMale: number;
  literacyRateFemale: number;
  educationSpendingPercent: number;
  primaryEnrollmentRate: number;
  secondaryEnrollmentRate: number;
  tertiaryEnrollmentRate: number;
  averageSchoolingYears: number;
  studentTeacherRatio: number;
  piloStudentsReading: number;
  piloStudentsMath: number;
  piloStudentsScience: number;
  universitiesInTop500: number;
}

export abstract class BaseProvider {
  protected name: string;
  protected baseUrl: string;
  protected client: AxiosInstance;
  protected rateLimitDelay: number = 100; // ms between requests

  constructor(name: string, baseUrl: string, config?: AxiosRequestConfig) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WorldStats-Backend/1.0',
      },
      ...config,
    });
  }

  protected async fetchWithRetry<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return retryWithBackoff(async () => {
      await sleep(this.rateLimitDelay);
      const response = await this.client.get<T>(endpoint, config);
      return response.data;
    }, 3, 1000);
  }

  protected async logSync(
    status: 'started' | 'success' | 'failed' | 'partial',
    recordsCount?: number,
    errorMessage?: string,
    duration?: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      await prisma.syncLog.create({
        data: {
          provider: this.name,
          status,
          recordsCount,
          errorMessage,
          duration,
          completedAt: status !== 'started' ? new Date() : null,
          metadata: metadata || null,
        },
      });
    } catch (err) {
      logger.error(`Failed to log sync for ${this.name}`, err);
    }
  }

  protected async cacheData(
    endpoint: string,
    data: unknown,
    expiresInHours: number = 24
  ): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      await prisma.externalDataCache.upsert({
        where: {
          provider_endpoint: {
            provider: this.name,
            endpoint,
          },
        },
        update: {
          data: data as any,
          expiresAt,
        },
        create: {
          provider: this.name,
          endpoint,
          data: data as any,
          expiresAt,
        },
      });
    } catch (err) {
      logger.error(`Failed to cache data for ${this.name}:${endpoint}`, err);
    }
  }

  protected async getCachedData<T>(endpoint: string): Promise<T | null> {
    try {
      const cached = await prisma.externalDataCache.findUnique({
        where: {
          provider_endpoint: {
            provider: this.name,
            endpoint,
          },
        },
      });

      if (cached && new Date(cached.expiresAt) > new Date()) {
        return cached.data as T;
      }
      return null;
    } catch {
      return null;
    }
  }

  abstract sync(countryCodes?: string[]): Promise<ProviderResult<CountryDataUpdate[]>>;

  getName(): string {
    return this.name;
  }
}
