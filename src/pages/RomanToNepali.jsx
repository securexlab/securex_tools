import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Info, Keyboard, Trash2, ArrowRightLeft, HelpCircle } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

const layoutMap = {
    '`': 'ऽ', '~': 'ँ', '1': '१', '!': '!', '2': '२', '@': '@', '3': '३', '#': '#',
    '4': '४', '$': '$', '5': '५', '%': '%', '6': '६', '^': '^', '7': '७', '&': '&',
    '8': '८', '*': '*', '9': '९', '(': '(', '0': '०', ')': ')', '-': '-', '_': '—',
    '=': '\u200D', '+': '\u200C', 'q': 'ट', 'Q': 'ठ', 'w': 'ौ', 'W': 'औ', 'e': 'े', 'E': 'ै',
    'r': 'र', 'R': 'ृ', 't': 'त', 'T': 'थ', 'y': 'य', 'Y': 'ञ', 'u': 'ु', 'U': 'ू',
    'i': 'ि', 'I': 'ी', 'o': 'ो', 'O': 'ओ', 'p': 'प', 'P': 'फ', '[': 'इ', '{': 'ई',
    ']': 'ए', '}': 'ऐ', '\\': 'ॐ', '|': 'ः', 'a': 'ा', 'A': 'आ', 's': 'स', 'S': 'श',
    'd': 'द', 'D': 'ध', 'f': 'उ', 'F': 'ऊ', 'g': 'ग', 'G': 'घ', 'h': 'ह', 'H': 'अ',
    'j': 'ज', 'J': 'झ', 'k': 'क', 'K': 'ख', 'l': 'ल', 'L': 'ळ', ';': ';', ':': ':',
    "'": "'", '"': '"', 'z': 'ष', 'Z': 'ऋ', 'x': 'ड', 'X': 'ढ', 'c': 'छ', 'C': 'च',
    'v': 'व', 'V': 'ँ', 'b': 'ब', 'B': 'भ', 'n': 'न', 'N': 'ण', 'm': 'म', 'M': 'ं',
    ',': ',', '<': 'ङ', '.': '.', '>': '।', '/': '्', '?': '?'
};

const keysRow1 = [
    { topL: 'ठ', btmL: 'ट', topR: 'Q', btmR: 'q' }, { topL: 'औ', btmL: 'ौ', topR: 'W', btmR: 'w' },
    { topL: 'ै', btmL: 'े', topR: 'E', btmR: 'e' }, { topL: 'ृ', btmL: 'र', topR: 'R', btmR: 'r' },
    { topL: 'थ', btmL: 'त', topR: 'T', btmR: 't' }, { topL: 'ञ', btmL: 'य', topR: 'Y', btmR: 'y' },
    { topL: 'ू', btmL: 'ु', topR: 'U', btmR: 'u' }, { topL: 'ी', btmL: 'ि', topR: 'I', btmR: 'i' },
    { topL: 'ओ', btmL: 'ो', topR: 'O', btmR: 'o' }, { topL: 'फ', btmL: 'प', topR: 'P', btmR: 'p' },
    { topL: 'ई', btmL: 'इ', topR: '{', btmR: '[' }, { topL: 'ऐ', btmL: 'ए', topR: '}', btmR: ']' }
];

const keysRow2 = [
    { topL: 'आ', btmL: 'ा', topR: 'A', btmR: 'a' }, { topL: 'श', btmL: 'स', topR: 'S', btmR: 's' },
    { topL: 'ध', btmL: 'द', topR: 'D', btmR: 'd' }, { topL: 'ऊ', btmL: 'उ', topR: 'F', btmR: 'f' },
    { topL: 'घ', btmL: 'ग', topR: 'G', btmR: 'g' }, { topL: 'अ', btmL: 'ह', topR: 'H', btmR: 'h' },
    { topL: 'झ', btmL: 'ज', topR: 'J', btmR: 'j' }, { topL: 'ख', btmL: 'क', topR: 'K', btmR: 'k' },
    { topL: 'ळ', btmL: 'ल', topR: 'L', btmR: 'l' }
];

const keysRow3 = [
    { topL: 'ऋ', btmL: 'ष', topR: 'Z', btmR: 'z' }, { topL: 'ढ', btmL: 'ड', topR: 'X', btmR: 'x' },
    { topL: 'च', btmL: 'छ', topR: 'C', btmR: 'c' }, { topL: 'ँ', btmL: 'व', topR: 'V', btmR: 'v' },
    { topL: 'भ', btmL: 'ब', topR: 'B', btmR: 'b' }, { topL: 'ण', btmL: 'न', topR: 'N', btmR: 'n' },
    { topL: 'ं', btmL: 'म', topR: 'M', btmR: 'm' }, { topL: 'ङ', btmL: ',', topR: '<', btmR: ',' },
    { topL: '।', btmL: '.', topR: '>', btmR: '.' }, { topL: '?', btmL: '्', topR: '?', btmR: '/' }
];

