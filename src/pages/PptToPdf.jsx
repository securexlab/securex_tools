import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
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

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Converting PowerPoint Presentations to PDF</h2>
        <p>Distributing slide decks often results in formatting inconsistencies due to missing fonts or incompatible software versions. The PPT to PDF Converter solves this by transforming Microsoft PowerPoint files (.ppt, .pptx) into static, universally accessible Portable Document Format (PDF) files. This ensures that your presentations render identically on every device, making it ideal for professional distribution.</p>
        <h3>The Architecture of Slide Rendering</h3>
        <p>Converting a dynamic presentation into a fixed layout requires sophisticated binary parsing. When a user uploads a PowerPoint file, the application transmits the multipart form payload to a secure backend conversion engine. The engine unpacks the OOXML structure of the PPTX file, reading the XML nodes that define slide dimensions, text vectors, embedded images, and layout coordinates.</p>
        <p>It systematically renders these elements onto static graphical canvases, translating them into standard PDF objects. This algorithmic reconstruction guarantees that complex slide transitions and visual hierarchies are flattened correctly. The resulting binary blob is then streamed back to the client as an <code>application/pdf</code> file, securely destroying the original payload to maintain strict user privacy.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Want to learn more about the privacy implications of online file processing? Check out our detailed guide: <Link to="/blog/why-secure-file-conversion-matters" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">Why Secure File Conversion Matters</Link>.</p>
      </div>
    </div>
  );
}
