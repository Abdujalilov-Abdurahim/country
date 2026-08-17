import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Shuffle, Globe2, Users, Building2, DollarSign, Languages } from 'lucide-react';
import { CONTINENTS } from '../../data/continents';
import { getRandomCountry } from '../../services/countriesApi';
import { GlobalSearch } from '../../components/search/GlobalSearch';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 1800 / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const STATS = [
  { icon: Globe2, label: 'Davlatlar', value: 195, suffix: '+', color: 'text-primary-600' },
  { icon: Building2, label: "Qit'alar", value: 7, suffix: '', color: 'text-emerald-600' },
  { icon: Users, label: 'Jahon aholisi (mlrd)', value: 8, suffix: 'B+', color: 'text-violet-600' },
  { icon: DollarSign, label: 'Valyutalar', value: 160, suffix: '+', color: 'text-amber-600' },
  { icon: Languages, label: 'Tillar', value: 7000, suffix: '+', color: 'text-rose-600' },
];

export function Home() {
  const navigate = useNavigate();
  const [randomLoading, setRandomLoading] = useState(false);

  const handleRandom = async () => {
    setRandomLoading(true);
    try {
      const country = await getRandomCountry();
      navigate(`/country/${country.alpha2Code.toLowerCase()}`);
    } catch { /* ignore */ } finally { setRandomLoading(false); }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="0.5" />
            <ellipse cx="100" cy="100" rx="50" ry="90" fill="none" stroke="white" strokeWidth="0.5" />
            <ellipse cx="100" cy="100" rx="90" ry="50" fill="none" stroke="white" strokeWidth="0.5" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="white" strokeWidth="0.5" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-600/30 text-primary-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Globe2 className="w-4 h-4" />195+ davlat, bitta platforma
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                Dunyoni <span className="text-gradient">davlatlardan</span> boshlang.
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
                Dunyo davlatlari, geografiyasi, aholisi, tarixi, iqtisodiyoti va boshqa qiziqarli ma'lumotlarni bir joyda o'rganing.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 max-w-md"><GlobalSearch /></div>
              <button onClick={() => navigate('/asia')} className="btn-primary flex items-center justify-center gap-2 text-base">
                Davlatlarni o'rganish <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}>
              <button onClick={handleRandom} disabled={randomLoading}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group">
                {randomLoading
                  ? <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                  : <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />}
                Tasodifiy davlat kashf qiling
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {STATS.map(({ icon: Icon, label, value, suffix, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Continents */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Qit'alar bo'yicha</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Dunyo bo'ylab sayohat qiling. Har bir qit'a o'zining noyob tarixi va madaniyati bilan sizni kutmoqda.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTINENTS.map((continent, i) => (
              <motion.div key={continent.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                onClick={() => navigate(continent.route)}>
                <div className={`h-3 bg-gradient-to-r ${continent.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{continent.icon}</div>
                    <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{continent.facts[0]}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">{continent.nameUz}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{continent.description}</p>
                  <button className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:gap-3 transition-all">
                    Ko'rish <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Random CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="card p-10 bg-gradient-to-br from-primary-600 to-primary-800 border-0 text-white">
            <div className="text-5xl mb-4">🎲</div>
            <h2 className="text-3xl font-bold mb-3">Tasodifiy davlatni kashf eting!</h2>
            <p className="text-primary-100 mb-8 text-lg">Hali bilmagan davlatingizni kashf qiling. Har safar yangi dunyo sizi kutmoqda.</p>
            <button onClick={handleRandom} disabled={randomLoading}
              className="inline-flex items-center gap-3 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-primary-50 transition-colors shadow-xl disabled:opacity-70 text-lg">
              {randomLoading ? <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /> : <Shuffle className="w-5 h-5" />}
              Tasodifiy davlat
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Imkoniyatlar</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🗺️', title: 'Dunyo xaritasi', desc: "Interaktiv xaritada davlatlarni topib, ma'lumot oling", route: '/map' },
              { icon: '📊', title: 'Taqqoslash', desc: "2-3 davlatni ko'rsatkichlari bo'yicha solishtiring", route: '/compare' },
              { icon: '🎓', title: 'Viktorina', desc: "Bayroqlar, poytaxtlar va valyutalar bo'yicha test ishlang", route: '/quiz' },
              { icon: '❤️', title: 'Sevimlilar', desc: "Yoqtirgan davlatlaringizni saqlab, keyinroq ko'ring", route: '/favorites' },
            ].map(({ icon, title, desc, route }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group" onClick={() => navigate(route)}>
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
