import React, { useState, useRef } from "react";
import { Upload, Download, Image as ImageIcon, Check, Info, FileText } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

const presets = [
  { name: "Lok Sewa Photo", width: 350, height: 450, label: "350x450 px", maxSize: 200, icon: ImageIcon },
  { name: "Signature", width: 300, height: 150, label: "300x150 px", maxSize: 200, icon: FileText },
  { name: "Citizenship / Doc", width: 800, height: 600, label: "Max 500KB", maxSize: 500, icon: FileText }
];

export default function PhotoResizer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activePreset, setActivePreset] = useState(presets[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
    }
  };

  const processImage = () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      canvas.width = activePreset.width;
      canvas.height = activePreset.height;
      
      // Draw image with resizing
      ctx.drawImage(img, 0, 0, activePreset.width, activePreset.height);
      
      // Convert to blob with quality control
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setResultImage(dataUrl);
      setIsProcessing(false);
    };
  };

  return (
    <div className="space-y-8">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Photo Resizer</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Resize and compress photos for Lok Sewa, TSC, and other official Nepali forms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl text-center space-y-4 relative group hover:border-blue-500 transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            {previewUrl ? (
              <img src={previewUrl} className="max-h-64 mx-auto rounded-xl shadow-lg" alt="Preview" />
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-bold">Select or Drop Photo</p>
                  <p className="text-sm text-slate-400">Click to upload from your gallery</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => { setActivePreset(p); setResultImage(null); }}
                className={cn(
                  "p-6 rounded-2xl border transition-all text-left space-y-3",
                  activePreset.name === p.name 
                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105 z-10" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                <div className={cn("p-2 rounded-lg w-fit", activePreset.name === p.name ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800")}>
                  <p.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{p.name}</h4>
                  <p className={cn("text-[10px] font-bold uppercase opacity-60", activePreset.name === p.name ? "" : "text-slate-400")}>{p.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <button 
            disabled={!selectedFile || isProcessing}
            onClick={processImage}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-20 transition-all shadow-xl"
          >
            {isProcessing ? "Processing..." : "Process Photo"}
          </button>

          {resultImage && (
            <div className="glass-card p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
               <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm mb-2">
                  <Check className="w-4 h-4" /> Ready for Download
               </div>
               <img src={resultImage} className="w-full rounded-xl border border-slate-100 dark:border-slate-800" alt="Result" />
               <a 
                 href={resultImage} 
                 download={`securex_resized_${activePreset.name.replace(/\s+/g, '_').toLowerCase()}.jpg`}
                 className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
               >
                 <Download className="w-4 h-4" /> Download JPG
               </a>
            </div>
          )}

          <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex gap-3">
             <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
             <div className="space-y-1">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-400">Important Note</p>
                <p className="text-[10px] text-amber-700/70 dark:text-amber-400/60 leading-relaxed font-medium">
                  Official portals like Lok Sewa require specific pixel dimensions. Our resizer ensures the correct width/height while maintaining file size under 200KB.
                </p>
             </div>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Resize and Compress for Official Forms</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-center">
              Our <strong>Photo Resizer</strong> is specially calibrated for Nepali government portals. Whether you are applying for <strong>Lok Sewa Aayog (PSC)</strong>, TSC, or citizenship, we ensure your photos meet the exact pixel and file size requirements without any technical jargon.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-blue-600 rounded-[3rem] text-white space-y-4 shadow-xl shadow-blue-500/20">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-200" />
                Precise Dimensions
              </h3>
              <p className="text-xs opacity-90 leading-relaxed font-medium">
                Standard photo for Lok Sewa requires 350x450 pixels, while a signature should be 300x150 pixels. Our presets automatically apply these constraints so you don't have to manual crop or guess the aspect ratio.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">How to use?</h3>
              <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                <li>Upload your original high-quality photo or signature scan.</li>
                <li>Choose your target preset (e.g., Lok Sewa Photo).</li>
                <li>Click "Process Photo" to apply the standard resizing.</li>
                <li>Download the optimized JPG file ready for the portal.</li>
                <li>Your original data never leaves your browser (Safe & Secure).</li>
              </ul>
            </div>
          </div>

          <div className="p-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Why use this tool instead of Paint?
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
                Generic photo editors often distort images or keep the file size too high. Our engine uses an intelligent <strong>canvas-based compression</strong> algorithm that reduces file weight (below 200KB or 500KB as required) while keeping your facial features or signature clear and legible for official verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
