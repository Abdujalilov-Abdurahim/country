import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AppContext } from './hooks/useAppContext';
import { useDarkMode } from './hooks/useDarkMode';
import { useFavorites } from './hooks/useFavorites';
import { Globe2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home/Home').then((m) => ({ default: m.Home })));
const Europe = lazy(() => import('./pages/Continents/Europe/Europe').then((m) => ({ default: m.Europe })));
const Asia = lazy(() => import('./pages/Continents/Asia/Asia').then((m) => ({ default: m.Asia })));
const Africa = lazy(() => import('./pages/Continents/Africa/Africa').then((m) => ({ default: m.Africa })));
const NorthAmerica = lazy(() => import('./pages/Continents/NorthAmerica/NorthAmerica').then((m) => ({ default: m.NorthAmerica })));
const SouthAmerica = lazy(() => import('./pages/Continents/SouthAmerica/SouthAmerica').then((m) => ({ default: m.SouthAmerica })));
const Oceania = lazy(() => import('./pages/Continents/Oceania/Oceania').then((m) => ({ default: m.Oceania })));
const CountryDetail = lazy(() => import('./pages/Country/CountryDetail').then((m) => ({ default: m.CountryDetail })));
const WorldMap = lazy(() => import('./pages/Map/WorldMap').then((m) => ({ default: m.WorldMap })));
const Compare = lazy(() => import('./pages/Compare/Compare').then((m) => ({ default: m.Compare })));
const Favorites = lazy(() => import('./pages/Favorites/Favorites').then((m) => ({ default: m.Favorites })));
const Quiz = lazy(() => import('./pages/Quiz/Quiz').then((m) => ({ default: m.Quiz })));
const NotFound = lazy(() => import('./pages/NotFound/NotFound').then((m) => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
          <Globe2 className="w-6 h-6 text-white" />
        </div>
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  return (
    <AppContext.Provider value={{ isDark, toggleDark, favorites, toggleFavorite, isFavorite }}>
      <BrowserRouter>
        <MainLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/europe" element={<Europe />} />
              <Route path="/asia" element={<Asia />} />
              <Route path="/africa" element={<Africa />} />
              <Route path="/north-america" element={<NorthAmerica />} />
              <Route path="/south-america" element={<SouthAmerica />} />
              <Route path="/oceania" element={<Oceania />} />
              <Route path="/country/:countryCode" element={<CountryDetail />} />
              <Route path="/map" element={<WorldMap />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
