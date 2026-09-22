'use client';

import React, { useState } from 'react';
import { ClassroomPack, StudentDoubt } from '@/types';
import {
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Send,
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface DoubtSolverProps {
  pack: ClassroomPack;
  doubts: StudentDoubt[];
  onAddDoubt: (doubt: StudentDoubt) => void;
  studentName: string;
}

export const DoubtSolver: React.FC<DoubtSolverProps> = ({
  pack,
  doubts,
  onAddDoubt,
  studentName,
}) => {
  const [doubtText, setDoubtText] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [hasSimulatedImage, setHasSimulatedImage] = useState(false);

  const sampleQuestions = [
    "Why does Max Pooling have 0 learnable weights?",
    "If Stride = 2 and Padding = 1, how does the image size change?",
    "What is the difference between an activation map and a kernel?",
  ];

  const handleSubmitDoubt = async (customQuery?: string) => {
    const query = customQuery || doubtText.trim() || (hasSimulatedImage ? 'Uploaded problem on gradient routing in CNNs' : '');
    if (!query) return;

    setDoubtText('');
    setIsSolving(true);

    try {
      await new Promise((r) => setTimeout(r, 600));

      const newDoubt: StudentDoubt = {
        id: `doubt-${Date.now()}`,
        studentId: 'student-aryan',
        studentName,
        questionText: query,
        identifiedConcepts: [
          'Backpropagation in ConvNets',
          'Gradient Routing through Max Pooling',
          'Chain Rule in 2D Tensors',
        ],
        relevantLecture: `${pack.topic} (Slide 8 & Slide 12)`,
        answerText: `Here is the simple explanation:\n\n1. The Core Idea: Max Pooling has zero weights because its only job is downsampling (reducing spatial size). It simply picks the highest number in each 2×2 window.\n\n2. During Backpropagation: The network remembers which cell had that maximum value (using an 'argmax mask'). The error signal flows 100% back into that one winning cell, and the other 3 cells get 0.\n\n3. Slide Reference: Review Slide 8 of Dr. Sharma's lecture deck for the visual diagram!`,
        status: 'Resolved',
        createdAt: new Date().toISOString(),
      };

      onAddDoubt(newDoubt);
      setHasSimulatedImage(false);
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-[#0d9488] border border-teal-200">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Student Doubt Solver</h1>
            <p className="text-xs text-slate-500">
              Got stuck during class or homework? Type your question or snap a photo of your notebook.
            </p>
          </div>
        </div>
      </div>

      {/* Doubt Input Box */}
      <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Ask Your Question
          </h3>
          <span className="text-[11px] text-slate-500">
            Connected to: <strong className="text-[#0d9488]">{pack.topic}</strong>
          </span>
        </div>

        {/* Quick Sample Questions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0">Click to try:</span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSubmitDoubt(sq)}
              className="px-3 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-teal-50 text-slate-700 hover:text-[#0d9488] border border-[#e6dfd5] hover:border-[#0d9488]/40 whitespace-nowrap transition-all shadow-2xs font-medium"
            >
              {sq}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitDoubt();
          }}
          className="space-y-3"
        >
          <textarea
            rows={3}
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            placeholder="Type your question in simple words... e.g. What happens if I forget padding in my convolutional layer?"
            className="w-full px-4 py-3 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#0d9488] resize-none leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Simulated Image Upload */}
            <button
              type="button"
              onClick={() => setHasSimulatedImage(!hasSimulatedImage)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                hasSimulatedImage
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-[#faf8f5] border-[#e6dfd5] text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#0d9488]" />
              {hasSimulatedImage
                ? '✓ Sample_Problem_Photo.png Attached'
                : '+ Attach Photo of Notebook / Homework'}
            </button>

            <button
              type="submit"
              disabled={isSolving || (!doubtText.trim() && !hasSimulatedImage)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-xs transition-all disabled:opacity-40 active:scale-95"
            >
              {isSolving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Diagnosing & Solving...</span>
                </>
              ) : (
                <>
                  <span>Solve My Doubt</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Resolved Doubts Stream */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Your Answered Doubts ({doubts.length})
        </h3>

        {doubts.map((doubt) => (
          <div
            key={doubt.id}
            className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Solved & Connected to Class Notes</span>
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {doubt.relevantLecture}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Question:</p>
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                &ldquo;{doubt.questionText}&rdquo;
              </p>
            </div>

            {/* Identified Concepts Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 font-bold">Key Concepts:</span>
              {doubt.identifiedConcepts.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-teal-50 text-[#0f766e] border border-teal-200"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Answer Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-2">
              <p className="text-xs font-bold text-[#0d9488] uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Step-by-Step Answer:
              </p>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {doubt.answerText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
