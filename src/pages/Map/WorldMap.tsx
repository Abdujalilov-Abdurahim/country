import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map as MapIcon, Search, X } from 'lucide-react';
import { getAllCountries, searchCountries, formatPopulation } from '../../services/countriesApi';
import type { Country } from '../../types/country';
import { useDebounce } from '../../hooks/useDebounce';

const REGION_COLORS: Record<string, string> = {
  Europe: '#3B82F6',
  Asia: '#EF4444',
  Africa: '#F59E0B',
  Americas: '#8B5CF6',
  Oceania: '#06B6D4',
};

const REGION_LABELS: Record<string, string> = {
  Europe: 'Yevropa', Asia: 'Osiyo', Africa: 'Afrika', Americas: 'Amerika', Oceania: 'Okeaniya',
};

export function WorldMap() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Country[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    getAllCountries().then((data) => { setCountries(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return; }
    searchCountries(debouncedQuery).then((data) => setResults(data.slice(0, 6))).catch(() => {});
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-2">
            <MapIcon className="w-8 h-8 text-primary-600" />Dunyo xaritasi
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Davlatlarni qidiring va ularga o'ting.</p>
        </motion.div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Davlat qidirish..."
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          {query && <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-30">
              {results.map((c) => (
                <button key={c.alpha2Code} onClick={() => navigate(`/country/${c.alpha2Code.toLowerCase()}`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-left">
                  <img src={c.flags.svg} alt={c.name} className="w-8 h-5 object-cover rounded shadow-sm" />
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.region} · {c.capital || '—'}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(REGION_COLORS).map(([region, color]) => (
            <div key={region} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{REGION_LABELS[region] || region}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="card p-6">
            {Object.entries(REGION_COLORS).map(([region, color]) => {
              const regionCountries = countries.filter((c) => c.region === region);
              if (!regionCountries.length) return null;
              return (
                <div key={region} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <h3 className="font-semibold text-slate-900 dark:text-white">{REGION_LABELS[region]}</h3>
                    <span className="text-sm text-slate-400">({regionCountries.length} ta davlat)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {regionCountries.map((c) => (
                      <button key={c.alpha2Code} onClick={() => navigate(`/country/${c.alpha2Code.toLowerCase()}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                        style={{ borderColor: color + '40', backgroundColor: color + '10', color }}
                        onMouseEnter={() => setHoveredCountry(c)} onMouseLeave={() => setHoveredCountry(null)}>
                        <img src={c.flags.svg} alt={c.name} className="w-4 h-3 object-cover rounded-sm" />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hoveredCountry && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 card p-4 shadow-2xl flex items-center gap-3 pointer-events-none">
            <img src={hoveredCountry.flags.svg} alt={hoveredCountry.name} className="w-12 h-8 object-cover rounded shadow-sm" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{hoveredCountry.name}</div>
              <div className="text-xs text-slate-400">{hoveredCountry.capital || '—'} · {formatPopulation(hoveredCountry.population)} aholi</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
