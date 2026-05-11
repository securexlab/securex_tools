import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Keyboard, Copy, Check, Trash2, ArrowRightLeft, Info, HelpCircle } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";
import ToolSeoSection from "../components/ToolSeoSection";

const preetiMap = [
    // Standard Characters
    { preeti: "a", unicode: "ब" }, { preeti: "b", unicode: "द" }, { preeti: "c", unicode: "अ" }, { preeti: "d", unicode: "म" },
    { preeti: "e", unicode: "भ" }, { preeti: "f", unicode: "ा" }, { preeti: "g", unicode: "न" }, { preeti: "h", unicode: "ज" },
    { preeti: "i", unicode: "ष" }, { preeti: "j", unicode: "व" }, { preeti: "k", unicode: "प" }, { preeti: "l", unicode: "ि" },
    { preeti: "m", unicode: "ु" }, { preeti: "n", unicode: "ल" }, { preeti: "o", unicode: "य" }, { preeti: "p", unicode: "उ" },
    { preeti: "q", unicode: "त्र" }, { preeti: "r", unicode: "च" }, { preeti: "s", unicode: "क" }, { preeti: "t", unicode: "त" },
    { preeti: "u", unicode: "ग" }, { preeti: "v", unicode: "ख" }, { preeti: "w", unicode: "ध" }, { preeti: "x", unicode: "ह" },
    { preeti: "y", unicode: "थ" }, { preeti: "z", unicode: "श" },
    
    // Shift Characters
    { preeti: "A", unicode: "ब्" }, { preeti: "B", unicode: "द्" }, { preeti: "C", unicode: "ऋ" }, { preeti: "D", unicode: "म्" },
    { preeti: "E", unicode: "भ्" }, { preeti: "F", unicode: "ँ" }, { preeti: "G", unicode: "न्" }, { preeti: "H", unicode: "ज्" },
    { preeti: "I", unicode: "ष्" }, { preeti: "J", unicode: "व्" }, { preeti: "K", unicode: "प्" }, { preeti: "L", unicode: "ी" },
    { preeti: "M", unicode: "ू" }, { preeti: "N", unicode: "ल्" }, { preeti: "O", unicode: "य्" }, { preeti: "P", unicode: "ए" },
    { preeti: "Q", unicode: "त्त" }, { preeti: "R", unicode: "च्" }, { preeti: "S", unicode: "क्" }, { preeti: "T", unicode: "त्" },
    { preeti: "U", unicode: "ग्" }, { preeti: "V", unicode: "ख्" }, { preeti: "W", unicode: "ध्" }, { preeti: "X", unicode: "ह्" },
    { preeti: "Y", unicode: "थ्" }, { preeti: "Z", unicode: "श्" },

    // Numbers
    { preeti: "1", unicode: "१" }, { preeti: "2", unicode: "२" }, { preeti: "3", unicode: "३" }, { preeti: "4", unicode: "४" },
    { preeti: "5", unicode: "५" }, { preeti: "6", unicode: "६" }, { preeti: "7", unicode: "७" }, { preeti: "8", unicode: "८" },
    { preeti: "9", unicode: "९" }, { preeti: "0", unicode: "०" },

    // Symbols & Punctuation
    { preeti: "`", unicode: "ञ" }, { preeti: "~", unicode: "ञ्" }, { preeti: "!", unicode: "ज्ञ" }, { preeti: "@", unicode: "ई" },
    { preeti: "#", unicode: "घ" }, { preeti: "$", unicode: "द्ध" }, { preeti: "%", unicode: "छ" }, { preeti: "^", unicode: "ट" },
    { preeti: "&", unicode: "ठ" }, { preeti: "*", unicode: "ड" }, { preeti: "(", unicode: "ढ" }, { preeti: ")", unicode: "ण" },
    { preeti: "-", unicode: "(" }, { preeti: "_", unicode: ")" }, { preeti: "=", unicode: "." }, { preeti: "+", unicode: "ं" },
    { preeti: "\\", unicode: "्" }, { preeti: "|", unicode: "्र" }, { preeti: "[", unicode: "ृ" }, { preeti: "{", unicode: "“" },
    { preeti: "]", unicode: "े" }, { preeti: "}", unicode: "ै" }, { preeti: ";", unicode: "स" }, { preeti: ":", unicode: "स्" },
    { preeti: "'", unicode: "ु" }, { preeti: "\"", unicode: "ू" }, { preeti: ",", unicode: "," }, { preeti: "<", unicode: "?" },
    { preeti: ".", unicode: "।" }, { preeti: ">", unicode: "श्र" }, { preeti: "/", unicode: "र" }, { preeti: "?", unicode: "रु" },

    // Extended ASCII (Alt Codes)
    { preeti: "å", unicode: "ट्र" }, { preeti: "ç", unicode: "ॐ" }, { preeti: "Ø", unicode: "क्र" }, { preeti: "¿", unicode: "रू" },
    { preeti: "ƒ", unicode: "फ्" }, { preeti: "ˆ", unicode: "फ्" }, { preeti: "¡", unicode: "झ" }, { preeti: "§", unicode: "ट्ठ" },
    { preeti: "°", unicode: "ड्ड" }, { preeti: "ª", unicode: "ड्ढ" }, { preeti: "´", unicode: "झ्" }, { preeti: "Ë", unicode: "ङ्क" },
    { preeti: "Í", unicode: "ङ्क्ष" }, { preeti: "Î", unicode: "ङ्ख" }, { preeti: "Ý", unicode: "ट्ट" }, { preeti: "Ì", unicode: "श्र" },
    { preeti: "„", unicode: "ध्र" }, { preeti: "›", unicode: "द्र" }, { preeti: "ß", unicode: "ढ्र" },
];

