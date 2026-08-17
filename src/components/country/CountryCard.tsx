import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Users, Globe2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Country } from '../../types/country';
import { formatPopulation } from '../../services/countriesApi';
import { useAppContext } from '../../hooks/useAppContext';

interface CountryCardProps {
  country: Country;
  index?: number;
}

export function CountryCard({ country, index = 0 }: CountryCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAppContext();
  const [imgError, setImgError] = useState(false);
  const fav = isFavorite(country.alpha2Code);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      className="card overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-primary-600/10 hover:-translate-y-1 transition-all duration-300"
      onClick={() => navigate(`/country/${country.alpha2Code.toLowerCase()}`)}
    >
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 h-44">
        {!imgError ? (
          <img
            src={country.flags.svg || country.flags.png}
            alt={`${country.name} bayrog'i`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">{country.flag}</div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(country.alpha2Code); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${fav ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-red-500'}`}
          aria-label={fav ? 'Sevimlilardan olib tashlash' : "Sevimlilarga qo'shish"}
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
        </button>
        <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 text-xs font-mono font-medium px-2 py-1 rounded-md">
          {country.alpha2Code}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1 group-hover:text-primary-600 transition-colors">{country.name}</h3>
        {country.nativeName && country.nativeName !== country.name && (
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 truncate">{country.nativeName}</p>
        )}
        <div className="space-y-1.5 mb-4">
          {country.capital && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{country.capital}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{formatPopulation(country.population)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{country.subregion || country.region}</span>
          </div>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200"
          onClick={(e) => { e.stopPropagation(); navigate(`/country/${country.alpha2Code.toLowerCase()}`); }}
        >
          Ko'proq ma'lumot <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
