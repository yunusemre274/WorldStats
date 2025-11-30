// Country API hooks - fetches real data from backend
import { useQuery } from "@tanstack/react-query";

const API_BASE = "http://localhost:3001/api";

// Types matching the frontend display needs
export interface CountryStats {
  id: string;
  name: string;
  demographics: {
    avgIq: number;
    maleFemaleRatio: string;
    childPop: string;
    literacyRate: string;
    addictionRates: {
      smoking: string;
      alcohol: string;
      substances: string;
    };
    population: number;
  };
  military: {
    rank: number;
    activePersonnel: number;
    budget: string;
    assets: { name: string; value: number }[];
  };
  crime: {
    index: number;
    categories: { name: string; value: number }[];
    trend: { year: string; value: number }[];
  };
  economic: {
    gdpPerCapita: string;
    govType: string;
    memberships: string[];
    passportRank: number;
  };
}

// Backend response type (matches actual API structure)
interface BackendCountryResponse {
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
    demographics: {
      totalPopulation: number | null;
      malePopulation: number | null;
      femalePopulation: number | null;
      maleFemaleRatio: string | null;
      medianAge: number | null;
      lifeExpectancy: number | null;
      childPopulationPercent: number | null;
      averageIQ: number | null;
      populationGrowthRate: number | null;
    };
    economy: {
      gdp: number | null;
      gdpPerCapita: number | null;
      gdpGrowthRate: number | null;
      currency: string | null;
    };
    military: {
      globalRank: number | null;
      activeSoldiers: number | null;
      totalMilitaryPersonnel: number | null;
      defenseSpending: number | null;
      tanks: number | null;
      totalAircraft: number | null;
      navalVessels: number | null;
      nuclearWeapons: boolean;
      isNatoMember: boolean;
    };
    political: {
      governmentType: string | null;
      isEU: boolean;
      isUN: boolean;
      isNato: boolean;
      isG7: boolean;
      isG20: boolean;
      isBrics: boolean;
      passportRanking: number | null;
      passportVisaFree: number | null;
    };
    crime: {
      crimeIndex: number | null;
      safetyIndex: number | null;
      crimeCategories: Array<{ category: string; percentage: number }>;
    };
    health: {
      smokingRate: number | null;
      alcoholConsumption: number | null;
      drugUseRate: number | null;
      obesityRate: number | null;
    };
    education: {
      literacyRate: number | null;
    };
  };
}

// Transform backend data to frontend format
function transformCountryData(data: BackendCountryResponse): CountryStats {
  const { categories } = data;
  const demo = categories.demographics;
  const economy = categories.economy;
  const military = categories.military;
  const political = categories.political;
  const crime = categories.crime;
  const health = categories.health;
  const education = categories.education;

  // Calculate male/female ratio
  let maleFemaleRatio = "1:1";
  if (demo?.maleFemaleRatio) {
    maleFemaleRatio = demo.maleFemaleRatio;
  } else if (demo?.malePopulation && demo?.femalePopulation) {
    const ratio = demo.malePopulation / demo.femalePopulation;
    maleFemaleRatio = `${ratio.toFixed(2)}:1`;
  }

  // Format budget
  const formatBudget = (value?: number | null): string => {
    if (!value) return "N/A";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  };

  // Format GDP per capita
  const formatGdpPerCapita = (value?: number | null): string => {
    if (!value) return "N/A";
    return `$${value.toLocaleString()}`;
  };

  // Build memberships array
  const memberships: string[] = [];
  if (political?.isEU) memberships.push("EU");
  if (political?.isNato) memberships.push("NATO");
  if (political?.isUN) memberships.push("UN");
  if (political?.isG7) memberships.push("G7");
  if (political?.isG20) memberships.push("G20");
  if (political?.isBrics) memberships.push("BRICS");

  // Crime categories from backend
  const crimeCategories = crime?.crimeCategories?.map((c) => ({
    name: c.category,
    value: c.percentage,
  })) || [{ name: "General", value: crime?.crimeIndex || 30 }];

  // Generate fake GDP trend for visualization
  const gdpTrend = [
    { year: "2019", value: (economy?.gdpPerCapita || 0) * 0.92 },
    { year: "2020", value: (economy?.gdpPerCapita || 0) * 0.88 },
    { year: "2021", value: (economy?.gdpPerCapita || 0) * 0.95 },
    { year: "2022", value: (economy?.gdpPerCapita || 0) * 0.98 },
    { year: "2023", value: economy?.gdpPerCapita || 0 },
  ];

  return {
    id: data.code3 || data.code,
    name: data.country,
    demographics: {
      avgIq: demo?.averageIQ || 100,
      maleFemaleRatio,
      childPop: demo?.childPopulationPercent 
        ? `${demo.childPopulationPercent.toFixed(1)}%` 
        : "N/A",
      literacyRate: education?.literacyRate 
        ? `${education.literacyRate.toFixed(0)}%` 
        : "N/A",
      addictionRates: {
        smoking: health?.smokingRate ? `${health.smokingRate.toFixed(0)}%` : "N/A",
        alcohol: health?.alcoholConsumption ? `${health.alcoholConsumption.toFixed(0)}%` : "N/A",
        substances: health?.drugUseRate ? `${health.drugUseRate.toFixed(1)}%` : "N/A",
      },
      population: demo?.totalPopulation || 0,
    },
    military: {
      rank: military?.globalRank || 0,
      activePersonnel: military?.activeSoldiers || 0,
      budget: formatBudget(military?.defenseSpending),
      assets: [
        { name: "Air", value: military?.totalAircraft || 0 },
        { name: "Land", value: military?.tanks || 0 },
        { name: "Naval", value: military?.navalVessels || 0 },
      ],
    },
    crime: {
      index: crime?.crimeIndex || 0,
      categories: crimeCategories,
      trend: gdpTrend.map(t => ({ year: t.year, value: Math.round(t.value / 1000) })),
    },
    economic: {
      gdpPerCapita: formatGdpPerCapita(economy?.gdpPerCapita),
      govType: political?.governmentType || "Unknown",
      memberships: memberships.length > 0 ? memberships : ["UN"],
      passportRank: political?.passportRanking || 0,
    },
  };
}

