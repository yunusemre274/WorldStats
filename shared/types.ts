// Shared types for WorldStats - can be used by both frontend and backend
// This file is a mirror of key types for reference

export interface CountryBasic {
  id: number;
  code: string;
  name: string;
  capital?: string;
  region?: string;
  flagUrl?: string;
  population?: number;
  gdpNominal?: number;
}

export interface Country {
  id: number;
  code: string;
  name: string;
  officialName?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  flagUrl?: string;
  coatOfArmsUrl?: string;
  mapSvgUrl?: string;
  area?: number;
  landlocked: boolean;
  currency?: string;
  currencySymbol?: string;
  callingCode?: string;
  timezone?: string;
  drivingSide?: string;
  createdAt: string;
  updatedAt: string;
  demographics?: Demographics;
  economy?: Economy;
  military?: Military;
  politics?: Politics;
  crime?: Crime;
  health?: Health;
  gdpHistory: GdpHistory[];
}

export interface Demographics {
  id: number;
  population: number;
  populationDensity?: number;
  medianAge?: number;
  urbanPopulationPercent?: number;
  averageIq?: number;
  literacyRate?: number;
  officialLanguages: string[];
}

export interface Economy {
  id: number;
  gdpNominal?: number;
  gdpPpp?: number;
  gdpPerCapita?: number;
  gdpGrowthRate?: number;
  unemploymentRate?: number;
  inflationRate?: number;
  publicDebtPercent?: number;
  smokingRate?: number;
  alcoholConsumption?: number;
  drugUseRate?: number;
  averageIncome?: number;
  minimumWage?: number;
  giniIndex?: number;
  costOfLivingIndex?: number;
}

export interface Military {
  id: number;
  globalRank?: number;
  totalPersonnel?: number;
  activePersonnel?: number;
  reservePersonnel?: number;
  defensebudget?: number;
  tanks?: number;
  aircraft?: number;
  navalVessels?: number;
  nuclearWeapons: boolean;
  natoMember: boolean;
}

export interface Politics {
  id: number;
  governmentType?: string;
  headOfState?: string;
  headOfGovernment?: string;
  rulingParty?: string;
  euMember: boolean;
  unMember: boolean;
  democracyIndex?: number;
  corruptionIndex?: number;
  pressdomIndex?: number;
  passportRank?: number;
  visaFreeCountries?: number;
}

export interface Crime {
  id: number;
  overallIndex?: number;
  homicideRate?: number;
  robberyRate?: number;
  assaultRate?: number;
  kidnappingRate?: number;
  prisonPopulation?: number;
  incarcerationRate?: number;
  categories: CrimeCategory[];
}

export interface CrimeCategory {
  id: number;
  category: string;
  ratePerr100k: number;
  trend: string;
}

export interface Health {
  id: number;
  lifeExpectancyMale?: number;
  lifeExpectancyFemale?: number;
  lifeExpectancyOverall?: number;
  healthcareSpendingPercent?: number;
  healthcareSpendingPerCapita?: number;
  hospitalBedsPerr1000?: number;
  physiciansPerr1000?: number;
  obesityRate?: number;
  diabetesRate?: number;
  covidVaccinationRate?: number;
  mentalHealthIndex?: number;
  suicideRate?: number;
}

export interface GdpHistory {
  id: number;
  year: number;
  gdpNominal: number;
  gdpGrowthRate?: number;
}

// Region types for map rendering
export type Region = 
  | 'Africa'
  | 'Americas'
  | 'Asia'
  | 'Europe'
  | 'Oceania';

export type SubRegion =
  | 'Northern Africa'
  | 'Eastern Africa'
  | 'Middle Africa'
  | 'Southern Africa'
  | 'Western Africa'
  | 'Caribbean'
  | 'Central America'
  | 'South America'
  | 'Northern America'
  | 'Central Asia'
  | 'Eastern Asia'
  | 'South-Eastern Asia'
  | 'Southern Asia'
  | 'Western Asia'
  | 'Eastern Europe'
  | 'Northern Europe'
  | 'Southern Europe'
  | 'Western Europe'
  | 'Australia and New Zealand'
  | 'Melanesia'
  | 'Micronesia'
  | 'Polynesia';

// Chart types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

// Comparison types
export interface ComparisonMetric {
  name: string;
  country1Value: number | string | boolean | null;
  country2Value: number | string | boolean | null;
  unit?: string;
  winner?: 'country1' | 'country2' | 'tie' | null;
  category: string;
}

// Event types for real-time
export interface RealtimeEvent {
  type: 'country_update' | 'sync_complete' | 'comparison_update';
  payload: unknown;
  timestamp: string;
}

// Sorting options
export type SortField = 
  | 'name'
  | 'population'
  | 'gdp'
  | 'area'
  | 'militaryRank'
  | 'lifeExpectancy';

export type SortOrder = 'asc' | 'desc';

// Filter options
export interface CountryFilters {
  region?: Region;
  subregion?: SubRegion;
  minPopulation?: number;
  maxPopulation?: number;
  minGdp?: number;
  maxGdp?: number;
  euMember?: boolean;
  natoMember?: boolean;
  nuclearPower?: boolean;
}
