import { ContinentPage } from '../../../components/continent/ContinentPage';
import { CONTINENTS } from '../../../data/continents';

const config = CONTINENTS.find((c) => c.name === 'Europe')!;

export function Europe() {
  return <ContinentPage config={config} />;
}
