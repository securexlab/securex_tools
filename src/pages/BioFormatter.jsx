import React, { useState } from "react";
import { Instagram, Twitter, Facebook, Copy, Check, Hash } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";
import RelatedReading from "../components/RelatedReading.jsx";

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

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Elevate Your Presence with Professional Bio Formatting</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
              "Your bio is your first impression in the digital world. Make it count."
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our <strong>Social Media Bio Formatter</strong> helps you stand out on Instagram, Threads, and Twitter. Standard text can look cluttered; our tool allows you to accurately track character counts across different platforms to ensure your message is never cut short.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Perfect for Creators</h3>
              <ul className="text-sm text-slate-500 space-y-2 list-disc pl-4">
                <li>Optimize Instagram profile readability.</li>
                <li>Add flair to your Threads introductions.</li>
                <li>Create unique captions for TikTok.</li>
                <li>Professional formatting for LinkedIn summaries.</li>
              </ul>
            </div>
            <div className="bg-blue-600 p-6 rounded-[2rem] text-white space-y-3 shadow-xl shadow-blue-500/20">
                <h4 className="font-bold">Character Limit Awareness</h4>
                <p className="text-xs text-blue-100 opacity-90 leading-relaxed">
                  Social platforms have strict limits (e.g., 150 for Instagram). Our tool tracks your length in real-time, providing immediate visual feedback if you exceed the allowed limit for any platform.
                </p>
            </div>
          </div>

          <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Supported Platforms</p>
            <div className="flex flex-wrap justify-center gap-6 opacity-60">
                <Instagram className="w-5 h-5" />
                <Twitter className="w-5 h-5" />
                <Facebook className="w-5 h-5" />
                <Hash className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    <RelatedReading category="text" />
    </div>
  );
}
