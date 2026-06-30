"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Image as ImageIcon, AlertCircle, Sparkles } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleChange}
      />

      {/* Main Dropzone Card */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`
          w-full cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center
          transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${isDragActive
            ? "border-blue-400 bg-blue-50 scale-[1.01]"
            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
          }
        `}
        style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.04)" }}
        role="button"
        tabIndex={0}
        aria-label="Upload answer sheet. Click or drag and drop a PDF or PNG/JPG image here."
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onButtonClick();
          }
        }}
      >
        {/* Upload Icon */}
        <div className={`
          mx-auto mb-5 flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200
          ${isDragActive ? "bg-blue-100" : "bg-blue-50"}
        `}>
          <Upload className={`w-7 h-7 transition-colors duration-200 ${isDragActive ? "text-blue-600" : "text-blue-500"}`} />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Upload Scan Sheet
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Drag and drop your file here, or{" "}
          <span className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            browse files
          </span>
        </p>

        {/* Supported formats */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg" aria-label="Supports PDF documents">
            <FileText className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-gray-600">PDF Document</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg" aria-label="Supports PNG and JPG images">
            <ImageIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">PNG / JPG Image</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 mx-auto max-w-sm text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl mt-4" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-left font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center w-full max-w-sm my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <span className="relative bg-[#F8FAFC] px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          or try a sample
        </span>
      </div>

      {/* Mock Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUseMock();
        }}
        className="
          group flex items-center gap-2.5 px-6 py-3 text-sm font-semibold
          text-gray-700 bg-white border border-gray-200 rounded-xl
          hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/40
          transition-all duration-200
          shadow-sm hover:shadow-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        "
        style={{ boxShadow: "0 1px 2px 0 rgba(15,23,42,0.06)" }}
        aria-label="Load interactive mock examination sheet with sample scores"
      >
        <Sparkles className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
        Load Interactive Mock Examination
      </button>
    </div>
  );
}
