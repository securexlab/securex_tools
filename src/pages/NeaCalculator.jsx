import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Receipt, Info, History, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

export default function NeaCalculator() {
  const [units, setUnits] = useState(100);
  const [details, setDetails] = useState({ total: 0, energyCharge: 0, service: 0 });

  const calculateBill = () => {
    let bill = 0;
    let serviceCharge = 0;
    
    // Simplified Tariff 2080 (Single Phase 5A)
    if (units <= 20) {
      serviceCharge = 30;
      bill = units * 3; 
    } else if (units <= 30) {
      serviceCharge = 50;
      bill = (20 * 3) + (units - 20) * 6.50;
    } else if (units <= 50) {
       serviceCharge = 75;
       bill = (20 * 3) + (10 * 6.50) + (units - 30) * 8.00;
    } else if (units <= 150) {
       serviceCharge = 100;
       bill = (20 * 3) + (10 * 6.50) + (20 * 8.00) + (units - 50) * 9.50;
    } else if (units <= 250) {
       serviceCharge = 125;
       bill = (20 * 3) + (10 * 6.50) + (20 * 8.00) + (100 * 9.50) + (units - 150) * 10.00;
    } else {
       serviceCharge = 150;
       bill = (20 * 3) + (10 * 6.50) + (20 * 8.00) + (100 * 9.50) + (100 * 10.00) + (units - 250) * 11.00;
    }

    setDetails({ total: bill + serviceCharge, energyCharge: bill, service: serviceCharge });
  };

  useEffect(() => {
    calculateBill();
  }, [units]);

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NEA Bill Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Estimate your monthly NEA electricity bill based on the latest 2080 Tariff rates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="glass-card p-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Monthly Consumption (Units)
              </label>
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400 font-mono">{units}</div>
            </div>
            <input 
              type="range"
              min="0"
              max="1000"
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
               <span>Min (0)</span>
               <span>Max (1000+)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Charge</p>
                <h4 className="text-2xl font-black">Rs. {details.service}</h4>
             </div>
             <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Energy Charge</p>
                <h4 className="text-2xl font-black">Rs. {(details.energyCharge || 0).toLocaleString()}</h4>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-12 bg-blue-600 text-white shadow-2xl relative overflow-hidden group">
              <Receipt className="absolute -bottom-6 -right-6 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 mb-6">Total Estimated Amount</p>
              <h3 className="text-7xl font-black tracking-tighter mb-8">Rs. {(details.total || 0).toLocaleString()}</h3>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm">
                Next Month Estimate <ArrowRight className="w-3.5 h-3.5" />
              </div>
           </div>

           <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <History className="w-3.5 h-3.5 text-blue-500" /> Tariff Slabs (5A)
              </h4>
              <div className="space-y-3">
                 {[
                   { u: "0 - 20 Units", r: "Rs 3.00 / Unit" },
                   { u: "21 - 30 Units", r: "Rs 6.50 / Unit" },
                   { u: "31 - 50 Units", r: "Rs 8.00 / Unit" },
                   { u: "51 - 150 Units", r: "Rs 9.50 / Unit" }
                 ].map((slab, i) => (
                   <div key={i} className="flex justify-between items-center text-xs font-bold p-3 bg-slate-50 dark:bg-slate-950 rounded-lg">
                      <span className="text-slate-500">{slab.u}</span>
                      <span className="text-blue-600">{slab.r}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex gap-4">
              <Info className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
                Note: Rates vary for 15A, 30A, and 60A connections. This calculator covers the most common <strong>5A Single Phase</strong> domestic household tariff.
              </p>
           </div>
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Deciphering Nepal Electricity Authority (NEA) Tariffs</h2>
        <p>Calculating utility costs in Nepal involves understanding layered, progressive billing structures. The NEA Bill Calculator is specifically engineered to demystify domestic electricity bills for the standard 5A Single Phase connection. By automating the tariff logic set by the Nepal Electricity Authority, it provides households with exact cost projections based on monthly unit consumption.</p>
        <h3>The Logic of Progressive Tiered Billing</h3>
        <p>Unlike flat-rate pricing, the NEA utilizes a tiered pricing algorithm where the cost per unit increases as consumption crosses specific thresholds. The application's core logic models this exact progressive structure. It evaluates the input units against defined boundaries (e.g., 20, 30, 50, 150, 250 units). For instance, the first 20 units are billed at a minimal base rate, but as consumption spills into the next tier, only the remaining units are subjected to the higher multiplier.</p>
        <p>Simultaneously, the system assigns a tier-specific fixed "Service Charge" that scales with usage. The engine mathematically aggregates the baseline energy charges across all breached slabs and adds the service charge, returning a mathematically exact total. This deterministic modeling ensures users can accurately audit their utility expenses without performing manual mathematics.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Explore more regarding regional metrics and mathematics in our article: <Link to="/blog/nepal-land-measurement-systems-explained" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">Nepal Land and Mathematics Systems Explained</Link>.</p>
      </div>
    </div>
  );
}
