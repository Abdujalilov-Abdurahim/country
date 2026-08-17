import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, X, ChevronDown } from 'lucide-react';
import type { Country } from '../../types/country';
import { getAllCountries, getCountryByCode, formatPopulation, formatArea, getCurrencyInfo, getLanguages, getCallingCode } from '../../services/countriesApi';
import { useDebounce } from '../../hooks/useDebounce';

const MAX_COMPARE = 3;

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700">
      <td className="py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 w-36 sm:w-48">{label}</td>
      {values.map((val, i) => (
        <td key={i} className="py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white text-center">
          {val || <span className="text-slate-300 dark:text-slate-600 font-normal italic">—</span>}
        </td>
      ))}
    </tr>
  );
}

function CountrySelector({ onSelect, selected }: { onSelect: (c: Country) => void; selected: string[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Country[]>([]);
  const [open, setOpen] = useState(false);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => { getAllCountries().then(setAllCountries).catch(() => {}); }, []);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    const q = debouncedQuery.toLowerCase();
    setResults(allCountries.filter((c) => !selected.includes(c.alpha2Code) && (c.name.toLowerCase().includes(q) || c.alpha2Code.toLowerCase() === q)).slice(0, 8));
  }, [debouncedQuery, allCountries, selected]);

  return (
    <div className="relative">
      <div className="flex items-center border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-4 min-w-[200px]">
        <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} placeholder="Davlat qidirish..."
          className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none" />
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
          {results.map((c) => (
            <button key={c.alpha2Code} onClick={() => { onSelect(c); setQuery(''); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors">
              <img src={c.flags.svg || c.flags.png} alt={c.name} className="w-7 h-5 object-cover rounded shadow-sm flex-shrink-0" />
              <span className="text-sm text-slate-900 dark:text-white truncate">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Compare() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<Country[]>([]);

  useEffect(() => {
    const code = searchParams.get('country');
    if (code) {
      getCountryByCode(code).then((c) => setSelected([c])).catch(() => {});
    }
  }, [searchParams]);

  const addCountry = useCallback((country: Country) => {
    setSelected((prev) => prev.length < MAX_COMPARE ? [...prev, country] : prev);
  }, []);

  const removeCountry = useCallback((code: string) => {
    setSelected((prev) => prev.filter((c) => c.alpha2Code !== code));
  }, []);

  const selectedCodes = selected.map((c) => c.alpha2Code);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-2">
            <BarChart2 className="w-8 h-8 text-primary-600" />Davlatlarni taqqoslash
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">2–3 ta davlatni tanlang va ularning ko'rsatkichlarini solishtiring.</p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-8 items-start">
          {selected.map((country) => (
            <div key={country.alpha2Code} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-sm">
              <img src={country.flags.svg || country.flags.png} alt={country.name} className="w-8 h-5 object-cover rounded shadow-sm" />
              <span className="font-medium text-slate-900 dark:text-white text-sm">{country.name}</span>
              <button onClick={() => removeCountry(country.alpha2Code)} className="text-slate-300 hover:text-red-500 transition-colors ml-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {selected.length < MAX_COMPARE && <CountrySelector onSelect={addCountry} selected={selectedCodes} />}
        </div>

        {selected.length >= 2 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50">
                    <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-36 sm:w-48">Ko'rsatkich</th>
                    {selected.map((c) => (
                      <th key={c.alpha2Code} className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <img src={c.flags.svg || c.flags.png} alt={c.name} className="w-10 h-6 object-cover rounded shadow-sm" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{c.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <CompareRow label="Poytaxt" values={selected.map((c) => c.capital || '—')} />
                  <CompareRow label="Qit'a" values={selected.map((c) => c.region)} />
                  <CompareRow label="Mintaqa" values={selected.map((c) => c.subregion || '—')} />
                  <CompareRow label="Aholi" values={selected.map((c) => formatPopulation(c.population))} />
                  <CompareRow label="Maydon" values={selected.map((c) => formatArea(c.area))} />
                  <CompareRow label="Aholi zichligi" values={selected.map((c) => {
                    const d = c.populationDensity ?? (c.area > 0 ? c.population / c.area : undefined);
                    return d !== undefined ? `${d.toFixed(1)}/km²` : '—';
                  })} />
                  <CompareRow label="Valyuta" values={selected.map((c) => getCurrencyInfo(c))} />
                  <CompareRow label="Tillar" values={selected.map((c) => getLanguages(c))} />
                  <CompareRow label="Vaqt zonasi" values={selected.map((c) => c.timezones?.[0] || '—')} />
                  <CompareRow label="Internet TLD" values={selected.map((c) => c.topLevelDomain?.join(', ') || '—')} />
                  <CompareRow label="Telefon kodi" values={selected.map((c) => getCallingCode(c))} />
                  <CompareRow label="Davlat kodi" values={selected.map((c) => `${c.alpha2Code} / ${c.alpha3Code}`)} />
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Kamida 2 ta davlat tanlang</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">Yuqoridagi qidiruv orqali davlatlarni tanlang va ularni ko'rsatkichlari bo'yicha solishtiring.</p>
          </div>
        )}
      </div>
    </div>
  );
}
