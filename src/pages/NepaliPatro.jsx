import React, { useState, useEffect, useCallback } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Info, 
  Clock, 
  Sunrise, 
  Sunset, 
  Moon,
  Loader2,
  AlertCircle,
  Bell,
  X
} from "lucide-react";
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";

const MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", 
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// In-memory cache for calendar data
const calendarCache = new Map();

export default function NepaliPatro() {
  const [selectedYear, setSelectedYear] = useState(2083);
  const [selectedMonth, setSelectedMonth] = useState(1); // 1-indexed
  const [calendarData, setCalendarData] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showDayDetailModal, setShowDayDetailModal] = useState(false);

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchCalendarData = useCallback(async (year, month, force = false) => {
    const cacheKey = `${year}-${month}`;
    if (!force && calendarCache.has(cacheKey)) {
      const cachedData = calendarCache.get(cacheKey);
      setCalendarData(cachedData);
      
      // Auto-select "today" or first day
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const todayInMonth = cachedData.days.find(d => d.ad_date === todayStr);
      const dayToSelect = todayInMonth || cachedData.days[0];
      setSelectedDay(dayToSelect);
      fetchDayDetails(dayToSelect.ad_date);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let adYear = year - 57;
      let adMonth = month + 3;
      
      if (adMonth > 12) {
        adMonth -= 12;
        adYear += 1;
      }
      
      const urls = [
        `/api/patro?year=${adYear}&month=${adMonth}`,
        `/api/patro?year=${adMonth === 12 ? adYear + 1 : adYear}&month=${adMonth === 12 ? 1 : adMonth + 1}`
      ];

      const responses = await Promise.all(urls.map(url => fetch(url)));
      const dataResults = await Promise.all(responses.map(res => res.ok ? res.json() : { days: [] }));
      
      const allDaysRaw = dataResults.flatMap(r => r.days || []);
      const uniqueDaysMap = new Map();
      allDaysRaw.forEach(d => {
        if (d.date) uniqueDaysMap.set(d.date, d);
      });
      
      const allDays = Array.from(uniqueDaysMap.values());
      const targetMonthName = MONTHS[month - 1];

      const normalize = (s) => s?.toLowerCase().replace(/h/g, '').replace(/aa/g, 'a').replace(/sh/g, 's').replace(/s/g, 's').replace(/v/g, 'b').replace(/w/g, 'b') || "";

      const mappedDays = allDays
        .filter(d => {
           if (!d.bs_date) return false;
           const parts = d.bs_date.split(' ');
           if (parts.length < 2) return false;
           const bsMonthName = parts[1];
           const nBS = normalize(bsMonthName);
           const nTarget = normalize(targetMonthName);
           
           return nBS.startsWith(nTarget.substring(0, 3)) || 
                  nTarget.startsWith(nBS.substring(0, 3)) ||
                  nBS.includes(nTarget.substring(0, 4)) ||
                  nTarget.includes(nBS.substring(0, 4));
        })
        .map(d => {
          const bsDayParts = d.bs_date.split(' ');
          
          // Get Tithi Name
          let tithiDisplay = d.tithi_name || d.tithi;
          if (typeof d.tithi === 'number' || !isNaN(parseInt(d.tithi))) {
            const tNum = parseInt(d.tithi);
            const tithiNames = ["", "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"];
            if (tNum === 15 && d.paksha === 'shukla') tithiDisplay = "Purnima";
            else if (tNum === 15 || tNum === 30) tithiDisplay = "Amavasya";
            else if (tithiNames[tNum]) tithiDisplay = tithiNames[tNum];
          }

          return {
            ...d,
            bs_day: parseInt(bsDayParts[0]),
            ad_date: d.date, 
            tithi: tithiDisplay,
            event: d.festivals && d.festivals.length > 0 ? d.festivals[0].name : (d.holiday ? "Holiday" : null),
            day_of_week: new Date(d.date).getDay()
          };
        })
        .sort((a, b) => a.bs_day - b.bs_day);

      if (mappedDays.length === 0) {
        throw new Error(`Data for ${targetMonthName} ${year} is currently unavailable in the cosmic records.`);
      }

      const result = {
        days: mappedDays,
        first_day_of_month: mappedDays[0].day_of_week
      };

      calendarCache.set(cacheKey, result);
      setCalendarData(result);
      
      // Auto-select "today"
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const todayInMonth = mappedDays.find(d => d.ad_date === todayStr);
      const dayToSelect = todayInMonth || mappedDays[0];
      setSelectedDay(dayToSelect);
      fetchDayDetails(dayToSelect.ad_date);
    } catch (err) {
      setError(err.message);
      setCalendarData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize with Today's BS date
  useEffect(() => {
    const initToday = async () => {
      setLoading(true);
      try {
        const resp = await fetch('/api/today');
        if (resp.ok) {
          const data = await resp.json();
          setTodayData(data);
          if (data.bikram_sambat) {
            setSelectedYear(data.bikram_sambat.year);
            setSelectedMonth(data.bikram_sambat.month);
            // This will trigger the fetchCalendarData effect
          } else {
            fetchCalendarData(selectedYear, selectedMonth);
          }
        } else {
          fetchCalendarData(selectedYear, selectedMonth);
        }
      } catch (err) {
        console.error("Today fetch failed", err);
        fetchCalendarData(selectedYear, selectedMonth);
      }
    };
    initToday();
  }, [fetchCalendarData]);

  // Fetch when year/month changes - only if necessary
  useEffect(() => {
    const cacheKey = `${selectedYear}-${selectedMonth}`;
    if (selectedYear && selectedMonth && !calendarCache.has(cacheKey)) {
      fetchCalendarData(selectedYear, selectedMonth);
    } else if (selectedYear && selectedMonth && calendarCache.has(cacheKey)) {
      // Still need to update display if we have it cached but it's not the current state
      const cachedData = calendarCache.get(cacheKey);
      setCalendarData(cachedData);
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const todayInMonth = cachedData.days.find(d => d.ad_date === todayStr);
      const dayToSelect = todayInMonth || cachedData.days[0];
      setSelectedDay(dayToSelect);
      fetchDayDetails(dayToSelect.ad_date);
    }
  }, [selectedYear, selectedMonth, fetchCalendarData]);

  const [dayDetails, setDayDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchDayDetails = useCallback(async (adDate) => {
    setDetailsLoading(true);
    try {
      const resp = await fetch(`/api/convert-ad-to-bs?year=${adDate.split('-')[0]}&month=${adDate.split('-')[1]}&day=${adDate.split('-')[2]}`);
      if (resp.ok) {
        const data = await resp.json();
        setDayDetails(data);
      }
    } catch (err) {
      console.error("Failed to fetch day details", err);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const handleDaySelect = (dayData) => {
    setSelectedDay(dayData);
    setDayDetails(null);
    fetchDayDetails(dayData.ad_date);
  };

  const formatApiTime = (isoString) => {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'Asia/Kathmandu'
      });
    } catch (e) {
      return null;
    }
  };
  const handlePrevMonth = () => {
    if (selectedMonth > 1) {
      setSelectedMonth(selectedMonth - 1);
    } else {
      setSelectedYear(y => y - 1);
      setSelectedMonth(12);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth < 12) {
      setSelectedMonth(selectedMonth + 1);
    } else {
      setSelectedYear(y => y + 1);
      setSelectedMonth(1);
    }
    setSelectedDay(null);
  };

  const years = Array.from({ length: 41 }, (_, i) => 2060 + i);

  return (
    <div className="space-y-8 pb-10 px-4 pt-4 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
           <BackButton />
           <div className="flex items-center gap-4 mt-6">
              <div className="h-20 w-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <CalendarIcon className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Nepali Patro</h1>
                {todayData?.bikram_sambat && (
                  <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-sm mt-1">
                    Today is {MONTHS[todayData.bikram_sambat.month - 1]} {todayData.bikram_sambat.day}, {todayData.bikram_sambat.year} BS
                  </p>
                )}
              </div>
           </div>
        </div>

        {/* Live Nepali Time Widget */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white min-w-[280px] shadow-2xl relative overflow-hidden group">
          <Clock className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          <div className="relative z-10 flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-2xl">
                <Clock className="w-5 h-5 text-blue-400" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Kathmandu Time</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black">
                    {currentTime.toLocaleTimeString('en-US', { 
                      timeZone: 'Asia/Kathmandu', 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                    :{new Intl.DateTimeFormat('en-US', { 
                        timeZone: 'Asia/Kathmandu', 
                        second: '2-digit' 
                      }).format(currentTime)}
                    </span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
        <button 
          onClick={handlePrevMonth}
          className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex gap-4">
          <select 
            value={selectedMonth} 
            onChange={(e) => {
              setSelectedMonth(parseInt(e.target.value));
              setSelectedDay(null);
            }}
            className="bg-slate-50 dark:bg-slate-800 font-black px-6 py-3 rounded-2xl outline-none text-sm cursor-pointer appearance-none hover:ring-2 hover:ring-blue-500 transition-all text-slate-900 dark:text-white"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>

          <select 
            value={selectedYear} 
            onChange={(e) => {
              setSelectedYear(parseInt(e.target.value));
              setSelectedDay(null);
            }}
            className="bg-slate-50 dark:bg-slate-800 font-black px-6 py-3 rounded-2xl outline-none text-sm cursor-pointer appearance-none hover:ring-2 hover:ring-blue-500 transition-all text-slate-900 dark:text-white"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleNextMonth}
          className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Day Detail Modal */}
      {showDayDetailModal && selectedDay && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setShowDayDetailModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 max-w-md w-full relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowDayDetailModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all hover:rotate-90"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>

            <div className="flex items-center gap-5">
              <div className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg",
                selectedDay.holiday || selectedDay.day_of_week === 6
                  ? "bg-red-600 text-white" 
                  : "bg-blue-600 text-white"
              )}>
                {selectedDay.bs_day}
              </div>
              <div>
                <h3 className="text-2xl font-black leading-none text-slate-900 dark:text-white">
                  {MONTHS[selectedMonth - 1]} {selectedDay.bs_day}
                </h3>
                <p className="text-slate-500 font-bold text-sm mt-1">{selectedDay.ad_date}</p>
              </div>
            </div>

            {selectedDay.event && (
              <div className={cn(
                "p-5 rounded-2xl border flex items-start gap-3",
                selectedDay.holiday 
                  ? "bg-red-50 border-red-100 text-red-800 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-200" 
                  : "bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-200"
              )}>
                <Bell className="w-5 h-5 shrink-0 mt-0.5 opacity-70" />
                <div>
                  <p className="font-black text-[10px] uppercase tracking-widest opacity-60">Festival / Event</p>
                  <p className="text-lg font-bold mt-1 leading-tight">{selectedDay.event}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tithi</p>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                    {dayDetails?.tithi?.tithi_name || selectedDay.tithi || "N/A"}
                  </p>
                  {dayDetails?.tithi?.moon_phase?.toLowerCase().includes('purnima') && (
                    <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" title="Purnima" />
                  )}
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nepal Sambat</p>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {dayDetails?.nepal_sambat?.formatted || "..."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Sunrise className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Sunrise</p>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {detailsLoading ? "..." : (formatApiTime(dayDetails?.tithi?.sunrise_used) || "05:42 AM")}
                </p>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Paksha</p>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white capitalize">
                  {dayDetails?.tithi?.paksha || "..."} Paksha
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowDayDetailModal(false)}
              className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-sm tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              {DAYS.map(day => (
                <div key={day} className={cn(
                  "py-6 text-center text-xs font-black uppercase tracking-widest",
                  day === "Sat" ? "text-red-500" : "text-slate-400"
                )}>
                  {day}
                </div>
              ))}
            </div>

            {loading ? (
                <div className="h-[600px] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
                  <CalendarIcon className="w-8 h-8 text-blue-600 absolute inset-0 m-auto" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-slate-900 dark:text-white font-black text-lg">Syncing Lunar Cycle...</p>
                  <p className="text-slate-500 font-medium text-sm animate-pulse max-w-xs mx-auto">
                    Note: Our connection to the cosmic records may take a moment to warm up. 
                    Please wait while we align the planets.
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="h-[600px] flex flex-col items-center justify-center gap-6 text-center p-12">
                <div className="h-24 w-24 bg-red-100 dark:bg-red-900/30 rounded-[2rem] flex items-center justify-center text-red-600">
                  <AlertCircle className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Connection Error</h3>
                  <p className="text-slate-500 mt-2 max-w-sm mx-auto">{error}</p>
                </div>
                <button 
                  onClick={() => fetchCalendarData(selectedYear, selectedMonth)}
                  className="px-10 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-3xl font-black hover:scale-105 transition-all shadow-xl"
                >
                  RETRY SYNC
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800">
                {Array.from({ length: calendarData?.first_day_of_month || 0 }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white dark:bg-slate-900 min-h-[140px] p-2" />
                ))}

                {calendarData?.days.map((dayData, idx) => {
                  const isSaturday = dayData.day_of_week === 6;
                  const isHoliday = dayData.holiday;
                  const isSelected = selectedDay && selectedDay.bs_day === dayData.bs_day;
                  const isToday = 
                    todayData?.bikram_sambat && 
                    todayData.bikram_sambat.year === selectedYear && 
                    todayData.bikram_sambat.month === selectedMonth && 
                    todayData.bikram_sambat.day === dayData.bs_day;

                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        handleDaySelect(dayData);
                        setShowDayDetailModal(true);
                      }}
                      className={cn(
                        "bg-white dark:bg-slate-900 min-h-[140px] p-4 transition-all cursor-pointer group relative overflow-hidden",
                        isSelected ? "ring-4 ring-blue-600 z-10 scale-105 shadow-2xl" : "hover:bg-slate-50 dark:hover:bg-slate-800/40",
                        isToday && !isSelected && "ring-2 ring-blue-400 ring-inset"
                      )}
                    >
                      {isToday && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                      )}
                      
                      <div className="flex justify-between items-start relative z-10 gap-2">
                        <div className="flex flex-col min-w-0">
                          <span className={cn(
                            "text-3xl font-black transition-colors",
                            (isSaturday || isHoliday) ? "text-red-500" : "text-slate-800 dark:text-slate-200",
                          )}>
                            {dayData.bs_day}
                          </span>
                          <span className={cn(
                            "text-[10px] font-black uppercase mt-0.5 tracking-tighter leading-none truncate",
                            (dayData.tithi === "Purnima") ? "text-blue-500" : 
                            (dayData.tithi === "Amavasya") ? "text-slate-900 dark:text-white" :
                            "text-slate-400"
                          )}>
                            {dayData.tithi}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-black text-slate-400 block uppercase leading-none">
                            {dayData.ad_date?.split('-')[2]}
                          </span>
                          <span className="text-[9px] font-bold text-slate-300 block uppercase mt-0.5 leading-none">
                            {new Date(dayData.ad_date).toLocaleString('default', { month: 'short' })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 relative z-10">
                        {dayData.event && (
                          <div className={cn(
                            "text-[10px] leading-tight font-black py-1.5 px-3 rounded-xl line-clamp-2",
                            isHoliday || isSaturday
                              ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
                              : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          )}>
                            {dayData.event}
                          </div>
                        )}
                      </div>
                      
                      {dayData.event && dayData.event.toLowerCase().includes("ekadashi") && (
                        <div className="absolute -right-1 -bottom-1 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Bell className="w-12 h-12 text-blue-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {calendarData && calendarData.days.filter(d => d.event).length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between px-2">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Month's Key Events</h4>
                  <p className="text-slate-400 font-bold text-sm tracking-widest mt-1 uppercase">Cultural & Religious Highlights</p>
                </div>
                <Bell className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {(() => {
                  const allEvents = calendarData.days.filter(d => d.event);
                  const todayBS = todayData?.bikram_sambat?.day || 0;
                  
                  const upcomingEvents = allEvents.filter(d => d.bs_day >= todayBS).sort((a, b) => a.bs_day - b.bs_day);
                  const pastEvents = allEvents.filter(d => d.bs_day < todayBS).sort((a, b) => a.bs_day - b.bs_day);
                  
                  const visibleUpcoming = showAllEvents ? upcomingEvents : upcomingEvents.slice(0, 10);
                  const visiblePast = showPastEvents ? pastEvents : [];
                  
                  return (
                    <>
                      {pastEvents.length > 0 && (
                        <button 
                          onClick={() => setShowPastEvents(!showPastEvents)}
                          className="py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl mb-4 hover:border-blue-200 active:scale-[0.98]"
                        >
                          {showPastEvents ? "Hide Past Events" : `View ${pastEvents.length} Past Events`}
                        </button>
                      )}

                      {[...visiblePast, ...visibleUpcoming].map((d, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "flex items-center gap-6 p-6 rounded-[2.5rem] transition-all group cursor-pointer border border-transparent shadow-sm",
                            d.bs_day < todayBS 
                              ? "opacity-60 bg-slate-50 dark:bg-slate-800/30 grayscale-[0.5]" 
                              : "bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-slate-100 dark:hover:border-slate-700"
                          )}
                          onClick={() => {
                            handleDaySelect(d);
                            setShowDayDetailModal(true);
                          }}
                        >
                          <div className={cn(
                            "h-16 w-16 shrink-0 rounded-[1.5rem] flex flex-col items-center justify-center font-black transition-transform group-hover:scale-105 shadow-sm",
                            d.holiday ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                          )}>
                            <span className="text-2xl leading-none">{d.bs_day}</span>
                            <span className="text-[10px] uppercase tracking-widest mt-1 opacity-70">{DAYS[d.day_of_week]}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <p className={cn(
                                "text-lg font-black truncate transition-colors",
                                d.bs_day === todayBS ? "text-blue-600" : "text-slate-900 dark:text-white",
                                "group-hover:text-blue-600"
                              )}>
                                {d.event} 
                              </p>
                              {d.bs_day === todayBS && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] rounded-lg uppercase font-black animate-pulse shrink-0">Today</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
                               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] shrink-0">
                                 {MONTHS[selectedMonth - 1]} {d.bs_day}
                               </p>
                               {d.tithi && (
                                  <>
                                    <div className="h-1 w-1 bg-slate-300 rounded-full shrink-0" />
                                    <span className="text-[11px] text-blue-500/70 font-black italic truncate">{d.tithi}</span>
                                  </>
                               )}
                            </div>
                          </div>
                          
                          <div className="hidden md:block text-right shrink-0">
                            <p className="text-xs font-black text-slate-300 uppercase tracking-tighter">{d.ad_date}</p>
                            <div className="flex items-center justify-end gap-1 mt-1 text-slate-400">
                                <Sunrise className="w-3 h-3 opacity-30" />
                                <span className="text-[10px] font-bold">05:42</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {!showAllEvents && upcomingEvents.length > 10 && (
                        <button 
                          onClick={() => setShowAllEvents(true)}
                          className="col-span-full mt-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] py-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl hover:bg-blue-100 transition-colors"
                        >
                          Show {upcomingEvents.length - 10} more events
                        </button>
                      )}

                      {showAllEvents && upcomingEvents.length > 10 && (
                        <button 
                          onClick={() => setShowAllEvents(false)}
                          className="col-span-full mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 transition-colors"
                        >
                          Collapse List
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-8 space-y-8">
            {selectedDay ? (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "h-20 w-20 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl",
                    selectedDay.holiday || selectedDay.day_of_week === 6
                      ? "bg-red-600 text-white shadow-red-500/20" 
                      : "bg-blue-600 text-white shadow-blue-500/20"
                  )}>
                    {selectedDay.bs_day}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black leading-none text-slate-900 dark:text-white">
                      {MONTHS[selectedMonth - 1]} {selectedDay.bs_day}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm mt-2">{selectedDay.ad_date}</p>
                  </div>
                </div>

                {selectedDay.event && (
                  <div className={cn(
                    "p-6 rounded-[2rem] border-2 flex items-start gap-4",
                    selectedDay.holiday 
                      ? "bg-red-50 border-red-100 text-red-800 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-200" 
                      : "bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-200"
                  )}>
                    <Bell className="w-6 h-6 shrink-0 mt-1" />
                    <div>
                      <p className="font-black text-sm uppercase tracking-widest">Festival / Event</p>
                      <p className="text-lg font-bold mt-1 leading-snug">{selectedDay.event}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] space-y-1 group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tithi</p>
                    <p className="font-black text-slate-900 dark:text-white uppercase truncate text-sm">{selectedDay.tithi || "N/A"}</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] space-y-1 group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekday</p>
                    <p className="font-black text-slate-900 dark:text-white text-sm">{DAYS[selectedDay.day_of_week]}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-1">Cosmic Timings</h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                            <Sunrise className="w-5 h-5 text-amber-600" />
                         </div>
                         <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Sunrise</p>
                      </div>
                      <p className="font-black text-slate-900 dark:text-white">
                        {detailsLoading ? "..." : (formatApiTime(dayDetails?.tithi?.sunrise_used) || "05:42 AM")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <Sunset className="w-5 h-5 text-orange-600" />
                         </div>
                         <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Sunset</p>
                      </div>
                      <p className="font-black text-slate-900 dark:text-white">06:31 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/50 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-20 text-center space-y-6">
                <div className="relative inline-block">
                  <Moon className="w-20 h-20 text-slate-200 mx-auto" />
                  <Info className="w-8 h-8 text-blue-500 absolute -bottom-2 -right-2" />
                </div>
                <p className="text-slate-400 font-bold text-lg leading-snug">Select a day to unlock deep lunar insights and panchang details</p>
              </div>
            )}
            
            {/* Dynamic Full Moon Widget */}
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const fullMoonDay = calendarData?.days.find(d => 
                ((d.tithi && (d.tithi.toString().toLowerCase().includes("15") || d.tithi.toString().toLowerCase().includes("purnima"))) ||
                (d.event && d.event.toLowerCase().includes("purnima")) ||
                (d.moon_phase && d.moon_phase.toLowerCase().includes("full"))) &&
                (d.ad_date >= today)
              );
              
              if (!fullMoonDay) return (
                <div className="p-8 bg-blue-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group cursor-default">
                  <CalendarIcon className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
                  <div className="relative z-10">
                    <Bell className="w-8 h-8 mb-4 opacity-50" />
                    <h4 className="text-xl font-black mb-2">Next Lunar Gate</h4>
                    <p className="text-blue-100 font-black">Aligning Panchang...</p>
                    <p className="text-[10px] mt-2 opacity-60 uppercase font-black tracking-widest">Checking Jestha cycle...</p>
                  </div>
                </div>
              );

              const fmMonthName = fullMoonDay.bs_date ? fullMoonDay.bs_date.split(' ')[1] : MONTHS[selectedMonth - 1];

              return (
                <div className="p-8 bg-blue-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group cursor-default">
                  <CalendarIcon className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12 transition-transform duration-700" />
                  <div className="relative z-10">
                    <Bell className="w-8 h-8 mb-4 opacity-50" />
                    <h4 className="text-xl font-black mb-2">Upcoming Full Moon</h4>
                    <p className="text-blue-100 font-black">{fmMonthName} {fullMoonDay.bs_day}, {selectedYear}</p>
                    <div className="mt-6 flex items-center gap-2">
                       <div className="h-1 w-12 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-2/3" />
                       </div>
                       <span className="text-[10px] font-black uppercase opacity-60">
                        {fullMoonDay.event || "Purnima / Full Moon"}
                       </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-20 border-t border-slate-100 dark:border-slate-800 pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 text-slate-600 dark:text-slate-400">
              <div className="lg:col-span-8 space-y-16">
                <section>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">Ultimate Guide to Nepali Patro & Calendar 2083</h2>
                  <p className="text-xl leading-relaxed font-medium">
                    The <strong className="text-slate-900 dark:text-white">Nepali Patro</strong> is more than just a date tracker; it is the spiritual and cultural heartbeat of Nepal. Based on the <strong>Bikram Sambat (BS)</strong> era, which is approximately 56.7 years ahead of the Gregorian calendar, our digital patro provides accurate conversions and festival updates for 2083 and beyond.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <section className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Bikram Sambat (BS) System</h3>
                    <p className="text-base leading-relaxed opacity-80">
                      Founded by King Vikramaditya, the Bikram Sambat is the official calendar of Nepal. It follows a solar sidereal year and lunar months, making it uniquely attuned to the seasons of the Himalayas. Months like Baishakh, Dashain-heavy Ashwin, and Tihar-filled Kartik mark the major transitions in the Nepali year.
                    </p>
                  </section>
                  <section className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">The Significance of Tithi</h3>
                    <p className="text-base leading-relaxed opacity-80">
                      Every day in the Nepali calendar is assigned a <strong>Tithi</strong> (Lunar day). Tithis like Ekadashi, Purnima (Full Moon), and Amavasya (New Moon) dictate religious fasts and celebrations. Our API ensures real-time Tithi calculation based on precise sunrise timings in Kathmandu.
                    </p>
                  </section>
                </div>

                <section className="p-8 md:p-12 bg-blue-50 dark:bg-blue-900/10 rounded-[3rem] border border-blue-100 dark:border-blue-900/30">
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4">Major Festivals of Nepal</h3>
                  <p className="text-base text-blue-800/80 dark:text-blue-300/80 mb-8 font-medium">
                    Never miss a celebration. Our calendar tracks national holidays and regional jatras across the country.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8">
                    {[
                      "Dashain (Bada Dashain)",
                      "Tihar (Deepawali)",
                      "Chhath Parva",
                      "Buddha Jayanti",
                      "Holi (Fagu Purnima)",
                      "Maha Shivaratri",
                      "Lhosar",
                      "Eid al-Fitr",
                      "Nepal Sambat New Year"
                    ].map((fest, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest leading-tight">
                        <div className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                        <span className="flex-1">{fest}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="lg:col-span-4 space-y-12">
                <section className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">FAQ: Nepali Calendar</h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">When is Dashain 2083?</h4>
                      <p className="text-sm leading-relaxed opacity-70">Dashain usually falls in the month of Ashwin (Sept/Oct). Check our live calendar for the exact Ghatasthapana and Vijaya Dashami dates.</p>
                    </div>
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">What is Nepal Sambat?</h4>
                      <p className="text-sm leading-relaxed opacity-70">Nepal Sambat is a unique lunar calendar used by the Newar community, starting from 879 AD to commemorate the clearing of all debts of the people of Nepal.</p>
                    </div>
                  </div>
                </section>

                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Nepali Patro", "BS Calendar", "Bikram Sambat 2083", "Today's Tithi", 
                    "Nepal Festivals", "Kathmandu Sunrise", "Lunar Calendar Nepal", 
                    "Dashain Dates", "Tihar Calendar", "Public Holidays Nepal"
                  ].map((tag, i) => (
                    <span key={i} className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-[10px] font-black uppercase text-slate-500 tracking-widest hover:border-blue-400 transition-colors cursor-default">
                      #{tag.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
