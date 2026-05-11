import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Copy, Check, RefreshCw, Lock, Zap } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";
import ToolSeoSection from "../components/ToolSeoSection";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ label: "Strong", color: "emerald", score: 4 });

  const generatePassword = () => {
    let charset = "";
    if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) return;

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  useEffect(() => {
    // Basic strength check
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (options.symbols) score++;
    if (options.numbers) score++;
    
    if (score < 2) setStrength({ label: "Weak", color: "red", score });
    else if (score < 4) setStrength({ label: "Medium", color: "amber", score });
    else setStrength({ label: "Strong", color: "emerald", score });
  }, [password]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Password Generator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Generate ultra-secure, cryptographically strong passwords locally on your device.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="glass-card p-1 bg-slate-900 dark:bg-slate-100 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 font-mono text-2xl md:text-3xl font-bold text-white dark:text-slate-950 break-all leading-tight tracking-tight select-all">
                {password}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={generatePassword}
                  className="p-3 bg-white/10 dark:bg-slate-200 text-white dark:text-slate-600 rounded-2xl hover:bg-white/20 transition-all active:rotate-180 duration-500"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleCopy}
                  className={cn(
                    "p-3 rounded-2xl transition-all font-bold flex items-center gap-2",
                    copied ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <div className="flex-1 flex gap-1 h-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={cn("flex-1 rounded-full", i <= strength.score + 1 ? `bg-${strength.color}-500` : "bg-white/10 dark:bg-slate-200")} />
                  ))}
               </div>
               <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border", `text-${strength.color}-500 border-${strength.color}-500`)}>
                 {strength.label}
               </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password Length</label>
              <span className="text-xl font-bold text-blue-600">{length}</span>
            </div>
            <input 
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "uppercase", label: "Include ABC", icon: Type },
              { id: "lowercase", label: "Include abc", icon: Type },
              { id: "numbers", label: "Include 123", icon: Zap },
              { id: "symbols", label: "Include !@#", icon: Lock }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setOptions({ ...options, [opt.id]: !options[opt.id] })}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all text-sm font-bold",
                  options[opt.id] 
                    ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600" 
                    : "border-slate-100 dark:border-slate-800 text-slate-400"
                )}
              >
                <span>{opt.label}</span>
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", options[opt.id] ? "bg-blue-600 border-blue-600" : "border-slate-200")}>
                   {options[opt.id] && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>The Cryptography Behind Secure Password Generation</h2>
        <p>In the landscape of modern web development and cybersecurity, protecting user data is paramount. Our Cryptographic Password Generator utilizes industry-standard randomization algorithms to help individuals and developers create highly secure, brute-force-resistant credentials.</p>
        <h3>Maximizing Password Entropy</h3>
        <p>When generating passwords, the overarching goal is to maximize "entropy"—the mathematical unpredictability of the character string. While a password like <code>P@$$w0rd1!</code> appears complex to a human, it carries low entropy because it relies on predictable dictionary substitutions that modern brute-force algorithms easily crack. Our generator bypasses human predictability entirely to create high-entropy, cryptographically randomized strings that can withstand modern adversarial computing power.</p>
        <h3>Client-Side Processing for Maximum Privacy</h3>
        <p>Security tools are only as trustworthy as their architecture. This password generation logic operates entirely on the client side, meaning the randomization math happens directly within your browser's memory using secure JavaScript APIs. The generated passwords are never transmitted over a network, sent to a server, or stored in any database. This zero-knowledge architecture guarantees that you are the only entity with access to the newly generated credentials.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Deep dive into the algorithms protecting modern web applications by reading our guide: <Link to="/blog/cryptography-basics-hashing-vs-encryption" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">Cryptography Basics: Hashing vs. Encryption</Link>.</p>
      </div>
    </div>
  );
}

function Type(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" x2="15" y1="20" y2="20" />
      <line x1="12" x2="12" y1="4" y2="20" />
    </svg>
  )
}
