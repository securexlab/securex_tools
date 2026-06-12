import React, { useState } from "react";
import { Copy, Check, Hash as HashIcon, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";
import RelatedReading from "../components/RelatedReading.jsx";

export default function HashEncoder() {
  const [input, setInput] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  const encodeBase64 = (str) => {
    try { return btoa(str); } catch (e) { return "Invalid Input"; }
  };

  const decodeBase64 = (str) => {
    try { return atob(str); } catch (e) { return "Invalid Base64"; }
  };

  // Simple placeholder for MD5 (In real app we'd use a small MD5 lib)
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const results = [
    { label: "Base64 Encoded", value: encodeBase64(input), icon: Lock, color: "blue" },
    { label: "Base64 Decoded", value: decodeBase64(input), icon: ArrowRight, color: "emerald" },
    { label: "Text Hash (32-bit)", value: simpleHash(input), icon: HashIcon, color: "amber" },
    { label: "URL Encoded", value: encodeURIComponent(input), icon: ShieldCheck, color: "indigo" }
  ];

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hash & Base64</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Encode, decode, and generate text hashes instantly with local browser processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text to encode/decode..."
            className="w-full h-80 p-8 glass-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium resize-none shadow-xl"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outputs</label>
          <div className="grid gap-4">
            {results.map((res, i) => (
              <div key={i} className="glass-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-${res.color}-50 dark:bg-${res.color}-900/20 text-${res.color}-600 dark:text-${res.color}-400`}>
                      <res.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{res.label}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(res.value, i)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                      copiedKey === i ? "bg-emerald-500 text-white" : "text-slate-400 bg-slate-50 dark:bg-slate-800 hover:text-blue-600"
                    )}
                  >
                    {copiedKey === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === i ? "COPIED" : "COPY"}
                  </button>
                </div>
                <div className="font-mono text-sm break-all font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {input ? res.value : <span className="opacity-20 italic">Waiting for input...</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Why use our Hash & Base64 Tool?</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
              "Data integrity and secure encoding at your fingertips."
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Whether you are a developer debugging API responses or a security enthusiast checking data integrity, our <strong>Hash & Base64 Encoder/Decoder</strong> provides a fast, client-side way to manipulate text strings. All processing happens right in your browser, meaning your data never leaves your device.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-blue-600 rounded-[3rem] text-white space-y-4 shadow-xl shadow-blue-500/20">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-200" />
                Base64 Encoding
              </h3>
              <p className="text-xs opacity-90 leading-relaxed font-medium">
                Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format. It is commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Common Use Cases</h3>
              <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                <li>Encoding URLs to safely pass data in query parameters.</li>
                <li>Obfuscating sensitive text strings in configuration files.</li>
                <li>Generating simple hashes to verify text hasn't been altered.</li>
                <li>Decoding legacy data formats that use Base64.</li>
              </ul>
            </div>
          </div>

          <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex items-start gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold mb-2">Privacy & Security First</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                   Unlike other online encoders that send your text to their servers, our tool uses <strong>JavaScript btoa() and atob()</strong> methods natively in your browser. This ensures that your private keys, passwords, or sensitive text strings are never intercepted or stored on any server.
                </p>
            </div>
          </div>
        </div>
      </div>
    <RelatedReading category="security" />
    </div>
  );
}
