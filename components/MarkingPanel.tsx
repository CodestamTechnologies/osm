"use client";

import React, { useState } from "react";
import {
  Save,
  Plus,
  RotateCcw,
  AlertTriangle,
  MessageSquare,
  Trash2,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

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
      if (q.id === id) return { ...q, marksAwarded: numVal };
      return q;
    });
    onQuestionsChange(updatedQuestions);

    const errors = { ...validationErrors };
    if (numVal !== "" && (numVal < 0 || numVal > maxMarks)) {
      errors[id] = `Must be 0 – ${maxMarks}`;
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
        const errors = { ...validationErrors };
        if (q.marksAwarded !== "" && q.marksAwarded > numVal) {
          errors[id] = `Must be 0 – ${numVal}`;
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
      if (q.id === id) return { ...q, remarks: value };
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
    const renamedQuestions = updatedQuestions.map((q, idx) => ({
      ...q,
      name: `Q-${idx + 1}`,
    }));
    onQuestionsChange(renamedQuestions);
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

  const totalAwarded = questions.reduce(
    (sum, q) => sum + (typeof q.marksAwarded === "number" ? q.marksAwarded : 0),
    0
  );
  const totalMax = questions.reduce((sum, q) => sum + q.maxMarks, 0);
  const totalQuestions = questions.length;
  const questionsEvaluated = questions.filter((q) => q.marksAwarded !== "").length;
  const progressPercent =
    totalQuestions > 0 ? Math.round((questionsEvaluated / totalQuestions) * 100) : 0;
  const percentageScore = totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : 0;
  const hasErrors = Object.keys(validationErrors).length > 0;

  const statusColor = {
    Completed: "bg-green-50 text-green-700 border-green-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Draft: "bg-gray-100 text-gray-600 border-gray-200",
  }[evaluationStatus] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div
      className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 overflow-hidden"
      style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.04)" }}
    >
      {/* ── Panel Header ──────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
              <ClipboardList className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">
                Evaluation & Marks Entry
              </h2>
              <p className="text-[11px] text-gray-500 leading-tight">
                Award marks per question
              </p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusColor}`}
          >
            {evaluationStatus}
          </span>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Total Marks */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
            <p className="text-[11px] font-medium text-blue-500 mb-1">Total Marks</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-extrabold text-blue-700">{totalAwarded}</span>
              <span className="text-sm text-blue-400">/ {totalMax}</span>
            </div>
            {totalMax > 0 && (
              <p className="text-[10px] text-blue-500 mt-0.5 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {percentageScore}% score
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-[11px] font-medium text-gray-500 mb-1">Progress</p>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-2xl font-extrabold text-gray-800">{questionsEvaluated}</span>
              <span className="text-sm text-gray-400">/{totalQuestions}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">Questions graded</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1 text-right">{progressPercent}% complete</p>
      </div>

      {/* ── Questions List ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 max-h-[460px]">
        {/* Section header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Question Breakdown
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={resetQuestions}
              className="
                flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold
                text-gray-500 bg-white border border-gray-200 rounded-lg
                hover:bg-gray-50 hover:text-gray-700 transition-all duration-150
              "
              aria-label="Reset questions list to default items"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={addQuestionRow}
              className="
                flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold
                text-white bg-blue-600 border border-blue-600 rounded-lg
                hover:bg-blue-700 transition-all duration-150
              "
              aria-label="Add a new question row"
            >
              <Plus className="w-3 h-3" />
              Add Q
            </button>
          </div>
        </div>

        {/* Empty state */}
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl">
            <ClipboardList className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 mb-3">No questions defined yet.</p>
            <button
              onClick={addQuestionRow}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              aria-label="Create your first question item"
            >
              Add your first question row →
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {questions.map((q) => {
              const error = validationErrors[q.id];
              const isGraded = q.marksAwarded !== "";

              return (
                <div
                  key={q.id}
                  className={`
                    p-3.5 rounded-xl border transition-all duration-150
                    ${error
                      ? "border-red-200 bg-red-50/50"
                      : isGraded
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }
                  `}
                >
                  {/* Question row top */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-sm font-bold text-gray-800">{q.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {/* Marks awarded input */}
                        <input
                          type="number"
                          value={q.marksAwarded}
                          onChange={(e) => handleMarkChange(q.id, e.target.value, q.maxMarks)}
                          placeholder="—"
                          min="0"
                          max={q.maxMarks}
                          step="0.5"
                          aria-label={`Marks awarded for ${q.name}`}
                          className={`
                            w-14 px-2 py-1.5 text-sm font-bold text-center rounded-lg border outline-none
                            bg-white text-gray-900
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                            transition-all duration-150
                            ${error
                              ? "border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500"
                              : "border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            }
                          `}
                        />
                        <span className="text-gray-400 text-xs font-medium">/</span>
                        {/* Max marks input */}
                        <input
                          type="number"
                          value={q.maxMarks}
                          onChange={(e) => handleMaxMarkChange(q.id, e.target.value)}
                          min="1"
                          aria-label={`Maximum possible marks for ${q.name}`}
                          className="
                            w-10 px-1 py-1.5 text-xs font-semibold text-center text-gray-500
                            bg-transparent border-b border-transparent
                            hover:border-gray-300 focus:border-blue-500
                            outline-none transition-colors duration-150
                          "
                        />
                      </div>
                      {/* Delete */}
                      <button
                        onClick={() => deleteQuestionRow(q.id)}
                        className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                        title="Delete question"
                        aria-label={`Delete ${q.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Remarks input */}
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={q.remarks}
                      onChange={(e) => handleQuestionRemarksChange(q.id, e.target.value)}
                      placeholder="Add brief remarks..."
                      aria-label={`Grading remarks for ${q.name}`}
                      className="
                        w-full text-xs bg-transparent border-b border-transparent
                        hover:border-gray-200 focus:border-blue-400
                        outline-none py-0.5 text-gray-600 placeholder:text-gray-400
                        transition-colors duration-150
                      "
                    />
                  </div>

                  {/* Validation error */}
                  {error && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-red-600" role="alert">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer: Overall + Save ──────────────────────────────────── */}
      <div className="px-5 pt-4 pb-5 border-t border-gray-100 space-y-3 bg-gray-50/40">
        {/* Status selector */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Evaluation Status
          </label>
          <select
            value={evaluationStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="
              w-full px-3 py-2.5 text-sm font-medium rounded-xl border border-gray-200
              bg-white text-gray-900 outline-none
              focus:ring-2 focus:ring-blue-100 focus:border-blue-500
              transition-all duration-150 cursor-pointer
            "
          >
            <option value="Draft">Draft – Evaluation Initialized</option>
            <option value="In Progress">In Progress – Active Grading</option>
            <option value="Completed">Completed – Ready for Submission</option>
          </select>
        </div>

        {/* Overall remarks */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Overall Assessment Remarks
          </label>
          <textarea
            value={overallRemarks}
            onChange={(e) => onOverallRemarksChange(e.target.value)}
            rows={3}
            placeholder="Provide comprehensive evaluator comments on student performance..."
            className="
              w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200
              bg-white text-gray-900 placeholder:text-gray-400
              outline-none resize-none
              focus:ring-2 focus:ring-blue-100 focus:border-blue-500
              transition-all duration-150
            "
          />
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={isSaving || hasErrors}
          className={`
            flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl
            text-sm font-bold text-white transition-all duration-200
            ${hasErrors
              ? "bg-gray-300 cursor-not-allowed"
              : isSaving
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow-md"
            }
          `}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Assessment...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Marks Sheet</span>
            </>
          )}
        </button>

        {hasErrors && (
          <p className="text-[11px] text-red-500 text-center font-medium">
            Fix validation errors before saving.
          </p>
        )}
      </div>
    </div>
  );
}
