import React, { useState } from "react";
import { Copy, Check, FileJson, Trash2, Quote, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">JSON Formatter</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Prettify, validate, and minify JSON data for easy reading and debugging.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={formatJson}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:bg-blue-700"
          >
            <Sparkles className="w-4 h-4" /> Prettify
          </button>
          <button 
            onClick={minifyJson}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90"
          >
            <Quote className="w-4 h-4" /> Minify
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input Raw JSON</label>
            <button 
              onClick={() => setInput("")}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className={cn(
              "w-full h-[500px] p-6 font-mono text-sm bg-white dark:bg-slate-900 border-2 rounded-2xl outline-none focus:ring-4 transition-all transition-shadow",
              error ? "border-red-100 dark:border-red-900 focus:ring-red-50/50" : "border-slate-100 dark:border-slate-800 focus:ring-blue-50/50"
            )}
          />
          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30 text-xs font-bold animate-in fade-in duration-300">
               <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Formatted Output</label>
            <button 
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                copied ? "bg-emerald-500 text-white" : "text-slate-400 bg-slate-50 dark:bg-slate-800 hover:text-blue-600"
              )}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
          <div className="w-full h-[500px] p-6 font-mono text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-auto text-blue-600 dark:text-blue-400 font-bold whitespace-pre">
            {output || <span className="text-slate-300 dark:text-slate-700 italic font-normal">Formatted JSON will appear here...</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          { label: "Valid JSON", icon: Check },
          { label: "Local Only", icon: FileJson },
          { label: "High Performance", icon: Sparkles }
        ].map((tag, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold text-slate-500">
            <tag.icon className="w-3.5 h-3.5" /> {tag.label}
          </div>
        ))}
      </div>

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">The Ultimate JSON Formatter & Validator</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Working with raw JSON can be a headache, especially when it's minified or deeply nested. Our <strong>JSON Formatter</strong> helps you transform ugly, unreadable blobs of data into beautifully indented, structured code. It also doubles as a <strong>JSON Validator</strong>, catching syntax errors (missing commas, quotes, etc.) in real-time.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-blue-600 rounded-[3rem] text-white space-y-4 shadow-xl shadow-blue-500/20">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileJson className="w-5 h-5 text-blue-200" />
                Prettify & Minify
              </h3>
              <p className="text-xs opacity-90 leading-relaxed font-medium">
                Choose between "Prettify" to make JSON human-readable for debugging, or "Minify" to remove all white spaces and line breaks for saving storage and improving API performance.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Key Features</h3>
              <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                <li>Instantly catch JSON syntax errors with line-by-line feedback.</li>
                <li>One-click copy to clipboard for quick implementation.</li>
                <li>Secure 100% client-side processing (No data sent to server).</li>
                <li>Dark mode support for comfortable late-night debugging.</li>
              </ul>
            </div>
          </div>

          <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex items-start gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold mb-2">How it works?</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                   Simply paste your raw JSON into the input box. Our engine uses the native <strong>JSON.parse()</strong> method to validate your data. If valid, <strong>JSON.stringify(data, null, 2)</strong> is used to create the beautifully formatted output you see on the right. If invalid, the exact error thrown by the JavaScript engine is displayed for you to fix.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
