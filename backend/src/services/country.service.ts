// Country Service - Business logic for country operations
import prisma from '../db/client.js';
import redis from '../utils/redis.js';
import { config } from '../utils/config.js';
import { NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import Fuse from 'fuse.js';

export interface CountryListItem {
  id: string;
  code: string;
  code3: string | null;
  name: string;
  officialName: string | null;
  region: string | null;
  capital: string | null;
  flagUrl: string | null;
  population: number | null;
}

export interface CountryFullData {
  country: string;
  code: string;
  code3: string | null;
  officialName: string | null;
  region: string | null;
  subregion: string | null;
  capital: string | null;
  flagUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  categories: {
    demographics: DemographicsCategory;
    economy: EconomyCategory;
    military: MilitaryCategory;
    political: PoliticalCategory;
    crime: CrimeCategory;
    health: HealthCategory;
    education: EducationCategory;
  };
}

export interface DemographicsCategory {
  totalPopulation: number | null;
  malePopulation: number | null;
  femalePopulation: number | null;
  maleFemaleRatio: string | null;
  medianAge: number | null;
  lifeExpectancy: number | null;
  lifeExpectancyMale: number | null;
  lifeExpectancyFemale: number | null;
  birthRate: number | null;
  deathRate: number | null;
  fertilityRate: number | null;
  infantMortalityRate: number | null;
  urbanPopulationPercent: number | null;
  childPopulationPercent: number | null;
  workingAgePercent: number | null;
  elderlyPercent: number | null;
  averageIQ: number | null;
  populationGrowthRate: number | null;
}

export interface EconomyCategory {
  gdp: number | null;
  gdpPerCapita: number | null;
  gdpGrowthRate: number | null;
  gdpPpp: number | null;
  inflation: number | null;
  unemploymentRate: number | null;
  povertyRate: number | null;
  giniIndex: number | null;
  publicDebt: number | null;
  tradeBalance: number | null;
  exports: number | null;
  imports: number | null;
  minimumWage: number | null;
  averageIncome: number | null;
  currency: string | null;
  currencyCode: string | null;
  smokingRate: number | null;
  alcoholDependencyRate: number | null;
  drugUseRate: number | null;
}

export interface MilitaryCategory {
  globalRank: number | null;
  activeSoldiers: number | null;
  reservePersonnel: number | null;
  totalMilitaryPersonnel: number | null;
  defenseSpending: number | null;
  defenseSpendingPercent: number | null;
  tanks: number | null;
  totalAircraft: number | null;
  navalVessels: number | null;
  nuclearWeapons: boolean;
  isNatoMember: boolean;
}

export interface PoliticalCategory {
  governmentType: string | null;
  chiefOfState: string | null;
  headOfGovernment: string | null;
  isEU: boolean;
  isUN: boolean;
  isNato: boolean;
  isG7: boolean;
  isG20: boolean;
  isBrics: boolean;
  passportRanking: number | null;
  passportVisaFree: number | null;
  democracyIndex: number | null;
  corruptionIndex: number | null;
  humanDevelopmentIndex: number | null;
}

export interface CrimeCategory {
  crimeIndex: number | null;
  safetyIndex: number | null;
  totalCrimeRate: number | null;
  homicideRate: number | null;
  crimeCategories: Array<{ category: string; percentage: number }>;
}

export interface HealthCategory {
  smokingRate: number | null;
  alcoholConsumption: number | null;
  alcoholDependencyRate: number | null;
  drugUseRate: number | null;
  obesityRate: number | null;
  healthcareSpendingPercent: number | null;
  hospitalBedsPer1000: number | null;
  physiciansPer1000: number | null;
  suicideRate: number | null;
  diabetesPrevalence: number | null;
}

export interface EducationCategory {
  literacyRate: number | null;
  literacyRateMale: number | null;
  literacyRateFemale: number | null;
  educationSpendingPercent: number | null;
  primaryEnrollmentRate: number | null;
  secondaryEnrollmentRate: number | null;
  tertiaryEnrollmentRate: number | null;
  averageSchoolingYears: number | null;
}

class CountryService {
  private fuseInstance: Fuse<CountryListItem> | null = null;

  // Get all countries (with caching)
  async getAll(): Promise<CountryListItem[]> {
    const cacheKey = 'countries:all';
    
    // Try cache first
    const cached = await redis.get<CountryListItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const countries = await prisma.country.findMany({
      select: {
        id: true,
        code: true,
        code3: true,
        name: true,
        officialName: true,
        region: true,
        capital: true,
        flagUrl: true,
        population: true,
      },
      orderBy: { name: 'asc' },
    });

    const result = countries.map(c => ({
      ...c,
      population: c.population ? Number(c.population) : null,
    }));

    await redis.set(cacheKey, result, config.cache.countryTtl);
    return result;
  }

  // Search countries with fuzzy matching
  async search(query: string): Promise<CountryListItem[]> {
    const countries = await this.getAll();

    if (!this.fuseInstance || this.fuseInstance.getIndex().size() !== countries.length) {
      this.fuseInstance = new Fuse(countries, {
        keys: ['name', 'officialName', 'code', 'code3', 'capital'],
        threshold: 0.4,
        distance: 100,
        includeScore: true,
      });
    }

    const results = this.fuseInstance.search(query);
    return results.slice(0, 10).map(r => r.item);
  }

  // Get single country with all data
  async getOne(code: string): Promise<CountryFullData> {
    const normalizedCode = code.toUpperCase();
    const cacheKey = `country:${normalizedCode}`;

    // Try cache first
    const cached = await redis.get<CountryFullData>(cacheKey);
    if (cached) {
      return cached;
    }

    const country = await prisma.country.findFirst({
      where: {
        OR: [
          { code: normalizedCode },
          { code3: normalizedCode },
        ],
      },
      include: {
        demographics: true,
        economy: true,
        military: true,
        politics: true,
        crime: {
          include: {
            categories: true,
          },
        },
        healthStats: true,
        education: true,
      },
    });

    if (!country) {
      throw new NotFoundError(`Country with code ${code}`);
    }

    const result: CountryFullData = {
      country: country.name,
      code: country.code,
      code3: country.code3,
      officialName: country.officialName,
      region: country.region,
      subregion: country.subregion,
      capital: country.capital,
      flagUrl: country.flagUrl,
      latitude: country.latitude,
      longitude: country.longitude,
      categories: {
        demographics: {
          totalPopulation: country.demographics?.totalPopulation ? Number(country.demographics.totalPopulation) : null,
          malePopulation: country.demographics?.malePopulation ? Number(country.demographics.malePopulation) : null,
          femalePopulation: country.demographics?.femalePopulation ? Number(country.demographics.femalePopulation) : null,
          maleFemaleRatio: country.demographics?.maleFemaleRatio ?? null,
          medianAge: country.demographics?.medianAge ?? null,
          lifeExpectancy: country.demographics?.lifeExpectancy ?? null,
          lifeExpectancyMale: country.demographics?.lifeExpectancyMale ?? null,
          lifeExpectancyFemale: country.demographics?.lifeExpectancyFemale ?? null,
          birthRate: country.demographics?.birthRate ?? null,
          deathRate: country.demographics?.deathRate ?? null,
          fertilityRate: country.demographics?.fertilityRate ?? null,
          infantMortalityRate: country.demographics?.infantMortalityRate ?? null,
          urbanPopulationPercent: country.demographics?.urbanPopulationPercent ?? null,
          childPopulationPercent: country.demographics?.childPopulationPercent ?? null,
          workingAgePercent: country.demographics?.workingAgePercent ?? null,
          elderlyPercent: country.demographics?.elderlyPercent ?? null,
          averageIQ: country.demographics?.averageIQ ?? null,
          populationGrowthRate: country.demographics?.populationGrowthRate ?? null,
        },
        economy: {
          gdp: country.economy?.gdp ?? null,
          gdpPerCapita: country.economy?.gdpPerCapita ?? null,
          gdpGrowthRate: country.economy?.gdpGrowthRate ?? null,
          gdpPpp: country.economy?.gdpPpp ?? null,
          inflation: country.economy?.inflation ?? null,
          unemploymentRate: country.economy?.unemploymentRate ?? null,
          povertyRate: country.economy?.povertyRate ?? null,
          giniIndex: country.economy?.giniIndex ?? null,
          publicDebt: country.economy?.publicDebt ?? null,
          tradeBalance: country.economy?.tradeBalance ?? null,
          exports: country.economy?.exports ?? null,
          imports: country.economy?.imports ?? null,
          minimumWage: country.economy?.minimumWage ?? null,
          averageIncome: country.economy?.averageIncome ?? null,
          currency: country.economy?.currency ?? null,
          currencyCode: country.economy?.currencyCode ?? null,
          smokingRate: country.healthStats?.smokingRate ?? null,
          alcoholDependencyRate: country.healthStats?.alcoholDependencyRate ?? null,
          drugUseRate: country.healthStats?.drugUseRate ?? null,
        },
        military: {
          globalRank: country.military?.globalRank ?? null,
          activeSoldiers: country.military?.activeSoldiers ?? null,
          reservePersonnel: country.military?.reservePersonnel ?? null,
          totalMilitaryPersonnel: country.military?.totalMilitaryPersonnel ?? null,
          defenseSpending: country.military?.defenseSpending ?? null,
          defenseSpendingPercent: country.military?.defenseSpendingPercent ?? null,
          tanks: country.military?.tanks ?? null,
          totalAircraft: country.military?.totalAircraft ?? null,
          navalVessels: country.military?.navalVessels ?? null,
          nuclearWeapons: country.military?.nuclearWeapons ?? false,
          isNatoMember: country.military?.isNatoMember ?? false,
        },
        political: {
          governmentType: country.politics?.governmentType ?? null,
          chiefOfState: country.politics?.chiefOfState ?? null,
          headOfGovernment: country.politics?.headOfGovernment ?? null,
          isEU: country.politics?.isEU ?? false,
          isUN: country.politics?.isUN ?? true,
          isNato: country.politics?.isNato ?? false,
          isG7: country.politics?.isG7 ?? false,
          isG20: country.politics?.isG20 ?? false,
          isBrics: country.politics?.isBrics ?? false,
          passportRanking: country.politics?.passportRanking ?? null,
          passportVisaFree: country.politics?.passportVisaFree ?? null,
          democracyIndex: country.politics?.democracyIndex ?? null,
          corruptionIndex: country.politics?.corruptionIndex ?? null,
          humanDevelopmentIndex: country.politics?.humanDevelopmentIndex ?? null,
        },
        crime: {
          crimeIndex: country.crime?.crimeIndex ?? null,
          safetyIndex: country.crime?.safetyIndex ?? null,
          totalCrimeRate: country.crime?.totalCrimeRate ?? null,
          homicideRate: country.crime?.homicideRate ?? null,
          crimeCategories: country.crime?.categories.map(c => ({
            category: c.category,
            percentage: c.percentage,
          })) ?? [],
        },
        health: {
          smokingRate: country.healthStats?.smokingRate ?? null,
          alcoholConsumption: country.healthStats?.alcoholConsumption ?? null,
          alcoholDependencyRate: country.healthStats?.alcoholDependencyRate ?? null,
          drugUseRate: country.healthStats?.drugUseRate ?? null,
          obesityRate: country.healthStats?.obesityRate ?? null,
          healthcareSpendingPercent: country.healthStats?.healthcareSpendingPercent ?? null,
          hospitalBedsPer1000: country.healthStats?.hospitalBedsPer1000 ?? null,
          physiciansPer1000: country.healthStats?.physiciansPer1000 ?? null,
          suicideRate: country.healthStats?.suicideRate ?? null,
          diabetesPrevalence: country.healthStats?.diabetesPrevalence ?? null,
        },
        education: {
          literacyRate: country.education?.literacyRate ?? null,
          literacyRateMale: country.education?.literacyRateMale ?? null,
          literacyRateFemale: country.education?.literacyRateFemale ?? null,
          educationSpendingPercent: country.education?.educationSpendingPercent ?? null,
          primaryEnrollmentRate: country.education?.primaryEnrollmentRate ?? null,
          secondaryEnrollmentRate: country.education?.secondaryEnrollmentRate ?? null,
          tertiaryEnrollmentRate: country.education?.tertiaryEnrollmentRate ?? null,
          averageSchoolingYears: country.education?.averageSchoolingYears ?? null,
        },
      },
    };

    await redis.set(cacheKey, result, config.cache.countryTtl);
    return result;
  }

  // Get country by ID
  async getById(id: string): Promise<CountryFullData> {
    const country = await prisma.country.findUnique({
      where: { id },
      select: { code: true },
    });

    if (!country) {
      throw new NotFoundError('Country');
    }

    return this.getOne(country.code);
  }

  // Invalidate cache for a country
  async invalidateCache(code?: string): Promise<void> {
    await redis.invalidateCountryCache(code);
    this.fuseInstance = null;
  }
}

export const countryService = new CountryService();
export default countryService;
