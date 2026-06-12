import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Lock, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

// NOTE: You don't need useTheme here if you are handling
// the dark/light background color in this component manually 
// with dark:bg-slate-900.

const slides = [
  {
    title: "Secure Document Converters",
    description: "Convert PDF, Word, and Excel files locally. Your data never leaves your browser.",
    cta: "Convert Now",
    path: "/pdf-to-word",
    icon: Shield,
    color: "blue",
  },
  {
    title: "Nepali Language Suite",
    description: "Professional Preeti to Unicode and Roman to Nepali tools designed for speed.",
    cta: "View Language Tools",
    path: "/preeti-unicode",
    icon: Zap,
    color: "orange",
  },
  {
    title: "Privacy First Analytics",
    description: "Built for the modern Nepali workflow with full privacy by design.",
    cta: "Explore Dashboard",
    path: "/word-counter",
    icon: Lock,
    color: "emerald",
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Ensuring background color is set to dark by default for high-end look
    <section className="relative h-[450px] w-full overflow-hidden rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 p-8 lg:p-16 flex flex-col justify-center"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] -z-0" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Standard Utility Suite
            </div>
            
            {/* FIX 1: Title made slightly smaller so it stays on one line */}
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-slate-50 mb-6 tracking-tight leading-tight">
              {slides[current].title.split(" ").map((word, i) => (
                // We make the middle word blue for that premium SaaS highlight look
                <span key={i} className={i === 1 ? "text-blue-600" : ""}>{word} </span>
              ))}
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg lg:text-xl leading-relaxed font-semibold max-w-2xl mb-8 opacity-90">
              {slides[current].description}
            </p>

            <Link href={slides[current].path} className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 group shadow-lg shadow-blue-600/20">
              {slides[current].cta}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Large Abstract Icon Decoration (Optional) */}
          <div className="absolute right-0 bottom-0 p-8 opacity-5">
             {React.createElement(slides[current].icon, { size: 300 })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* FIX 2: Dots moved to the center using relative absolute positioning */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            // Taller, rounder dots for a modern look
            className={`transition-all duration-300 rounded-full ${current === i ? "w-8 h-1.5 bg-blue-600" : "w-2.5 h-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}