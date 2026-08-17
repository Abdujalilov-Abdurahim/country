import { Search, X } from 'lucide-react';

interface CountrySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CountrySearch({ value, onChange, placeholder = "Davlat nomini kiriting..." }: CountrySearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
        aria-label="Davlatlarni qidirish"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Tozalash">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
