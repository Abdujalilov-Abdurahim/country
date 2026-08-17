import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'world-countries-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const addFavorite = useCallback((code: string) => {
    setFavorites((prev) => prev.includes(code) ? prev : [...prev, code]);
  }, []);

  const removeFavorite = useCallback((code: string) => {
    setFavorites((prev) => prev.filter((c) => c !== code));
  }, []);

  const toggleFavorite = useCallback((code: string) => {
    setFavorites((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }, []);

  const isFavorite = useCallback((code: string) => favorites.includes(code), [favorites]);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}
