import React from "react";
import BackButton from "../components/BackButton";
import { FileText, Scale, Zap, AlertTriangle } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <BackButton />
      
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Use</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg italic">
          Last updated: April 30, 2026
        </p>
      </header>

      <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Agreement to Terms</h2>
          </div>
          <p className="text-blue-100 leading-relaxed text-lg">
            By accessing and using SecureX Lab Tools, you agree to be bound by these Terms of Use. If you do not agree to all of these terms, please do not use the service.
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold text-xl">Service Usage</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Our tools are provided for lawful purposes only. You may not use this platform to process illegal content, malicious software, or copyrighted material without permission.
          </p>
        </section>

        <section className="space-y-4 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-xl">Fair Use Policy</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            To ensure service availability for all users, we implement rate limits and file size restrictions (3.5MB per conversion). Automated or bot access that stresses our infrastructure is prohibited.
          </p>
        </section>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 px-4">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">1. Intellectual Property</h2>
          <p className="text-slate-600 dark:text-slate-400">
            All code, UI designs, and brand elements are the property of SecureX Lab. Users retain full ownership of any data processed through our tools.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">2. Disclaimer of Warranties</h2>
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl italic text-sm text-slate-500 border-l-4 border-slate-300">
            "The service is provided 'as is' without warranties of any kind. We do not guarantee that the tools will always be available, accurate, or error-free."
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">3. Limitation of Liability</h2>
          <p className="text-slate-600 dark:text-slate-400">
            In no event shall SecureX Lab or its developers be liable for any direct, indirect, or consequential damages resulting from the use or inability to use our tools.
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold font-mono text-xs uppercase tracking-widest text-slate-400">Contact</h2>
          <p className="text-slate-700 dark:text-slate-300 font-bold">
            support@securexlab.com
          </p>
        </section>
      </div>
    </div>
  );
}
