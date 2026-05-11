import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Trash2, Type, Clock, Hash, AlignLeft, FileText, Upload, Loader2 } from "lucide-react";
import BackButton from "../components/BackButton";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// Set worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function WordCounter() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    sentences: 0,
    readingTime: 0
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?।]/).filter(s => s.trim().length > 0).length;
    
    // Average reading speed is ~200 words per minute
    const readingTime = Math.ceil(words / 200);

    setStats({ words, chars, charsNoSpaces, sentences, readingTime });
  }, [text]);

  const handleClear = () => setText("");

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => "str" in item ? item.str : "");
          fullText += strings.join(" ").replace(/\s+/g, " ") + "\n";
        }
        setText(fullText);
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        file.name.endsWith(".docx")
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => setText(event.target?.result);
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process file. Please use a standard .docx or .pdf file.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Word Counter</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time statistics for your content with estimated reading time.</p>
        </div>
        <div className="flex gap-3">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".docx,.pdf,.txt"
                className="hidden"
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Upload File (.docx, .pdf)
            </button>
            <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 transition-colors"
            >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Workspace
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Words", value: stats.words, icon: Type, color: "blue" },
          { label: "Characters", value: stats.chars, icon: Hash, color: "emerald" },
          { label: "Sentences", value: stats.sentences, icon: AlignLeft, color: "amber" },
          { label: "No Spaces", value: stats.charsNoSpaces, icon: Hash, color: "indigo" },
          { label: "Read Time", value: `${stats.readingTime}m`, icon: Clock, color: "pink" }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
            <div className={`p-2 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 mb-2`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your content here to calculate stats instantly..."
          className="w-full h-96 p-8 glass-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-lg font-medium leading-relaxed"
        />
        <div className="absolute bottom-6 right-8 text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[.2em]">
          Ready to Process
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Real-Time Text Analytics and Reading Time Estimation</h2>
        <p>For writers, journalists, and SEO professionals, analyzing text metrics is crucial for optimizing content length and pacing. The Word Counter is a client-side text processing engine that instantly computes character densities, word counts, sentence boundaries, and average reading times. It handles both direct text input and direct extraction from uploaded DOCX and PDF files.</p>
        <h3>Regular Expressions and Metric Algorithms</h3>
        <p>The application relies on a suite of optimized Regular Expressions (RegEx) to parse the active string state. Words are calculated by matching consecutive non-whitespace characters (<code>/\s+/</code>), while sentence counts are derived by splitting the string at standard terminal punctuation marks like periods, exclamation points, and the Devanagari Danda (<code>/[.!?।]/</code>). Characters excluding spaces are found by stripping whitespaces globally (<code>/\s/g</code>).</p>
        <p>For file uploads, the tool utilizes embedded Web Workers via <code>pdfjs-dist</code> to asynchronously extract text vectors from PDF binaries, and <code>mammoth.js</code> to parse raw text streams from DOCX XML trees. Finally, it applies a standardized algorithm—dividing the total word count by an average human reading speed of 200 words per minute—to dynamically render accurate reading time estimations.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Dive deep into text formatting and character encoding history: <Link to="/blog/evolution-of-nepali-typography-preeti-to-unicode" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">The Evolution of Nepali Typography</Link>.</p>
      </div>
    </div>
  );
}
