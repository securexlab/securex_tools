import React, { useState, useEffect } from "react";
import { Calculator, Wallet, TrendingUp, Info } from "lucide-react";
import BackButton from "../components/BackButton";
import RelatedReading from "../components/RelatedReading.jsx";

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

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Smart Salary Tax Calculator for Nepal (FY 2080/81)</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-center">
              Our <strong>Nepali Tax Calculator</strong> is updated with the latest Finance Act 2080 changes. It helps salaried individuals and couples calculate their monthly TDS (Tax Deducted at Source) and see their actual take-home salary after all government obligations.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-blue-600 rounded-[3rem] text-white space-y-4 shadow-xl shadow-blue-500/20">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-200" />
                The 1% Social Security Tax
              </h3>
              <p className="text-xs opacity-90 leading-relaxed font-medium">
                In Nepal, the first bracket of taxable income is taxed at 1% for Social Security. For individuals, this applies to the first 5 Lakhs, and for couples, it's the first 6 Lakhs. Our tool automatically detects your marital status and applies the correct threshold.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">How is my tax calculated?</h3>
              <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                <li>Input your gross monthly salary (before any deductions).</li>
                <li>Choose "Individual" or "Couple" status.</li>
                <li>We apply the tiered slab system (10%, 20%, 30%, etc.).</li>
                <li>The tool shows both your monthly deduction and annual projection.</li>
                <li>See exactly how much you take home every month after tax.</li>
              </ul>
            </div>
          </div>

          <div className="p-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] space-y-8">
            <div className="space-y-4">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Tax Slabs & Rates (FY 2080/81)</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                The following tables outline the annual tax brackets for resident individuals and couples in Nepal. Tax is calculated cumulatively across these tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h5 className="text-xs font-black uppercase tracking-widest text-blue-600">Individual (Single)</h5>
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold">
                      <tr>
                        <th className="px-4 py-3 uppercase tracking-tighter">Annual Slab (NPR)</th>
                        <th className="px-4 py-3 uppercase tracking-tighter">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      <tr><td className="px-4 py-3">Up to 5,00,000</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">1%</td></tr>
                      <tr><td className="px-4 py-3">Next 2,00,000 (To 7L)</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">10%</td></tr>
                      <tr><td className="px-4 py-3">Next 3,00,000 (To 10L)</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">20%</td></tr>
                      <tr><td className="px-4 py-3">Next 10,00,000 (To 20L)</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">30%</td></tr>
                      <tr><td className="px-4 py-3">Above 20,00,000</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">36%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-black uppercase tracking-widest text-emerald-600">Couple (Married)</h5>
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold">
                      <tr>
                        <th className="px-4 py-3 uppercase tracking-tighter">Annual Slab (NPR)</th>
                        <th className="px-4 py-3 uppercase tracking-tighter">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      <tr><td className="px-4 py-3">Up to 6,00,000</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">1%</td></tr>
                      <tr><td className="px-4 py-3">Next 2,00,000 (To 8L)</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">10%</td></tr>
                      <tr><td className="px-4 py-3">Next 3,00,000 (To 11L)</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">20%</td></tr>
                      <tr><td className="px-4 py-3">Next 9,00,000 (To 20L)</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">30%</td></tr>
                      <tr><td className="px-4 py-3">Above 20,00,000</td><td className="px-4 py-3 font-bold text-slate-900 dark:text-white">36%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-xl font-bold">Wait, I have Life Insurance!</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                  While this calculator provides a robust baseline and accounts for the latest slabs, it does not currently factor in <strong>Section 12L (Life Insurance Premium)</strong> or <strong>SSF (Social Security Fund)</strong> deductions which can provide additional tax benefits. For high-precision tax planning, we recommend consulting with a certified accountant or using the Inland Revenue Department (IRD) official portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
