// Chart Service - Generate chart-ready data for frontend
import prisma from '../db/client.js';
import redis from '../utils/redis.js';
import { config } from '../utils/config.js';
import { NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export interface ChartData {
  gdpLineChart: GdpLineChartData;
  crimeDonutChart: CrimeDonutChartData;
  healthBarChart: HealthBarChartData;
  populationDonutChart: PopulationDonutChartData;
  militaryRadarChart: MilitaryRadarChartData;
  economicIndicatorsChart: EconomicIndicatorsChartData;
}

export interface GdpLineChartData {
  title: string;
  labels: number[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

export interface CrimeDonutChartData {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  totalCrimeRate: number | null;
}

export interface HealthBarChartData {
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
  }>;
}

export interface PopulationDonutChartData {
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  totalPopulation: number | null;
}

export interface MilitaryRadarChartData {
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

export interface EconomicIndicatorsChartData {
  title: string;
  indicators: Array<{
    name: string;
    value: number | null;
    unit: string;
    color: string;
  }>;
}

// Neon color palette for charts
const CHART_COLORS = {
  neonBlue: '#00f0ff',
  neonPink: '#ff00ff',
  neonGreen: '#00ff88',
  neonYellow: '#ffff00',
  neonOrange: '#ff8800',
  neonPurple: '#8800ff',
  neonRed: '#ff0055',
  neonCyan: '#00ffff',
};

class ChartService {
  // Get all chart data for a country
  async getCharts(code: string): Promise<ChartData> {
    const normalizedCode = code.toUpperCase();
    const cacheKey = `country:${normalizedCode}:charts`;

    // Try cache first
    const cached = await redis.get<ChartData>(cacheKey);
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
        crime: {
          include: {
            categories: true,
          },
        },
        healthStats: true,
      },
    });

    if (!country) {
      throw new NotFoundError(`Country with code ${code}`);
    }

    // Build GDP Line Chart
    const gdpHistory = (country.economy?.gdpGrowthHistory as Array<{ year: number; value: number }>) || [];
    const gdpLineChart: GdpLineChartData = {
      title: `GDP Per Capita Trend - ${country.name}`,
      labels: gdpHistory.map(h => h.year),
      datasets: [{
        label: 'GDP Per Capita (USD)',
        data: gdpHistory.map(h => h.value),
        borderColor: CHART_COLORS.neonBlue,
        backgroundColor: `${CHART_COLORS.neonBlue}33`,
      }],
    };

    // Build Crime Donut Chart
    const crimeCategories = country.crime?.categories || [];
    const crimeDonutChart: CrimeDonutChartData = {
      title: `Crime Distribution - ${country.name}`,
      labels: crimeCategories.map(c => c.category),
      data: crimeCategories.map(c => c.percentage),
      colors: [
        CHART_COLORS.neonRed,
        CHART_COLORS.neonOrange,
        CHART_COLORS.neonYellow,
        CHART_COLORS.neonPurple,
        CHART_COLORS.neonCyan,
      ],
      totalCrimeRate: country.crime?.totalCrimeRate ?? null,
    };

    // Build Health Bar Chart (Smoking, Alcohol, Drugs)
    const healthBarChart: HealthBarChartData = {
      title: `Health Indicators - ${country.name}`,
      labels: ['Smoking Rate', 'Alcohol Dependency', 'Drug Use', 'Obesity Rate'],
      datasets: [{
        label: 'Percentage of Population',
        data: [
          country.healthStats?.smokingRate ?? 0,
          country.healthStats?.alcoholDependencyRate ?? 0,
          country.healthStats?.drugUseRate ?? 0,
          country.healthStats?.obesityRate ?? 0,
        ],
        backgroundColor: CHART_COLORS.neonPink,
      }],
    };

    // Build Population Donut Chart (Male/Female)
    const malePopulation = country.demographics?.malePopulation ? Number(country.demographics.malePopulation) : 0;
    const femalePopulation = country.demographics?.femalePopulation ? Number(country.demographics.femalePopulation) : 0;
    const totalPop = malePopulation + femalePopulation;

    const populationDonutChart: PopulationDonutChartData = {
      title: `Population Distribution - ${country.name}`,
      labels: ['Male', 'Female'],
      data: totalPop > 0 
        ? [(malePopulation / totalPop) * 100, (femalePopulation / totalPop) * 100]
        : [50, 50],
      colors: [CHART_COLORS.neonBlue, CHART_COLORS.neonPink],
      totalPopulation: country.demographics?.totalPopulation ? Number(country.demographics.totalPopulation) : null,
    };

    // Build Military Radar Chart
    const military = country.military;
    const maxValues = {
      tanks: 15000,
      aircraft: 5000,
      naval: 800,
      soldiers: 3000000,
      spending: 900000000000,
    };

    const militaryRadarChart: MilitaryRadarChartData = {
      title: `Military Capabilities - ${country.name}`,
      labels: ['Tanks', 'Aircraft', 'Naval Vessels', 'Personnel', 'Defense Budget'],
      datasets: [{
        label: country.name,
        data: [
          Math.min((military?.tanks ?? 0) / maxValues.tanks * 100, 100),
          Math.min((military?.totalAircraft ?? 0) / maxValues.aircraft * 100, 100),
          Math.min((military?.navalVessels ?? 0) / maxValues.naval * 100, 100),
          Math.min((military?.totalMilitaryPersonnel ?? 0) / maxValues.soldiers * 100, 100),
          Math.min((military?.defenseSpending ?? 0) / maxValues.spending * 100, 100),
        ],
        borderColor: CHART_COLORS.neonGreen,
        backgroundColor: `${CHART_COLORS.neonGreen}44`,
      }],
    };

    // Build Economic Indicators Chart
    const economicIndicatorsChart: EconomicIndicatorsChartData = {
      title: `Economic Indicators - ${country.name}`,
      indicators: [
        { name: 'GDP', value: country.economy?.gdp ?? null, unit: 'USD', color: CHART_COLORS.neonGreen },
        { name: 'GDP Per Capita', value: country.economy?.gdpPerCapita ?? null, unit: 'USD', color: CHART_COLORS.neonBlue },
        { name: 'GDP Growth', value: country.economy?.gdpGrowthRate ?? null, unit: '%', color: CHART_COLORS.neonCyan },
        { name: 'Inflation', value: country.economy?.inflation ?? null, unit: '%', color: CHART_COLORS.neonOrange },
        { name: 'Unemployment', value: country.economy?.unemploymentRate ?? null, unit: '%', color: CHART_COLORS.neonRed },
        { name: 'Public Debt', value: country.economy?.publicDebt ?? null, unit: '% of GDP', color: CHART_COLORS.neonPurple },
      ],
    };

    const result: ChartData = {
      gdpLineChart,
      crimeDonutChart,
      healthBarChart,
      populationDonutChart,
      militaryRadarChart,
      economicIndicatorsChart,
    };

    await redis.set(cacheKey, result, config.cache.chartsTtl);
    return result;
  }
}

export const chartService = new ChartService();
export default chartService;
