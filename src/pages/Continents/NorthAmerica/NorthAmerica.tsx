import { ContinentPage } from '../../../components/continent/ContinentPage';
import { CONTINENTS } from '../../../data/continents';
import type { Country } from '../../../types/country';

const config = CONTINENTS.find((c) => c.name === 'North America')!;
const NORTH_AMERICA_SUBREGIONS = ['Northern America', 'Central America', 'Caribbean'];

function filterFn(country: Country): boolean {
  return Boolean(country.subregion && NORTH_AMERICA_SUBREGIONS.includes(country.subregion));
}

export function NorthAmerica() {
  return <ContinentPage config={config} filterFn={filterFn} />;
}
