import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Moon, Sun, Heart, Menu, X, Globe2, Map, BarChart2, HelpCircle, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalSearch } from '../search/GlobalSearch';
import { useAppContext } from '../../hooks/useAppContext';
import { getRandomCountry } from '../../services/countriesApi';

const navLinks = [
  { to: '/', label: 'Bosh sahifa', exact: true },
  { to: '/europe', label: 'Yevropa' },
  { to: '/asia', label: 'Osiyo' },
  { to: '/africa', label: 'Afrika' },
  { to: '/north-america', label: 'Shim. Amerika' },
  { to: '/south-america', label: 'Jan. Amerika' },
  { to: '/oceania', label: 'Okeaniya' },
];

const toolLinks = [
  { to: '/map', label: 'Xarita', icon: Map },
  { to: '/compare', label: 'Taqqoslash', icon: BarChart2 },
  { to: '/quiz', label: 'Viktorina', icon: HelpCircle },
];

export function Navbar() {
  const { isDark, toggleDark, favorites } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleRandom = async () => {
    setRandomLoading(true);
    try {
      const country = await getRandomCountry();
      navigate(`/country/${country.alpha2Code.toLowerCase()}`);
    } catch { /* ignore */ } finally {
      setRandomLoading(false);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-slate-200 dark:border-slate-700 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                <Globe2 className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block">World Countries</span>
            </Link>

            <nav className="hidden xl:flex items-center gap-1" aria-label="Asosiy navigatsiya">
              {navLinks.map(({ to, label, exact }) => (
                <NavLink key={to} to={to} end={exact}
                  className={({ isActive }) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  {label}
                </NavLink>
              ))}
              {toolLinks.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:block"><GlobalSearch /></div>
              <button onClick={handleRandom} disabled={randomLoading}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                aria-label="Tasodifiy davlat">
                {randomLoading ? <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /> : <Shuffle className="w-4 h-4" />}
              </button>
              <NavLink to="/favorites"
                className={({ isActive }) => `relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${isActive ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                aria-label="Sevimlilar">
                <Heart className="w-4 h-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </NavLink>
              <button onClick={toggleDark}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={isDark ? "Yorug' rejim" : 'Tungi rejim'}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => setMobileOpen(true)}
                className="xl:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Menyu">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 xl:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-50 xl:hidden overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">Menyu</span>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4"><GlobalSearch /></div>
              <nav className="px-4 pb-4 space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Navigatsiya</p>
                {navLinks.map(({ to, label, exact }) => (
                  <NavLink key={to} to={to} end={exact} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    {label}
                  </NavLink>
                ))}
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-4">Vositalar</p>
                {toolLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <Icon className="w-4 h-4" />{label}
                  </NavLink>
                ))}
                <NavLink to="/favorites" onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <Heart className="w-4 h-4" />Sevimlilar
                  {favorites.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{favorites.length}</span>}
                </NavLink>
                <button onClick={handleRandom} disabled={randomLoading}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
                  {randomLoading ? <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /> : <Shuffle className="w-4 h-4" />}
                  Tasodifiy davlat
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
