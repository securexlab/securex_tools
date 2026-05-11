import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Maximize, Grid, Info, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";
import ToolSeoSection from "../components/ToolSeoSection";

export default function LandConverter() {
  const [activeSystem, setActiveSystem] = useState("hilly"); // hilly (Ropani) or terai (Bigha)

  // Hilly State
  const [ropani, setRopani] = useState(0);
  const [aana, setAana] = useState(0);
  const [paisa, setPaisa] = useState(0);
  const [daam, setDaam] = useState(0);

  // Terai State
  const [bigha, setBigha] = useState(0);
  const [kattha, setKattha] = useState(0);
  const [dhur, setDhur] = useState(0);

  const [sqFt, setSqFt] = useState(0);
  const [sqMt, setSqMt] = useState(0);

  const calculateHilly = () => {
    // 1 Ropani = 5476 sq ft
    // 1 Aana = 342.25 sq ft
    // 1 Paisa = 85.56 sq ft
    // 1 Daam = 21.39 sq ft
    const totalSqFt = (ropani * 5476) + (aana * 342.25) + (paisa * 85.56) + (daam * 21.39);
    setSqFt(totalSqFt);
    setSqMt(totalSqFt * 0.092903);
  };

  const calculateTerai = () => {
    // 1 Bigha = 72900 sq ft
    // 1 Kattha = 3645 sq ft
    // 1 Dhur = 182.25 sq ft
    const totalSqFt = (bigha * 72900) + (kattha * 3645) + (dhur * 182.25);
    setSqFt(totalSqFt);
    setSqMt(totalSqFt * 0.092903);
  };

  useEffect(() => {
    if (activeSystem === "hilly") calculateHilly();
    else calculateTerai();
  }, [ropani, aana, paisa, daam, bigha, kattha, dhur, activeSystem]);

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Land Converter</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Convert traditional Nepali land units to Square Feet and Square Meters.</p>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit mx-auto lg:mx-0 shadow-sm">
        <button 
          onClick={() => setActiveSystem("hilly")}
          className={cn("px-8 py-3 text-sm font-bold rounded-xl transition-all", activeSystem === "hilly" ? "bg-white dark:bg-slate-800 shadow-md text-blue-600" : "text-slate-400")}
        >
          Hilly System (R-A-P-D)
        </button>
        <button 
          onClick={() => setActiveSystem("terai")}
          className={cn("px-8 py-3 text-sm font-bold rounded-xl transition-all", activeSystem === "terai" ? "bg-white dark:bg-slate-800 shadow-md text-blue-600" : "text-slate-400")}
        >
          Terai System (B-K-D)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {activeSystem === "hilly" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Ropani", val: ropani, set: setRopani },
                { label: "Aana", val: aana, set: setAana },
                { label: "Paisa", val: paisa, set: setPaisa },
                { label: "Daam", val: daam, set: setDaam }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</label>
                  <input type="number" step="0.01" value={item.val} onChange={(e) => item.set(parseFloat(e.target.value) || 0)} className="w-full p-4 glass-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Bigha", val: bigha, set: setBigha },
                { label: "Kattha", val: kattha, set: setKattha },
                { label: "Dhur", val: dhur, set: setDhur }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</label>
                  <input type="number" step="0.01" value={item.val} onChange={(e) => item.set(parseFloat(e.target.value) || 0)} className="w-full p-4 glass-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
              ))}
            </div>
          )}

          <div className="p-8 bg-blue-600 text-white rounded-3xl shadow-xl space-y-6 relative overflow-hidden group">
             <RefreshCw className="absolute top-4 right-4 w-12 h-12 opacity-5 -mr-4 -mt-4 group-hover:rotate-180 transition-transform duration-1000" />
             <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Total Square Feet</p>
                <h4 className="text-5xl font-black tracking-tighter">{sqFt.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-xl opacity-40">ft²</span></h4>
             </div>
             <div className="pt-6 border-t border-white/20">
                <h4 className="text-3xl font-bold tracking-tight">{sqMt.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-base opacity-40">m²</span></h4>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Metric conversion</p>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Grid className="w-4 h-4 text-blue-500" /> Unit Comparison
              </h4>
              <div className="space-y-4">
                 {[
                   { u1: "1 Ropani", u2: "16 Aana" },
                   { u1: "1 Aana", u2: "4 Paisa" },
                   { u1: "1 Paisa", u2: "4 Daam" },
                   { u1: "1 Bigha", u2: "20 Kattha" },
                   { u1: "1 Kattha", u2: "20 Dhur" }
                 ].map((unit, i) => (
                   <div key={i} className="flex justify-between items-center text-sm font-medium p-3 bg-slate-50 dark:bg-slate-950 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-400">{unit.u1}</span>
                      <Maximize className="w-3 h-3 text-slate-300" />
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{unit.u2}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl flex gap-4">
              <Info className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Land measurements in Nepal vary significantly between the Hilly regions (using Ropani) and the Terai plains (using Bigha). Always cross-verify with official <strong>"Lalpurja"</strong> documents.
              </p>
           </div>
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Decoding Nepal's Traditional Land Measurement Systems</h2>
        <p>Understanding and converting traditional Nepali land measurement units is essential for real estate transactions, architectural planning, and legal property registration. Our Land Converter accurately translates local metrics from the Hilly and Terai regions into universal standard units like Square Feet and Square Meters.</p>
        <h3>The Mathematics of the Hilly System (Ropani)</h3>
        <p>In the mountainous and hilly regions of Nepal, including the Kathmandu Valley, land is traditionally measured using the Ropani system. The hierarchy is mathematically structured as follows: 1 Ropani consists of 16 Aana; 1 Aana contains 4 Paisa; and 1 Paisa is composed of 4 Daam. In standard terms, one complete Ropani equates exactly to 5,476 square feet. This conversion tool automatically aggregates your inputs across these four tiers and calculates the precise total area.</p>
        <h3>The Terai Measurement System (Bigha)</h3>
        <p>Conversely, the southern plains (Terai) utilize the Bigha system, which represents significantly larger plots of land. Under this framework, 1 Bigha equals 20 Kattha, and 1 Kattha contains 20 Dhur. A single Bigha translates to a massive 72,900 square feet (roughly 6,772 square meters). By leveraging these strict mathematical ratios, the converter ensures that buyers, sellers, and engineers maintain total precision when evaluating property sizes across different geographical zones.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Want a deeper understanding of historical land metrics? Check out our detailed guide: <Link to="/blog/nepal-land-measurement-systems-explained" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">Nepal Land Measurement Systems Explained</Link>.</p>
      </div>
    </div>
  );
}
