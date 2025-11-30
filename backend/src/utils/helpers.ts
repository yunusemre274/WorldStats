// General Utility Functions
import { v4 as uuidv4 } from 'uuid';

// Generate unique ID
export const generateId = (): string => uuidv4();

// Sleep utility for rate limiting
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Safe JSON parse
export const safeJsonParse = <T>(str: string, fallback: T): T => {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Normalize country code to uppercase
export const normalizeCountryCode = (code: string): string => {
  return code.toUpperCase().trim();
};

// Calculate percentage from parts
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

// Round to decimal places
export const roundTo = (num: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

// Check if value is valid number
export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

// Parse numeric value safely
export const parseNumeric = (value: unknown): number | null => {
  if (typeof value === 'number' && isValidNumber(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isValidNumber(parsed) ? parsed : null;
  }
  return null;
};

// Chunk array into smaller arrays
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Retry function with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
};

// Debounce function
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Get current timestamp in seconds
export const nowInSeconds = (): number => Math.floor(Date.now() / 1000);

// ISO country code mapping (alpha-2 to alpha-3)
export const countryCodeMap: Record<string, string> = {
  US: 'USA', DE: 'DEU', GB: 'GBR', FR: 'FRA', JP: 'JPN',
  CN: 'CHN', IN: 'IND', BR: 'BRA', RU: 'RUS', AU: 'AUS',
  CA: 'CAN', IT: 'ITA', ES: 'ESP', MX: 'MEX', KR: 'KOR',
  TR: 'TUR', SA: 'SAU', ZA: 'ZAF', NG: 'NGA', EG: 'EGY',
  AR: 'ARG', PL: 'POL', NL: 'NLD', SE: 'SWE', CH: 'CHE',
  BE: 'BEL', AT: 'AUT', NO: 'NOR', DK: 'DNK', FI: 'FIN',
  PT: 'PRT', GR: 'GRC', CZ: 'CZE', HU: 'HUN', RO: 'ROU',
  IL: 'ISR', AE: 'ARE', SG: 'SGP', MY: 'MYS', TH: 'THA',
  ID: 'IDN', PH: 'PHL', VN: 'VNM', PK: 'PAK', BD: 'BGD',
};

// Get alpha-3 code from alpha-2
export const getAlpha3Code = (alpha2: string): string | undefined => {
  return countryCodeMap[alpha2.toUpperCase()];
};

// Map for World Bank indicator codes
export const worldBankIndicators = {
  gdp: 'NY.GDP.MKTP.CD',
  gdpPerCapita: 'NY.GDP.PCAP.CD',
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  population: 'SP.POP.TOTL',
  populationGrowth: 'SP.POP.GROW',
  lifeExpectancy: 'SP.DYN.LE00.IN',
  birthRate: 'SP.DYN.CBRT.IN',
  deathRate: 'SP.DYN.CDRT.IN',
  fertilityRate: 'SP.DYN.TFRT.IN',
  infantMortality: 'SP.DYN.IMRT.IN',
  urbanPopulation: 'SP.URB.TOTL.IN.ZS',
  literacyRate: 'SE.ADT.LITR.ZS',
  unemployment: 'SL.UEM.TOTL.ZS',
  inflation: 'FP.CPI.TOTL.ZG',
  giniIndex: 'SI.POV.GINI',
  healthExpenditure: 'SH.XPD.CHEX.GD.ZS',
  educationExpenditure: 'SE.XPD.TOTL.GD.ZS',
};
