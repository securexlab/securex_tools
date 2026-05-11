import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, Download, Upload, Loader2, AlertCircle, CheckCircle2, FileVideo } from "lucide-react";
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setError("");
    if (!selectedFile) return;

    const allowedTypes = [
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    // Check extension as well just in case MIME type is flaky
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    const isWord = allowedTypes.includes(selectedFile.type) || ext === 'doc' || ext === 'docx';

    if (!isWord) {
      setError("Please upload a valid Word document (.doc or .docx).");
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
      const response = await fetch("/api/convert-word", {
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
      a.download = file.name.replace(/\.(docx|doc)$/, ".pdf");
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
          <h1 className="text-3xl font-bold tracking-tight">Word to PDF Converter</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Transform your Word (.doc, .docx) documents into professional PDF files instantly.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div 
            className={cn(
              "relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center space-y-4",
              dragActive ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-slate-200 dark:border-slate-800",
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
              accept=".doc,.docx"
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-4">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <FileText className="w-8 h-8" />
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
                  <p className="font-bold text-slate-800 dark:text-slate-200">Click or drag Word (.docx) here</p>
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
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
            )}
          >
            {isConverting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Converting Word...
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
        <h2>Standardizing Word Documents to Fixed PDFs</h2>
        <p>While Microsoft Word is excellent for document creation, sharing `.docx` files often results in broken formatting, misaligned tables, and font replacement issues across different operating systems. The Word to PDF Converter resolves these compatibility hurdles by programmatically locking the document's structure into a universally consistent Portable Document Format (PDF).</p>
        <h3>The XML to PDF Rendering Process</h3>
        <p>Modern Word documents (.docx) are essentially zipped archives of XML files (OOXML). When a user drops a file into the upload zone, the tool securely transfers the payload to the backend processing server. The conversion algorithm unzips the payload, parsing the internal `document.xml` schema alongside its associated stylesheet dictionaries and media relationships.</p>
        <p>The rendering engine maps these XML nodes—such as paragraphs, headings, and margins—onto a 2D PDF graphical canvas. By executing this exact spatial translation, the engine ensures that all typographical fidelity and layout parameters are permanently preserved. The backend then compresses the resulting data into a secure binary PDF blob, streaming it directly to the client's browser for an immediate, formatting-safe download.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Learn more about why secure document handling is essential for your data: <Link to="/blog/why-secure-file-conversion-matters" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">Why Secure File Conversion Matters</Link>.</p>
      </div>
    </div>
  );
}
