import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ContinentConfig, Country } from '../../types/country';
import { useCountriesByRegion } from '../../hooks/useCountries';
import { CountryGrid } from '../country/CountryGrid';
import { CountrySearch } from '../country/CountrySearch';
import { CountryFilter } from '../country/CountryFilter';
import type { SortOption } from '../country/CountryFilter';
import { CountryStats } from '../country/CountryStats';
import { ErrorState } from '../ui/ErrorState';
import { useDebounce } from '../../hooks/useDebounce';

interface ContinentPageProps {
  config: ContinentConfig;
  filterFn?: (country: Country) => boolean;
}

function sortCountries(countries: Country[], sort: SortOption): Country[] {
  return [...countries].sort((a, b) => {
    switch (sort) {
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'population-desc': return b.population - a.population;
      case 'population-asc': return a.population - b.population;
      case 'area-desc': return (b.area || 0) - (a.area || 0);
      case 'area-asc': return (a.area || 0) - (b.area || 0);
      default: return 0;
    }
  });
}

export function ContinentPage({ config, filterFn }: ContinentPageProps) {
  const { countries: rawCountries, loading, error, retry } = useCountriesByRegion(config.region);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const debouncedSearch = useDebounce(search, 250);

  const baseCountries = useMemo(() => {
    return filterFn ? rawCountries.filter(filterFn) : rawCountries;
  }, [rawCountries, filterFn]);

  const countries = useMemo(() => {
    let list = baseCountries;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.capital && c.capital.toLowerCase().includes(q)) ||
          c.alpha2Code.toLowerCase() === q
      );
    }
    return sortCountries(list, sortBy);
  }, [baseCountries, debouncedSearch, sortBy]);

  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <div className="min-h-screen">
      <div className={`bg-gradient-to-br ${config.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-6xl mb-4">{config.icon}</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{config.nameUz}</h1>
            <p className="text-white/80 text-lg max-w-2xl mb-6">{config.description}</p>
            <div className="flex flex-wrap gap-3">
              {config.facts.map((fact) => (
                <span key={fact} className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full font-medium">{fact}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!loading && baseCountries.length > 0 && (
          <CountryStats countries={baseCountries} continentName={config.nameUz} />
        )}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <CountrySearch value={search} onChange={setSearch} placeholder={`${config.nameUz}da davlat qidirish...`} />
          </div>
          <CountryFilter sortBy={sortBy} onSortChange={setSortBy} totalCount={baseCountries.length} filteredCount={countries.length} />
        </div>
        <CountryGrid countries={countries} loading={loading} emptyMessage="Bu qit'ada davlat topilmadi." />
      </div>
    </div>
  );
}
