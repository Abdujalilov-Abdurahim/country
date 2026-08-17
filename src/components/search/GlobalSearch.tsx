import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Country } from '../../types/country';
import { searchCountries } from '../../services/countriesApi';
import { useDebounce } from '../../hooks/useDebounce';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    searchCountries(debouncedQuery)
      .then((data) => { setResults(data.slice(0, 8)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => { setOpen(query.length > 0); }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((country: Country) => {
    setQuery(''); setOpen(false);
    navigate(`/country/${country.alpha2Code.toLowerCase()}`);
  }, [navigate]);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Davlat qidirish..."
          className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-all"
          aria-label="Davlat qidirish"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {loading && <div className="flex items-center justify-center py-8"><div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>}
            {!loading && results.length === 0 && query && (
              <div className="py-8 text-center"><p className="text-slate-400 text-sm">"{query}" bo'yicha natija topilmadi</p></div>
            )}
            {!loading && results.map((country) => (
              <button key={country.alpha2Code} onClick={() => handleSelect(country)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left">
                <img src={country.flags.svg || country.flags.png} alt={country.name} className="w-8 h-5 object-cover rounded shadow-sm flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white text-sm truncate">{country.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {country.capital && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{country.capital}</span>}
                    <span className="flex items-center gap-1"><Globe2 className="w-3 h-3" />{country.region}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-300 dark:text-slate-500 font-mono">{country.alpha2Code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
