import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, MapPin, Users, Globe2, DollarSign, ExternalLink, BarChart2 } from 'lucide-react';
import { useCountry } from '../../hooks/useCountries';
import { useAppContext } from '../../hooks/useAppContext';
import { CountryDetailSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatPopulation, formatArea, getCallingCode, getCurrencyInfo, getLanguages } from '../../services/countriesApi';

function InfoRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-sm text-slate-400 sm:w-44 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white">{value || "Ma'lumot mavjud emas"}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
        <Icon className="w-5 h-5 text-primary-600" />{title}
      </h2>
      {children}
    </motion.div>
  );
}

export function CountryDetail() {
  const { countryCode } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();
  const { country, loading, error, retry } = useCountry(countryCode || '');
  const { isFavorite, toggleFavorite } = useAppContext();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (country) document.title = `${country.name} — World Countries`;
    return () => { document.title = 'World Countries'; };
  }, [country]);

  if (loading) return <div className="pt-8"><CountryDetailSkeleton /></div>;
  if (error || !country) return <div className="pt-16"><ErrorState message={error || "Davlat topilmadi."} onRetry={retry} /></div>;

  const fav = isFavorite(country.alpha2Code);
  const density = country.populationDensity
    ?? (country.area > 0 ? country.population / country.area : undefined);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Orqaga
        </button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-full md:w-72 h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-lg">
                {!imgError ? (
                  <img src={country.flags.svg || country.flags.png} alt={`${country.name} bayrog'i`}
                    className="w-full h-full object-cover" onError={() => setImgError(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">{country.flag}</div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{country.name}</h1>
                  {country.nativeName && country.nativeName !== country.name && (
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{country.nativeName}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleFavorite(country.alpha2Code)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition-all ${fav ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-red-300 hover:text-red-500'}`}>
                    <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                    {fav ? 'Saqlangan' : 'Saqlash'}
                  </button>
                  {country.maps?.googleMaps && (
                    <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-primary-600 hover:text-primary-600 text-sm font-medium transition-all">
                      <ExternalLink className="w-4 h-4" />Xarita
                    </a>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mt-4">
                <InfoRow label="Qit'a" value={country.region} />
                <InfoRow label="Mintaqa" value={country.subregion || "Ma'lumot mavjud emas"} />
                <InfoRow label="Poytaxt" value={country.capital || "Ma'lumot mavjud emas"} />
                <InfoRow label="Aholi" value={formatPopulation(country.population)} />
                <InfoRow label="Maydon" value={formatArea(country.area)} />
                <InfoRow label="Kod" value={`${country.alpha2Code} / ${country.alpha3Code}`} />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Umumiy ma'lumot" icon={Globe2}>
            <InfoRow label="Nomi" value={country.name} />
            <InfoRow label="Poytaxt" value={country.capital || "Ma'lumot mavjud emas"} />
            <InfoRow label="Qit'a" value={country.region} />
            <InfoRow label="Mintaqa" value={country.subregion || "Ma'lumot mavjud emas"} />
            <InfoRow label="Internet TLD" value={country.topLevelDomain?.join(', ') || "Ma'lumot mavjud emas"} />
            <InfoRow label="Telefon kodi" value={getCallingCode(country)} />
            <InfoRow label="Xalq nomi (demonim)" value={country.demonym || "Ma'lumot mavjud emas"} />
          </Section>

          <Section title="Aholi va tillar" icon={Users}>
            <InfoRow label="Aholi" value={formatPopulation(country.population)} />
            <InfoRow label="Aholi zichligi" value={density !== undefined ? `${density.toFixed(1)} kishi/km²` : "Ma'lumot mavjud emas"} />
            <InfoRow label="Tillar" value={getLanguages(country)} />
          </Section>

          <Section title="Geografiya" icon={MapPin}>
            <InfoRow label="Maydon" value={formatArea(country.area)} />
            <InfoRow label="Koordinatlar" value={country.latlng ? `${country.latlng[0].toFixed(2)}°, ${country.latlng[1].toFixed(2)}°` : "Ma'lumot mavjud emas"} />
            <InfoRow label="Vaqt zonasi" value={country.timezones?.join(', ') || "Ma'lumot mavjud emas"} />
            {country.borders && country.borders.length > 0 && (
              <div className="py-2.5">
                <span className="text-sm text-slate-400 block mb-2">Qo'shni davlatlar</span>
                <div className="flex flex-wrap gap-2">
                  {country.borders.map((code) => (
                    <Link key={code} to={`/country/${code.toLowerCase()}`}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-mono font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
                      {code}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {(!country.borders || country.borders.length === 0) && (
              <InfoRow label="Qo'shni davlatlar" value="Ma'lumot mavjud emas" />
            )}
          </Section>

          <Section title="Iqtisodiyot" icon={DollarSign}>
            <InfoRow label="Valyuta" value={getCurrencyInfo(country)} />
            <InfoRow label="Telefon kodi" value={getCallingCode(country)} />
            <div className="py-2.5">
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                GDP ma'lumotlari ushbu API orqali taqdim etilmaydi. Aniq iqtisodiy ma'lumotlar uchun Jahon banki ma'lumotlarini ko'ring.
              </p>
            </div>
          </Section>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="card p-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Bu davlatni boshqasi bilan solishtiring</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Aholi, maydon va boshqa ko'rsatkichlarni taqqoslang</p>
          </div>
          <Link to={`/compare?country=${country.alpha2Code}`} className="btn-primary flex items-center gap-2 flex-shrink-0">
            <BarChart2 className="w-4 h-4" />Taqqoslash
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
