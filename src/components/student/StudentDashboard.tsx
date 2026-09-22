'use client';

import React, { useState } from 'react';
import { ClassroomPack, UserProfile } from '@/types';
import {
  Sparkles,
  BookOpen,
  Presentation,
  CheckSquare,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Calculator,
  Compass,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  student: UserProfile;
  activePack: ClassroomPack;
  onNavigate: (tab: string) => void;
  hasSubmittedQuiz: boolean;
  recentScore?: number;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  activePack,
  onNavigate,
  hasSubmittedQuiz,
  recentScore,
}) => {
  // Interactive formula calculator state for students
  const [calcW, setCalcW] = useState(32);
  const [calcK, setCalcK] = useState(5);
  const [calcP, setCalcP] = useState(2);
  const [calcS, setCalcS] = useState(1);

  const calculatedOutput = Math.floor((calcW - calcK + 2 * calcP) / calcS) + 1;

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans">
      {/* Friendly Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] text-white shadow-md border border-[#0d9488]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Student Study Desk • Semester 5 AI & Machine Learning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              👋 Hey {student.name.split(' ')[0]}! Ready for Today&apos;s Class?
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
              Dr. Rajesh Sharma published the complete lecture package for{' '}
              <span className="text-amber-200 font-bold underline decoration-amber-300/60 underline-offset-2">
                {activePack.topic}
              </span>
              . Everything you need to understand, practice, and ace this topic is right here.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('student-quiz')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#0d9488] hover:bg-slate-50 shadow-sm transition-all"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{hasSubmittedQuiz ? `Quiz Done (${recentScore}/5)` : 'Take 5-Min Practice Quiz'}</span>
            </button>
            <button
              onClick={() => onNavigate('student-tutor')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-black/25 hover:bg-black/35 text-white border border-white/25 backdrop-blur-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI Buddy</span>
            </button>
          </div>
        </div>
      </div>

      {/* 30-Second Concept in Plain English (Zero Jargon) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e6dfd5] shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              💡 In Plain English: What is {activePack.topic}?
            </h3>
            <p className="text-xs text-slate-500">
              The 30-second intuition before diving into formulas and slides
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs sm:text-sm leading-relaxed text-slate-700">
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center text-xs font-black">
                1
              </span>
              The Problem with Regular Networks
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              If an image is 1000×1000 pixels, a regular neural network needs 3 million connections for just one layer! That crashes computers and forgets which pixels are next to each other.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center text-xs font-black">
                2
              </span>
              The CNN Solution: Sliding Filter
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Instead of looking at the whole photo at once, a CNN slides a tiny magnifying glass (like a 3×3 or 5×5 window called a <strong>Kernel</strong>) over the photo to spot local patterns like edges and textures.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center text-xs font-black">
                3
              </span>
              From Edges to Full Objects
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Early layers detect edges → middle layers detect eyes, ears, and corners → deeper layers recognize the full face or car! It works just like human vision.
            </p>
          </div>
        </div>
      </div>

      {/* Your 3-Step Action Plan Today */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">🎯 Your 3-Step Study Plan</h2>
            <p className="text-xs text-slate-500">Complete these 3 steps to master today&apos;s lecture</p>
          </div>
          <span className="text-xs font-semibold text-[#0d9488] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Estimated time: ~15 mins
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Slides */}
          <div
            onClick={() => onNavigate('student-lecture')}
            className="p-5 rounded-2xl bg-white hover:border-[#0d9488] border border-[#e6dfd5] shadow-xs cursor-pointer transition-all hover:shadow-sm group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                  Step 1 • 7 mins
                </span>
                <Presentation className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Browse Class Slides & Notes
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check the 13 slides with diagrams, visual filters, and real-world analogies taught by Dr. Sharma.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 pt-2 border-t border-[#f0eae0]">
              <span>Open Slides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Step 2: Practice Quiz */}
          <div
            onClick={() => onNavigate('student-quiz')}
            className="p-5 rounded-2xl bg-white hover:border-[#0d9488] border border-[#e6dfd5] shadow-xs cursor-pointer transition-all hover:shadow-sm group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold">
                  Step 2 • 5 mins
                </span>
                <CheckSquare className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Test Yourself with 5 Questions
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {hasSubmittedQuiz
                  ? `You already scored ${recentScore}/5! You can review your explanations or retake anytime.`
                  : 'Quick multi-choice quiz to check what stuck and get instant answers with confetti.'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 pt-2 border-t border-[#f0eae0]">
              <span>{hasSubmittedQuiz ? 'Review Results' : 'Start Practice Quiz'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Step 3: Ask AI Buddy */}
          <div
            onClick={() => onNavigate('student-tutor')}
            className="p-5 rounded-2xl bg-white hover:border-[#0d9488] border border-[#e6dfd5] shadow-xs cursor-pointer transition-all hover:shadow-sm group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#0d9488] text-xs font-bold">
                  Step 3 • 3 mins
                </span>
                <Sparkles className="w-5 h-5 text-[#0d9488] group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors">
                Ask AI Buddy Anything You Didn&apos;t Get
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stuck on backprop or stride? Ask the AI tutor to explain with simple stories, code, or exam tips.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d9488] pt-2 border-t border-[#f0eae0]">
              <span>Chat with AI Buddy</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sizing Formula Playground (Students love calculators!) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e6dfd5] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-[#0d9488]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                🧮 Interactive Output Size Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Play with the numbers to see how Padding (P) and Stride (S) change the output dimensions
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] text-xs font-mono font-bold text-slate-700 self-start sm:self-auto">
            Formula: ⌊(W - K + 2P)/S⌋ + 1
          </div>
        </div>

        {/* Sliders / Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 block">Input Width (W)</label>
            <input
              type="number"
              min={4}
              max={1024}
              value={calcW}
              onChange={(e) => setCalcW(Number(e.target.value) || 32)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d4cbbe] text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d9488]"
            />
            <span className="text-[10px] text-slate-500 block">e.g. 32px or 224px</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 block">Kernel / Filter (K)</label>
            <input
              type="number"
              min={1}
              max={15}
              value={calcK}
              onChange={(e) => setCalcK(Number(e.target.value) || 3)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d4cbbe] text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d9488]"
            />
            <span className="text-[10px] text-slate-500 block">e.g. 3×3 or 5×5</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 block">Padding (P)</label>
            <input
              type="number"
              min={0}
              max={10}
              value={calcP}
              onChange={(e) => setCalcP(Number(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d4cbbe] text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d9488]"
            />
            <span className="text-[10px] text-slate-500 block">Zero-padding border</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 block">Stride (S)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={calcS}
              onChange={(e) => setCalcS(Number(e.target.value) || 1)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d4cbbe] text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d9488]"
            />
            <span className="text-[10px] text-slate-500 block">Step size in pixels</span>
          </div>
        </div>

        {/* Calculation Result Callout */}
        <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="font-bold text-slate-800">
              Calculation Breakdown: ⌊({calcW} - {calcK} + 2×{calcP}) / {calcS}⌋ + 1
            </p>
            <p className="text-slate-600">
              {calcP === 2 && calcK === 5 && calcS === 1
                ? '⭐ "Same" Padding detected! Notice how output width remains exactly 32.'
                : `Produces an output feature map of ${calculatedOutput} × ${calculatedOutput}.`}
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#0d9488] text-white font-mono font-black text-base shadow-xs shrink-0">
            Output: {calculatedOutput} × {calculatedOutput}
          </div>
        </div>
      </div>

      {/* ⚠️ 3 Common Exam Mistakes to Watch Out For */}
      <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3 Common Exam Traps to Avoid
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
            <p className="font-bold text-amber-950">❌ Trap 1: Pooling has weights</p>
            <p className="text-slate-700">
              <strong>Truth:</strong> Max Pooling has ZERO weights to learn! It just picks the biggest number in each 2×2 window.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
            <p className="font-bold text-amber-950">❌ Trap 2: Stride increases size</p>
            <p className="text-slate-700">
              <strong>Truth:</strong> Larger stride jumps across pixels, making the output smaller, not bigger!
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
            <p className="font-bold text-amber-950">❌ Trap 3: Kernels learn alone</p>
            <p className="text-slate-700">
              <strong>Truth:</strong> The weights inside the filter are shared across the whole image (Weight Sharing).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
