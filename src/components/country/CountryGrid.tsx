import type { Country } from '../../types/country';
import { CountryCard } from './CountryCard';
import { CountryGridSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/ErrorState';

interface CountryGridProps {
  countries: Country[];
  loading?: boolean;
  emptyMessage?: string;
}

export function CountryGrid({ countries, loading = false, emptyMessage }: CountryGridProps) {
  if (loading) return <CountryGridSkeleton />;
  if (countries.length === 0) return <EmptyState message={emptyMessage} />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {countries.map((country, index) => (
        <CountryCard key={country.alpha2Code} country={country} index={index} />
      ))}
    </div>
  );
}
