import { useState, useEffect, useCallback } from 'react';
import type { Country } from '../types/country';
import { getAllCountries, getCountriesByRegion, getCountryByCode } from '../services/countriesApi';

export function useAllCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true); setError(null);
    getAllCountries()
      .then((data) => { setCountries(data); setLoading(false); })
      .catch(() => { setError("Ma'lumotlarni yuklashda xatolik yuz berdi."); setLoading(false); });
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { countries, loading, error, retry: fetch };
}

export function useCountriesByRegion(region: string) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true); setError(null);
    getCountriesByRegion(region)
      .then((data) => { setCountries(data); setLoading(false); })
      .catch(() => { setError("Ma'lumotlarni yuklashda xatolik yuz berdi."); setLoading(false); });
  }, [region]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { countries, loading, error, retry: fetchData };
}

export function useCountry(code: string) {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    if (!code) return;
    setLoading(true); setError(null);
    getCountryByCode(code)
      .then((data) => { setCountry(data); setLoading(false); })
      .catch(() => { setError("Davlat ma'lumotlarini yuklashda xatolik yuz berdi."); setLoading(false); });
  }, [code]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { country, loading, error, retry: fetchData };
}
