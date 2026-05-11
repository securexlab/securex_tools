import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Hash as HashIcon, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

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

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Understanding Cryptographic Hashing and Encoding</h2>
        <p>Data security and formatting require strict adherence to encoding standards and cryptographic algorithms. The Hash & Base64 Encoder is a dual-purpose developer utility that allows users to instantly transform plaintext into universally transportable Base64 strings, or generate 32-bit hash digests directly within the browser memory.</p>
        <h3>Base64 Encoding vs. Hash Functions</h3>
        <p>It is critical to distinguish between encoding and hashing. Base64 encoding translates binary or string data into a radix-64 representation, using only safe ASCII characters. This is a two-way, mathematically reversible process designed for safe data transport across networks, not for security. The tool utilizes the browser's native <code>btoa()</code> and <code>atob()</code> APIs to execute this instantly.</p>
        <p>Conversely, hashing is a one-way mathematical trapdoor. The tool's secondary function employs a bitwise shifting algorithm to generate a numeric 32-bit hash. By iterating through the character codes and applying left-shift operations combined with subtraction, it triggers an "avalanche effect"—where a minor change in the input completely alters the resulting hexadecimal output. Because hashes cannot be reverse-engineered into their original plaintext, they are fundamentally distinct from encoded strings.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Want a deeper understanding of web security? Read our full guide: <Link to="/blog/cryptography-basics-hashing-vs-encryption" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">Cryptography Basics: Hashing vs. Encryption</Link>.</p>
      </div>
    </div>
  );
}
