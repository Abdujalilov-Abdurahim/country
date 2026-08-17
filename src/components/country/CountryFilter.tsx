import { SlidersHorizontal } from 'lucide-react';

export type SortOption = 'name-asc' | 'name-desc' | 'population-desc' | 'population-asc' | 'area-desc' | 'area-asc';

interface CountryFilterProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}

export function CountryFilter({ sortBy, onSortChange, totalCount, filteredCount }: CountryFilterProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-900 dark:text-white">{filteredCount}</span>
        {' / '}
        <span>{totalCount}</span> ta davlat
      </p>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 cursor-pointer"
          aria-label="Saralash"
        >
          <option value="name-asc">A → Z</option>
          <option value="name-desc">Z → A</option>
          <option value="population-desc">Ko'p aholi</option>
          <option value="population-asc">Kam aholi</option>
          <option value="area-desc">Katta maydon</option>
          <option value="area-asc">Kichik maydon</option>
        </select>
      </div>
    </div>
  );
}
