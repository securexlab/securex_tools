import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="h-12 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
      <div>&copy; {currentYear} SecureX Lab. Developed for Nepal.</div>
      <div className="flex gap-6 items-center">
        <Link href="/privacy" className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-blue-600 cursor-pointer transition-colors">Terms of Use</Link>
        <span className="text-slate-300 dark:text-slate-700 select-none">v1.2.0-stable</span>
      </div>
    </footer>
  );
}
