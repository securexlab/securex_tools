import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Copy, Check, Hash } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

const platformLimits = [
  { name: "Instagram", limit: 150, icon: Instagram, color: "pink" },
  { name: "Twitter / X", limit: 160, icon: Twitter, color: "slate" },
  { name: "Threads", limit: 500, icon: Instagram, color: "slate" },
  { name: "FB Intro", limit: 101, icon: Facebook, color: "blue" }
];

export default function BioFormatter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bio Formatter</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Check character limits and format perfect bios for all your social platforms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Draft Your Bio</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Introduce yourself here..."
            className="w-full h-80 p-8 glass-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xl font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-xl"
          />
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-slate-400">{text.length} Characters</span>
            <button 
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all shadow-lg",
                copied ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy Bio
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Status</label>
          <div className="grid gap-4">
            {platformLimits.map((p, i) => {
              const remaining = p.limit - text.length;
              const isOver = remaining < 0;
              return (
                <div key={i} className="glass-card p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-colors group-hover:bg-blue-600 group-hover:text-white",
                      isOver ? "text-red-500" : "text-slate-400"
                    )}>
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">{p.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Limit: {p.limit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-2xl font-black tracking-tight",
                      isOver ? "text-red-500" : "text-emerald-500"
                    )}>
                      {remaining}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Left</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Optimizing Social Media Bios and Character Counting</h2>
        <p>Crafting the perfect bio for platforms like Instagram, Twitter (X), Threads, and Facebook requires precision. Each platform imposes strict character limits on user profiles. The Bio Formatter is a specialized text utility that parses your input in real time, calculating exact string lengths against predefined platform constraints. By actively monitoring the character count, users can ensure their introductions remain within the allowed boundaries without truncation.</p>
        <h3>The Logic Behind Character Calculation</h3>
        <p>At a technical level, this tool relies on standard JavaScript string length properties, evaluating the UTF-16 code units of your text. It instantly binds to the textarea's change events, providing a millisecond-accurate reflection of remaining characters. As the user types, the application subtracts the current input length from the platform's maximum allowance (e.g., 150 for Instagram, 160 for Twitter). When the limit is breached, the UI conditionally applies error classes to visually alert the user.</p>
        <p>This immediate feedback loop is critical for content creators who need to condense complex information into concise, readable formats. Formatting text perfectly ensures cross-platform consistency and better audience engagement while avoiding awkward cut-offs on mobile displays.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Want to dive deeper into text processing and character encoding standards? Check out our guide: <Link to="/blog/evolution-of-nepali-typography-preeti-to-unicode" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">The Evolution of Nepali Typography</Link>.</p>
      </div>
    </div>
  );
}
