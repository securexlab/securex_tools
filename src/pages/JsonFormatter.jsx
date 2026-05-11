import React, { useState } from "react";
import { Link } from "react-router-dom";
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

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Parsing and Standardizing JSON Data Structures</h2>
        <p>JavaScript Object Notation (JSON) is the universal standard for data exchange across modern APIs and web applications. However, unformatted or minified JSON is nearly impossible for developers to read or debug. The JSON Formatter acts as a client-side parsing engine that validates, prettifies, and compresses JSON payloads instantly, ensuring data integrity without transmitting sensitive information to external servers.</p>
        <h3>The Mechanics of Abstract Syntax Tree Parsing</h3>
        <p>When a user inputs a raw string, the application utilizes the browser's native JavaScript engine to parse the text into an Abstract Syntax Tree (AST). If the syntax is malformed, the parser immediately catches the exception and surfaces a precise error, preventing application crashes.</p>
        <p>For valid data, the tool runs a stringification process. When "Prettify" is invoked, the algorithm injects standardized indentation (typically two spaces) and line breaks, visually nesting the hierarchical data. When "Minify" is selected, the engine strips all non-essential whitespace, line breaks, and carriage returns, reducing the total byte size of the payload. This seamless manipulation of object properties ensures developers can easily inspect API responses or optimize data for network transmission.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Check out our deeper dive into typography and string processing: <Link to="/blog/evolution-of-nepali-typography-preeti-to-unicode" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">The Evolution of Nepali Typography</Link>.</p>
      </div>
    </div>
  );
}
