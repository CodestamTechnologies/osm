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
  BookOpen,
  X,
  Copy,
  Check,
  Info,
} from "lucide-react";
import DocumentDropzone from "./DocumentDropzone";
import ImageViewer from "./ImageViewer";
import MarkingPanel, { QuestionMark } from "./MarkingPanel";

// Dynamically import PDFViewer to disable SSR
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-100 border border-gray-200 rounded-xl">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-sm text-gray-500 font-medium">Loading document renderer...</span>
    </div>
  ),
});

// ── Local types ────────────────────────────────────────────────────────────
interface SavedPayload {
  timestamp: string;
  document: { fileName: string; fileType: string | null };
  evaluation: {
    questions: { id: string; name: string; marksAwarded: number | null; maxMarks: number; remarks: string }[];
    overallRemarks: string;
    status: string;
    totalScore: number;
    maxPossibleScore: number;
  };
}

interface DraftData {
  timestamp: string;
  fileName: string;
  fileType: "pdf" | "image" | null;
  fileUrl: string | null;
  questions: QuestionMark[];
  overallRemarks: string;
  evaluationStatus: string;
}

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

  // Marking Panel states — questions seeded via lazy initializer (avoids useEffect setState)
  const [questions, setQuestions] = useState<QuestionMark[]>(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: `q-${i + 1}`,
      name: `Q-${i + 1}`,
      marksAwarded: "",
      maxMarks: 10,
      remarks: "",
    }))
  );
  const [overallRemarks, setOverallRemarks] = useState<string>("");
  const [evaluationStatus, setEvaluationStatus] = useState<string>("Draft");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Saved Data Modal states
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [lastSavedData, setLastSavedData] = useState<SavedPayload | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Mobile layout state: "document" | "grading"
  const [activeMobileTab, setActiveMobileTab] = useState<"document" | "grading">("document");

  // Auto-save & Restoration states — draft loaded via lazy initializer (avoids useEffect setState)
  const [hasDraft, setHasDraft] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem("auramark_osm_draft");
      if (!saved) return false;
      const parsed: DraftData = JSON.parse(saved);
      return Boolean(
        parsed.fileName &&
          (parsed.overallRemarks ||
            parsed.questions.some((q) => q.marksAwarded !== "" || q.remarks !== ""))
      );
    } catch {
      return false;
    }
  });
  const [draftData, setDraftData] = useState<DraftData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("auramark_osm_draft");
      if (!saved) return null;
      const parsed: DraftData = JSON.parse(saved);
      return parsed.fileName ? parsed : null;
    } catch {
      return null;
    }
  });

  const modalRef = React.useRef<HTMLDivElement>(null);

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

  // Initialize questions — handled via lazy useState initializer above

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

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

  // Draft loading — handled via lazy useState initializer above

  // Auto-save effect
  useEffect(() => {
    if (!fileName) return;

    const draft = {
      fileName,
      fileType,
      fileUrl: fileUrl && fileUrl.startsWith("blob:") ? null : fileUrl,
      questions,
      overallRemarks,
      evaluationStatus,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem("auramark_osm_draft", JSON.stringify(draft));
  }, [fileName, fileType, fileUrl, questions, overallRemarks, evaluationStatus]);

  // ── Viewer & page/save controls (declared before keyboard useEffect to avoid TDZ) ──
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.15, 3.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.5));
  const handleZoomReset = () => setScale(1.0);
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handlePrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

  const handleSave = () => {
    setIsSaving(true);

    const payload = {
      timestamp: new Date().toISOString(),
      document: { fileName, fileType },
      evaluation: {
        questions: questions.map((q) => ({
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
      },
    };

    setTimeout(() => {
      setIsSaving(false);
      console.log("=== OSM ASSESSMENT DATA SAVED ===");
      console.log(JSON.stringify(payload, null, 2));
      console.log("=================================");

      setLastSavedData(payload);
      setShowSavedModal(true);

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `evaluation_${fileName.split(".")[0] || "result"}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showNotification("success", "Marks sheet successfully saved! File downloaded & details displayed.");
    }, 1500);
  };

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      // Ctrl + S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (file) {
          handleSave();
        }
        return;
      }

      // Alt shortcuts
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "=":
            e.preventDefault();
            handleZoomIn();
            break;
          case "-":
            e.preventDefault();
            handleZoomOut();
            break;
          case "r":
            e.preventDefault();
            handleRotate();
            break;
          case "arrowleft":
            e.preventDefault();
            if (fileType === "pdf") {
              handlePrevPage();
            }
            break;
          case "arrowright":
            e.preventDefault();
            if (fileType === "pdf") {
              handleNextPage();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, fileType]);

  // Modal Focus Trap & Escape key
  useEffect(() => {
    if (!showSavedModal) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSavedModal(false);
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll("button");
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    }, 50);

    window.addEventListener("keydown", handleModalKeyDown);
    return () => window.removeEventListener("keydown", handleModalKeyDown);
  }, [showSavedModal]);

  const handleRestoreDraft = () => {
    if (!draftData) return;
    setFileName(draftData.fileName);
    setFileType(draftData.fileType);
    setQuestions(draftData.questions);
    setOverallRemarks(draftData.overallRemarks);
    setEvaluationStatus(draftData.evaluationStatus);

    if (draftData.fileUrl) {
      setFile(draftData.fileUrl);
      setFileUrl(draftData.fileUrl);
    } else {
      if (draftData.fileName === "interactive-mock-sheet.svg") {
        handleUseMock();
      } else {
        showNotification("info", `Draft restored. Please browse file to view: ${draftData.fileName}`);
      }
    }
    setHasDraft(false);
    showNotification("success", "Evaluation draft successfully restored!");
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("auramark_osm_draft");
    setHasDraft(false);
    setDraftData(null);
    showNotification("info", "Draft session discarded.");
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
 
  // Notification icon helper
  const NotifIcon = {
    success: <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />,
    error:   <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />,
    info:    <Info className="w-4 h-4 text-blue-600 shrink-0" />,
  };

  const notifStyles = {
    success: "bg-white border-green-200 text-green-800",
    error:   "bg-white border-red-200 text-red-800",
    info:    "bg-white border-blue-200 text-blue-800",
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>

      {/* ── Top Application Bar ──────────────────────────────────────── */}
      <header className="h-14 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-5 z-10"
        style={{ boxShadow: "0 1px 2px 0 rgba(15,23,42,0.05)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-xl">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-gray-900 tracking-tight leading-tight">
              AuraMark OSM
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest leading-tight">
              On-Screen Evaluation Suite
            </p>
          </div>
        </div>

        {/* File badge (center) */}
        {file && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg max-w-xs" aria-label="Active document details">
            <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 truncate" title={fileName}>
              {fileName}
            </span>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {file && (
            <button
              onClick={handleClearDocument}
              className="
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                text-gray-600 bg-white border border-gray-200 rounded-lg
                hover:bg-gray-50 hover:text-gray-800 transition-all duration-150
              "
              aria-label="Upload a different document"
            >
              <Upload className="w-3.5 h-3.5" />
              Change Document
            </button>
          )}
          <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md">
            MVP
          </span>
        </div>
      </header>

      {/* ── Draft Recovery Alert ──────────────────────────────────────── */}
      {hasDraft && draftData && (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex flex-wrap gap-3 items-center justify-between z-20 shrink-0 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-semibold text-amber-800">
              Auto-saved draft from {new Date(draftData.timestamp).toLocaleTimeString()}: <strong>{draftData.fileName}</strong> ({draftData.questions.filter((q: { marksAwarded: number | string }) => q.marksAwarded !== "").length} graded items)
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDiscardDraft}
              className="px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleRestoreDraft}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Restore Draft
            </button>
          </div>
        </div>
      )}

      {/* ── Toast Notification ───────────────────────────────────────── */}
      {notification && (
        <div className="fixed top-16 right-5 z-50 animate-in slide-in-from-top-2 fade-in duration-200" role="status" aria-live="polite">
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold max-w-sm
              ${notifStyles[notification.type]}
            `}
            style={{ boxShadow: "0 4px 16px 0 rgba(15,23,42,0.10)" }}
          >
            {NotifIcon[notification.type]}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* ── Sticky Mobile View Switcher ──────────────────────────────── */}
      {file && (
        <div className="lg:hidden shrink-0 bg-white border-b border-gray-200 flex" role="tablist" aria-label="Mobile view mode switcher">
          <button
            onClick={() => setActiveMobileTab("document")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all ${
              activeMobileTab === "document"
                ? "border-blue-600 text-blue-600 bg-blue-50/20"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            role="tab"
            aria-selected={activeMobileTab === "document"}
            aria-controls="mobile-viewport-container"
          >
            📄 Document View
          </button>
          <button
            onClick={() => setActiveMobileTab("grading")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all ${
              activeMobileTab === "grading"
                ? "border-blue-600 text-blue-600 bg-blue-50/20"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            role="tab"
            aria-selected={activeMobileTab === "grading"}
            aria-controls="mobile-marking-container"
          >
            📋 Grading Panel
          </button>
        </div>
      )}

      {/* ── Main Workspace ───────────────────────────────────────────── */}
      <main className="flex-1 flex overflow-hidden">
        {!file ? (
          /* Dropzone screen */
          <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
            <DocumentDropzone onFileSelect={handleFileSelect} onUseMock={handleUseMock} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

            {/* Left Panel: Document Viewer */}
            <div 
              id="mobile-viewport-container"
              className={`
                flex-1 flex flex-col bg-[#F1F5F9] border-r border-gray-200 overflow-hidden
                ${activeMobileTab === "document" ? "flex" : "hidden lg:flex"}
              `}
              role="tabpanel"
            >

              {/* Viewer Toolbar */}
              <div className="h-11 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10" aria-label="Document toolbar controls">

                {/* Zoom controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all duration-150"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="text-xs font-bold px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-150 min-w-[52px]"
                    title="Reset Zoom"
                    aria-label="Reset zoom to 100%"
                  >
                    {Math.round(scale * 100)}%
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all duration-150"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Page navigation */}
                {fileType === "pdf" && numPages > 1 && (
                  <div className="flex items-center gap-2" aria-label="PDF pages navigation">
                    <button
                      onClick={handlePrevPage}
                      disabled={pageNumber === 1}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                      title="Previous Page"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-gray-600">
                      {pageNumber} / {numPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={pageNumber === numPages}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                      title="Next Page"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Rotate */}
                <button
                  onClick={handleRotate}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all duration-150"
                  title="Rotate 90° Clockwise"
                  aria-label="Rotate 90 degrees clockwise"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Document viewport */}
              <div className="flex-1 overflow-auto p-5 flex justify-center items-start">
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
            <div 
              id="mobile-marking-container"
              className={`
                w-full lg:w-[400px] shrink-0 p-4 bg-[#F8FAFC] border-t lg:border-t-0 border-gray-200 overflow-y-auto
                ${activeMobileTab === "grading" ? "block" : "hidden lg:block"}
              `}
              role="tabpanel"
            >
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

      {/* ── Saved Data JSON Modal ────────────────────────────────────── */}
      {showSavedModal && lastSavedData && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSavedModal(false); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white w-full max-w-2xl rounded-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]"
            style={{ boxShadow: "0 20px 60px -10px rgba(15,23,42,0.18), 0 4px 16px -4px rgba(15,23,42,0.10)" }}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 id="modal-title" className="text-sm font-bold text-gray-900">Evaluation Saved Successfully!</h3>
                  <p className="text-[11px] text-gray-400">Mock database capture simulation</p>
                </div>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all duration-150"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Note banner */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm text-amber-800">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <p>
                  <strong>Frontend MVP Note:</strong> There is no connected backend. The system compiled the grading data into the structured schema below. This payload is logged to the console and ready to be sent to a database API.
                </p>
              </div>

              {/* JSON block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Saved JSON Schema
                  </span>
                  <button
                    onClick={handleCopyJSON}
                    className="
                      flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                      text-gray-600 bg-white border border-gray-200 rounded-lg
                      hover:bg-gray-50 hover:text-gray-800 transition-all duration-150
                    "
                    aria-label="Copy saved JSON schema string"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Schema</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="
                  p-4 bg-gray-950 text-green-400 font-mono text-xs rounded-xl
                  overflow-x-auto border border-gray-800 max-h-[320px] shadow-inner select-all
                  leading-relaxed
                ">
                  {JSON.stringify(lastSavedData, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-2.5">
              <button
                onClick={() => setShowSavedModal(false)}
                className="
                  px-5 py-2.5 text-sm font-semibold text-white bg-blue-600
                  hover:bg-blue-700 active:scale-[0.98] rounded-xl
                  transition-all duration-200 shadow-sm hover:shadow-md
                "
                aria-label="Dismiss saved dialog"
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
