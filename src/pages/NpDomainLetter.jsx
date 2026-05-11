import React, { useState } from "react";
import { Download, Printer, FileText, Send, User, MapPin, Globe, Server, CheckCircle2, Mail, AlertTriangle } from "lucide-react";
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";

export default function NpDomainLetter() {
  const [formData, setFormData] = useState({
    purpose: "Personal",
    fullName: "",
    address: "",
    email: "",
    domainName: "",
    primaryNS: "",
    secondaryNS: "",
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const domainWithoutExt = formData.domainName.replace(/\.np$/, "");
  const fullDomain = domainWithoutExt ? (domainWithoutExt.includes('.') ? domainWithoutExt : `${domainWithoutExt}.com.np`) : "";

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isNpDomain = (domain) => {
    return domain.toLowerCase().endsWith(".np");
  };

  const isValid = formData.fullName && formData.address && isEmailValid(formData.email) && isNpDomain(formData.domainName);

  return (
    <div className="space-y-8 pb-10">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">.NP Domain Cover Letter Generator</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Generate the professional cover letter required for Mercantile .np domain registration in Nepal.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => isValid && window.print()}
            disabled={!isValid}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg",
              isValid 
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Registration Details</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Purpose</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Personal", "Organization"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, purpose: p }))}
                      className={cn(
                        "py-2 rounded-lg text-sm font-bold border transition-all",
                        formData.purpose === p 
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Domain Name *
                </label>
                <input 
                  type="text"
                  name="domainName"
                  value={formData.domainName}
                  onChange={handleInputChange}
                  placeholder="e.g. ram-sharma.com.np"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border dark:bg-slate-950 focus:ring-2 outline-none transition-all text-sm",
                    formData.domainName && !isNpDomain(formData.domainName) 
                      ? "border-amber-500 focus:ring-amber-500" 
                      : "border-slate-200 dark:border-slate-800 focus:ring-blue-500"
                  )}
                />
                {formData.domainName && !isNpDomain(formData.domainName) && (
                  <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> Domain must end with .np
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address *
                </label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. ram@example.com"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border dark:bg-slate-950 focus:ring-2 outline-none transition-all text-sm",
                    formData.email && !isEmailValid(formData.email)
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-200 dark:border-slate-800 focus:ring-blue-500"
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> {formData.purpose === "Personal" ? "Full Name" : "Organization Name"} *
                </label>
                <input 
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={formData.purpose === "Personal" ? "e.g. Ram Sharma" : "e.g. Acme Nepal Pvt. Ltd."}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> {formData.purpose === "Personal" ? "Address" : "Company Address"} *
                </label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Kathmandu, Nepal"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Name Servers</p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      <Server className="w-3.5 h-3.5" /> Primary Name Server
                    </label>
                    <input 
                      type="text"
                      name="primaryNS"
                      value={formData.primaryNS}
                      onChange={handleInputChange}
                      placeholder="e.g. ns1.yourhost.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      <Server className="w-3.5 h-3.5" /> Secondary Name Server
                    </label>
                    <input 
                      type="text"
                      name="secondaryNS"
                      value={formData.secondaryNS}
                      onChange={handleInputChange}
                      placeholder="e.g. ns2.yourhost.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Pro Tips
            </h4>
            <ul className="text-xs text-blue-800/80 dark:text-blue-500/80 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Domain is <strong>FREE</strong> for life in Nepal.</li>
              <li>For personal domains, use your exact name as per citizenship.</li>
              <li>Include your Citizenship number in the name if required by registrar.</li>
              <li>Upload this as a JPG or PDF on the Mercantile portal.</li>
            </ul>
          </div>
        </div>

        {/* Letter Preview Section */}
        <div className="lg:col-span-7 space-y-4 print:col-span-12">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Application Preview</label>
          <div className="bg-white text-slate-900 p-12 shadow-2xl rounded-sm aspect-[1/1.414] border border-slate-200 print:shadow-none print:border-none print:p-0 mx-auto w-full overflow-y-auto">
            <div className="text-sm md:text-base space-y-8 font-serif leading-relaxed text-slate-900">
              <div className="text-right">Date: {formData.date}</div>
              
              <div className="space-y-1">
                To,<br />
                The Hostmaster,<br />
                Mercantile Communication Pvt. Ltd.<br />
                Durbar Marg, Kathmandu
              </div>

              <div className="font-bold">
                Subject: NP Domain Registration
              </div>

              <div>Dear Sir/Madam,</div>

              <p>
                I am writing this letter to request you to kindly register a <span className="text-blue-600 font-medium">{fullDomain || "yourdomain.com.np"}</span> domain for me based on my {formData.purpose === "Personal" ? "name" : "organization"}. 
                I have provided my {formData.purpose === "Personal" ? "personal" : "organization"} details, and also attached a scanned copy of my {formData.purpose === "Personal" ? "citizenship" : "company registration"} with this letter. 
                I would be very glad if you approve my domain registration request.
              </p>

              <p>
                Thank you very much for consideration. I look forward to hearing from you soon.
              </p>

              <div className="space-y-1 pt-4">
                <div className="font-bold uppercase text-[12px] text-slate-500 mb-2">Technical Details:</div>
                <div><strong>Domain name:</strong> {fullDomain || "yourdomain.com.np"}</div>
                <div>
                  <strong>Primary Name Server:</strong><br />
                  <span className="pl-4">{formData.primaryNS}</span>
                </div>
                <div>
                  <strong>Secondary Name Server:</strong><br />
                  <span className="pl-4">{formData.secondaryNS}</span>
                </div>
              </div>

              <div className="pt-10">
                Sincerely,<br /><br />
                <strong>Name:</strong> {formData.fullName || "[Your Name]"}<br />
                <strong>Email:</strong> {formData.email || "[Your Email]"}<br />
                <strong>Address:</strong> {formData.address || "[Address]"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What is a .NP Domain Cover Letter?</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              In Nepal, registering a .com.np, .org.np, or other .np ccTLD requires a formal application letter addressed to Mercantile Communications. This letter acts as a formal request to the registry to allocate the domain to an individual or an organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">How to use this tool?</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                <li>Select "Personal" for individual or "Organization" for business.</li>
                <li>Enter the desired domain name (e.g., yourname.com.np).</li>
                <li>Fill in your full name and address exactly as it appears on your ID.</li>
                <li>Provide your hosting provider's name servers (DNS).</li>
                <li>Click "Print" to save it as a PDF.</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Key Registration Rules</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                <li>Personal domains must match your citizenship name.</li>
                <li>Organization domains must match business registration name.</li>
                <li>Registration is completely free for Nepalese citizens.</li>
                <li>A front and back scan of your citizenship is mandatory.</li>
              </ul>
            </div>
          </div>

          <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-sm text-slate-500 italic text-center">
              Our generator ensures your cover letter follows the standard format accepted by Mercantile for faster approval. No more manual typing or formatting issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
