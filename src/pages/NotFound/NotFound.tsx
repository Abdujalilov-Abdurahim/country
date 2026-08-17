import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Globe2 } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-8xl mb-6">🌍</div>
        <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-3">Sahifa topilmadi</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">Siz qidirgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => navigate('/')} className="btn-primary flex items-center gap-2"><Home className="w-4 h-4" />Bosh sahifa</button>
          <button onClick={() => navigate('/asia')} className="btn-secondary flex items-center gap-2"><Globe2 className="w-4 h-4" />Davlatlarni ko'rish</button>
        </div>
      </motion.div>
    </div>
  );
}
