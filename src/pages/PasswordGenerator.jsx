import React, { useState, useEffect } from "react";
import { Shield, Copy, Check, RefreshCw, Lock, Zap } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

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

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">The Need for Cryptographically Strong Passwords</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Standard passwords like "password123" are cracked in milliseconds. Our <strong>Random Password Generator</strong> helps you create highly complex, unique strings that are virtually impossible to guess. By mixing uppercase letters, numbers, and specialty symbols, you significantly increase your digital security.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-900 text-white rounded-[3rem] space-y-4 shadow-xl">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Security First
              </h3>
              <p className="text-xs opacity-90 leading-relaxed font-medium">
                Our tool uses <strong>Math.random()</strong> and client-side JavaScript. This means your passwords are generated right in your browser. They are never sent to any server, ensuring that nobody—including us—ever sees the passwords you create.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Modern Security Standards</h3>
              <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                <li><strong>Length Matters:</strong> We recommend a minimum of 16 characters for critical accounts.</li>
                <li><strong>Symbols:</strong> Special characters like !@#$% increase entropy significantly.</li>
                <li><strong>Uniqueness:</strong> Never reuse the same password across multiple platforms.</li>
                <li><strong>Entropy:</strong> The randomness of your password determines how long it takes to crack.</li>
              </ul>
            </div>
          </div>

          <div className="p-10 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-600 text-white rounded-2xl">
                  <Lock className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100">Pro Tip: Use a Password Manager</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                While our tool is great for generating single strong passwords, we highly recommend using a reputable <strong>Password Manager</strong> (like Bitwarden, 1Password, or Dashlane) to store these complex strings safely. You only need to remember one master password, and the manager handles the rest!
            </p>
          </div>
        </div>
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
