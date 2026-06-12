import React, { useState } from "react";
import { UserCheck, ShieldAlert, CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "../lib/utils";
import RelatedReading from "../components/RelatedReading.jsx";
import BackButton from "../components/BackButton";

export default function LokSewaAge() {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [isDisable, setIsDisable] = useState(false);
  const [isHealth, setIsHealth] = useState(false);
  const [result, setResult] = useState(null);

  const checkEligibility = () => {
    if (!dob) return;
    const birth = new Date(dob);
    const today = new Date(); // Usually advertisement date is used, but for general check today works
    
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    let minAge = 18;
    let maxAge = 35;

    if (gender === "female" || isDisable) {
        maxAge = 40;
    }
    if (isHealth) {
        maxAge = 45;
    }

    const eligible = age >= minAge && age <= maxAge;
    setResult({ age, minAge, maxAge, eligible });
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lok Sewa Age Checker</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Check your age eligibility for various Civil Service positions in Nepal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5" /> Select Gender
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl">
              {["male", "female", "others"].map(g => (
                <button 
                  key={g}
                  onClick={() => setGender(g)}
                  className={cn(
                    "flex-1 py-3 text-sm font-bold rounded-xl capitalize transition-all",
                    gender === g ? "bg-white dark:bg-slate-800 shadow-md text-blue-600" : "text-slate-400"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth (AD)</label>
            <input 
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button 
               onClick={() => setIsDisable(!isDisable)}
               className={cn(
                 "p-4 rounded-2xl border-2 flex items-center gap-3 transition-all",
                 isDisable ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-600 font-bold" : "border-slate-100 dark:border-slate-800 text-slate-400 font-medium"
               )}
             >
                <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center", isDisable ? "bg-amber-500 border-amber-500" : "border-slate-200")}>
                  {isDisable && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">Disabled Category</span>
             </button>
             <button 
               onClick={() => setIsHealth(!isHealth)}
               className={cn(
                 "p-4 rounded-2xl border-2 flex items-center gap-3 transition-all",
                 isHealth ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600 font-bold" : "border-slate-100 dark:border-slate-800 text-slate-400 font-medium"
               )}
             >
                <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center", isHealth ? "bg-blue-500 border-blue-500" : "border-slate-200")}>
                  {isHealth && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">Health Service</span>
             </button>
          </div>

          <button 
            onClick={checkEligibility}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl active:scale-95"
          >
            Verify Eligibility
          </button>
        </div>

        <div>
           {result ? (
             <div className="space-y-6">
                <div className={cn(
                  "glass-card p-10 text-center space-y-4 shadow-2xl relative overflow-hidden",
                  result.eligible ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                )}>
                   {result.eligible ? <CheckCircle2 className="w-16 h-16 mx-auto opacity-20 absolute -top-4 -right-4" /> : <XCircle className="w-16 h-16 mx-auto opacity-20 absolute -top-4 -right-4" />}
                   
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-70">Calculated Age</p>
                     <h3 className="text-7xl font-black tracking-tighter">{result.age} <span className="text-2xl font-medium opacity-50">Yrs</span></h3>
                   </div>

                   <div className="pt-6 border-t border-white/20">
                      <p className="text-2xl font-bold tracking-tight">
                        {result.eligible ? "Eligible to Apply" : "Ineligible / Over Age"}
                      </p>
                      <p className="text-xs font-bold opacity-60 mt-1 uppercase tracking-widest">
                        Allowed limit: {result.minAge} - {result.maxAge} Years
                      </p>
                   </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Eligibility Rules
                   </h4>
                   <div className="space-y-3">
                      {[
                        { l: "General Male", r: "Up to 35 Yrs" },
                        { l: "General Female", r: "Up to 40 Yrs" },
                        { l: "Disabled", r: "Up to 40 Yrs" },
                        { l: "Health Service", r: "Up to 45 Yrs" }
                      ].map((rule, i) => (
                        <div key={i} className="flex justify-between items-center text-xs px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                           <span className="font-bold text-slate-500">{rule.l}</span>
                           <span className="text-slate-800 dark:text-slate-100 font-black">{rule.r}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] text-slate-300 dark:text-slate-700">
                <Info className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest">Enter data to check results</p>
             </div>
           )}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Official Lok Sewa Age Eligibility Rules</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Applying for the Public Service Commission (PSC) in Nepal requires strict adherence to age limits. Our <strong>Lok Sewa Age Checker</strong> helps you determine if you fall within the mandatory age brackets for non-technical and technical civil service positions.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-blue-600 rounded-[3rem] text-white space-y-4 shadow-xl shadow-blue-500/20">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-200" />
                Category Specific Limits
              </h3>
              <p className="text-xs opacity-90 leading-relaxed font-medium">
                Limits vary significantly based on your gender and category. For example, while the limit for male candidates in administrative roles is 35, it extends to 40 for female candidates and those with disabilities. Health services have the highest threshold at 45.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">How to use this tool?</h3>
              <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                <li>Select your gender (this affects the maximum age).</li>
                <li>Enter your Date of Birth as per your citizenship certificate.</li>
                <li>Check "Disabled Category" if you are applying through a disability quota.</li>
                <li>Check "Health Service" for nursing, doctors, or medical technician roles.</li>
                <li>The tool instantly tells you if you are eligible based on the current date.</li>
              </ul>
            </div>
          </div>

          <div className="p-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Important Disclaimer
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
                Age eligibility for Lok Sewa is usually calculated based on the <strong>last date of advertisement application</strong> (without double fee). While this tool uses the current date to give you a quick check, please refer to the specific advertisement PDF from the PSC portal (psc.gov.np) for the final confirmation of terms.
            </p>
          </div>
        </div>
      </div>
      <RelatedReading category="math" /> 
    </div>
  );
}
