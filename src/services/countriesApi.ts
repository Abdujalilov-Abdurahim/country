import axios from 'axios';
import type { Country } from '../types/country';

const BASE_URL = 'https://countries.dev';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

// Single cached "all countries" list — every other lookup derives from this,
// so we only ever hit one real network endpoint.
let allCache: { data: Country[]; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function isCacheValid(): boolean {
  return !!allCache && Date.now() - allCache.timestamp < CACHE_DURATION;
}

function axiosErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || String(err);
  }
  return err instanceof Error ? err.message : String(err);
}

export async function getAllCountries(): Promise<Country[]> {
  if (isCacheValid()) return allCache!.data;
  try {
    const res = await api.get<Country[]>('/countries', { params: { full: true } });
    const sorted = [...res.data].sort((a, b) => a.name.localeCompare(b.name));
    allCache = { data: sorted, timestamp: Date.now() };
    return sorted;
  } catch (err) {
    throw new Error('Failed to fetch countries: ' + axiosErrorMessage(err));
  }
}

export async function getCountryByCode(code: string): Promise<Country> {
  try {
    const all = await getAllCountries();
    const lower = code.toLowerCase();
    const found = all.find(
      (c) => c.alpha2Code.toLowerCase() === lower || c.alpha3Code.toLowerCase() === lower
    );
    if (found) return found;

    // Fallback: not in the cached list (shouldn't normally happen) — ask the API directly.
    const res = await api.get<Country>(`/alpha/${code}`, { params: { full: true } });
    return res.data;
  } catch (err) {
    throw new Error('Failed to fetch country: ' + axiosErrorMessage(err));
  }
}

export async function getCountriesByRegion(region: string): Promise<Country[]> {
  try {
    const all = await getAllCountries();
    return all
      .filter((c) => c.region.toLowerCase() === region.toLowerCase())
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    throw new Error('Failed to fetch countries by region: ' + axiosErrorMessage(err));
  }
}

export async function searchCountries(query: string): Promise<Country[]> {
  try {
    if (!query.trim()) return [];
    const all = await getAllCountries();
    const q = query.toLowerCase();
    return all.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.alpha2Code.toLowerCase() === q ||
        c.alpha3Code.toLowerCase() === q ||
        (c.capital && c.capital.toLowerCase().includes(q))
    );
  } catch (err) {
    throw new Error('Search failed: ' + axiosErrorMessage(err));
  }
}

export async function getCountriesByCodes(codes: string[]): Promise<Country[]> {
  try {
    if (!codes.length) return [];
    const all = await getAllCountries();
    const lowerCodes = codes.map((c) => c.toLowerCase());
    return all.filter(
      (c) => lowerCodes.includes(c.alpha2Code.toLowerCase()) || lowerCodes.includes(c.alpha3Code.toLowerCase())
    );
  } catch (err) {
    throw new Error('Failed to fetch countries by codes: ' + axiosErrorMessage(err));
  }
}

export async function getRandomCountry(): Promise<Country> {
  try {
    const all = await getAllCountries();
    const eligible = all.filter((c) => c.population > 100000);
    return eligible[Math.floor(Math.random() * eligible.length)];
  } catch (err) {
    throw new Error('Failed to fetch a random country: ' + axiosErrorMessage(err));
  }
}

export function formatPopulation(pop: number): string {
  if (pop >= 1_000_000_000) return `${(pop / 1_000_000_000).toFixed(1)}B`;
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)}K`;
  return pop.toString();
}

export function formatArea(area: number): string {
  return new Intl.NumberFormat().format(Math.round(area)) + ' km²';
}

export function getCallingCode(country: Country): string {
  if (!country.callingCodes || country.callingCodes.length === 0) return "Ma'lumot mavjud emas";
  return `+${country.callingCodes[0]}`;
}

export function getCurrencyInfo(country: Country): string {
  if (!country.currencies || country.currencies.length === 0) return "Ma'lumot mavjud emas";
  return country.currencies.map((c) => `${c.name} (${c.symbol})`).join(', ');
}

export function getLanguages(country: Country): string {
  if (!country.languages || country.languages.length === 0) return "Ma'lumot mavjud emas";
  return country.languages.map((l) => l.name).join(', ');
}
