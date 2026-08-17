import { ContinentPage } from '../../../components/continent/ContinentPage';
import { CONTINENTS } from '../../../data/continents';

const config = CONTINENTS.find((c) => c.name === 'Asia')!;

export function Asia() {
  return <ContinentPage config={config} />;
}
