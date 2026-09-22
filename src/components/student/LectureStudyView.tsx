'use client';

import React, { useState } from 'react';
import { ClassroomPack } from '@/types';
import { generatePrintableWorksheetHTML } from '@/lib/googleWorkspace';
import {
  Presentation,
  BookOpen,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Eye
} from 'lucide-react';

interface LectureStudyViewProps {
  pack: ClassroomPack;
  onAskTutorWithContext: (context: string) => void;
}

// Student-friendly plain English summaries for each slide
const plainEnglishSlideGuides: Record<number, string> = {
  1: 'Welcome! Today we discover how computers learned to "see" images like human eyes do, from simple edges to full objects.',
  2: 'Why normal neural networks fail on images: A 1000×1000 image has 3 million inputs! Flat networks forget spatial neighborhoods and crash.',
  3: 'The biology behind it: Scientists found that brain cells in cats only fire when they see lines at specific angles. CNNs copy this biological design.',
  4: 'The sliding window: A tiny 3×3 matrix slides across the photo, multiplying numbers to detect specific features like vertical lines or curves.',
  5: 'The golden formula: (W - K + 2P)/S + 1. Use this to calculate how big or small your image becomes after applying the filter.',
  6: 'Stride is step size: Stride = 1 moves 1 pixel at a time. Stride = 2 skips a pixel, halving your output dimensions and saving memory.',
  7: 'Padding adds borders: Without padding, borders get scanned less than the center. Padding with 0s keeps the original image size intact.',
  8: 'Max Pooling shrinks the map: It takes a 2×2 box and keeps ONLY the biggest number. It has 0 weights to learn and makes the network translation invariant.',
  9: 'Activation Function (ReLU): Replaces all negative numbers with zero. This adds non-linearity so the network can learn complex curvy shapes.',
  10: 'Feature Hierarchy: Layer 1 sees lines → Layer 2 sees textures/corners → Layer 3 sees parts (wheels, noses) → Layer 4 sees the complete car or dog.',
  11: 'Hands-on Activity: Practice doing 2D convolution by hand using a simple 5×5 matrix with paper and pencil.',
  12: 'Common Exam Traps: Remember that Pooling has 0 parameters, larger stride makes output smaller, and weights are shared across the image.',
  13: 'Summary & Wrap Up: We learned Conv layers, Pooling, ReLU, and the Sizing Formula. Ready for the practice quiz!',
};

