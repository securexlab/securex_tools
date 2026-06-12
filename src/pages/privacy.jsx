import React from "react";
import BackButton from "../components/BackButton";
import { Shield, Lock, Eye, ServerOff } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <BackButton />
      
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg italic">
          Last updated: April 30, 2026
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: Shield,
            title: "Data Protection",
            desc: "We use enterprise-grade encryption to ensure your data is handled with the highest security standards.",
            color: "text-blue-600 bg-blue-50 dark:bg-blue-900/10"
          },
          {
            icon: Lock,
            title: "No Credentials Stored",
            desc: "For all password and hash tools, processing happens entirely on your device. We never see your input.",
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10"
          },
          {
            icon: Eye,
            title: "Minimal Tracking",
            desc: "We only collect anonymous usage statistics to improve our tools. No personal identifying information is tracked.",
            color: "text-purple-600 bg-purple-50 dark:bg-purple-900/10"
          },
          {
            icon: ServerOff,
            title: "Instant Deletion",
            desc: "Files uploaded for conversion are processed in-memory and deleted immediately after the task is finished.",
            color: "text-orange-600 bg-orange-50 dark:bg-orange-900/10"
          }
        ].map((item, idx) => (
          <div key={idx} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className={`p-3 w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">1. Information Collection</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            At SecureX Lab Tools, we prioritize your privacy. We do not require account registration, and we do not collect personal information such as names, email addresses, or phone numbers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">2. Document Processing</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            For our conversion tools (PDF to Word, Excel to PDF, etc.), your documents are temporarily transmitted to secure API endpoints for processing. These files are processed in volatile memory and are not stored permanently. We use encrypted SSL/TLS connections for all data transfers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">3. Local Storage & Cookies</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We use browser local storage only to remember your theme preference (Dark/Light mode). We do not use third-party tracking cookies or advertising pixels.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">4. Third-Party Services</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Our document conversion tools utilize the <strong>Cloudmersive API</strong>. By using these tools, you agree to their data processing practices which are built for enterprise compliance and high security.
          </p>
        </section>

        <section className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-8">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            If you have any questions regarding this privacy policy, you may contact us at <strong>privacy@securexlab.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
