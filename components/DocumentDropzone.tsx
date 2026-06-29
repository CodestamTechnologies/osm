"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";

interface DocumentDropzoneProps {
  onFileSelect: (file: File) => void;
  onUseMock: () => void;
}

export default function DocumentDropzone({ onFileSelect, onUseMock }: DocumentDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file format. Please upload a PDF or an Image (PNG, JPG).");
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 transition-all duration-300 hover:border-violet-500/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleChange}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full max-w-lg p-10 text-center rounded-xl cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-violet-500 bg-violet-500/5 dark:bg-violet-500/10 scale-102"
            : ""
        }`}
        onClick={onButtonClick}
      >
        <div className="p-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full mb-6 animate-pulse">
          <Upload className="w-10 h-10" />
        </div>

        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          Upload Scan Sheet
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Drag and drop your PDF or image here, or{" "}
          <span className="text-violet-600 dark:text-violet-400 font-medium hover:underline">
            browse files
          </span>
        </p>

        <div className="flex items-center justify-center gap-6 text-zinc-400 text-xs mb-8">
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg">
            <FileText className="w-4 h-4 text-red-500" />
            <span>PDF Document</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg">
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            <span>Images (PNG, JPG)</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-2.5 rounded-lg mb-6 max-w-md">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-left font-medium">{error}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 mt-2">
        <div className="relative flex items-center justify-center w-full max-w-md">
          <hr className="w-40 border-zinc-200 dark:border-zinc-800" />
          <span className="absolute px-3 text-xs text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-950 font-medium uppercase tracking-wider">
            Or Use Sample
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onUseMock();
          }}
          className="px-6 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 hover:scale-102"
        >
          Load Interactive Mock Examination
        </button>
      </div>
    </div>
  );
}
