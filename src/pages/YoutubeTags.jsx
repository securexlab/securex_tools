import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Youtube, Search, Copy, Check, Hash, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

const tagGroups = [
  { name: "General Vlog", tags: ["Nepali Vlog", "Nepal Travel", "Daily Life Nepal", "Kathmandu Vlog", "Nepali YouTuber", "Nepali Culture"] },
  { name: "News & Tech", tags: ["Nepal News Live", "Tech in Nepal", "Nepali Tech Insider", "Gadget Review Nepal", "Nepali Samachar", "Internet in Nepal"] },
  { name: "Music & Ent.", tags: ["Nepali Song 2081", "Nepali Movie", "Comedy Nepal", "Nepali Music Video", "Nepal Idol", "The Voice of Nepal"] },
  { name: "Gaming", tags: ["PUBG Mobile Nepal", "Free Fire Nepal", "Nepali Gamer", "Gaming Nepal", "Nepali Live Stream"] }
];

export default function YoutubeTags() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [copied, setCopied] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTags.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">YouTube Tags Tool</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">SEO-optimized trending tags and keywords for the Nepali viewer niche.</p>
        </div>
        {selectedTags.length > 0 && (
          <button 
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all shadow-lg",
              copied ? "bg-emerald-500 text-white" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copy {selectedTags.length} Tags
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {tagGroups.map((group, idx) => (
             <section key={idx} className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500" /> {group.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-bold transition-all",
                        selectedTags.includes(tag) 
                          ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600" 
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-red-400"
                      )}
                    >
                      # {tag}
                    </button>
                  ))}
                </div>
             </section>
           ))}
        </div>

        <div className="space-y-6">
           <div className="glass-card p-8 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 border-dashed border-2">
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" /> Selected Tags
              </h4>
              {selectedTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <span key={tag} className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-300 dark:text-slate-700 italic">
                  Tap tags to add them here
                </div>
              )}
           </div>

           <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
              <h5 className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Youtube className="w-3.5 h-3.5" /> SEO Advice
              </h5>
              <p className="text-xs text-red-800/70 dark:text-red-400/70 leading-relaxed">
                Always include your niche keywords in the first 2 lines of your description and in the title for maximum reach.
              </p>
           </div>
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Optimizing YouTube Tags for the Nepali Niche</h2>
        <p>In the highly competitive landscape of digital video, algorithmic visibility dictates a channel's success. The YouTube Tags Tool provides content creators with curated, high-traffic keyword arrays specifically tailored for the Nepali audience. By organizing trending phrases across categories like Tech, Vlogs, and Gaming, it enables creators to construct robust metadata payloads that directly appeal to regional search queries.</p>
        <h3>Keyword Indexing and Array Manipulation</h3>
        <p>Under the hood, this utility leverages highly optimized array state management to handle keyword selection. The application initializes predefined multidimensional arrays containing localized search terms. When a user interacts with the UI, a toggle function evaluates the inclusion of the string within the active state array. If absent, it pushes the string; if present, it splices it out. This ensures an exact, non-duplicative list of tags.</p>
        <p>Upon finalization, the tool utilizes the <code>Array.join(', ')</code> method to automatically format the selected tags into a comma-separated string, pushing it directly to the system clipboard via the <code>navigator.clipboard.writeText()</code> API. This frictionless data manipulation allows creators to rapidly inject SEO-optimized strings into their YouTube metadata.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Learn more about indexing formats and character systems in our article: <Link to="/blog/evolution-of-nepali-typography-preeti-to-unicode" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">The Evolution of Nepali Typography</Link>.</p>
      </div>
    </div>
  );
}
