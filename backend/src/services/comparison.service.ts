// Comparison Service - Compare two countries
import prisma from '../db/client.js';
import redis from '../utils/redis.js';
import { config } from '../utils/config.js';
import { NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { countryService, CountryFullData } from './country.service.js';

export interface ComparisonMetric {
  metric: string;
  country1Value: number | string | boolean | null;
  country2Value: number | string | boolean | null;
  difference?: number | null;
  percentDifference?: number | null;
  winner?: string | null;
  unit?: string;
}

export interface ComparisonResult {
  country1: {
    name: string;
    code: string;
    flagUrl: string | null;
  };
  country2: {
    name: string;
    code: string;
    flagUrl: string | null;
  };
  categories: {
    demographics: ComparisonMetric[];
    economy: ComparisonMetric[];
    military: ComparisonMetric[];
    political: ComparisonMetric[];
    crime: ComparisonMetric[];
    health: ComparisonMetric[];
  };
  summary: {
    winner: string | null;
    scores: {
      country1: number;
      country2: number;
    };
    highlights: string[];
  };
  timestamp: Date;
}

class ComparisonService {
  async compare(code1: string, code2: string): Promise<ComparisonResult> {
    const c1 = code1.toUpperCase();
    const c2 = code2.toUpperCase();
    const cacheKey = `comparison:${c1}:${c2}`;

    // Try cache first
    const cached = await redis.get<ComparisonResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get both countries
    const [country1Data, country2Data] = await Promise.all([
      countryService.getOne(c1),
      countryService.getOne(c2),
    ]);

    // Get country basic info
    const [country1Info, country2Info] = await Promise.all([
      prisma.country.findFirst({ where: { OR: [{ code: c1 }, { code3: c1 }] } }),
      prisma.country.findFirst({ where: { OR: [{ code: c2 }, { code3: c2 }] } }),
    ]);

    if (!country1Info || !country2Info) {
      throw new NotFoundError('One or both countries');
    }

    const result: ComparisonResult = {
      country1: {
        name: country1Data.country,
        code: country1Data.code,
        flagUrl: country1Data.flagUrl,
      },
      country2: {
        name: country2Data.country,
        code: country2Data.code,
        flagUrl: country2Data.flagUrl,
      },
      categories: {
        demographics: this.compareDemographics(country1Data, country2Data),
        economy: this.compareEconomy(country1Data, country2Data),
        military: this.compareMilitary(country1Data, country2Data),
        political: this.comparePolitical(country1Data, country2Data),
        crime: this.compareCrime(country1Data, country2Data),
        health: this.compareHealth(country1Data, country2Data),
      },
      summary: { winner: null, scores: { country1: 0, country2: 0 }, highlights: [] },
      timestamp: new Date(),
    };

    // Calculate summary
    result.summary = this.calculateSummary(result, country1Data, country2Data);

    await redis.set(cacheKey, result, config.cache.comparisonTtl);
    return result;
  }

  private compareDemographics(c1: CountryFullData, c2: CountryFullData): ComparisonMetric[] {
    return [
      this.createMetric('Population', c1.categories.demographics.totalPopulation, c2.categories.demographics.totalPopulation, 'people', 'higher'),
      this.createMetric('Life Expectancy', c1.categories.demographics.lifeExpectancy, c2.categories.demographics.lifeExpectancy, 'years', 'higher'),
      this.createMetric('Median Age', c1.categories.demographics.medianAge, c2.categories.demographics.medianAge, 'years'),
      this.createMetric('Birth Rate', c1.categories.demographics.birthRate, c2.categories.demographics.birthRate, 'per 1000'),
      this.createMetric('Urban Population', c1.categories.demographics.urbanPopulationPercent, c2.categories.demographics.urbanPopulationPercent, '%'),
      this.createMetric('Average IQ', c1.categories.demographics.averageIQ, c2.categories.demographics.averageIQ, 'points', 'higher'),
    ];
  }

  private compareEconomy(c1: CountryFullData, c2: CountryFullData): ComparisonMetric[] {
    return [
      this.createMetric('GDP', c1.categories.economy.gdp, c2.categories.economy.gdp, 'USD', 'higher'),
      this.createMetric('GDP Per Capita', c1.categories.economy.gdpPerCapita, c2.categories.economy.gdpPerCapita, 'USD', 'higher'),
      this.createMetric('GDP Growth', c1.categories.economy.gdpGrowthRate, c2.categories.economy.gdpGrowthRate, '%', 'higher'),
      this.createMetric('Unemployment Rate', c1.categories.economy.unemploymentRate, c2.categories.economy.unemploymentRate, '%', 'lower'),
      this.createMetric('Inflation', c1.categories.economy.inflation, c2.categories.economy.inflation, '%', 'lower'),
      this.createMetric('Average Income', c1.categories.economy.averageIncome, c2.categories.economy.averageIncome, 'USD/year', 'higher'),
      this.createMetric('Public Debt', c1.categories.economy.publicDebt, c2.categories.economy.publicDebt, '% of GDP', 'lower'),
    ];
  }

  private compareMilitary(c1: CountryFullData, c2: CountryFullData): ComparisonMetric[] {
    return [
      this.createMetric('Global Rank', c1.categories.military.globalRank, c2.categories.military.globalRank, '', 'lower'),
      this.createMetric('Active Soldiers', c1.categories.military.activeSoldiers, c2.categories.military.activeSoldiers, 'personnel', 'higher'),
      this.createMetric('Defense Spending', c1.categories.military.defenseSpending, c2.categories.military.defenseSpending, 'USD', 'higher'),
      this.createMetric('Tanks', c1.categories.military.tanks, c2.categories.military.tanks, 'units', 'higher'),
      this.createMetric('Aircraft', c1.categories.military.totalAircraft, c2.categories.military.totalAircraft, 'units', 'higher'),
      this.createMetric('Naval Vessels', c1.categories.military.navalVessels, c2.categories.military.navalVessels, 'ships', 'higher'),
      this.createBooleanMetric('Nuclear Weapons', c1.categories.military.nuclearWeapons, c2.categories.military.nuclearWeapons),
      this.createBooleanMetric('NATO Member', c1.categories.military.isNatoMember, c2.categories.military.isNatoMember),
    ];
  }

  private comparePolitical(c1: CountryFullData, c2: CountryFullData): ComparisonMetric[] {
    return [
      this.createMetric('Passport Ranking', c1.categories.political.passportRanking, c2.categories.political.passportRanking, '', 'lower'),
      this.createMetric('Visa-Free Access', c1.categories.political.passportVisaFree, c2.categories.political.passportVisaFree, 'countries', 'higher'),
      this.createMetric('Democracy Index', c1.categories.political.democracyIndex, c2.categories.political.democracyIndex, '', 'higher'),
      this.createMetric('Corruption Index', c1.categories.political.corruptionIndex, c2.categories.political.corruptionIndex, '', 'higher'),
      this.createMetric('HDI', c1.categories.political.humanDevelopmentIndex, c2.categories.political.humanDevelopmentIndex, '', 'higher'),
      this.createBooleanMetric('EU Member', c1.categories.political.isEU, c2.categories.political.isEU),
      this.createBooleanMetric('G7 Member', c1.categories.political.isG7, c2.categories.political.isG7),
      this.createBooleanMetric('G20 Member', c1.categories.political.isG20, c2.categories.political.isG20),
    ];
  }

  private compareCrime(c1: CountryFullData, c2: CountryFullData): ComparisonMetric[] {
    return [
      this.createMetric('Crime Index', c1.categories.crime.crimeIndex, c2.categories.crime.crimeIndex, '', 'lower'),
      this.createMetric('Safety Index', c1.categories.crime.safetyIndex, c2.categories.crime.safetyIndex, '', 'higher'),
      this.createMetric('Total Crime Rate', c1.categories.crime.totalCrimeRate, c2.categories.crime.totalCrimeRate, 'per 100k', 'lower'),
      this.createMetric('Homicide Rate', c1.categories.crime.homicideRate, c2.categories.crime.homicideRate, 'per 100k', 'lower'),
    ];
  }

  private compareHealth(c1: CountryFullData, c2: CountryFullData): ComparisonMetric[] {
    return [
      this.createMetric('Smoking Rate', c1.categories.health.smokingRate, c2.categories.health.smokingRate, '%', 'lower'),
      this.createMetric('Alcohol Dependency', c1.categories.health.alcoholDependencyRate, c2.categories.health.alcoholDependencyRate, '%', 'lower'),
      this.createMetric('Drug Use', c1.categories.health.drugUseRate, c2.categories.health.drugUseRate, '%', 'lower'),
      this.createMetric('Obesity Rate', c1.categories.health.obesityRate, c2.categories.health.obesityRate, '%', 'lower'),
      this.createMetric('Healthcare Spending', c1.categories.health.healthcareSpendingPercent, c2.categories.health.healthcareSpendingPercent, '% of GDP'),
      this.createMetric('Hospital Beds', c1.categories.health.hospitalBedsPer1000, c2.categories.health.hospitalBedsPer1000, 'per 1000', 'higher'),
      this.createMetric('Physicians', c1.categories.health.physiciansPer1000, c2.categories.health.physiciansPer1000, 'per 1000', 'higher'),
    ];
  }

  private createMetric(
    metric: string,
    val1: number | null,
    val2: number | null,
    unit: string,
    betterIs?: 'higher' | 'lower'
  ): ComparisonMetric {
    let winner: string | null = null;
    let difference: number | null = null;
    let percentDifference: number | null = null;

    if (val1 !== null && val2 !== null) {
      difference = val1 - val2;
      if (val2 !== 0) {
        percentDifference = ((val1 - val2) / Math.abs(val2)) * 100;
      }

      if (betterIs === 'higher') {
        winner = val1 > val2 ? 'country1' : val2 > val1 ? 'country2' : null;
      } else if (betterIs === 'lower') {
        winner = val1 < val2 ? 'country1' : val2 < val1 ? 'country2' : null;
      }
    }

    return {
      metric,
      country1Value: val1,
      country2Value: val2,
      difference,
      percentDifference,
      winner,
      unit,
    };
  }

  private createBooleanMetric(
    metric: string,
    val1: boolean,
    val2: boolean
  ): ComparisonMetric {
    return {
      metric,
      country1Value: val1,
      country2Value: val2,
    };
  }

  private calculateSummary(
    result: ComparisonResult,
    c1: CountryFullData,
    c2: CountryFullData
  ): ComparisonResult['summary'] {
    let country1Score = 0;
    let country2Score = 0;
    const highlights: string[] = [];

    // Count wins across all categories
    for (const category of Object.values(result.categories)) {
      for (const metric of category) {
        if (metric.winner === 'country1') country1Score++;
        else if (metric.winner === 'country2') country2Score++;
      }
    }

    // Generate highlights
    const gdpDiff = (c1.categories.economy.gdpPerCapita ?? 0) - (c2.categories.economy.gdpPerCapita ?? 0);
    if (Math.abs(gdpDiff) > 5000) {
      const richer = gdpDiff > 0 ? c1.country : c2.country;
      highlights.push(`${richer} has significantly higher GDP per capita`);
    }

    if (c1.categories.military.globalRank && c2.categories.military.globalRank) {
      const stronger = c1.categories.military.globalRank < c2.categories.military.globalRank ? c1.country : c2.country;
      highlights.push(`${stronger} has a higher military ranking`);
    }

    const safetyDiff = (c1.categories.crime.safetyIndex ?? 0) - (c2.categories.crime.safetyIndex ?? 0);
    if (Math.abs(safetyDiff) > 10) {
      const safer = safetyDiff > 0 ? c1.country : c2.country;
      highlights.push(`${safer} is considered safer based on crime statistics`);
    }

    return {
      winner: country1Score > country2Score ? c1.country : country2Score > country1Score ? c2.country : null,
      scores: {
        country1: country1Score,
        country2: country2Score,
      },
      highlights,
    };
  }
}

export const comparisonService = new ComparisonService();
export default comparisonService;
