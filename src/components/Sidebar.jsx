import React from "react";
import { Link, useLocation } from "react-router-dom";
import { TOOLS } from "../constants";
import { cn } from "../lib/utils";
import { X, Layers, BookMarked } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 transition-transform lg:translate-x-0 overflow-y-auto scrollbar-hide",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold group-hover:bg-blue-700 transition-colors">
              SX
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100">
              SecureX <span className="text-blue-600">Lab Tools</span>
            </span>
          </Link>
          
          <button 
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={itemIdx}
                      to={item.path}
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
    </>
  );
}
