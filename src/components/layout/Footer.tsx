import { Link } from 'react-router-dom';
import { Globe2, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-white mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-white" />
              </div>
              World Countries
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dunyoni o'rganing. Davlatlar, geografiya, aholi va madaniyat haqida har bir ma'lumot shu yerda.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Qit'alar</h3>
            <ul className="space-y-2">
              {[
                { to: '/europe', label: 'Yevropa' },
                { to: '/asia', label: 'Osiyo' },
                { to: '/africa', label: 'Afrika' },
                { to: '/north-america', label: 'Shimoliy Amerika' },
                { to: '/south-america', label: 'Janubiy Amerika' },
                { to: '/oceania', label: 'Okeaniya' },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Vositalar</h3>
            <ul className="space-y-2">
              {[
                { to: '/map', label: '🗺️ Dunyo xaritasi' },
                { to: '/compare', label: '📊 Taqqoslash' },
                { to: '/quiz', label: '🎓 Viktorina' },
                { to: '/favorites', label: '❤️ Sevimlilar' },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Ma'lumot</h3>
            <p className="text-sm text-slate-400 mb-2">
              Barcha davlat ma'lumotlari <strong className="text-slate-300">countries.dev API</strong> orqali olinadi.
            </p>
            <a href="https://countries.dev" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
              countries.dev
            </a>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} World Countries. Ma'lumotlar: countries.dev API</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">Sevgi bilan yaratilgan <Heart className="w-3 h-3 text-red-500 fill-current" /></p>
        </div>
      </div>
    </footer>
  );
}
