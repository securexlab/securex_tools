import React, { useState } from "react";
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

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Grow Your Channel with Trending YouTube Tags</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Tagging is one of the most misunderstood parts of YouTube SEO. Our <strong>YouTube Tag Generator</strong> helps you discover and select the most relevant keywords specifically for the Nepalese audience. Using correct tags helps YouTube's algorithm understand your content and suggest it to the right viewers.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-red-600 rounded-[3rem] text-white space-y-4 shadow-xl shadow-red-500/20">
              <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                <Youtube className="w-5 h-5 text-red-200" />
                Targeting the Niche
              </h3>
              <p className="text-xs opacity-90 leading-relaxed font-medium">
                The Nepalese YouTube market is highly competitive in niches like Vlogging, Tech, and Music. Using tags like "Nepali YouTuber" or "Kathmandu Vlog" ensures that your video appears in the "Suggested" section for users who already consume similar content in Nepal.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Tagging Best Practices</h3>
              <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                <li><strong>Relevance:</strong> Only use tags that directly relate to your video content.</li>
                <li><strong>Mix:</strong> Use a combination of broad (e.g., Nepal) and specific (e.g., Everest Base Camp Trek) tags.</li>
                <li><strong>Limit:</strong> Don't exceed the 500-character limit provided by YouTube.</li>
                <li><strong>Order:</strong> Put your most important keywords first in the list.</li>
              </ul>
            </div>
          </div>

          <div className="p-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2">
                <Hash className="w-5 h-5 text-red-600" />
                How to use these tags?
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
                Browse through our curated groups (Vlog, News, Tech, etc.) and tap on the tags you want to use. They will appear in the "Selected Tags" box. Once you've selected your favorites, click the "Copy" button at the top. Go to your YouTube Studio video details page, find the "Tags" section, and paste them (Ctrl+V). Simple and effective!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
