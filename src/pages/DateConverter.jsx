import React, { useState } from "react";
import NepaliDate from "nepali-date-converter";
import { 
  ArrowRightLeft, 
  Calendar, 
  RefreshCw, 
  Copy, 
  CheckCircle2,
  CalendarDays,
  ArrowRight
} from "lucide-react";
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";

const NEPALI_MONTHS = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", 
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const AD_MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const DAYS_RANGE = Array.from({ length: 32 }, (_, i) => i + 1);

// Helper to sanitize Devanagari numbers
const convertDevanagariToEnglish = (str) => {
  if (!str) return "";
  const unicodeMap = {
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9"
  };
  return str.toString().split("").map(char => unicodeMap[char] || char).join("");
};

export default function DateConverter() {
  const now = new Date();
  const todayBS = new NepaliDate();

  const [adYear, setAdYear] = useState(now.getFullYear().toString());
  const [adMonth, setAdMonth] = useState((now.getMonth() + 1).toString());
  const [adDay, setAdDay] = useState(now.getDate().toString());

  const [bsYear, setBsYear] = useState(todayBS.getYear().toString());
  const [bsMonth, setBsMonth] = useState((todayBS.getMonth() + 1).toString());
  const [bsDay, setBsDay] = useState(todayBS.getDate().toString());
  
  const [results, setResults] = useState({ adToBs: null, bsToAd: null });
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const convertAdToBs = () => {
    try {
      const year = parseInt(adYear);
      const month = parseInt(adMonth) - 1;
      const day = parseInt(adDay);
      
      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) throw new Error("Invalid AD Date");
      
      const nepaliDate = new NepaliDate(date);
      setResults(prev => ({ 
        ...prev, 
        adToBs: {
          year: nepaliDate.getYear(),
          month: nepaliDate.getMonth() + 1,
          day: nepaliDate.getDate(),
          monthName: NEPALI_MONTHS[nepaliDate.getMonth()],
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' })
        } 
      }));
    } catch (e) {
      alert("Invalid Date Selection");
    }
  };

  const convertBsToAd = () => {
    try {
      const year = parseInt(convertDevanagariToEnglish(bsYear));
      const month = parseInt(bsMonth) - 1;
      const day = parseInt(convertDevanagariToEnglish(bsDay));
      
      const nepaliDate = new NepaliDate(year, month, day);
      const adDateObj = nepaliDate.toJsDate();
      
      setResults(prev => ({ 
        ...prev, 
        bsToAd: {
          year: adDateObj.getFullYear(),
          month: adDateObj.getMonth() + 1,
          day: adDateObj.getDate(),
          monthName: AD_MONTHS[adDateObj.getMonth()],
          dayName: adDateObj.toLocaleDateString('en-US', { weekday: 'long' })
        } 
      }));
    } catch (e) {
      alert("Invalid Nepali Date Selection");
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-7xl mx-auto px-6">
        <div>
           <BackButton />
           <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-6">Date Converter</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Millisecond-accurate conversion between Gregorian (AD) & Bikram Sambat (BS)</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* AD to BS Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Gregorian to Nepali</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">English (AD) ➔ Bikram Sambat (BS)</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Year</label>
                <select 
                  value={adYear}
                  onChange={(e) => setAdYear(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {Array.from({ length: 150 }, (_, i) => 1944 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Month</label>
                <select 
                  value={adMonth}
                  onChange={(e) => setAdMonth(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {AD_MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Day</label>
                <select 
                  value={adDay}
                  onChange={(e) => setAdDay(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {DAYS_RANGE.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={convertAdToBs}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              CONVERT TO NEPALI
            </button>

            {results.adToBs && (
              <div className="bg-blue-600 text-white rounded-[2rem] p-8 relative overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4">
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-2 opacity-70">Nepali Date Result</p>
                    <h3 className="text-3xl font-black tracking-tight">
                      {results.adToBs.year} {results.adToBs.monthName} {results.adToBs.day}
                    </h3>
                    <p className="text-blue-100 font-bold text-sm mt-1">{results.adToBs.dayName}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(`${results.adToBs.year} ${results.adToBs.monthName} ${results.adToBs.day}`, 'adToBs')}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors active:scale-90"
                  >
                    {copied === 'adToBs' ? <CheckCircle2 className="w-6 h-6 text-emerald-300" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BS to AD Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-amber-500/5 border border-slate-100 dark:border-slate-800 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Nepali to Gregorian</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Bikram Sambat (BS) ➔ English (AD)</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Year</label>
                <select 
                  value={bsYear}
                  onChange={(e) => setBsYear(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-amber-500 transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {Array.from({ length: 150 }, (_, i) => 2000 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Month</label>
                <select 
                  value={bsMonth}
                  onChange={(e) => setBsMonth(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-amber-500 transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {NEPALI_MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Day</label>
                <select 
                  value={bsDay}
                  onChange={(e) => setBsDay(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-amber-500 transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {DAYS_RANGE.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={convertBsToAd}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              CONVERT TO ENGLISH
            </button>

            {results.bsToAd && (
              <div className="bg-amber-600 text-white rounded-[2rem] p-8 relative overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4">
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-amber-100 uppercase tracking-[0.2em] mb-2 opacity-70">English Date Result</p>
                    <h3 className="text-3xl font-black tracking-tight">
                      {results.bsToAd.year} {results.bsToAd.monthName} {results.bsToAd.day}
                    </h3>
                    <p className="text-amber-100 font-bold text-sm mt-1">{results.bsToAd.dayName}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(`${results.bsToAd.year} ${results.bsToAd.monthName} ${results.bsToAd.day}`, 'bsToAd')}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors active:scale-90"
                  >
                    {copied === 'bsToAd' ? <CheckCircle2 className="w-6 h-6 text-emerald-300" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO & Informational Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Everything You Need to Know About Date Conversion</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Converting dates between the <strong className="text-slate-900 dark:text-white">Bikram Sambat (BS)</strong> and <strong className="text-slate-900 dark:text-white">Gregorian (AD)</strong> systems is a common necessity for Nepalese people worldwide. Our tool uses a high-precision algorithm based on the official Nepali calendar rules to ensure your legal documents, birthdays, and anniversaries are perfectly synchronized.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-200">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Why is there a 56-year difference?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-loose">
                  The Bikram Sambat era was founded by King Vikramaditya and is approximately 56 years, 8 months, and 17 days ahead of the Gregorian calendar. Since it follows the solar cycle with lunar influence, the number of days in each month varies each year, unlike the fixed Gregorian months.
                </p>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-amber-200">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Data Integrity & Accuracy</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-loose">
                  Our converter handles leap years in both systems flawlessly. We support historical date lookup back to 1944 AD (2000 BS) and future planning up to 2094 AD (2150 BS), making it ideal for genealogy research and long-term project planning.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-10 bg-blue-600 rounded-[3rem] text-white space-y-6">
              <h3 className="text-2xl font-black">Conversion Quick Tips</h3>
              <ul className="space-y-4">
                {[
                  "Official documents usually require BS dates.",
                  "International travel depends on AD dates.",
                  "Tithis are calculated at sunrise.",
                  "Advisory: Always double-check legal forms."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold opacity-90">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "ADtoBS", "BikramSambat", "DateConverter", "NepalCalendar", 
                "GregorianConversion", "NepaliPatro", "Accuracy", "TithiConversion"
              ].map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
