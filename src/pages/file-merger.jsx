import React, { useState, useRef } from "react";
import { Upload, X, FileText, Loader2, AlertCircle, CheckCircle2, Download } from "lucide-react";
import BackButton from "../components/BackButton";
import { cn } from "../lib/utils";

export default function FileMerger() {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFiles) => {
    setError("");
    setSuccess(false);

    if (!selectedFiles || selectedFiles.length === 0) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    const newFiles = Array.from(selectedFiles).filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const isAllowed =
        allowedTypes.includes(file.type) ||
        ["pdf", "doc", "docx", "ppt", "pptx"].includes(ext);

      if (!isAllowed) {
        setError(`Invalid file: ${file.name}. Only PDF, Word, and PowerPoint files are supported.`);
        return false;
      }

      if (file.size > 50 * 1024 * 1024) {
        // 50 MB limit per file
        setError(`File ${file.name} exceeds 50 MB limit.`);
        return false;
      }

      return true;
    });

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 files to merge.");
      return;
    }

    setIsMerging(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/merge", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `Merge failed with status: ${response.status}`;
        const contentType = response.headers.get("content-type");
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } else {
            const textError = await response.text();
            errorMsg = textError.substring(0, 200) || errorMsg;
          }
        } catch (e) {
          errorMsg = `Merge failed with status: ${response.status}`;
        }
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setFiles([]);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
      console.error("Merge error:", err);
    } finally {
      setIsMerging(false);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    return ext;
  };

  return (
    <div className="space-y-8 pb-10">
      <BackButton />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Merger</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Combine multiple PDF, Word, and PowerPoint documents into a single PDF file.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload Zone */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center space-y-4",
              dragActive
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                : "border-slate-200 dark:border-slate-800",
              files.length > 0
                ? "bg-slate-50 dark:bg-slate-800/50"
                : "hover:bg-slate-50 dark:hover:bg-slate-800/20"
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files)}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              multiple
              className="hidden"
            />

            <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
              <Upload className="w-10 h-10" />
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                Drop your documents here
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                or click to select files (PDF, Word, PowerPoint)
              </p>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
              Maximum 50 MB per file • Minimum 2 files to merge
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl p-4 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Documents merged successfully! Download started.
              </p>
            </div>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Queued Files ({files.length})
            </h2>

            <div className="space-y-2">
              {files.map((file, index) => {
                const ext = getFileIcon(file.name);
                const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {ext.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {sizeInMB} MB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl transition-colors flex-shrink-0"
                      aria-label="Remove file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Merge Button */}
            <button
              onClick={handleMerge}
              disabled={isMerging || files.length < 2}
              className={cn(
                "w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2",
                isMerging || files.length < 2
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95"
              )}
            >
              {isMerging ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Merge Documents
                </>
              )}
            </button>

            {files.length < 2 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Add at least 2 files to enable merging
              </p>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-3xl p-6">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">1.</span>
              <span>Upload 2 or more PDF, Word, or PowerPoint files</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">2.</span>
              <span>Any non-PDF files will automatically convert to PDF</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">3.</span>
              <span>Click "Merge Documents" to combine all files into one PDF</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">4.</span>
              <span>Your merged PDF downloads automatically</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
