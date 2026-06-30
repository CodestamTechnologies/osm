"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";

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
  const [prevFileUrl, setPrevFileUrl] = useState(fileUrl);

  if (fileUrl !== prevFileUrl) {
    setPrevFileUrl(fileUrl);
    setLoading(true);
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full min-h-[500px] relative bg-slate-100 overflow-auto p-4 md:p-8 rounded-xl border border-gray-200">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 z-10 rounded-xl">
          <Loader2 className="w-9 h-9 text-blue-600 animate-spin mb-3" />
          <span className="text-sm font-medium text-gray-500">
            Rendering Scanned Answer Sheet...
          </span>
        </div>
      )}

      <Document
        file={fileUrl}
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
          className="shadow-md bg-white p-2 rounded-lg border border-gray-100"
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
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            }
          />
        </div>
      </Document>
    </div>
  );
}
