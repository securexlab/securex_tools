import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Moon, Sun, Menu, X, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "next-themes"; // Updated for Next.js!

export default function Navbar({ onMenuClick }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevents Next.js hydration mismatch
  useEffect(() => setMounted(true), []);

  const getBreadcrumb = () => {
    const path = router.pathname;
    if (path === "/") return "Dashboard";
    return path.split("/").filter(Boolean).map(s => s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")).join(" / ");
  };

  const isDark = theme === "dark";

  return (
    // Added z-50 so the Navbar always stays on top of the Sidebar
    <nav className="sticky top-0 z-50 w-full h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold group-hover:bg-blue-700 transition-colors">
            SX
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100">
            SecureX <span className="text-blue-600">Lab Tools</span>
          </span>
        </Link>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block ml-2" />
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-colors hidden sm:flex">
          <span className="text-blue-600 dark:text-blue-500">{getBreadcrumb()}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-8">
        <Link href="/blog" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-500 transition-colors">
          Blog
        </Link>
        
        {/* Dark Mode Toggle */}
        <div 
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="h-8 w-14 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5 flex items-center cursor-pointer relative transition-colors shadow-inner"
        >
          {mounted && (
            <>
              <div className={cn(
                "h-5 w-5 bg-white dark:bg-slate-600 rounded-full shadow-lg border border-slate-200 dark:border-slate-500 transition-all duration-300 transform",
                isDark ? "translate-x-6" : "translate-x-0"
              )} />
              <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                <Sun className={cn("w-3 h-3 text-orange-400 transition-opacity duration-300", isDark ? "opacity-0" : "opacity-100")} />
                <Moon className={cn("w-3 h-3 text-blue-400 transition-opacity duration-300", isDark ? "opacity-100" : "opacity-0")} />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}