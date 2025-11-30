// Country API - Frontend API client with full TypeScript types
import httpClient from './httpClient';

// ============= TYPES =============

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

export interface CrimeCategory {
  id: number;
  category: string;
  ratePerr100k: number;
  trend: string;
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

export interface ChartData {
  labels: string[];
  values: number[];
  unit?: string;
  color?: string;
}

export interface CountryCharts {
  gdpHistory: ChartData;
  populationPyramid?: {
    male: { ageGroup: string; percentage: number }[];
    female: { ageGroup: string; percentage: number }[];
  };
  economicIndicators: ChartData;
  militaryStrength: ChartData;
  crimeBreakdown: ChartData;
  healthMetrics: ChartData;
}

export interface ComparisonResult {
  countries: [Country, Country];
  differences: {
    category: string;
    metrics: {
      name: string;
      country1Value: number | string | boolean | null;
      country2Value: number | string | boolean | null;
      unit?: string;
      winner?: string;
    }[];
  }[];
  summary: string;
}

export interface AISummary {
  countryCode: string;
  countryName: string;
  summary: string;
  highlights: string[];
  generatedAt: string;
  cached: boolean;
}

export interface SearchResult {
  countries: CountryBasic[];
  totalCount: number;
  query: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    cached?: boolean;
    timestamp?: string;
    source?: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ============= API FUNCTIONS =============

/**
 * Get all countries with basic info
 */
export async function getAll(): Promise<CountryBasic[]> {
  const response = await httpClient.get<ApiResponse<CountryBasic[]>>('/countries');
  return response.data.data;
}

/**
 * Get a single country by ISO code with full details
 */
export async function getOne(code: string): Promise<Country> {
  const response = await httpClient.get<ApiResponse<Country>>(`/countries/${code.toUpperCase()}`);
  return response.data.data;
}

/**
 * Get chart data for a country
 */
export async function getCharts(code: string): Promise<CountryCharts> {
  const response = await httpClient.get<ApiResponse<CountryCharts>>(`/countries/${code.toUpperCase()}/charts`);
  return response.data.data;
}

/**
 * Search countries by name or code
 */
export async function search(query: string): Promise<SearchResult> {
  const response = await httpClient.get<ApiResponse<SearchResult>>('/countries/search', {
    params: { q: query },
  });
  return response.data.data;
}

/**
 * Compare two countries
 */
export async function compare(code1: string, code2: string): Promise<ComparisonResult> {
  const response = await httpClient.get<ApiResponse<ComparisonResult>>('/compare', {
    params: {
      c1: code1.toUpperCase(),
      c2: code2.toUpperCase(),
    },
  });
  return response.data.data;
}

/**
 * Get AI-generated summary for a country
 */
export async function summary(code: string): Promise<AISummary> {
  const response = await httpClient.get<ApiResponse<AISummary>>(`/countries/${code.toUpperCase()}/summary`);
  return response.data.data;
}

/**
 * Trigger manual data sync (admin only)
 */
export async function triggerSync(providers?: string[]): Promise<{ message: string; jobId: string }> {
  const response = await httpClient.post<ApiResponse<{ message: string; jobId: string }>>('/sync', {
    providers,
  });
  return response.data.data;
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<{
  lastSync: string | null;
  inProgress: boolean;
  providers: { name: string; lastSync: string | null; status: string }[];
}> {
  const response = await httpClient.get<ApiResponse<{
    lastSync: string | null;
    inProgress: boolean;
    providers: { name: string; lastSync: string | null; status: string }[];
  }>>('/sync/status');
  return response.data.data;
}

// ============= REALTIME HELPERS =============

/**
 * Connect to SSE for real-time updates
 */
export function connectSSE(onMessage: (data: unknown) => void): EventSource {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const eventSource = new EventSource(`${baseUrl}/api/realtime/sse`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      console.error('Failed to parse SSE message');
    }
  };

  eventSource.onerror = () => {
    console.error('SSE connection error');
  };

  return eventSource;
}

/**
 * Connect to WebSocket for comparison room
 */
export function connectCompareWS(
  code1: string,
  code2: string,
  onMessage: (data: ComparisonResult) => void,
  onError?: (error: Event) => void
): WebSocket {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
  const ws = new WebSocket(`${wsUrl}/ws/compare`);

  ws.onopen = () => {
    // Join comparison room
    ws.send(JSON.stringify({
      type: 'join',
      payload: { codes: [code1.toUpperCase(), code2.toUpperCase()] },
    }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'comparison_update') {
        onMessage(data.payload);
      }
    } catch {
      console.error('Failed to parse WebSocket message');
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError?.(error);
  };

  return ws;
}

// ============= REACT QUERY KEYS =============

export const countryKeys = {
  all: ['countries'] as const,
  lists: () => [...countryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...countryKeys.lists(), filters] as const,
  details: () => [...countryKeys.all, 'detail'] as const,
  detail: (code: string) => [...countryKeys.details(), code] as const,
  charts: (code: string) => [...countryKeys.all, 'charts', code] as const,
  summary: (code: string) => [...countryKeys.all, 'summary', code] as const,
  search: (query: string) => [...countryKeys.all, 'search', query] as const,
  compare: (code1: string, code2: string) => [...countryKeys.all, 'compare', code1, code2] as const,
};

// ============= EXPORT DEFAULT =============

const countryApi = {
  getAll,
  getOne,
  getCharts,
  search,
  compare,
  summary,
  triggerSync,
  getSyncStatus,
  connectSSE,
  connectCompareWS,
  keys: countryKeys,
};

export default countryApi;
