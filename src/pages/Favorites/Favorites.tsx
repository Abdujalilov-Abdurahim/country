import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { getCountriesByCodes } from '../../services/countriesApi';
import type { Country } from '../../types/country';
import { CountryCard } from '../../components/country/CountryCard';
import { CountryGridSkeleton } from '../../components/ui/Skeleton';

export function Favorites() {
  const { favorites, toggleFavorite } = useAppContext();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (favorites.length === 0) { setCountries([]); return; }
    setLoading(true);
    getCountriesByCodes(favorites)
      .then((data) => { setCountries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [favorites]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-current" />Sevimli davlatlar
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{favorites.length} ta davlat saqlangan</p>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={() => { if (window.confirm("Barcha sevimlilarni o'chirishni xohlaysizmi?")) favorites.forEach((code) => toggleFavorite(code)); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4" />Hammasini o'chirish
            </button>
          )}
        </motion.div>

        {loading && <CountryGridSkeleton />}

        {!loading && favorites.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sevimlilar bo'sh</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">Davlat kartasidagi yurak belgisini bosib, davlatlarni sevimlilarga qo'shing.</p>
            <button onClick={() => navigate('/')} className="btn-primary">Davlatlarni ko'rish</button>
          </motion.div>
        )}

        {!loading && countries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {countries.map((country, index) => <CountryCard key={country.alpha2Code} country={country} index={index} />)}
          </div>
        )}
      </div>
    </div>
  );
}
