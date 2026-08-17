import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Ma'lumotlarni yuklashda xatolik yuz berdi.", onRetry }: ErrorStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Xatolik yuz berdi</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />Qayta urinish
        </button>
      )}
    </motion.div>
  );
}

export function EmptyState({ message = "Hech qanday natija topilmadi." }: { message?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Natija topilmadi</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">{message}</p>
    </motion.div>
  );
}
