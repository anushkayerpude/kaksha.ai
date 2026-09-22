'use client';

import React, { useState } from 'react';
import { ClassroomPack } from '@/types';
import { generatePrintableWorksheetHTML, buildGoogleDocsPayload, buildGoogleSlidesPayload, buildGoogleFormsPayload } from '@/lib/googleWorkspace';
import { 
  BookOpen, Presentation, FileText, CheckSquare, Sparkles, Printer, 
  ExternalLink, CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle, 
  Clock, Share2, HelpCircle, Eye, EyeOff, Layers 
} from 'lucide-react';

interface ClassroomPackViewerProps {
  pack: ClassroomPack;
  onPublishToStudents: (packId: string) => void;
  onEnterTeachMode: () => void;
  onStartOnlineClass?: () => void;
  isOnlineLive?: boolean;
  apiKey?: string;
}

export const ClassroomPackViewer: React.FC<ClassroomPackViewerProps> = ({
  pack,
  onPublishToStudents,
  onEnterTeachMode,
  onStartOnlineClass,
  isOnlineLive,
  apiKey,
}) => {
  const [activeTab, setActiveTab] = useState<
    'timeline' | 'presentation' | 'briefing' | 'misconceptions' | 'activity' | 'worksheet' | 'quiz' | 'exit'
  >('timeline');

  // Presentation State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Worksheet State
  const [worksheetTier, setWorksheetTier] = useState<'foundation' | 'standard' | 'challenge'>('standard');

  // Quiz State
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // Google Workspace Export Modal State
  const [exportModal, setExportModal] = useState<{
    isOpen: boolean;
    type: 'DOCS' | 'SLIDES' | 'FORMS' | null;
    data: any;
  }>({ isOpen: false, type: null, data: null });

  const handlePrintWorksheet = () => {
    const html = generatePrintableWorksheetHTML(pack, worksheetTier);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  };

  const handleExportGoogleDocs = () => {
    const payload = buildGoogleDocsPayload(pack);
    setExportModal({ isOpen: true, type: 'DOCS', data: payload });
  };

  const handleExportGoogleSlides = () => {
    const payload = buildGoogleSlidesPayload(pack);
    setExportModal({ isOpen: true, type: 'SLIDES', data: payload });
  };

  const handleExportGoogleForms = () => {
    const payload = buildGoogleFormsPayload(pack);
    setExportModal({ isOpen: true, type: 'FORMS', data: payload });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e6dfd5] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#881337] border border-rose-200 uppercase tracking-wider">
                Full Classroom Pack
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {pack.subject} • {pack.grade} • {pack.duration} Mins
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {pack.topic}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onStartOnlineClass && (
              <button
                onClick={onStartOnlineClass}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
                  isOnlineLive ? 'bg-rose-600 hover:bg-rose-700 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>{isOnlineLive ? 'Resume Online Class' : '🔴 Take Online Class'}</span>
              </button>
            )}

            <button
              onClick={onEnterTeachMode}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-xs transition-all"
            >
              <Presentation className="w-4 h-4" />
              In-Class Teleprompter
            </button>

            {pack.publishedToStudents ? (
              <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Published to Students
              </span>
            ) : (
              <button
                onClick={() => onPublishToStudents(pack.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#881337] hover:bg-[#9f1239] text-white shadow-xs transition-all"
              >
                <Share2 className="w-4 h-4" />
                Publish to Students
              </button>
            )}
          </div>
        </div>

        {/* Google Workspace Integration Export Bar */}
        <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
            <span>Google Workspace Ecosystem:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportGoogleDocs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all font-bold shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Google Docs (Lesson & Notes)
            </button>

            <button
              onClick={handleExportGoogleSlides}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all font-bold shadow-2xs"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-600" />
              Google Slides (13 Slides)
            </button>

            <button
              onClick={handleExportGoogleForms}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all font-bold shadow-2xs"
            >
              <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
              Google Forms (5-Q Quiz)
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#e6dfd5] scrollbar-none">
          {[
            { id: 'timeline', label: 'Lesson Plan (Timeline)', icon: Clock },
            { id: 'presentation', label: 'Slide Deck (13 Slides)', icon: Presentation },
            { id: 'briefing', label: 'Teacher Briefing', icon: BookOpen },
            { id: 'misconceptions', label: 'Misconceptions Engine', icon: AlertTriangle },
            { id: 'activity', label: 'Classroom Activity', icon: Layers },
            { id: 'worksheet', label: 'Printable Worksheet', icon: FileText },
            { id: 'quiz', label: '5-Question Quiz & Key', icon: CheckSquare },
            { id: 'exit', label: 'Exit Ticket & Resources', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#881337] text-white shadow-xs'
                    : 'bg-[#faf8f5] text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-[#e6dfd5]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Lesson Plan & Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Learning Objectives Callout */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0d9488]" />
              Measurable Learning Objectives (Bloom's Taxonomy)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {pack.learningObjectives.map((obj, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-[#881337] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">{obj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 60-Minute Timeline Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Classroom Lesson Timeline</h3>
                <p className="text-xs text-slate-500">
                  Exact distribution totaling {pack.duration} minutes of classroom instruction
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#0d9488] border border-teal-200">
                Sum: {pack.duration} Mins
              </span>
            </div>

            <div className="space-y-3">
              {pack.lessonTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-[#e6dfd5] text-[#881337] font-mono text-xs font-bold shrink-0 shadow-2xs">
                      {item.timeRange}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-[#e6dfd5]">
                          {item.activityType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">{item.description}</p>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        <strong>Teacher Cue:</strong> {item.teacherGuidance}
                      </p>
                    </div>
                  </div>

                  {item.keyQuestionsToAsk && item.keyQuestionsToAsk.length > 0 && (
                    <div className="md:max-w-xs shrink-0 p-3 rounded-xl bg-white border border-[#e6dfd5] shadow-2xs">
                      <p className="text-[10px] font-bold text-[#881337] uppercase">Key Question to Ask:</p>
                      <p className="text-xs text-slate-700 mt-0.5">&ldquo;{item.keyQuestionsToAsk[0]}&rdquo;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 13-Slide Presentation Deck */}
      {activeTab === 'presentation' && (
        <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Interactive Slide Deck</h3>
              <p className="text-xs text-slate-500">
                Slide {currentSlideIndex + 1} of {pack.presentation.length} • Formatted for Google Slides API
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] text-slate-700 disabled:opacity-40 hover:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-700">
                {currentSlideIndex + 1} / {pack.presentation.length}
              </span>
              <button
                onClick={() => setCurrentSlideIndex(Math.min(pack.presentation.length - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === pack.presentation.length - 1}
                className="p-2 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] text-slate-700 disabled:opacity-40 hover:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Slide Canvas */}
          {(() => {
            const slide = pack.presentation[currentSlideIndex];
            return (
              <div className="aspect-[16/9] w-full max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 bg-slate-900 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-slate-800">
                <div>
                  <div className="flex items-center justify-between text-indigo-400 text-xs font-mono mb-2">
                    <span>SLIDE {slide.slideNumber} OF 13</span>
                    <span>KAKSHA.AI • {pack.subject}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{slide.title}</h2>
                  {slide.subtitle && <p className="text-sm text-indigo-200 mt-1">{slide.subtitle}</p>}
                </div>

                <div className="my-auto py-4 space-y-3 max-w-2xl">
                  {slide.bulletPoints.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <p className="text-sm sm:text-base text-slate-200 leading-snug">{bullet}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-md">
                    <strong>Visual Suggestion:</strong> {slide.visualPrompt}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">Google Slides API Spec</span>
                </div>
              </div>
            );
          })()}

          {/* Presenter Notes */}
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1 max-w-4xl mx-auto">
            <p className="text-xs font-bold text-[#881337] uppercase tracking-wider">Presenter Notes (For Teacher):</p>
            <p className="text-xs text-slate-700 italic">{pack.presentation[currentSlideIndex].presenterNotes}</p>
          </div>
        </div>
      )}

      {/* Tab 3: Teacher Briefing */}
      {activeTab === 'briefing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#881337] border border-rose-200 mb-2">
                <Clock className="w-3.5 h-3.5" />
                Target Prep Time: 5–10 Minutes
              </div>
              <h3 className="text-xl font-bold text-slate-900">Teacher Briefing & Rapid Revision</h3>
              <p className="text-xs text-slate-500">
                Review this briefing right before class to refresh intuition, analogies, and student questions
              </p>
            </div>

            {/* 5-Minute Audio Recap Script */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  🎬 5-Minute Classroom Opening & Recap Script
                </span>
                <span className="text-[10px] text-amber-800 font-mono font-bold">Spoken Narration</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed italic">
                {pack.teacherBrief.fiveMinuteRecapScript}
              </p>
            </div>

            {/* Analogies & Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Vivid Real-World Analogies to Use
                </h4>
                {pack.teacherBrief.realWorldAnalogies.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
                    <span className="text-xs font-bold text-[#0d9488]">{item.concept}</span>
                    <p className="text-xs font-bold text-slate-900">&ldquo;{item.analogy}&rdquo;</p>
                    <p className="text-xs text-slate-600">{item.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Anticipated Student Questions
                </h4>
                {pack.teacherBrief.likelyStudentQuestions.map((qa, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1.5">
                    <p className="text-xs font-bold text-[#881337]">Q: {qa.question}</p>
                    <p className="text-xs text-slate-700">A: {qa.suggestedAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Misconceptions Engine */}
      {activeTab === 'misconceptions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Common Student Misconceptions
            </h3>
            <p className="text-xs text-slate-500">
              Address these common traps explicitly during your lecture to accelerate deep comprehension
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pack.misconceptions.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-3">
                <div className="flex items-start gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                    Common Belief
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">&ldquo;{item.belief}&rdquo;</p>

                <div className="p-3.5 rounded-xl bg-white border border-[#e6dfd5] border-l-4 border-l-emerald-600 space-y-1 shadow-2xs">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase">Scientific Clarification:</p>
                  <p className="text-xs text-slate-700">{item.clarification}</p>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-[#e6dfd5]">
                  <strong>Diagnostic Check:</strong> {item.suggestedCheckQuestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Classroom Activity */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-50 text-[#0d9488] border border-teal-200">
                  <Layers className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">{pack.classroomActivity.title}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Duration: {pack.classroomActivity.durationMinutes} Minutes • Group Size: {pack.classroomActivity.groupSize}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Interactive Hands-On Lab
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 font-medium">
            <strong>Activity Objective:</strong> {pack.classroomActivity.objective}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Step-by-Step Instructions:</h4>
            {pack.classroomActivity.stepByStepInstructions.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-white border border-[#e6dfd5] text-[#881337] text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] text-xs text-slate-700">
            <strong>Required Deliverable:</strong> {pack.classroomActivity.deliverable}
          </div>
        </div>
      )}

      {/* Tab 6: Printable Differentiated Worksheet */}
      {activeTab === 'worksheet' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Differentiated Student Worksheet</h3>
              <p className="text-xs text-slate-500">
                Adapt to student learning needs with 1-click tier switching and direct print-ready formatting
              </p>
            </div>

            <button
              onClick={handlePrintWorksheet}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#881337] hover:bg-[#9f1239] text-white shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Worksheet (PDF)
            </button>
          </div>

          {/* Tier Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#f5f2eb] border border-[#e6dfd5] max-w-md">
            {(['foundation', 'standard', 'challenge'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setWorksheetTier(tier)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  worksheetTier === tier
                    ? 'bg-white text-[#881337] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Worksheet Preview Card */}
          <div className="p-6 rounded-3xl bg-[#faf8f5] border border-[#e6dfd5] space-y-6">
            <div className="p-4 rounded-2xl bg-white border border-dashed border-[#d4cbbe] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
              <span><strong>Student Name:</strong> ____________________________</span>
              <span><strong>Roll No:</strong> ____________</span>
              <span><strong>Date:</strong> ____________</span>
            </div>

            {/* Section A */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#881337] uppercase tracking-wider border-l-4 border-[#881337] pl-2">
                Section A: Foundational Knowledge
              </h4>
              {pack.worksheet[worksheetTier].sectionA_Basic.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-white border border-[#e6dfd5] space-y-2 shadow-2xs">
                  <p className="text-xs font-bold text-slate-900">Q{q.number}. {q.question}</p>
                  {q.hint && <p className="text-[11px] text-slate-500 italic">Hint: {q.hint}</p>}
                  <div className="h-16 rounded-xl border border-dashed border-[#d4cbbe] bg-[#faf8f5]" />
                </div>
              ))}
            </div>

            {/* Section B */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#881337] uppercase tracking-wider border-l-4 border-[#881337] pl-2">
                Section B: Conceptual Understanding
              </h4>
              {pack.worksheet[worksheetTier].sectionB_Conceptual.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-white border border-[#e6dfd5] space-y-2 shadow-2xs">
                  <p className="text-xs font-bold text-slate-900">Q{q.number}. {q.question}</p>
                  {q.hint && <p className="text-[11px] text-slate-500 italic">Hint: {q.hint}</p>}
                  <div className="h-16 rounded-xl border border-dashed border-[#d4cbbe] bg-[#faf8f5]" />
                </div>
              ))}
            </div>

            {/* Section C */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#881337] uppercase tracking-wider border-l-4 border-[#881337] pl-2">
                Section C: Application & Sizing Arithmetic
              </h4>
              {pack.worksheet[worksheetTier].sectionC_Application.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-white border border-[#e6dfd5] space-y-2 shadow-2xs">
                  <p className="text-xs font-bold text-slate-900">Q{q.number}. {q.question}</p>
                  {q.hint && <p className="text-[11px] text-slate-500 italic">Hint: {q.hint}</p>}
                  <div className="h-20 rounded-xl border border-dashed border-[#d4cbbe] bg-[#faf8f5]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: 5-Question Quiz & Answer Key */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">5-Question Curriculum Quiz</h3>
              <p className="text-xs text-slate-500">
                Auto-aligned to learning objectives • Exportable to Google Forms
              </p>
            </div>

            <button
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#faf8f5] hover:bg-slate-100 text-[#881337] border border-[#e6dfd5] transition-all"
            >
              {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showAnswerKey ? 'Hide Answer Key' : 'Reveal Answer Key & Explanations'}
            </button>
          </div>

          <div className="space-y-4">
            {pack.quiz.map((q) => (
              <div key={q.id} className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#881337] border border-[#e6dfd5] shadow-2xs">
                    Question {q.questionNumber} • {q.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{q.learningObjective}</span>
                </div>

                <p className="text-sm font-bold text-slate-900">{q.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, i) => {
                    const isCorrect = showAnswerKey && opt.startsWith(q.correctAnswer);
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-white border-[#e6dfd5] text-slate-700 shadow-2xs'
                        }`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {showAnswerKey && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-bold">✓ Correct Answer: Option {q.correctAnswer}</p>
                    <p className="text-slate-700">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Exit Ticket & Student Resources */}
      {activeTab === 'exit' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exit Ticket */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Diagnostic Exit Ticket</h3>
            <p className="text-xs text-slate-500">Collect from students during final 3 minutes</p>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-3">
              <p className="text-xs text-[#881337] font-bold">{pack.exitTicket.prompt}</p>
              <div className="p-3 rounded-xl bg-white border border-[#e6dfd5] text-xs text-slate-800 shadow-2xs">
                <strong>Diagnostic Question:</strong> {pack.exitTicket.diagnosticQuestion}
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#e6dfd5] text-xs text-slate-800 shadow-2xs">
                <strong>Confidence Rating Check:</strong> {pack.exitTicket.confidenceCheck}
              </div>
            </div>
          </div>

          {/* Student Resources */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Student Study Material</h3>
            <p className="text-xs text-slate-500">Attached to student lecture dashboard</p>

            <div className="space-y-2.5">
              {pack.studentResources.map((res, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{res.title}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white text-[#0d9488] border border-[#e6dfd5] shadow-2xs">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{res.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Google Workspace Export Modal */}
      {exportModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-[#0d9488] border border-teal-200">
                  <Sparkles className="w-5 h-5 text-[#0d9488]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Export to Google {exportModal.type === 'DOCS' ? 'Docs' : exportModal.type === 'SLIDES' ? 'Slides' : 'Forms'}
                  </h4>
                  <p className="text-xs text-slate-500">Live Google Ecosystem Integration Payload</p>
                </div>
              </div>
              <button
                onClick={() => setExportModal({ isOpen: false, type: null, data: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-2 max-h-72 overflow-y-auto">
              <p className="text-[11px] text-slate-500 uppercase font-mono font-bold">Payload Preview (JSON):</p>
              <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap">
                {JSON.stringify(exportModal.data, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setExportModal({ isOpen: false, type: null, data: null })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <a
                href={
                  exportModal.type === 'DOCS'
                    ? pack.googleExports.docsUrl
                    : exportModal.type === 'SLIDES'
                    ? pack.googleExports.slidesUrl
                    : pack.googleExports.formsUrl
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-xs"
              >
                Open in Google {exportModal.type === 'DOCS' ? 'Docs' : exportModal.type === 'SLIDES' ? 'Slides' : 'Forms'}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
