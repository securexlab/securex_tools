import React, { useState, useRef } from "react";
import { Presentation, Download, Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";

export default function PptToPdf() {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setError("");
    if (!selectedFile) return;

    const allowedTypes = [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];
    
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    const isPpt = allowedTypes.includes(selectedFile.type) || ext === 'ppt' || ext === 'pptx';

    if (!isPpt) {
      setError("Please upload a valid PowerPoint file (.ppt or .pptx).");
      return;
    }

    if (selectedFile.size > 3670016) {
      setError("File size exceeds 3.5 MB limit. Please upload a smaller file.");
      alert("File size exceeds 3.5 MB limit. Please upload a smaller file.");
      return;
    }

    setFile(selectedFile);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/convert-ppt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `Conversion failed with status: ${response.status}`;
        const contentType = response.headers.get('content-type');
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } else {
            const textError = await response.text();
            errorMsg = textError.substring(0, 200) || errorMsg;
          }
        } catch (e) {
          errorMsg = `Conversion failed with status: ${response.status}`;
        }
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.(pptx|ppt)$/, ".pdf");
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
      alert("Error: " + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <BackButton />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PPT to PDF Converter</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Convert your PowerPoint presentations (.pptx, .ppt) to PDF format for easy sharing.</p>
        </div>
      </div>

      <div className="max-w-3xl auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div 
            className={cn(
              "relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center space-y-4",
              dragActive ? "border-orange-500 bg-orange-50/50 dark:bg-orange-900/10" : "border-slate-200 dark:border-slate-800",
              file ? "bg-slate-50 dark:bg-slate-800/50" : "hover:bg-slate-50 dark:hover:bg-slate-800/20"
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files[0])}
              accept=".ppt,.pptx"
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-4">
                <div className="h-16 w-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Presentation className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <>
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Click or drag PPT here</p>
                  <p className="text-sm text-slate-500">Max file size: 3.5 MB</p>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={!file || isConverting}
            className={cn(
              "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
              !file || isConverting
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/20"
            )}
          >
            {isConverting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Converting Presentation...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Convert to PDF (.pdf)
              </>
            )}
          </button>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Instant PPT to PDF Conversion</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              Convert your PowerPoint slides into high-fidelity PDF documents. Our converter preserves every animation, image, and text layout, ensuring your presentation looks great on all devices.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-orange-50 dark:bg-orange-900/10 rounded-3xl border border-orange-100 dark:border-orange-900/30 space-y-4">
              <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Fidelity Guaranteed
              </h3>
              <p className="text-sm text-orange-800/70 dark:text-orange-400/70 leading-relaxed">
                We maintain the exact placement of text boxes, images, and shapes, giving you a PDF that looks identical to your PPT.
              </p>
            </div>
            <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 space-y-4">
              <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Fast & Secure
              </h3>
              <p className="text-sm text-emerald-800/70 dark:text-emerald-400/70 leading-relaxed">
                Your presentations are converted in seconds. We prioritize your privacy and never keep your files on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
