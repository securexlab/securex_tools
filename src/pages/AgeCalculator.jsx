import React, { useState } from "react";
import NepaliDate from "nepali-date-converter";
import { User, Calendar, RefreshCw, Sparkles, History, Info, BookOpen } from "lucide-react";
import { Link } from "react-router-dom"; // Added for AdSense internal linking
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";
import RelatedReading from '../components/RelatedReading';

const NEPALI_MONTHS = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", 
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const AD_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_RANGE = Array.from({ length: 32 }, (_, i) => i + 1);

const convertDevanagariToEnglish = (str) => {
  if (!str) return "";
  const devToEng = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
  return str.toString().replace(/[०-९]/g, (d) => devToEng[d]);
};

export default function AgeCalculator() {
  const [activeTab, setActiveTab] = useState("AD");
  const [ageDetails, setAgeDetails] = useState(null);

  const now = new Date();
  const todayBS = new NepaliDate();

  // AD Inputs
  const [adYear, setAdYear] = useState(now.getFullYear().toString());
  const [adMonth, setAdMonth] = useState((now.getMonth() + 1).toString());
  const [adDay, setAdDay] = useState(now.getDate().toString());
  
  // BS Inputs
  const [bsYear, setBsYear] = useState(todayBS.getYear().toString());
  const [bsMonth, setBsMonth] = useState((todayBS.getMonth() + 1).toString());
  const [bsDay, setBsDay] = useState(todayBS.getDate().toString());

  const getAgeBreakdown = (birth, today) => {
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;

    return { years, months, days, totalDays, totalWeeks, totalMonths };
  };

  const calculateAdAge = () => {
    const y = parseInt(adYear);
    const m = parseInt(adMonth);
    const d = parseInt(adDay);

    if (isNaN(y) || isNaN(m) || isNaN(d)) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const birth = new Date(y, m - 1, d);
    birth.setHours(0, 0, 0, 0);

    if (birth > today) {
      alert("Date of birth cannot be in the future!");
      return;
    }

    const breakdown = getAgeBreakdown(birth, today);

    setAgeDetails({ 
      ...breakdown,
      birthMonth: AD_MONTHS[birth.getMonth()],
      birthYear: y,
      birthDay: d,
      format: "AD"
    });
  };

  const calculateBsAge = () => {
    try {
      const y = parseInt(convertDevanagariToEnglish(bsYear));
      const m = parseInt(bsMonth);
      const d = parseInt(convertDevanagariToEnglish(bsDay));

      if (isNaN(y) || isNaN(m) || isNaN(d)) return;

      const birthDateBS = new NepaliDate(y, m - 1, d);
      const birthAd = birthDateBS.toJsDate();
      birthAd.setHours(0, 0, 0, 0);
      
      const todayAd = new Date();
      todayAd.setHours(0, 0, 0, 0);

      if (birthAd > todayAd) {
        alert("Date of birth cannot be in the future!");
        return;
      }

      // We use Gregorian breakdown for consistency as requested by user
      // but we store the Nepali birth month name for display
      const breakdown = getAgeBreakdown(birthAd, todayAd);

      setAgeDetails({
        ...breakdown,
        birthMonth: NEPALI_MONTHS[birthDateBS.getMonth()],
        birthYear: y,
        birthDay: d,
        format: "BS"
      });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-7xl mx-auto px-6">
        <div>
           <BackButton />
           <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-6">Age Calculator</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Precise human life-cycle metrics in AD and BS calendars</p>
        </div>

        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
          {["AD", "BS"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setAgeDetails(null); }}
              className={cn(
                "px-10 py-3 rounded-[1.5rem] font-black transition-all text-sm",
                activeTab === tab 
                  ? "bg-white dark:bg-slate-800 text-blue-600 shadow-md" 
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
              )}
            >
              {tab} Calendar
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-500/5 border border-slate-100 dark:border-slate-800 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-2xl shadow-lg transition-transform",
              activeTab === "AD" ? "bg-blue-600 rotate-3" : "bg-emerald-600 -rotate-3"
            )}>
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Choose Birth Date</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select your {activeTab} DOB</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Year Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Year</label>
                <select 
                  value={activeTab === "AD" ? adYear : bsYear}
                  onChange={(e) => activeTab === "AD" ? setAdYear(e.target.value) : setBsYear(e.target.value)}
                  className={cn(
                    "w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer",
                    activeTab === "AD" ? "focus:border-blue-500" : "focus:border-emerald-500"
                  )}
                >
                  {Array.from({ length: 110 }, (_, i) => (activeTab === "AD" ? 1944 : 2000) + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Month Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Month</label>
                <select 
                  value={activeTab === "AD" ? adMonth : bsMonth}
                  onChange={(e) => activeTab === "AD" ? setAdMonth(e.target.value) : setBsMonth(e.target.value)}
                  className={cn(
                    "w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer",
                    activeTab === "AD" ? "focus:border-blue-500" : "focus:border-emerald-500"
                  )}
                >
                  {(activeTab === "AD" ? AD_MONTHS : NEPALI_MONTHS).map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Day Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Day</label>
                <select 
                  value={activeTab === "AD" ? adDay : bsDay}
                  onChange={(e) => activeTab === "AD" ? setAdDay(e.target.value) : setBsDay(e.target.value)}
                  className={cn(
                    "w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent transition-all rounded-2xl p-4 font-black text-slate-900 dark:text-white appearance-none cursor-pointer",
                    activeTab === "AD" ? "focus:border-blue-500" : "focus:border-emerald-500"
                  )}
                >
                  {DAYS_RANGE.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={activeTab === "AD" ? calculateAdAge : calculateBsAge}
              className={cn(
                "w-full py-5 rounded-[2rem] text-white font-black text-lg transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 group",
                activeTab === "AD" 
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" 
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
              )}
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Calculate My Age
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {ageDetails ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Years", value: ageDetails.years, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                  { label: "Months", value: ageDetails.months, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
                  { label: "Days", value: ageDetails.days, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center space-y-3 shadow-sm">
                    <p className={cn("text-5xl font-black rounded-3xl py-2", item.color)}>{item.value}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.2em]">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-10 text-white space-y-10 relative overflow-hidden group">
                <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-700" />
                
                <div className="relative z-10 grid grid-cols-2 gap-y-10">
                  <div className="col-span-2 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Life Journey Statistics</h3>
                  </div>
                  
                  <div>
                    <p className="text-4xl font-black tracking-tighter">{(ageDetails.totalMonths || 0).toLocaleString()}</p>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">Total Months</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black tracking-tighter">{(ageDetails.totalWeeks || 0).toLocaleString()}</p>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">Weeks lived</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black tracking-tighter">{(ageDetails.totalDays || 0).toLocaleString()}</p>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">Days on Earth</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black tracking-tighter truncate leading-tight">
                      {ageDetails.birthYear} {ageDetails.birthMonth} {ageDetails.birthDay}
                    </p>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">Date of Birth</p>
                  </div>
                </div>
                
                <User className="absolute -right-12 -bottom-12 w-56 h-56 opacity-5 -rotate-12 transform group-hover:scale-110 group-hover:rotate-0 transition-all duration-700 pointer-events-none" />
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-8 group transition-colors hover:border-blue-100 dark:hover:border-slate-700">
               <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-slate-300 dark:text-slate-700" />
               </div>
               <h3 className="text-lg font-black text-slate-900 dark:text-white">Awaiting Input</h3>
               <p className="font-bold text-slate-400 mt-2 text-sm max-w-xs">Enter your birth date on the left to reveal your life statistics.</p>
               <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800">
                 <Info className="w-3 h-3 text-blue-500" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Unified AD/BS precision</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO & Informational Content */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Unified Age Calculation Logic</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                To ensure absolute consistency, our calculator unifies the age breakdown (Years, Months, Days) using the <strong className="text-slate-900 dark:text-white">Gregorian (AD) standards</strong> regardless of which calendar you use for input. This prevents the common discrepancy where different calendar systems (with variable month lengths) produce slightly different day counts for the same life duration.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Total Life Statistics</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-loose">
                  Ever wondered how many weeks you've been alive? Or how many months? Our tool breaks down your entire existence into understandable units, giving you a unique perspective on your own timeline.
                </p>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Accuracy and Reliability</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-loose">
                  We handle the complex leap year rules of the Gregorian calendar and the variable month lengths of the Bikram Sambat system, ensuring that whether you were born in 2040 BS or 1995 AD, your results are 100% accurate.
                </p>
              </div>
            </div>

            {/* AD-SENSE PUBLISHER CONTENT LINKING */}
            <div className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Related Reading</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Converting between AD and BS dates for calculations involves complex astronomical data because of the variable month lengths in the Bikram Sambat calendar. Learn more about how the official calendar of Nepal works and why simple math isn't enough for accurate conversion.
              </p>
              <Link
                to="/blog/understanding-bikram-sambat"
                className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-full"
              >
                Read: Understanding the Bikram Sambat (BS) Calendar &rarr;
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-10 bg-emerald-600 rounded-[3rem] text-white space-y-6">
              <h3 className="text-2xl font-black">Calendar Insights</h3>
              <ul className="space-y-4">
                {[
                  "Nepali months vary from 29 to 32 days.",
                  "New Year (Baisakh 1) falls in mid-April.",
                  "BS is mid-way between Solar & Lunar cycle.",
                  "AD is strictly a Solar calendar system."
                ].map((insight, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold opacity-90">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "AgeCalculator", "NepaliAge", "BikramSambat", "Gregorian", 
                "LifeTracker", "NepalCalendar", "BirthStatistics", "AgeInWeeks"
              ].map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    <RelatedReading category="date" />
    </div>
  );
}