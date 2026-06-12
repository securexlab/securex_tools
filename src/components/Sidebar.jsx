import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { TOOLS } from "../constants";
import { cn } from "../lib/utils";
import { BookMarked } from "lucide-react";

// We don't need isOpen here anymore because _app.jsx handles the hiding/showing!
export default function Sidebar({ onClose }) {
  const router = useRouter();

  return (
    <aside className="h-full min-h-0 bg-white dark:bg-slate-950 overflow-y-auto scrollbar-hide flex flex-col justify-between pb-20 lg:pb-0">
      
      <div className="p-4 space-y-8">
        {TOOLS.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <div className="px-3 flex items-center gap-2 mb-4">
              <div className={cn(
                "p-1.5 rounded-lg text-xs",
                `bg-${cat.color}-50 dark:bg-${cat.color}-900/20 text-${cat.color}-600 dark:text-${cat.color}-400`
              )}>
                <cat.icon className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {cat.category}
              </h3>
            </div>

            <div className="space-y-1">
              {cat.items.map((item, itemIdx) => {
                const isActive = router.pathname === item.path;
                return (
                  <Link
                    key={itemIdx}
                    href={item.path}
                    // This tells the mobile menu to close when a link is clicked
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all group",
                      isActive 
                        ? "bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/5" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
                    )}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      isActive ? "bg-blue-600 scale-100" : "bg-slate-300 dark:bg-slate-700 scale-0 group-hover:scale-100"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 mt-8 border-t border-slate-100 dark:border-slate-800">
        <a 
          href="https://securexlab.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-blue-600 transition-all group"
        >
          <BookMarked className="w-4 h-4" />
          Visit Main Website
        </a>
      </div>
    </aside>
  );
}