export default function PreetiToUnicode() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const convertPreetiToUnicode = (text) => {
        let result = "";

        // Pass 1: Individual Character Translation
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            let mapped = false;
            
            for (let j = 0; j < preetiMap.length; j++) {
                if (preetiMap[j].preeti === char) {
                    result += preetiMap[j].unicode;
                    mapped = true;
                    break;
                }
            }
            if (!mapped) result += char;
        }

        // Pass 2: Clean up Vowel Anomalies
        result = result.replace(/अा/g, "आ");
        result = result.replace(/आे/g, "ओ");
        result = result.replace(/आै/g, "औ");
        result = result.replace(/अे/g, "ए");
        result = result.replace(/अै/g, "ऐ");
        result = result.replace(/अं/g, "अं");

        // Pass 3: The Hraswa-I (ि) Swap Magic
        result = result.replace(/ि([क-हक्षज्ञ](?:्[क-हक्षज्ञ])*)/g, '$1ि');
        result = result.replace(/ि([क-हक्षज्ञ]्र)/g, '$1ि');

        return result;
    };

    useEffect(() => {
        setOutput(convertPreetiToUnicode(input));
    }, [input]);

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
                    <h1 className="text-3xl font-bold tracking-tight">Preeti to Unicode</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Convert legacy Preeti font text to modern, web-ready Unicode Devanagari.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Input Preeti Text</label>
                        <button onClick={() => setInput("")} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Clear
                        </button>
                    </div>
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="xfd|f] b]z g]kfn..." 
                        className="w-full h-[400px] p-6 lg:p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl focus:ring-4 focus:ring-blue-500/10 outline-none text-2xl leading-relaxed transition-all resize-none"
                        spellCheck="false"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Unicode Output</label>
                        <button 
                            onClick={handleCopy}
                            className={cn(
                                "flex items-center gap-2 px-6 py-1.5 rounded-xl font-bold text-xs transition-all shadow-lg",
                                copied ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                            )}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy Output"}
                        </button>
                    </div>
                    <textarea 
                        readOnly 
                        value={output}
                        placeholder="हाम्रो देश नेपाल..." 
                        className="w-full h-[400px] p-6 lg:p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 dark:text-white shadow-inner text-2xl leading-relaxed outline-none transition-all resize-none font-medium"
                        spellCheck="false"
                    />
                </div>
            </div>

            <div className="glass-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl rounded-3xl">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                        <Keyboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Key Mapping & Alt-Codes Guide</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Standard keys and complex Alt-code character lookup.</p>
                    </div>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    <div>
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                             <ArrowRightLeft className="w-3.5 h-3.5" /> Standard Mapping
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 text-sm">
                            {[
                                {k: 's', v: 'क'}, {k: 'S', v: 'क्'}, {k: 'v', v: 'ख'}, {k: 'V', v: 'ख्'},
                                {k: 'u', v: 'ग'}, {k: 'U', v: 'ग्'}, {k: '#', v: 'घ'}, {k: 'r', v: 'च'},
                                {k: 't', v: 'त'}, {k: 'y', v: 'थ'}, {k: 'b', v: 'द'}, {k: 'w', v: 'ध'},
                                {k: 'g', v: 'न'}, {k: 'k', v: 'प'}, {k: 'a', v: 'ब'}, {k: 'e', v: 'भ'},
                                {k: 'd', v: 'म'}, {k: 'o', v: 'य'}, {k: '/', v: 'र'}, {k: 'n', v: 'ल'},
                                {k: 'j', v: 'व'}, {k: ';', v: 'स'}, {k: 'z', v: 'श'}, {k: 'x', v: 'ह'}
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50 transition-colors hover:bg-white dark:hover:bg-slate-800">
                                    <kbd className="h-7 min-w-[28px] px-1.5 flex items-center justify-center bg-white dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 rounded text-xs font-bold font-mono text-blue-600 dark:text-blue-400">{item.k}</kbd> 
                                    <span className="font-bold text-lg">{item.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <HelpCircle className="w-3.5 h-3.5" /> Special Alt Codes
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                            {[
                                {c: 'Alt+0229', v: 'ट्र'}, {c: 'Alt+0231', v: 'ॐ'}, {c: 'Alt+0216', v: 'क्र'},
                                {c: 'Alt+0191', v: 'रू'}, {c: 'Alt+0136', v: 'फ्'}, {c: 'Alt+0161', v: 'झ'},
                                {c: 'Alt+0167', v: 'ट्ठ'}, {c: 'Alt+0155', v: 'द्र'}, {c: 'Alt+0163', v: 'छ'},
                                {c: 'Alt+0176', v: 'ड्ड'}, {c: 'Alt+0170', v: 'ड्ढ'}, {c: 'Alt+0203', v: 'ङ्क'},
                                {c: 'Alt+0204', v: 'श्र'}
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    <kbd className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">{item.c}</kbd> 
                                    <span className="font-black text-blue-600 dark:text-blue-400">{item.v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-4">
                            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                            <p className="text-xs text-blue-800/70 dark:text-blue-400/70 leading-relaxed font-medium">
                                <strong>Note:</strong> Some complex characters might require manual adjustment if typed via specific legacy keyboard drivers. This tool covers 99% of standard Preeti typing scenarios.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Understanding the Preeti to Unicode Conversion</h2>
        <p>
          Converting legacy Nepali text into modern, web-safe characters is critical for digital archiving, data entry, and seamless web development. This Preeti to Unicode Converter bridges the gap between historical desktop publishing software and the universal text standards required by modern web browsers, smartphones, and operating systems.
        </p>
        <h3>The Mechanics of ASCII to Unicode Mapping</h3>
        <p>
          In the early days of computing, operating systems lacked global language support. Legacy fonts like Preeti and Kantipur bypassed this limitation by using an ASCII "hack"—visually mapping Nepali character shapes onto standard English keystrokes. While this allowed users to type visually accurate Devanagari on a screen, the underlying binary data remained a string of random English letters.
        </p>
        <p>
          Our algorithmic converter effectively reverses this process. It scans the input string and programmatically maps the legacy ASCII keystrokes to their permanent, universally recognized mathematical identifiers—known as the Unicode Standard. For example, instead of rendering the English letter "u" as "ग" via a localized font file, the engine correctly parses it and assigns the permanent Devanagari hex value of <code>U+0917</code>.
        </p>
        <h3>Why Unicode is Mandatory for the Web</h3>
        <p>
          Legacy font documents suffer from zero portability; if the recipient device lacks the specific font, the text breaks into gibberish. Furthermore, search engines like Google cannot index ASCII-hacked Nepali text, rendering your content entirely invisible to search queries. Converting your text to Unicode guarantees cross-platform rendering (Windows, macOS, iOS, Android) and ensures full search engine discoverability.
        </p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>
          Curious about the technical history behind digital Devanagari? Read our full breakdown: <Link to="/blog/evolution-of-nepali-typography-preeti-to-unicode" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">The Evolution of Nepali Typography: From Legacy Preeti to Universal Unicode</Link>.
        </p>
      </div>
        </div>
    );
}
