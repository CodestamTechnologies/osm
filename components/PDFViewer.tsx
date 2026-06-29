"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, AlertTriangle } from "lucide-react";

// Configure PDFJS Worker via CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || "4.4.168"}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string | File;
  scale: number;
  rotation: number;
  pageNumber: number;
  onLoadSuccess: (numPages: number) => void;
  onLoadError: (error: Error) => void;
}

export default function PDFViewer({
  fileUrl,
  scale,
  rotation,
  pageNumber,
  onLoadSuccess,
  onLoadError,
}: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [pdfSource, setPdfSource] = useState<string | File>("");

  useEffect(() => {
    // If it's a File, create a local URL or pass it directly
    if (fileUrl instanceof File) {
      setPdfSource(fileUrl);
    } else {
      setPdfSource(fileUrl);
    }
    setLoading(true);
  }, [fileUrl]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full min-h-[500px] relative bg-zinc-100 dark:bg-zinc-900 overflow-auto p-4 md:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100/80 dark:bg-zinc-900/80 z-10">
          <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Rendering Scanned Answer Sheet...
          </span>
        </div>
      )}

      <Document
        file={pdfSource}
        onLoadSuccess={(pdf) => {
          setLoading(false);
          onLoadSuccess(pdf.numPages);
        }}
        onLoadError={(err) => {
          setLoading(false);
          onLoadError(err);
        }}
        className="flex justify-center"
        loading={null}
      >
        <div
          className="transition-shadow duration-300 shadow-xl bg-white dark:bg-zinc-950 p-2 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease-out",
          }}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={
              <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
              </div>
            }
          />
        </div>
      </Document>
    </div>
  );
}
