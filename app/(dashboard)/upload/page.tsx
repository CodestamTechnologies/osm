"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, X, CheckCircle2, AlertTriangle, FileType } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-text-primary">Upload Scan Sheets</h1>
        <p className="text-brand-text-secondary">Upload scanned answer booklets securely for on-screen evaluation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Area</CardTitle>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-12 text-center transition-colors
                    ${isDragging ? "border-brand-primary bg-brand-primary/5" : "border-brand-border hover:border-brand-primary hover:bg-brand-bg"}
                  `}
                >
                  <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="h-8 w-8 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Drag & Drop files here</h3>
                  <p className="text-sm text-brand-text-secondary mb-6">or click to browse from your computer</p>
                  
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => document.getElementById('file-upload')?.click()}>
                      Browse Files
                    </Button>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    />
                  </div>
                  
                  <div className="mt-8 flex items-center justify-center gap-6 text-sm text-brand-text-secondary">
                    <div className="flex items-center"><FileType className="w-4 h-4 mr-1" /> PDF, PNG, JPG</div>
                    <div>Max size: 50MB</div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-xl p-6 bg-brand-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center">
                        <File className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-brand-text-primary">{file.name}</h4>
                        <p className="text-sm text-brand-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    {!uploading && progress === 100 && (
                      <Button variant="ghost" size="icon" onClick={clearFile} className="text-brand-text-secondary hover:text-brand-danger">
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  {uploading || progress > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-text-secondary">{uploading ? "Uploading..." : "Completed"}</span>
                        <span className="font-medium text-brand-primary">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-brand-bg rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-brand-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {!uploading && progress === 100 && (
                    <div className="mt-6 flex justify-end gap-3">
                      <Button variant="outline" onClick={clearFile}>Cancel</Button>
                      <Button>Process Document</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Computer_Science_101_Batch_A.pdf", status: "Processed", date: "Today, 10:30 AM", size: "12.4 MB" },
                  { name: "Physics_201_Midterms.pdf", status: "Failed", date: "Yesterday, 2:15 PM", size: "8.1 MB" },
                  { name: "Mathematics_Final_Exam.pdf", status: "Processed", date: "Oct 12, 09:00 AM", size: "45.2 MB" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-brand-border hover:bg-brand-bg transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileTextIcon />
                      <div>
                        <p className="text-sm font-medium text-brand-text-primary">{item.name}</p>
                        <p className="text-xs text-brand-text-secondary">{item.size} • {item.date}</p>
                      </div>
                    </div>
                    {item.status === "Processed" ? (
                      <CheckCircle2 className="h-5 w-5 text-brand-success" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-brand-danger" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Guidelines</CardTitle>
              <CardDescription>Follow these rules for accurate AI processing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-brand-text-secondary">
              <ul className="list-disc pl-5 space-y-2">
                <li>Ensure scans are clear and readable (minimum 300 DPI recommended).</li>
                <li>Remove all blank pages before uploading.</li>
                <li>Do not mix answer sheets from different subjects in a single PDF.</li>
                <li>Ensure barcode/QR code on the front page is clearly visible.</li>
                <li>Maximum file size is 50MB per upload.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FileTextIcon() {
  return (
    <div className="h-10 w-10 bg-brand-bg rounded flex items-center justify-center text-brand-text-secondary">
      <File className="h-5 w-5" />
    </div>
  );
}
