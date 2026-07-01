"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize, Bookmark, Search, FileText, CheckCircle2, AlertTriangle, Lightbulb, Save, Clock } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";

// Mock data
const mockQuestions = [
  { id: "Q1", marks: 8, max: 10, aiSuggested: 8, status: "completed" },
  { id: "Q2", marks: null, max: 15, aiSuggested: 12, status: "pending" },
  { id: "Q3", marks: null, max: 5, aiSuggested: 5, status: "pending" },
];

const mockCandidate = {
  rollNo: "CS2023-4059",
  name: "John Doe",
  subject: "Computer Science 101",
  date: "Oct 15, 2023",
  attempt: 1,
};

export default function EvaluatePage() {
  const [activeTab, setActiveTab] = useState<"marks" | "rubric" | "candidate">("marks");

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4 overflow-hidden -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
      
      {/* Left Panel: Document Viewer */}
      <Card className="flex-1 flex flex-col overflow-hidden shadow-brand-md border-brand-border">
        {/* Toolbar */}
        <div className="h-14 border-b border-brand-border bg-brand-bg flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Thumbnail Sidebar">
              <FileText className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-brand-border mx-1" />
            <Button variant="ghost" size="icon" title="Zoom Out"><ZoomOut className="h-4 w-4" /></Button>
            <span className="text-sm font-medium w-12 text-center">100%</span>
            <Button variant="ghost" size="icon" title="Zoom In"><ZoomIn className="h-4 w-4" /></Button>
            <div className="h-6 w-px bg-brand-border mx-1" />
            <Button variant="ghost" size="icon" title="Rotate"><RotateCw className="h-4 w-4" /></Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-medium">Page 1 of 12</span>
            <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Bookmark"><Bookmark className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" title="Fullscreen"><Maximize className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* PDF Viewport (Mock) */}
        <div className="flex-1 bg-gray-200/50 flex items-center justify-center overflow-auto p-8 relative">
          {/* Highlight Mock */}
          <div className="absolute top-32 left-1/4 w-1/2 h-24 bg-brand-primary/10 border-2 border-brand-primary/30 rounded" />
          
          <div className="w-full max-w-2xl bg-white shadow-xl h-[800px] rounded-sm p-12">
            <div className="border-b-2 border-gray-800 pb-4 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-900">Computer Science 101</h2>
                <p className="text-gray-600 font-medium">Midterm Examination</p>
              </div>
              <div className="text-right">
                <div className="border border-gray-400 p-2 text-center font-mono text-sm tracking-widest bg-gray-50">
                  |||| ||| |||| || |||
                  <br />
                  {mockCandidate.rollNo}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <h3 className="font-bold text-lg mb-2">Q1. Explain the difference between process and thread.</h3>
                <p className="text-gray-800 font-handwriting text-lg leading-relaxed border border-blue-100 bg-blue-50/20 p-4 rounded-lg">
                  A process is an executing instance of a program, containing its own memory space, variables, and state. A thread is the smallest sequence of programmed instructions that can be managed independently by a scheduler. Threads exist within a process and share the process resources...
                </p>
                <div className="absolute -left-12 top-0 bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded shadow-sm text-sm">
                  10m
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Right Panel: Grading & Info */}
      <div className="w-[450px] flex flex-col shrink-0 gap-4">
        
        {/* Status Bar */}
        <Card className="shrink-0 p-3 flex justify-between items-center bg-brand-primary text-white border-none">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">12:45</span>
          </div>
          <div className="flex items-center gap-2">
            <Save className="h-4 w-4 text-blue-200" />
            <span className="text-sm text-blue-100">Saved 2m ago</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
            In Progress
          </Badge>
        </Card>

        {/* Tab Navigation */}
        <div className="flex bg-brand-bg rounded-lg p-1 shrink-0 border border-brand-border">
          <button 
            onClick={() => setActiveTab("marks")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "marks" ? "bg-white shadow-sm text-brand-primary" : "text-brand-text-secondary hover:text-brand-text-primary"}`}
          >
            Marking
          </button>
          <button 
            onClick={() => setActiveTab("rubric")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "rubric" ? "bg-white shadow-sm text-brand-primary" : "text-brand-text-secondary hover:text-brand-text-primary"}`}
          >
            Rubric
          </button>
          <button 
            onClick={() => setActiveTab("candidate")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "candidate" ? "bg-white shadow-sm text-brand-primary" : "text-brand-text-secondary hover:text-brand-text-primary"}`}
          >
            Candidate
          </button>
        </div>

        {/* Tab Content Area */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {activeTab === "marks" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
                
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-brand-text-primary">Evaluation Progress</span>
                    <span className="text-brand-primary font-bold">1 / 3 Completed</span>
                  </div>
                  <div className="h-2 w-full bg-brand-bg rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full w-1/3" />
                  </div>
                </div>

                <div className="space-y-4">
                  {mockQuestions.map((q) => (
                    <div key={q.id} className={`p-4 rounded-xl border ${q.status === 'completed' ? 'border-brand-success/30 bg-brand-success/5' : 'border-brand-border bg-white shadow-brand-sm'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-brand-text-primary">{q.id}</h4>
                          {q.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-brand-success" />}
                        </div>
                        <span className="text-sm font-medium text-brand-text-secondary">Max: {q.max}</span>
                      </div>
                      
                      <div className="flex gap-3 items-start">
                        <div className="flex-1">
                          <Input 
                            type="number" 
                            placeholder="Marks" 
                            defaultValue={q.marks || ""}
                            className={q.status === 'completed' ? 'border-brand-success focus-visible:ring-brand-success' : ''}
                          />
                        </div>
                        
                        {/* AI Suggestion */}
                        <div className="flex-1 flex flex-col items-center justify-center p-2 rounded-md bg-purple-50 border border-purple-100 text-purple-700">
                          <div className="flex items-center gap-1 text-xs font-semibold mb-1">
                            <Lightbulb className="h-3 w-3" /> AI Suggests
                          </div>
                          <span className="font-bold text-lg">{q.aiSuggested}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <textarea 
                          placeholder="Add remarks (optional)..."
                          className="w-full text-sm rounded-md border border-brand-border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary resize-none h-16"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-brand-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-brand-text-primary">Total Score</span>
                    <span className="text-2xl font-bold text-brand-primary">8 / 30</span>
                  </div>
                  <Button className="w-full">Submit Evaluation</Button>
                </div>

              </motion.div>
            )}

            {activeTab === "rubric" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
                <h3 className="font-semibold text-brand-text-primary mb-2">Q1. Process vs Thread (10 Marks)</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900">
                    <span className="font-bold block mb-1">Definition (4 Marks)</span>
                    Clear distinction between process (independent execution) and thread (subset of process).
                  </div>
                  
                  <div className="p-3 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary">
                    <span className="font-bold block mb-1">Resource Sharing (3 Marks)</span>
                    Mentions that threads share memory/resources of the process, while processes have isolated memory.
                  </div>

                  <div className="p-3 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary">
                    <span className="font-bold block mb-1">Context Switching (3 Marks)</span>
                    Explains that thread context switching is faster/cheaper than process context switching.
                  </div>

                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-900 mt-6">
                    <span className="font-bold flex items-center gap-1 mb-1"><AlertTriangle className="h-4 w-4" /> Common Mistakes</span>
                    Deduct marks if candidate states threads cannot run concurrently.
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "candidate" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-brand-bg flex items-center justify-center text-3xl font-bold text-brand-text-secondary border-4 border-white shadow-brand-sm">
                    JD
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-brand-text-secondary uppercase tracking-wider font-semibold">Roll Number</p>
                    <p className="font-medium text-brand-text-primary font-mono text-lg">{mockCandidate.rollNo}</p>
                  </div>
                  <div className="h-px bg-brand-border w-full" />
                  
                  <div>
                    <p className="text-xs text-brand-text-secondary uppercase tracking-wider font-semibold">Candidate Name</p>
                    <p className="font-medium text-brand-text-primary">{mockCandidate.name}</p>
                  </div>
                  <div className="h-px bg-brand-border w-full" />
                  
                  <div>
                    <p className="text-xs text-brand-text-secondary uppercase tracking-wider font-semibold">Subject</p>
                    <p className="font-medium text-brand-text-primary">{mockCandidate.subject}</p>
                  </div>
                  <div className="h-px bg-brand-border w-full" />

                  <div>
                    <p className="text-xs text-brand-text-secondary uppercase tracking-wider font-semibold">Attempt</p>
                    <p className="font-medium text-brand-text-primary">Attempt {mockCandidate.attempt}</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-brand-bg rounded-lg text-center">
                  <div className="font-mono text-sm tracking-widest text-brand-text-secondary mb-2">BARCODE / QR</div>
                  <div className="h-16 w-full bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px)] opacity-50" />
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
