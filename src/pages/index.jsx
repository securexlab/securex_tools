import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { TOOLS } from "../constants";
import HeroSlider from "../components/HeroSlider";

export default function Home() {
  return (
    <div className="space-y-12 pb-20 pt-16">
      {/* 1. High-End Hero Slider Section */}
      <HeroSlider />

      {/* 2. Tools Grid Area */}
      <div className="space-y-16">
        {TOOLS.map((cat, idx) => (
          <section key={idx} className="space-y-8">
            {/* Category Header */}
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-blue-600 rounded-full" />
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                {cat.category}
              </h4>
            </div>
            
            {/* Responsive Grid System */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {cat.items.map((item, itemIdx) => (
                <motion.div
                  key={itemIdx}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link 
                    href={item.path}
                    className="group relative h-full p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div className="relative z-10">
                      {/* Icon Container */}
                      <div className={`h-10 w-10 bg-${cat.color}-50 dark:bg-${cat.color}-900/20 text-${cat.color}-600 dark:text-${cat.color}-400 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:bg-blue-600 group-hover:text-white shadow-sm`}>
                        <cat.icon className="w-5 h-5" />
                      </div>

                      {/* Tool Name */}
                      <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.name}
                      </h5>

                      {/* Tool Description */}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                    
                    {/* Arrow Indicator (Visible on Hover) */}
                    <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    </div>

                    {/* Decorative Abstract Background Shape */}
                    <div className="absolute -bottom-6 -right-6 h-16 w-16 bg-slate-50 dark:bg-slate-800/50 rounded-full transition-transform group-hover:scale-[3.5] group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 -z-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 3. Global Stats/Trust Bar (Optional - Great for SaaS feel) */}
      <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">100%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Private & Local</p>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">20+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Utility Tools</p>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">Free</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">No Subscription</p>
          </div>
        </div>
      </section>
    </div>
  );
}