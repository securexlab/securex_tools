import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  return (
    <Link 
      to="/" 
      className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-bold text-xs uppercase tracking-widest transition-all mb-6 group"
    >
      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </div>
      Back to Tools Hub
    </Link>
  );
}
