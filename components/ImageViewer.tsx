"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Loader2, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] relative bg-zinc-100 dark:bg-zinc-900 overflow-auto p-8 rounded-xl border border-zinc-200 dark:border-zinc-800">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100/80 dark:bg-zinc-900/80 z-10">
          <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loading Scan Sheet Image...</span>
        </div>
      )}

      <div
        className="transition-transform duration-200 ease-out shadow-lg bg-white p-2 rounded-md"
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
