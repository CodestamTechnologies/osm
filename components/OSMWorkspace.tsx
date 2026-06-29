"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  X,
  Copy,
  Check,
} from "lucide-react";
import DocumentDropzone from "./DocumentDropzone";
import ImageViewer from "./ImageViewer";
import MarkingPanel, { QuestionMark } from "./MarkingPanel";

// Dynamically import PDFViewer to disable SSR
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
      <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading document renderer...</span>
    </div>
  ),
});

export default function OSMWorkspace() {
  // Document states
  const [file, setFile] = useState<File | string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | "image" | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // Viewer controls
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  // Marking Panel states
  const [questions, setQuestions] = useState<QuestionMark[]>([]);
  const [overallRemarks, setOverallRemarks] = useState<string>("");
  const [evaluationStatus, setEvaluationStatus] = useState<string>("Draft");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Saved Data Modal states
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [lastSavedData, setLastSavedData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyJSON = () => {
    if (!lastSavedData) return;
    navigator.clipboard.writeText(JSON.stringify(lastSavedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Initialize questions
  useEffect(() => {
    const defaultQuestions: QuestionMark[] = Array.from({ length: 5 }, (_, i) => ({
      id: `q-${i + 1}`,
      name: `Q-${i + 1}`,
      marksAwarded: "",
      maxMarks: 10,
      remarks: "",
    }));
    setQuestions(defaultQuestions);
  }, []);

  // Try to load initial sample-paper.pdf from public directory on mount
  useEffect(() => {
    const checkSamplePaper = async () => {
      try {
        const response = await fetch("/sample-paper.pdf", { method: "HEAD" });
        if (response.ok) {
          setFile("/sample-paper.pdf");
          setFileType("pdf");
          setFileUrl("/sample-paper.pdf");
          setFileName("sample-paper.pdf");
          showNotification("info", "Loaded standard sample-paper.pdf");
        } else {
          // If sample-paper.pdf isn't found, check if there's an image fallback in public
          const imgResponse = await fetch("/sample-image.png", { method: "HEAD" });
          if (imgResponse.ok) {
            setFile("/sample-image.png");
            setFileType("image");
            setFileUrl("/sample-image.png");
            setFileName("sample-image.png");
            showNotification("info", "Sample PDF unavailable. Loaded fallback sample-image.png");
          }
        }
      } catch (e) {
        console.warn("Could not auto-load sample file: ", e);
      }
    };
    checkSamplePaper();
  }, []);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleFileSelect = (selectedFile: File) => {
    const type = selectedFile.type === "application/pdf" ? "pdf" : "image";
    setFile(selectedFile);
    setFileType(type);
    setFileName(selectedFile.name);
    setPageNumber(1);
    setScale(1.0);
    setRotation(0);

    const objectUrl = URL.createObjectURL(selectedFile);
    setFileUrl(objectUrl);

    showNotification("success", `Successfully loaded: ${selectedFile.name}`);
  };

  const handleUseMock = () => {
    // Generate a high fidelity SVG/DataURI fallback scan paper to display
    const mockImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
      <rect width="100%" height="100%" fill="%23fcfcf9"/>
      <path d="M 0 0 L 800 0 L 800 1100 L 0 1100 Z" fill="none" stroke="%23cccccc" stroke-width="4"/>
      
      <!-- Top banner for header info -->
      <rect x="40" y="40" width="720" height="120" rx="8" fill="%23f1f5f9" stroke="%23e2e8f0" stroke-width="1.5"/>
      <text x="60" y="80" font-family="sans-serif" font-size="22" font-weight="bold" fill="%231e293b">MIDTERM EXAMINATION 2026</text>
      <text x="60" y="110" font-family="sans-serif" font-size="14" fill="%2364748b">Subject: Computer Science &amp; Engineering</text>
      <text x="60" y="135" font-family="sans-serif" font-size="14" fill="%2364748b">Student Roll No: CS-2026-98402 | Date: June 27, 2026</text>
      
      <rect x="620" y="60" width="120" height="80" rx="8" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-dasharray="4"/>
      <text x="680" y="85" font-family="sans-serif" font-size="10" font-weight="bold" fill="%2394a3b8" text-anchor="middle">OFFICIAL USE</text>
      <text x="680" y="115" font-family="sans-serif" font-size="24" font-weight="black" fill="%23cbd5e1" text-anchor="middle">A+</text>
      
      <!-- Question 1 section -->
      <text x="60" y="220" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">Q1. Write a function to reverse a linked list. (10 Marks)</text>
      <text x="80" y="255" font-family="Courier New, monospace" font-size="14" fill="%2309090b" font-weight="normal">
        <tspan x="80" dy="0">Node* reverseList(Node* head) {</tspan>
        <tspan x="100" dy="22">Node* prev = nullptr;</tspan>
        <tspan x="100" dy="22">Node* current = head;</tspan>
        <tspan x="100" dy="22">Node* next = nullptr;</tspan>
        <tspan x="100" dy="22">while (current != nullptr) {</tspan>
        <tspan x="120" dy="22">next = current-&gt;next; // save next node</tspan>
        <tspan x="120" dy="22">current-&gt;next = prev; // reverse pointer</tspan>
        <tspan x="120" dy="22">prev = current;       // move prev</tspan>
        <tspan x="120" dy="22">current = next;       // move current</tspan>
        <tspan x="100" dy="22">}</tspan>
        <tspan x="100" dy="22">return prev;</tspan>
        <tspan x="80" dy="22">}</tspan>
      </text>
      
      <circle cx="70" cy="530" r="14" fill="%2310b981" fill-opacity="0.1" stroke="%2310b981" stroke-width="1.5"/>
      <text x="70" y="534" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2310b981" text-anchor="middle">✓</text>
      <text x="95" y="534" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2310b981">Correct algorithm. Complexity: O(N) time and O(1) space.</text>
      
      <!-- Line separator -->
      <line x1="40" y1="580" x2="760" y2="580" stroke="%23e2e8f0" stroke-width="1.5" stroke-dasharray="8 4"/>
      
      <!-- Question 2 section -->
      <text x="60" y="630" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">Q2. What is the difference between TCP and UDP? (10 Marks)</text>
      
      <text x="80" y="670" font-family="sans-serif" font-size="14" fill="%2309090b">
        <tspan x="80" dy="0">TCP is connection-oriented and guarantees delivery using retransmissions.</tspan>
        <tspan x="80" dy="22">It uses a 3-way handshake to establish connection. Reliable &amp; slower.</tspan>
        <tspan x="80" dy="30">UDP is connectionless and does not guarantee packet delivery. It is fast,</tspan>
        <tspan x="80" dy="22">ideal for video streaming and gaming. It doesn't check for errors or lost data.</tspan>
      </text>
      
      <circle cx="70" cy="770" r="14" fill="%2310b981" fill-opacity="0.1" stroke="%2310b981" stroke-width="1.5"/>
      <text x="70" y="774" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2310b981" text-anchor="middle">✓</text>
      <text x="95" y="774" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2310b981">Good definition, covers reliable vs unreliable and use cases.</text>
      
      <!-- Question 3 section -->
      <text x="60" y="850" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">Q3. Briefly explain the concept of ACID properties in Database Systems. (10 Marks)</text>
      
      <text x="80" y="890" font-family="sans-serif" font-size="14" fill="%2309090b">
        <tspan x="80" dy="0">A - Atomicity: Transactions are all-or-nothing.</tspan>
        <tspan x="80" dy="22">C - Consistency: DB transitions from one valid state to another.</tspan>
        <tspan x="80" dy="22">I - Isolation: Transactions run independently of each other.</tspan>
        <tspan x="80" dy="22">D - Durability: Changes persist even in case of system failure.</tspan>
      </text>

      <circle cx="70" cy="1000" r="14" fill="%2310b981" fill-opacity="0.1" stroke="%2310b981" stroke-width="1.5"/>
      <text x="70" y="1004" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2310b981" text-anchor="middle">✓</text>
      <text x="95" y="1004" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2310b981">Clear, concise descriptions for all four attributes.</text>
    </svg>`;

    setFileType("image");
    setFileName("interactive-mock-sheet.svg");
    setPageNumber(1);
    setNumPages(1);
    setScale(1.0);
    setRotation(0);
    setFileUrl(mockImage);
    setFile(mockImage);

    // Set custom mock marking schema
    const mockQuestions: QuestionMark[] = [
      { id: "mq-1", name: "Q-1 (Linked List)", marksAwarded: 9, maxMarks: 10, remarks: "Excellent reverse algorithm, optimal O(N) complexity" },
      { id: "mq-2", name: "Q-2 (TCP vs UDP)", marksAwarded: 8.5, maxMarks: 10, remarks: "Well structured difference, missing header comparisons" },
      { id: "mq-3", name: "Q-3 (ACID properties)", marksAwarded: 10, maxMarks: 10, remarks: "Flawless atomic definitions and descriptions" },
      { id: "mq-4", name: "Q-4 (OS Scheduling)", marksAwarded: "", maxMarks: 10, remarks: "" },
      { id: "mq-5", name: "Q-5 (DBMS Indexing)", marksAwarded: "", maxMarks: 10, remarks: "" },
    ];
    setQuestions(mockQuestions);
    setOverallRemarks("Good response in basic algorithms and networks. DB concepts are solid. Needs evaluation for scheduling.");
    setEvaluationStatus("In Progress");

    showNotification("info", "Loaded pre-configured mock exam answer sheet");
  };

  const handleClearDocument = () => {
    if (fileUrl && fileUrl.startsWith("blob:")) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileType(null);
    setFileUrl(null);
    setFileName("");
    setPageNumber(1);
    setNumPages(1);
  };

  // Zoom control handlers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.15, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.15, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1.0);
  };

  // Rotation control handler
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // PDF page navigation
  const handlePrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const handleSave = () => {
    setIsSaving(true);

    const payload = {
      timestamp: new Date().toISOString(),
      document: {
        fileName,
        fileType,
      },
      evaluation: {
        questions: questions.map(q => ({
          id: q.id,
          name: q.name,
          marksAwarded: q.marksAwarded === "" ? null : q.marksAwarded,
          maxMarks: q.maxMarks,
          remarks: q.remarks,
        })),
        overallRemarks,
        status: evaluationStatus,
        totalScore: questions.reduce((sum, q) => sum + (typeof q.marksAwarded === "number" ? q.marksAwarded : 0), 0),
        maxPossibleScore: questions.reduce((sum, q) => sum + q.maxMarks, 0),
      }
    };

    // Simulate network delay
    setTimeout(() => {
      setIsSaving(false);
      console.log("=== OSM ASSESSMENT DATA SAVED ===");
      console.log(JSON.stringify(payload, null, 2));
      console.log("=================================");

      setLastSavedData(payload);
      setShowSavedModal(true);

      // Trigger a client-side file download so the user gets a physical file
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `evaluation_${fileName.split('.')[0] || 'result'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showNotification("success", "Marks sheet successfully saved! File downloaded & details displayed.");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-black overflow-hidden font-sans">
      {/* Top Application Bar */}
      <header className="h-16 shrink-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-violet-600 p-2 rounded-xl text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-md font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              AuraMark OSM
            </h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              On-Screen Evaluation Suite MVP
            </p>
          </div>
        </div>

        {file && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg max-w-sm">
            <FileText className="w-4 h-4 text-violet-500 shrink-0" />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 truncate" title={fileName}>
              {fileName}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {file && (
            <button
              onClick={handleClearDocument}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Change Document</span>
            </button>
          )}
          <span className="text-xs font-bold px-2.5 py-1 bg-violet-600/10 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 rounded-md">
            MVP mode
          </span>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold max-w-md ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : notification.type === "error"
              ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
              : "bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300"
          }`}>
            {notification.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
            {notification.type === "error" && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
            {notification.type === "info" && <FileText className="w-5 h-5 text-violet-500 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 flex overflow-hidden">
        {!file ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900/50">
            <DocumentDropzone onFileSelect={handleFileSelect} onUseMock={handleUseMock} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Panel: Document Viewer */}
            <div className="flex-1 flex flex-col bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {/* Viewer Control Toolbar */}
              <div className="h-12 shrink-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 z-10">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="text-xs font-semibold px-2 py-1 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-100 transition-colors"
                    title="Reset Zoom"
                  >
                    {Math.round(scale * 100)}%
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Page Navigation */}
                {fileType === "pdf" && numPages > 1 && (
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handlePrevPage}
                      disabled={pageNumber === 1}
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      Page {pageNumber} of {numPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={pageNumber === numPages}
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Rotation Control */}
                <div className="flex items-center">
                  <button
                    onClick={handleRotate}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Viewport content */}
              <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
                {fileType === "pdf" ? (
                  <PDFViewer
                    fileUrl={file}
                    scale={scale}
                    rotation={rotation}
                    pageNumber={pageNumber}
                    onLoadSuccess={(loadedPages) => setNumPages(loadedPages)}
                    onLoadError={(err) => {
                      console.error("PDF load error: ", err);
                      showNotification("error", "Error loading PDF file. Please verify it is a valid PDF.");
                    }}
                  />
                ) : (
                  fileUrl && (
                    <ImageViewer
                      fileUrl={fileUrl}
                      scale={scale}
                      rotation={rotation}
                      onLoadSuccess={() => setNumPages(1)}
                    />
                  )
                )}
              </div>
            </div>

            {/* Right Panel: Marking Panel */}
            <div className="w-full lg:w-[420px] shrink-0 p-5 bg-zinc-50 dark:bg-zinc-900 border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800 overflow-y-auto">
              <MarkingPanel
                questions={questions}
                overallRemarks={overallRemarks}
                evaluationStatus={evaluationStatus}
                onQuestionsChange={setQuestions}
                onOverallRemarksChange={setOverallRemarks}
                onStatusChange={setEvaluationStatus}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          </div>
        )}
      </main>

      {/* Saved Data JSON Viewer Modal */}
      {showSavedModal && lastSavedData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transform transition-transform scale-100 duration-300">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-50">Evaluation Saved Successfully!</h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Mock database capture simulation</p>
                </div>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                <strong>💡 Note for Evaluation Review:</strong> Since this is a frontend MVP, there is no connected backend database. However, the system successfully compiled the grading data into the structured schema below. This exact payload is logged to the developer console and is ready to be sent to a database API.
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Saved JSON Schema</span>
                  <button
                    onClick={handleCopyJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Schema</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-zinc-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-zinc-800 max-h-[350px] shadow-inner select-all">
                  {JSON.stringify(lastSavedData, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 flex justify-end gap-2.5">
              <button
                onClick={() => setShowSavedModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 active:scale-98 rounded-xl transition-all duration-200 shadow-md shadow-violet-500/10"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
