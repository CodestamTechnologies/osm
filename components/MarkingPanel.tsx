"use client";

import React, { useState } from "react";
import { Save, Plus, RotateCcw, CheckCircle, AlertTriangle, MessageSquare, Trash2 } from "lucide-react";

export interface QuestionMark {
  id: string;
  name: string;
  marksAwarded: number | "";
  maxMarks: number;
  remarks: string;
}

interface MarkingPanelProps {
  questions: QuestionMark[];
  overallRemarks: string;
  evaluationStatus: string;
  onQuestionsChange: (questions: QuestionMark[]) => void;
  onOverallRemarksChange: (remarks: string) => void;
  onStatusChange: (status: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function MarkingPanel({
  questions,
  overallRemarks,
  evaluationStatus,
  onQuestionsChange,
  onOverallRemarksChange,
  onStatusChange,
  onSave,
  isSaving,
}: MarkingPanelProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleMarkChange = (id: string, value: string, maxMarks: number) => {
    let numVal: number | "";
    if (value === "") {
      numVal = "";
    } else {
      numVal = parseFloat(value);
      if (isNaN(numVal)) numVal = "";
    }

    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, marksAwarded: numVal };
      }
      return q;
    });

    onQuestionsChange(updatedQuestions);

    // Validate
    const errors = { ...validationErrors };
    if (numVal !== "" && (numVal < 0 || numVal > maxMarks)) {
      errors[id] = `Marks must be between 0 and ${maxMarks}`;
    } else {
      delete errors[id];
    }
    setValidationErrors(errors);
  };

  const handleMaxMarkChange = (id: string, value: string) => {
    let numVal = parseInt(value, 10);
    if (isNaN(numVal) || numVal < 1) numVal = 1;

    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        // Recalculate validation error if marksAwarded exceeds new max
        const errors = { ...validationErrors };
        if (q.marksAwarded !== "" && q.marksAwarded > numVal) {
          errors[id] = `Marks must be between 0 and ${numVal}`;
        } else {
          delete errors[id];
        }
        setValidationErrors(errors);

        return { ...q, maxMarks: numVal };
      }
      return q;
    });

    onQuestionsChange(updatedQuestions);
  };

  const handleQuestionRemarksChange = (id: string, value: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, remarks: value };
      }
      return q;
    });
    onQuestionsChange(updatedQuestions);
  };

  const addQuestionRow = () => {
    const newId = `q-${Date.now()}`;
    const nextIndex = questions.length + 1;
    const newQuestion: QuestionMark = {
      id: newId,
      name: `Q-${nextIndex}`,
      marksAwarded: "",
      maxMarks: 10,
      remarks: "",
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const deleteQuestionRow = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    // Rename sequentially for professional look
    const renamedQuestions = updatedQuestions.map((q, idx) => ({
      ...q,
      name: `Q-${idx + 1}`,
    }));
    onQuestionsChange(renamedQuestions);

    // Clear validation errors
    const errors = { ...validationErrors };
    delete errors[id];
    setValidationErrors(errors);
  };

  const resetQuestions = () => {
    const defaultQuestions: QuestionMark[] = Array.from({ length: 5 }, (_, i) => ({
      id: `q-${i + 1}`,
      name: `Q-${i + 1}`,
      marksAwarded: "",
      maxMarks: 10,
      remarks: "",
    }));
    onQuestionsChange(defaultQuestions);
    setValidationErrors({});
  };

  const totalAwarded = questions.reduce((sum, q) => sum + (typeof q.marksAwarded === "number" ? q.marksAwarded : 0), 0);
  const totalMax = questions.reduce((sum, q) => sum + q.maxMarks, 0);
  const totalQuestions = questions.length;
  const questionsEvaluated = questions.filter((q) => q.marksAwarded !== "").length;
  const progressPercent = totalQuestions > 0 ? Math.round((questionsEvaluated / totalQuestions) * 100) : 0;
  const percentageScore = totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : 0;

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      {/* Panel Header */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Evaluation & Marks Entry</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Award marks page by page or overall</p>
          </div>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            evaluationStatus === "Completed"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
              : evaluationStatus === "In Progress"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
              : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/25"
          }`}>
            {evaluationStatus}
          </span>
        </div>

        {/* Scores Overview Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/10 p-3.5 rounded-xl text-center">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mb-1">Total Marks</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-black text-violet-600 dark:text-violet-400">{totalAwarded}</span>
              <span className="text-sm text-zinc-400 dark:text-zinc-500">/ {totalMax}</span>
            </div>
            {totalMax > 0 && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 block">
                Grade Rate: {percentageScore}%
              </span>
            )}
          </div>

          <div className="bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800 p-3.5 rounded-xl text-center">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block mb-1">Progress</span>
            <span className="text-2xl font-black text-zinc-800 dark:text-zinc-200">
              {questionsEvaluated}<span className="text-sm text-zinc-400 dark:text-zinc-500">/{totalQuestions}</span>
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 block">
              Questions Graded
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-violet-600 dark:bg-violet-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Questions Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[450px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Detailed Breakdown
          </h3>
          <div className="flex gap-2">
            <button
              onClick={resetQuestions}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={addQuestionRow}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-white bg-violet-600 hover:bg-violet-700 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Q</span>
            </button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No questions defined yet.</p>
            <button
              onClick={addQuestionRow}
              className="mt-3 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Add your first question row
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => {
              const error = validationErrors[q.id];
              return (
                <div
                  key={q.id}
                  className={`p-3.5 border rounded-xl transition-all duration-200 bg-zinc-50/30 dark:bg-zinc-900/10 ${
                    error
                      ? "border-red-500/50 bg-red-500/5"
                      : q.marksAwarded !== ""
                      ? "border-emerald-500/30 bg-emerald-500/2"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                      {q.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={q.marksAwarded}
                          onChange={(e) => handleMarkChange(q.id, e.target.value, q.maxMarks)}
                          placeholder="Marks"
                          min="0"
                          max={q.maxMarks}
                          step="0.5"
                          className={`w-16 px-2 py-1 text-sm font-semibold rounded-md border text-center outline-none bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            error
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-violet-500"
                          }`}
                        />
                        <span className="text-zinc-400">/</span>
                        <input
                          type="number"
                          value={q.maxMarks}
                          onChange={(e) => handleMaxMarkChange(q.id, e.target.value)}
                          placeholder="Max"
                          min="1"
                          className="w-12 px-1 py-1 text-sm text-zinc-500 bg-transparent text-center border-b border-transparent hover:border-zinc-300 focus:border-violet-500 outline-none"
                        />
                      </div>
                      <button
                        onClick={() => deleteQuestionRow(q.id)}
                        className="text-zinc-400 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Remarks per question */}
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      value={q.remarks}
                      onChange={(e) => handleQuestionRemarksChange(q.id, e.target.value)}
                      placeholder="Add brief question remarks..."
                      className="w-full text-xs bg-transparent border-b border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 focus:border-violet-500 outline-none py-0.5 text-zinc-600 dark:text-zinc-400"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-red-500">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Evaluation Area */}
      <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 space-y-4 bg-zinc-50/20 dark:bg-zinc-900/5">
        <div>
          <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
            Evaluation Status
          </label>
          <select
            value={evaluationStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:ring-1 focus:ring-violet-500 outline-none"
          >
            <option value="Draft">Draft (Evaluation Initialized)</option>
            <option value="In Progress">In Progress (Active Grading)</option>
            <option value="Completed">Completed (Ready for Submission)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
            Overall Assessment Remarks
          </label>
          <textarea
            value={overallRemarks}
            onChange={(e) => onOverallRemarksChange(e.target.value)}
            rows={3}
            placeholder="Provide comprehensive evaluator comments on student performance..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
          />
        </div>

        <button
          onClick={onSave}
          disabled={isSaving || hasErrors}
          className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-white font-bold transition-all duration-200 shadow-md ${
            hasErrors
              ? "bg-zinc-400 cursor-not-allowed shadow-none"
              : isSaving
              ? "bg-violet-500/80 cursor-wait"
              : "bg-violet-600 hover:bg-violet-700 active:scale-98 shadow-violet-500/10"
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Assessment...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Marks Sheet</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
