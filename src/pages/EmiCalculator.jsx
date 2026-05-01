import React, { useState, useEffect } from "react";
import { Landmark, Briefcase, Zap, PieChart } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

export default function EmiCalculator() {
  const [activeTab, setActiveTab] = useState("bank"); // bank or sikada
  
  // Bank EMI State
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(5);
  const [emi, setEmi] = useState(0);
  
  // Sikada State
  const [sikPrincipal, setSikPrincipal] = useState(50000);
  const [sikRate, setSikRate] = useState(2); // usually 2% or 3% per month
  const [sikTime, setSikTime] = useState(12); // in months
  const [sikResult, setSikResult] = useState({ interest: 0, total: 0 });

  const calculateBankEMI = () => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emiCalc = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(emiCalc || 0);
  };

  const calculateSikada = () => {
    const interest = (sikPrincipal * sikRate * sikTime) / 100;
    setSikResult({ interest, total: sikPrincipal + interest });
  };

  useEffect(() => {
    if (activeTab === "bank") calculateBankEMI();
    else calculateSikada();
  }, [principal, rate, tenure, sikPrincipal, sikRate, sikTime, activeTab]);

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Calculate Bank EMI or local village "Sikada" interest with ease.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit mx-auto shadow-sm">
          <button 
            onClick={() => setActiveTab("bank")}
            className={cn("flex items-center gap-2 px-8 py-3 text-sm font-bold rounded-xl transition-all", activeTab === "bank" ? "bg-white dark:bg-slate-800 shadow-md text-blue-600" : "text-slate-400")}
          >
            <Landmark className="w-4 h-4" /> Bank EMI
          </button>
          <button 
            onClick={() => setActiveTab("sikada")}
            className={cn("flex items-center gap-2 px-8 py-3 text-sm font-bold rounded-xl transition-all", activeTab === "sikada" ? "bg-white dark:bg-slate-800 shadow-md text-blue-600" : "text-slate-400")}
          >
            <Zap className="w-4 h-4" /> Sikada (Local)
          </button>
        </div>

        {activeTab === "bank" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Principal Amount (Rs.)</label>
                <input type="number" value={principal} onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)} className="w-full text-3xl font-bold bg-transparent outline-none border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 pb-2 transition-colors" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Annual Interest Rate (%)</label>
                <input type="number" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="w-full text-3xl font-bold bg-transparent outline-none border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 pb-2 transition-colors" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><PieChart className="w-3.5 h-3.5" /> Tenure (Years)</label>
                <input type="number" value={tenure} onChange={(e) => setTenure(parseFloat(e.target.value) || 0)} className="w-full text-3xl font-bold bg-transparent outline-none border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 pb-2 transition-colors" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-10 bg-slate-950 text-white dark:bg-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700"><Landmark className="w-32 h-32" /></div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 opacity-50">Monthly Payment (EMI)</p>
                <h4 className="text-5xl font-black tracking-tighter mb-2">Rs. {emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h4>
                <div className="flex gap-4 pt-6 border-t border-white/10 dark:border-slate-200 mt-6">
                  <div>
                    <p className="text-xl font-bold">Rs. {(emi * tenure * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className="text-[10px] uppercase font-bold opacity-40">Total Repayment</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-blue-400">Rs. {(emi * tenure * 12 - principal).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className="text-[10px] uppercase font-bold opacity-40">Total Interest</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Principle Amount</label>
                <input type="number" value={sikPrincipal} onChange={(e) => setSikPrincipal(parseFloat(e.target.value) || 0)} className="w-full text-3xl font-bold bg-transparent outline-none border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 pb-2" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Monthly Rate (per 100)</label>
                <input type="number" step="0.5" value={sikRate} onChange={(e) => setSikRate(parseFloat(e.target.value) || 0)} className="w-full text-3xl font-bold bg-transparent outline-none border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 pb-2" />
                <p className="text-[10px] text-slate-400 font-bold">Typical: 2% (Rs 2 per hundred) or 3% (Rs 3 per hundred)</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><History className="w-3.5 h-3.5" /> Time (Months)</label>
                <input type="number" value={sikTime} onChange={(e) => setSikTime(parseFloat(e.target.value) || 0)} className="w-full text-3xl font-bold bg-transparent outline-none border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 pb-2" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-10 bg-emerald-600 text-white shadow-2xl space-y-8">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 opacity-70">Sikada Interest Earned</p>
                   <h4 className="text-5xl font-black tracking-tighter">Rs. {sikResult.interest.toLocaleString()}</h4>
                </div>
                <div className="pt-8 border-t border-white/20">
                   <p className="text-3xl font-bold text-emerald-100">Rs. {sikResult.total.toLocaleString()}</p>
                   <p className="text-[10px] uppercase font-bold opacity-70">Total Mature Amount</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Smart EMI Calculator for Homes & Cars</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Plan your finances better with our detailed <strong>Loan EMI Calculator</strong>. Whether it's a home loan, car loan, or personal loan, see your monthly commitments and total interest costs instantly.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Principal", desc: "The total money you borrow from the bank or lender." },
              { title: "Interest Rate", desc: "The annual percentage rate charged by the bank." },
              { title: "Loan Tenure", desc: "The duration (in years) to repay the full loan amount." },
              { title: "Sikada Rate", desc: "Local interest mapping (usually Rs. 2 or 3 per hundred)." }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <h4 className="font-bold text-sm text-blue-600 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <section className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-800">
              <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Understanding "Sikada" Interest</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                In many local communities in Nepal, the <strong>"Sikada"</strong> system is used where interest is calculated monthly per hundred rupees. A "2% rate" means Rs. 2 interest for every Rs. 100 borrowed per month. This tool helps you convert this traditional math into clear figures.
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                <PieChart className="w-4 h-4" />
                Know Your Finances
              </div>
            </div>
          </section>

          <p className="text-xs text-slate-400 text-center italic">
            Note: This calculator provides estimates for informational purposes only. Local rates and bank fees may vary based on individual contracts.
          </p>
        </div>
      </div>
    </div>
  );
}

function TrendingUp(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function History(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}