export default function RomanToNepali() {
  const [text, setText] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (!isEnabled || e.ctrlKey || e.metaKey || e.altKey) return;
    
    const char = e.key;
    if (layoutMap[char]) {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const mappedChar = layoutMap[char];
      const newText = text.substring(0, start) + mappedChar + text.substring(end);
      setText(newText);
      
      // Set cursor position after update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
  };

  const handlePaste = (e) => {
    if (!isEnabled) return;
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const converted = paste.split('').map(c => layoutMap[c] || c).join('');
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = text.substring(0, start) + converted + text.substring(end);
    setText(newText);
    
    setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + converted.length;
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <BackButton />
      
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/40">
        <h1 className="text-3xl font-bold tracking-tight">Nepali Unicode Keyboard (Romanized)</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-4xl">
          Official <strong>Romanized Unicode</strong> layout for professional Nepali typing. 
          Uses a strict 1-to-1 keystroke mapping required for government typing and Lok Sewa exams.
        </p>
        <div className="flex gap-6 mt-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                <Check className="w-3.5 h-3.5" /> 100% Client-Side
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                <Check className="w-3.5 h-3.5" /> Official Mapping
            </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 gap-4">
            <label className="flex items-center gap-3 cursor-pointer group text-sm font-bold text-slate-700 dark:text-slate-300">
                <div className={cn(
                    "w-10 h-5 rounded-full p-1 transition-colors relative",
                    isEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                )}>
                    <input 
                        type="checkbox" 
                        checked={isEnabled} 
                        onChange={() => setIsEnabled(!isEnabled)} 
                        className="sr-only"
                    />
                    <div className={cn(
                        "w-3 h-3 bg-white rounded-full transition-transform shadow-sm",
                        isEnabled ? "translate-x-5" : "translate-x-0"
                    )} />
                </div>
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                    {isEnabled ? "Nepali Mapping Enabled" : "English Mode (Disabled)"}
                </span>
            </label>
            <div className="flex gap-3">
                <button 
                    onClick={() => setText("")} 
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all uppercase tracking-widest"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
                <button 
                    onClick={handleCopy}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all shadow-lg",
                        copied ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Text"}
                </button>
            </div>
        </div>
        
        <textarea 
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={isEnabled ? "Start typing... (e.g. k i M k r / t v / y b i m u X /)" : "Type in English..."} 
            className="w-full h-[350px] p-8 text-2xl leading-relaxed focus:outline-none bg-white dark:bg-slate-900 dark:text-white transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
            spellCheck="false"
        />
        
        <div className="flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-8 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
            <span>Layout: Official Romanized Unicode</span>
            <span>{text.length} Characters</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                <Keyboard className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-bold">Keystroke Reference</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Press <kbd className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-bold mx-1">Shift</kbd> to type the top character on each key.</p>
            </div>
        </div>
        
        <div className="p-8 space-y-6 overflow-x-auto scrollbar-hide">
            {[keysRow1, keysRow2, keysRow3].map((row, rowIndex) => (
                <div key={rowIndex} className={cn("flex gap-2 min-w-max justify-center", rowIndex === 1 && "ml-8", rowIndex === 2 && "ml-16")}>
                    {row.map((k, i) => (
                        <div key={i} className="group w-[60px] h-[64px] border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 flex flex-col justify-between p-2.5 transition-all hover:border-blue-500 hover:scale-105 hover:shadow-lg hover:bg-white dark:hover:bg-slate-800 text-xs">
                            <div className="flex justify-between w-full">
                                <span className="font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600">{k.topL}</span>
                                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 group-hover:text-blue-500/50">{k.topR}</span>
                            </div>
                            <div className="flex justify-between w-full">
                                <span className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600/70">{k.btmL}</span>
                                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 group-hover:text-blue-500/50">{k.btmR}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div>
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <ArrowRightLeft className="w-3.5 h-3.5" /> Compound & Common Joints
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {[
                        { k: 'k + / + z', v: 'क्ष' }, { k: 't + / + r', v: 'त्र' },
                        { k: 'j + / + Y', v: 'ज्ञ' }, { k: 't + / + t', v: 'त्त' },
                        { k: 'd + / + D', v: 'द्ध' }, { k: 'd + / + v', v: 'द्व' },
                        { k: 'S + / + r', v: 'श्र' }, { k: 'H + a + M', v: 'आं' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-slate-50 dark:border-slate-800/50">
                            <span className="font-mono text-slate-400 group-hover:text-blue-600">{item.k}</span>
                            <span className="font-black text-blue-600 dark:text-blue-400">{item.v}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5" /> Practice Typing
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <p className="mb-3 text-xs font-bold text-slate-500 dark:text-slate-400">To type <span className="text-slate-900 dark:text-white underline decoration-blue-500 decoration-2 underline-offset-4">किंकर्तव्यबिमूढ्</span>, press these keys:</p>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-sm tracking-widest text-blue-600 dark:text-blue-400 shadow-sm">
                        k i M k r / t v / y b i m u U X /
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Mastering Romanized Nepali Unicode Typing</h2>
        <p>Typing in Devanagari often presents a steep learning curve for users accustomed to standard QWERTY keyboards. The Roman to Nepali Unicode Converter bridges this gap by implementing the official Romanized Unicode layout. This enables users to generate precise Nepali text by typing phonetically intuitive English keystrokes, making it the standard for government documentation and professional publishing.</p>
        <h3>Keymap Interception and String Manipulation</h3>
        <p>The technical foundation of this tool lies in its event-driven architecture and fixed-dictionary mapping. The application mounts a persistent <code>onKeyDown</code> listener directly onto the textarea. When a user strikes a key, the listener intercepts the event, preventing the default English character from rendering.</p>
        <p>It then queries a comprehensive, hardcoded JSON dictionary that correlates the specific ASCII keystroke (and its <code>Shift</code> modifier state) to its exact Devanagari hexadecimal Unicode counterpart. The engine executes a highly optimized string slice operation, inserting the mapped Unicode character precisely at the cursor's current index within the string. Furthermore, it supports clipboard paste events, automatically parsing and mapping entire blocks of text instantly. This client-side, zero-latency execution guarantees a seamless and secure typing experience.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Read about the history behind this typing layout in our full breakdown: <Link to="/blog/evolution-of-nepali-typography-preeti-to-unicode" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">The Evolution of Nepali Typography</Link>.</p>
      </div>
    </div>
  );
}
