// React Query Hooks for Country API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import countryApi, { countryKeys } from '../api/countryApi';
import type {
  Country,
  CountryBasic,
  CountryCharts,
  ComparisonResult,
  AISummary,
  SearchResult,
} from '../api/countryApi';

// ============= QUERY HOOKS =============

/**
 * Hook to fetch all countries
 */
export function useCountries() {
  return useQuery<CountryBasic[], Error>({
    queryKey: countryKeys.lists(),
    queryFn: countryApi.getAll,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch a single country by code
 */
export function useCountry(code: string | null | undefined) {
  return useQuery<Country, Error>({
    queryKey: countryKeys.detail(code || ''),
    queryFn: () => countryApi.getOne(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch country charts
 */
export function useCountryCharts(code: string | null | undefined) {
  return useQuery<CountryCharts, Error>({
    queryKey: countryKeys.charts(code || ''),
    queryFn: () => countryApi.getCharts(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Hook to fetch AI summary for a country
 */
export function useCountrySummary(code: string | null | undefined) {
  return useQuery<AISummary, Error>({
    queryKey: countryKeys.summary(code || ''),
    queryFn: () => countryApi.summary(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Hook to search countries
 */
export function useCountrySearch(query: string) {
  return useQuery<SearchResult, Error>({
    queryKey: countryKeys.search(query),
    queryFn: () => countryApi.search(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to compare two countries
 */
export function useCountryComparison(code1: string | null | undefined, code2: string | null | undefined) {
  return useQuery<ComparisonResult, Error>({
    queryKey: countryKeys.compare(code1 || '', code2 || ''),
    queryFn: () => countryApi.compare(code1!, code2!),
    enabled: !!code1 && !!code2 && code1 !== code2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============= MUTATION HOOKS =============

/**
 * Hook to trigger data sync
 */
export function useTriggerSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (providers?: string[]) => countryApi.triggerSync(providers),
    onSuccess: () => {
      // Invalidate all country queries after sync
      queryClient.invalidateQueries({ queryKey: countryKeys.all });
    },
  });
}

// ============= PREFETCH HELPERS =============

/**
 * Prefetch country data for faster navigation
 */
export function usePrefetchCountry() {
  const queryClient = useQueryClient();

  return (code: string) => {
    queryClient.prefetchQuery({
      queryKey: countryKeys.detail(code),
      queryFn: () => countryApi.getOne(code),
      staleTime: 1000 * 60 * 30,
    });
  };
}

/**
 * Prefetch country charts
 */
export function usePrefetchCharts() {
  const queryClient = useQueryClient();

  return (code: string) => {
    queryClient.prefetchQuery({
      queryKey: countryKeys.charts(code),
      queryFn: () => countryApi.getCharts(code),
      staleTime: 1000 * 60 * 60,
    });
  };
}

// ============= OPTIMISTIC UPDATE HELPERS =============

/**
 * Get cached country data
 */
export function useGetCachedCountry() {
  const queryClient = useQueryClient();

  return (code: string): Country | undefined => {
    return queryClient.getQueryData<Country>(countryKeys.detail(code));
  };
}

/**
 * Get all cached countries
 */
export function useGetCachedCountries() {
  const queryClient = useQueryClient();

  return (): CountryBasic[] | undefined => {
    return queryClient.getQueryData<CountryBasic[]>(countryKeys.lists());
  };
}

export default {
  useCountries,
  useCountry,
  useCountryCharts,
  useCountrySummary,
  useCountrySearch,
  useCountryComparison,
  useTriggerSync,
  usePrefetchCountry,
  usePrefetchCharts,
  useGetCachedCountry,
  useGetCachedCountries,
};
