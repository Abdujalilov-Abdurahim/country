import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, XCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { getAllCountries } from '../../services/countriesApi';
import type { Country } from '../../types/country';

type QuizType = 'flag' | 'capital' | 'currency' | 'continent';

interface Question {
  id: number; type: QuizType; prompt: string;
  flagUrl?: string; correct: string; options: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(countries: Country[], count = 10): Question[] {
  const eligible = countries.filter((c) => c.population > 100000 && c.capital && c.flags.svg);
  const pool = shuffle(eligible).slice(0, 40);
  const questions: Question[] = [];
  const types: QuizType[] = ['flag', 'capital', 'currency', 'continent'];

  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const country = pool[i];
    const others = pool.filter((_, idx) => idx !== i);
    const type = types[i % types.length];

    if (type === 'flag') {
      const opts = shuffle([country.name, ...shuffle(others).slice(0, 3).map((c) => c.name)]);
      questions.push({ id: i, type, prompt: "Bu qaysi davlatning bayrog'i?", flagUrl: country.flags.svg, correct: country.name, options: opts });
    } else if (type === 'capital' && country.capital) {
      const validOthers = others.filter((c) => c.capital);
      const opts = shuffle([country.capital, ...shuffle(validOthers).slice(0, 3).map((c) => c.capital!)]);
      questions.push({ id: i, type, prompt: `"${country.name}" davlatining poytaxti qaysi?`, correct: country.capital, options: opts });
    } else if (type === 'currency' && country.currencies && country.currencies.length > 0) {
      const currName = country.currencies[0].name;
      const validOthers = others.filter((c) => c.currencies && c.currencies.length > 0);
      const opts = shuffle([currName, ...shuffle(validOthers).slice(0, 3).map((c) => c.currencies![0].name)]);
      questions.push({ id: i, type, prompt: `"${country.name}" davlatining valyutasi qaysi?`, correct: currName, options: opts });
    } else {
      const regionMap: Record<string, string> = { Europe: 'Yevropa', Asia: 'Osiyo', Africa: 'Afrika', Americas: 'Amerika', Oceania: 'Okeaniya' };
      const regionUz = regionMap[country.region] || country.region;
      const allRegions = ['Yevropa', 'Osiyo', 'Afrika', 'Amerika', 'Okeaniya'].filter((r) => r !== regionUz);
      const opts = shuffle([regionUz, ...shuffle(allRegions).slice(0, 3)]);
      questions.push({ id: i, type, prompt: `"${country.name}" qaysi qit'ada joylashgan?`, correct: regionUz, options: opts });
    }
  }
  return questions;
}

export function Quiz() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<boolean[]>([]);

  const loadQuestions = useCallback((countryList: Country[]) => {
    setQuestions(generateQuestions(countryList, 10));
    setCurrent(0); setSelected(null); setScore(0); setDone(false); setResults([]);
  }, []);

  useEffect(() => {
    getAllCountries().then((data) => { setCountries(data); loadQuestions(data); setLoading(false); }).catch(() => setLoading(false));
  }, [loadQuestions]);

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === questions[current].correct;
    if (correct) setScore((s) => s + 1);
    setResults((r) => [...r, correct]);
    setTimeout(() => {
      if (current + 1 >= questions.length) setDone(true);
      else { setCurrent((c) => c + 1); setSelected(null); }
    }, 1200);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Savollar tayyorlanmoqda...</p>
      </div>
    </div>
  );

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-10 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '🎯' : '📚'}</div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{pct >= 80 ? 'Ajoyib natija!' : pct >= 50 ? 'Yaxshi urinish!' : "Ko'proq o'rganing!"}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {questions.length} ta savoldan <span className="font-bold text-slate-900 dark:text-white">{score}</span> ta to'g'ri javob
          </p>
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="10" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="10"
                strokeDasharray={`${(pct / 100) * 339.3} 339.3`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{pct}%</span>
            </div>
          </div>
          <div className="flex gap-2 mb-6 justify-center">
            {results.map((r, i) => (
              <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center ${r ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                {r ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
              </div>
            ))}
          </div>
          <button onClick={() => loadQuestions(countries)} className="btn-primary flex items-center gap-2 mx-auto">
            <RefreshCw className="w-4 h-4" />Qayta o'ynash
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">{current + 1} / {questions.length}</span>
          <span className="text-sm font-semibold text-primary-600">Ball: {score}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-8">
          <div className="bg-primary-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <div className="card p-6 mb-6">
              {q.flagUrl && (
                <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-700">
                  <img src={q.flagUrl} alt="Bayroq" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{q.prompt}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((option) => {
                let state = 'idle';
                if (selected) { if (option === q.correct) state = 'correct'; else if (option === selected) state = 'wrong'; }
                return (
                  <button key={option} onClick={() => handleAnswer(option)} disabled={!!selected}
                    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl border-2 font-medium text-left transition-all duration-200 ${
                      state === 'correct' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : state === 'wrong' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400'}`}>
                    <span>{option}</span>
                    {state === 'correct' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    {state === 'wrong' && <XCircle className="w-5 h-5 text-red-500" />}
                    {state === 'idle' && <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-500" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
