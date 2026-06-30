"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface ImageViewerProps {
  fileUrl: string;
  scale: number;
  rotation: number;
  onLoadSuccess: (numPages: number) => void;
}

export default function ImageViewer({ fileUrl, scale, rotation, onLoadSuccess }: ImageViewerProps) {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
    onLoadSuccess(1); // Images are always 1 page
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] relative bg-slate-100 overflow-auto p-8 rounded-xl border border-gray-200">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 z-10 rounded-xl">
          <Loader2 className="w-9 h-9 text-blue-600 animate-spin mb-3" />
          <span className="text-sm font-medium text-gray-500">Loading Scan Sheet Image...</span>
        </div>
      )}

      <div
        className="transition-transform duration-200 ease-out shadow-md bg-white p-2 rounded-lg"
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fileUrl}
          alt="Scanned Answer Sheet"
          onLoad={handleImageLoad}
          className="max-w-full h-auto select-none pointer-events-none"
          style={{ maxHeight: "85vh" }}
        />
      </div>
    </div>
  );
}
