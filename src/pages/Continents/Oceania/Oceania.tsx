import { ContinentPage } from '../../../components/continent/ContinentPage';
import { CONTINENTS } from '../../../data/continents';

const config = CONTINENTS.find((c) => c.name === 'Oceania')!;

export function Oceania() {
  return <ContinentPage config={config} />;
}
