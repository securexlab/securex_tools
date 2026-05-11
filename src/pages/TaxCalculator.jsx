import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calculator, Wallet, TrendingUp, Info } from "lucide-react";
import BackButton from "../components/BackButton";

export default function TaxCalculator() {
  const [salary, setSalary] = useState(50000);
  const [maritalStatus, setMaritalStatus] = useState("single");
  const [taxDetails, setTaxDetails] = useState({
    annualSalary: 0,
    monthlyTax: 0,
    annualTax: 0,
    netMonthly: 0
  });

  const calculateTax = () => {
    const annualSalary = salary * 12;
    let taxableAmount = annualSalary;
    let totalTax = 0;

    // Nepal Tax Slabs 2080/81 (Simplified for Resident Individual)
    // Slabs: 1% (Up to 5L single / 6L married), 10% (Next 2L), 20% (Next 3L), 30% (Next 10L), 36% (Above 20L)
    const threshold1 = maritalStatus === "single" ? 500000 : 600000;
    
    if (taxableAmount <= threshold1) {
      totalTax = taxableAmount * 0.01;
    } else {
      totalTax += threshold1 * 0.01;
      taxableAmount -= threshold1;

      // 10% Slab (Next 2L)
      const slab2 = Math.min(taxableAmount, 200000);
      totalTax += slab2 * 0.10;
      taxableAmount -= slab2;

      if (taxableAmount > 0) {
        // 20% Slab (Next 3L)
        const slab3 = Math.min(taxableAmount, 300000);
        totalTax += slab3 * 0.20;
        taxableAmount -= slab3;
      }

      if (taxableAmount > 0) {
        // 30% Slab (Next 10L)
        const slab4 = Math.min(taxableAmount, 1000000);
        totalTax += slab4 * 0.30;
        taxableAmount -= slab4;
      }

      if (taxableAmount > 0) {
        // 36% Slab (Rest)
        totalTax += taxableAmount * 0.36;
      }
    }

    setTaxDetails({
      annualSalary,
      annualTax: totalTax,
      monthlyTax: totalTax / 12,
      netMonthly: salary - (totalTax / 12)
    });
  };

  useEffect(() => {
    calculateTax();
  }, [salary, maritalStatus]);

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tax Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Calculate your monthly TDS and net take-home salary based on Nepal's tax slabs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <div className="glass-card p-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-10 self-start shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2.5rem]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-500" /> Income Configuration
              </label>
              <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                FY 2080/81
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Monthly Gross Salary (NPR)</label>
              <div className="relative group">
                <input 
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                  className="w-full text-5xl font-black bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-blue-500 rounded-3xl p-8 transition-all outline-none text-slate-900 dark:text-white"
                  placeholder="0"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 font-black text-xl pointer-events-none group-focus-within:text-blue-500/50 transition-colors">
                  NRs
                </div>
              </div>
              <div className="px-4">
                <input 
                  type="range"
                  min="10000"
                  max="1000000"
                  step="5000"
                  value={salary}
                  onChange={(e) => setSalary(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>10k</span>
                  <span>500k</span>
                  <span>1M</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Marital Status</label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setMaritalStatus("single")}
                className={`py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${maritalStatus === "single" ? "bg-white dark:bg-slate-800 shadow-lg text-blue-600" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
              >
                Individual
              </button>
              <button 
                onClick={() => setMaritalStatus("married")}
                className={`py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${maritalStatus === "married" ? "bg-white dark:bg-slate-800 shadow-lg text-blue-600" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
              >
                Couple
              </button>
            </div>
          </div>
        </div>

        {/* Results Section - Sticky on large screens */}
        <div className="space-y-6 lg:sticky lg:top-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-950 p-8 rounded-[2.5rem] shadow-xl space-y-2 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em]">Net Take Home</p>
              <h3 className="text-4xl font-black tracking-tighter">Rs. {Math.round(taxDetails.netMonthly || 0).toLocaleString()}</h3>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Available Per Month</p>
            </div>
            <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/20 space-y-2 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
              <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">Monthly TDS</p>
              <h3 className="text-4xl font-black tracking-tighter">Rs. {Math.round(taxDetails.monthlyTax || 0).toLocaleString()}</h3>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Tax Deducted</p>
            </div>
          </div>

          <div className="glass-card p-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-8 rounded-[3rem] shadow-xl shadow-slate-200/30 dark:shadow-none animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Annual Projection
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Annual</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">Rs. {(taxDetails.annualSalary || 0).toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Yearly Tax</span>
                  <p className="text-2xl font-black text-red-500">Rs. {Math.round(taxDetails.annualTax || 0).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="h-px bg-slate-100 dark:bg-slate-800" />
              
              <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex justify-between items-center group transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em]">Annual Net Balance</span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Rs. {Math.round((taxDetails.annualSalary || 0) - (taxDetails.annualTax || 0)).toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600/20 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/5 rounded-3xl flex gap-5">
             <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
             <p className="text-xs text-blue-800/80 dark:text-blue-400/80 leading-relaxed font-bold italic">
               Calculations are based on <strong>Finance Act 2080</strong> rules. This estimate excludes SSF (Social Security Fund), Insurance rebates, and CIT contributions. 
             </p>
          </div>
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Computing Nepal's Progressive Income Tax Slabs</h2>
        <p>Understanding net take-home pay requires navigating complex governmental tax codes. The Tax Calculator is a financial modeling utility that executes the precise income tax regulations mandated by the Inland Revenue Department of Nepal. It abstracts the complexities of the annual budget, providing salaried individuals with an exact breakdown of their TDS (Tax Deducted at Source) and net income.</p>
        <h3>The Mathematics of Progressive Taxation</h3>
        <p>The engine's logic is built upon a cascading, bracketed algorithm. Nepal's tax structure applies progressive percentage multipliers (1%, 10%, 20%, 30%, and 36%) to specific brackets of annual income. The tool first annualizes the user's monthly input and checks the selected marital status to determine the baseline exemption threshold (e.g., 500,000 for singles vs. 600,000 for married couples).</p>
        <p>It then iterates through the taxable amount. If the income exceeds a bracket, it multiplies that specific chunk by the tier's rate, subtracts it from the remaining pool, and pushes the remainder into the next tier calculation. By accurately summing these fractional tax liabilities and dividing by 12, the application guarantees an accurate monthly TDS deduction, yielding the exact net monthly balance without requiring manual spreadsheet formulas.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Explore traditional measurement metrics and related mathematics in Nepal: <Link to="/blog/nepal-land-measurement-systems-explained" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">Nepal Land Measurement Systems Explained</Link>.</p>
      </div>
    </div>
  );
}