export const LectureStudyView: React.FC<LectureStudyViewProps> = ({
  pack,
  onAskTutorWithContext,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeStudySection, setActiveStudySection] = useState<'slides' | 'notes' | 'worksheet'>('slides');
  const [showPlainEnglish, setShowPlainEnglish] = useState(true);

  const currentSlide = pack.presentation[slideIndex];
  const slideGuide = plainEnglishSlideGuides[currentSlide.slideNumber] || currentSlide.visualPrompt;

  const handlePrint = () => {
    const html = generatePrintableWorksheetHTML(pack, 'standard');
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 300);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#0d9488] border border-teal-200">
            Study Desk • Class Materials
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            {pack.topic}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {pack.subject} • Faculty: Dr. Anushka Yerpude • 13 Visual Slides
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f5f2eb] rounded-2xl border border-[#ded6c9] self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveStudySection('slides')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeStudySection === 'slides'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-indigo-600" />
            <span>Class Slides</span>
          </button>
          <button
            onClick={() => setActiveStudySection('notes')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeStudySection === 'notes'
                ? 'bg-white text-[#0d9488] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Summary & Formulas</span>
          </button>
          <button
            onClick={() => setActiveStudySection('worksheet')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeStudySection === 'worksheet'
                ? 'bg-white text-[#881337] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-[#881337]" />
            <span>Printable Worksheet</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: SLIDES VIEWER WITH STUDENT EXPLANATIONS                        */}
      {/* ========================================================================= */}
      {activeStudySection === 'slides' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-6">
            {/* Top Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 bg-[#f5f2eb] px-3 py-1 rounded-xl border border-[#e6dfd5]">
                  Slide {slideIndex + 1} of {pack.presentation.length}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline truncate max-w-xs">
                  {currentSlide.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
                  disabled={slideIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] text-slate-700 disabled:opacity-40 hover:bg-slate-100 text-xs font-bold transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                  onClick={() => setSlideIndex(Math.min(pack.presentation.length - 1, slideIndex + 1))}
                  disabled={slideIndex === pack.presentation.length - 1}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white disabled:opacity-40 text-xs font-bold transition-all shadow-2xs"
                >
                  <span className="hidden sm:inline">Next Slide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Presentation Canvas */}
            <div className="aspect-[16/10] sm:aspect-[16/9] w-full max-w-3xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 text-white shadow-md flex flex-col justify-between border border-slate-800 relative overflow-hidden">
              {/* Subtle visual gradient in slide background */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                  Lecture Presentation • Slide {currentSlide.slideNumber}
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white mt-1 leading-tight">
                  {currentSlide.title}
                </h2>
                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-teal-200/90 mt-1 font-medium">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Bullet Points */}
              <div className="my-auto py-4 space-y-3">
                {currentSlide.bulletPoints.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <p className="text-xs sm:text-base text-slate-100 leading-relaxed">{bullet}</p>
                  </div>
                ))}
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <span className="text-[11px] truncate">
                  <strong className="text-slate-300">Visual cue:</strong> {currentSlide.visualPrompt}
                </span>
                <button
                  onClick={() => onAskTutorWithContext(`Slide ${currentSlide.slideNumber} (${currentSlide.title})`)}
                  className="flex items-center gap-1.5 text-teal-300 hover:text-white font-bold shrink-0 text-xs transition-colors self-end sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Explain this slide to me</span>
                </button>
              </div>
            </div>

            {/* Quick Slide Thumbnail Indicator Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1 overflow-x-auto pb-1">
              {pack.presentation.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === slideIndex
                      ? 'w-6 bg-[#0d9488]'
                      : 'w-2 bg-[#ded6c9] hover:bg-slate-400'
                  }`}
                  title={`Slide ${s.slideNumber}: ${s.title}`}
                />
              ))}
            </div>

            {/* 💡 Plain English Translation Box for This Specific Slide */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  What this slide means in simple words:
                </p>
                <button
                  onClick={() => setShowPlainEnglish(!showPlainEnglish)}
                  className="text-[11px] text-amber-800 hover:underline font-semibold"
                >
                  {showPlainEnglish ? 'Hide explanation' : 'Show explanation'}
                </button>
              </div>
              {showPlainEnglish && (
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {slideGuide}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: SUMMARY & FORMULAS CHEAT SHEET                                 */}
      {/* ========================================================================= */}
      {activeStudySection === 'notes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                📖 Complete Topic Summary & Formula Cheat Sheet
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Everything you need to review before the quiz or midterms
              </p>
            </div>

            {/* Sizing Formula Callout */}
            <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
              <span className="text-xs font-bold text-[#0d9488] uppercase tracking-wider">
                The Golden Sizing Formula
              </span>
              <p className="text-lg sm:text-2xl font-mono font-bold text-slate-900">
                Output Dimension = ⌊(W - K + 2P) / S⌋ + 1
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs text-slate-700">
                <div><strong>W:</strong> Input image width</div>
                <div><strong>K:</strong> Filter / Kernel size</div>
                <div><strong>P:</strong> Padding rings of 0s</div>
                <div><strong>S:</strong> Stride step size</div>
              </div>
            </div>

            {/* Key Terminology in Simple Words */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Key Terms in Simple Words
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pack.teacherBrief.importantTerminology.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1">
                    <h5 className="text-xs font-bold text-[#881337] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0d9488]" />
                      {t.term}
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">{t.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Real World Analogies from Dr. Yerpude */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                💡 Real-World Analogy: Flashlight on a Wall
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                Think of 2D Convolution like shining a small square flashlight across a dark textured wall. As the flashlight beam slides across (Stride), it highlights specific ridges and patterns without having to illuminate the entire stadium at once.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: PRINTABLE PRACTICE WORKSHEET                                    */}
      {/* ========================================================================= */}
      {activeStudySection === 'worksheet' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e6dfd5] shadow-xs space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#881337] flex items-center justify-center mx-auto border border-rose-200">
              <Printer className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Practice Homework Worksheet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Print or save the official homework worksheet prepared by Dr. Yerpude. Contains Section A (Basic Sizing), Section B (Pooling & Receptive Fields), and Section C (Application Calculations).
            </p>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-xs transition-all active:scale-95"
            >
              <Download className="w-4 h-4" /> Print / Save PDF Worksheet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
