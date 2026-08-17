import { ContinentPage } from '../../../components/continent/ContinentPage';
import { CONTINENTS } from '../../../data/continents';

const config = CONTINENTS.find((c) => c.name === 'Africa')!;

export function Africa() {
  return <ContinentPage config={config} />;
}
