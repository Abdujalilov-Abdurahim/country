import { ContinentPage } from '../../../components/continent/ContinentPage';
import { CONTINENTS } from '../../../data/continents';
import type { Country } from '../../../types/country';

const config = CONTINENTS.find((c) => c.name === 'South America')!;

function filterFn(country: Country): boolean {
  return country.subregion === 'South America';
}

export function SouthAmerica() {
  return <ContinentPage config={config} filterFn={filterFn} />;
}
