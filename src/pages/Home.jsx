import React from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { motion } from "motion/react";
import { TOOLS } from "../constants";

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
           <Zap className="w-64 h-64 text-blue-500 transform rotate-12" />
        </div>
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Standard Utility Suite
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-50 mb-6 tracking-tight">
            SecureX <span className="text-blue-600">Lab</span> Tools
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-semibold max-w-2xl">
            A comprehensive, locally-processed utility ecosystem designed for the modern Nepali workflow. Privacy by design, no data leaves your browser.
          </p>
        </div>
      </section>

      {/* Tools Grid Area */}
      <div className="space-y-16">
        {TOOLS.map((cat, idx) => (
          <section key={idx} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className={`h-1 w-12 bg-blue-600 rounded-full`} />
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                {cat.category}
              </h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {cat.items.map((item, itemIdx) => (
                <Link 
                  key={itemIdx}
                  to={item.path}
                  className="group relative p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all active:scale-[0.96] flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className={`h-8 w-8 bg-${cat.color}-50 dark:bg-${cat.color}-900/20 text-${cat.color}-600 dark:text-${cat.color}-400 rounded-lg flex items-center justify-center mb-3 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 shadow-sm`}>
                      <cat.icon className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-[13px] text-slate-800 dark:text-slate-100 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 border-0">
                      {item.name}
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight font-medium opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Decorative Background Element */}
                  <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-slate-50 dark:bg-slate-800/50 rounded-full transition-transform group-hover:scale-[3] group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 -z-0" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
