import React, { useState, useEffect, useRef } from "react";
import { Trash2, Type, Clock, Hash, AlignLeft, FileText, Upload, Loader2 } from "lucide-react";
import BackButton from "../components/BackButton";
import RelatedReading from "../components/RelatedReading.jsx";
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

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Free Online Word Counter & Reading Time Calculator</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Whether you are a student writing an essay, a blogger crafting a new post, or a professional preparing a report, our <strong>Word Counter</strong> provides the precise metrics you need. It goes beyond simple counting by offering deep insights into your writing structure and readability.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold mb-2">Docx & PDF Support</h4>
              <p className="text-sm text-slate-500">Upload your Word documents or PDF files directly to extract text and count words without opening another app.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold mb-2">Reading Time</h4>
              <p className="text-sm text-slate-500">Estimated based on an average speed of 200 Words Per Minute (WPM), helping you optimize content length for your audience.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <AlignLeft className="w-5 h-5" />
              </div>
              <h4 className="font-bold mb-2">Detailed Metrics</h4>
              <p className="text-sm text-slate-500">Track character counts with and without spaces, and see exactly how many sentences make up your document.</p>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-xl font-bold">Why use SecureX Lab Word Counter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              Most online counters only look at English text. Our tool is optimized for both <strong>English</strong> and <strong>Nepali</strong> (Devanagari) characters. It correctly identifies Nepali sentence endings (Purna Biram ।) to provide accurate sentence counts for local content creators.
            </p>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              No Data Stored • Privacy Focused • 100% Client-Side Processing
            </div>
          </section>
        </div>
      </div>
    <RelatedReading category="text" />
    </div>
  );
}