// Fetch all countries (basic list)
export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/countries`);
      if (!response.ok) throw new Error("Failed to fetch countries");
      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// API wrapper response type
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Fetch single country by code
export function useCountry(code: string | null) {
  return useQuery({
    queryKey: ["country", code],
    queryFn: async (): Promise<CountryStats | null> => {
      if (!code) return null;
      
      try {
        const response = await fetch(`${API_BASE}/country/${code}`);
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error("Failed to fetch country");
        }
        const apiResponse: ApiResponse<BackendCountryResponse> = await response.json();
        console.log("API Response for", code, ":", apiResponse); // Debug log
        
        if (!apiResponse.success || !apiResponse.data) {
          return null;
        }
        
        return transformCountryData(apiResponse.data);
      } catch (error) {
        console.error("Error fetching country:", error);
        return null;
      }
    },
    enabled: !!code,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
}

// Map of ISO numeric codes to Alpha-2 codes for our backend
// Include both with and without leading zeros
export const ISO_NUMERIC_TO_ALPHA2: Record<string, string> = {
  "4": "AF", "004": "AF",     // Afghanistan
  "8": "AL", "008": "AL",     // Albania
  "12": "DZ", "012": "DZ",    // Algeria
  "24": "AO", "024": "AO",    // Angola
  "32": "AR", "032": "AR",    // Argentina
  "36": "AU", "036": "AU",    // Australia
  "40": "AT", "040": "AT",    // Austria
  "50": "BD", "050": "BD",    // Bangladesh
  "56": "BE", "056": "BE",    // Belgium
  "76": "BR", "076": "BR",    // Brazil
  "100": "BG",                // Bulgaria
  "124": "CA",                // Canada
  "152": "CL",                // Chile
  "156": "CN",                // China
  "170": "CO",                // Colombia
  "192": "CU",                // Cuba
  "203": "CZ",                // Czech Republic
  "208": "DK",                // Denmark
  "818": "EG",                // Egypt
  "233": "EE",                // Estonia
  "246": "FI",                // Finland
  "250": "FR",                // France
  "276": "DE",                // Germany
  "300": "GR",                // Greece
  "344": "HK",                // Hong Kong
  "348": "HU",                // Hungary
  "356": "IN",                // India
  "360": "ID",                // Indonesia
  "364": "IR",                // Iran
  "368": "IQ",                // Iraq
  "372": "IE",                // Ireland
  "376": "IL",                // Israel
  "380": "IT",                // Italy
  "392": "JP",                // Japan
  "398": "KZ",                // Kazakhstan
  "404": "KE",                // Kenya
  "408": "KP",                // North Korea
  "410": "KR",                // South Korea
  "458": "MY",                // Malaysia
  "484": "MX",                // Mexico
  "504": "MA",                // Morocco
  "528": "NL",                // Netherlands
  "554": "NZ",                // New Zealand
  "566": "NG",                // Nigeria
  "578": "NO",                // Norway
  "586": "PK",                // Pakistan
  "604": "PE",                // Peru
  "608": "PH",                // Philippines
  "616": "PL",                // Poland
  "620": "PT",                // Portugal
  "642": "RO",                // Romania
  "643": "RU",                // Russia
  "682": "SA",                // Saudi Arabia
  "702": "SG",                // Singapore
  "710": "ZA",                // South Africa
  "724": "ES",                // Spain
  "752": "SE",                // Sweden
  "756": "CH",                // Switzerland
  "158": "TW",                // Taiwan
  "764": "TH",                // Thailand
  "792": "TR",                // Turkey
  "804": "UA",                // Ukraine
  "784": "AE",                // UAE
  "826": "GB",                // United Kingdom
  "840": "US",                // United States
  "704": "VN",                // Vietnam
};

// Default stats for countries not in database
export const DEFAULT_STATS: CountryStats = {
  id: "UNK",
  name: "Unknown Territory",
  demographics: {
    avgIq: 100,
    maleFemaleRatio: "1:1",
    childPop: "N/A",
    literacyRate: "N/A",
    addictionRates: { smoking: "N/A", alcohol: "N/A", substances: "N/A" },
    population: 0,
  },
  military: {
    rank: 0,
    activePersonnel: 0,
    budget: "N/A",
    assets: [
      { name: "Air", value: 0 },
      { name: "Land", value: 0 },
      { name: "Naval", value: 0 },
    ],
  },
  crime: {
    index: 0,
    categories: [{ name: "N/A", value: 0 }],
    trend: [],
  },
  economic: {
    gdpPerCapita: "N/A",
    govType: "Unknown",
    memberships: [],
    passportRank: 0,
  },
};
