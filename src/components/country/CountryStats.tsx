import { Users, Globe2, TrendingUp } from 'lucide-react';
import type { Country } from '../../types/country';
import { formatPopulation } from '../../services/countriesApi';

interface CountryStatsProps {
  countries: Country[];
  continentName: string;
}

export function CountryStats({ countries, continentName: _ }: CountryStatsProps) {
  const totalPop = countries.reduce((sum, c) => sum + c.population, 0);
  const largest = [...countries].sort((a, b) => b.area - a.area)[0];
  const mostPopulated = [...countries].sort((a, b) => b.population - a.population)[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="card p-4 text-center">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
          <Globe2 className="w-5 h-5 text-primary-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{countries.length}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Davlatlar</div>
      </div>
      <div className="card p-4 text-center">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
          <Users className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatPopulation(totalPop)}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Jami aholi</div>
      </div>
      <div className="card p-4 text-center">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-white truncate">{largest?.name || '—'}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Eng katta</div>
      </div>
      <div className="card p-4 text-center">
        <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
          <Users className="w-5 h-5 text-violet-600" />
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-white truncate">{mostPopulated?.name || '—'}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Eng ko'p aholi</div>
      </div>
    </div>
  );
}
