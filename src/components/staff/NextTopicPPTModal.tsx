'use client';

import React, { useState, useEffect } from 'react';
import { ClassroomPack, ClassAnalytics, NextTopicRecommendation, GeneratedNextDeck, PresentationSlide } from '@/types';
import { getNextTopicRecommendations, generateNextTopicPPTDeck } from '@/lib/nextTopicService';
import { generateAndDownloadPPTX } from '@/lib/pptxExport';
import {
  X,
  Sparkles,
  Download,
  Presentation,
  ChevronLeft,
  ChevronRight,
  Layers,
  Crosshair,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  BookOpen,
  Share2,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface NextTopicPPTModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPack: ClassroomPack;
  analytics?: ClassAnalytics;
  instructorName: string;
  apiKey?: string;
  onPromoteToFullPack?: (topic: string, durationMinutes: number) => void;
}

export const NextTopicPPTModal: React.FC<NextTopicPPTModalProps> = ({
  isOpen,
  onClose,
  currentPack,
  analytics,
  instructorName,
  apiKey,
  onPromoteToFullPack,
}) => {
  const [recommendations, setRecommendations] = useState<NextTopicRecommendation[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [targetDuration, setTargetDuration] = useState<number>(45);

  const [activeView, setActiveView] = useState<'SELECT' | 'VIEW_DECK'>('SELECT');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDeck, setGeneratedDeck] = useState<GeneratedNextDeck | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Compute curriculum recommendations on mount or pack change
  useEffect(() => {
    if (currentPack) {
      const recs = getNextTopicRecommendations(currentPack, analytics);
      setRecommendations(recs);
      if (recs.length > 0 && !selectedTopic) {
        setSelectedTopic(recs[0].topic);
      }
    }
  }, [currentPack, analytics]);

  if (!isOpen) return null;

  const handleGenerate = async (topicToUse?: string) => {
    const topic = (topicToUse || customTopicInput || selectedTopic).trim();
    if (!topic) return;

    setIsGenerating(true);
    try {
      const deck = await generateNextTopicPPTDeck(
        topic,
        currentPack.topic,
        currentPack.subject,
        instructorName,
        targetDuration,
        apiKey
      );
      setGeneratedDeck(deck);
      setCurrentSlideIndex(0);
      setActiveView('VIEW_DECK');
    } catch (err) {
      console.error('Error generating next topic PPT:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPPTX = async () => {
    if (!generatedDeck) return;
    setIsDownloading(true);
    try {
      await generateAndDownloadPPTX(
        generatedDeck.topic,
        generatedDeck.subject,
        generatedDeck.instructorName,
        generatedDeck.slides,
        generatedDeck.targetDuration
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Error downloading PPTX:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySlideOutline = () => {
    if (!generatedDeck) return;
    const text = generatedDeck.slides
      .map(
        (s) =>
          `Slide ${s.slideNumber}: ${s.title}\n${s.subtitle || ''}\n${s.bulletPoints.map((bp) => `• ${bp}`).join('\n')}\nNotes: ${s.presenterNotes}\n`
      )
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const currentSlide: PresentationSlide | undefined = generatedDeck?.slides[currentSlideIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-[#fbf9f5] w-full max-w-5xl rounded-3xl border border-[#e6dfd5] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Institutional Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#881337] text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-amber-200 border border-white/15">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Autonomous Curriculum Engine
                </span>
                <span className="text-[10px] text-rose-200">•</span>
                <span className="text-[10px] text-rose-200 font-medium">
                  Prerequisite Bridge & Presentation Generator
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                {activeView === 'SELECT'
                  ? 'What to Teach Next • Intelligent PPT Deck'
                  : `Next Lecture Deck: ${generatedDeck?.topic || selectedTopic}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeView === 'VIEW_DECK' && (
              <button
                onClick={() => setActiveView('SELECT')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-all"
              >
                ← Change Topic
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeView === 'SELECT' ? (
            /* STEP 1: RECOMMENDATIONS & TOPIC SELECTION */
            <div className="space-y-6">
              {/* Context Banner */}
              <div className="p-4 rounded-2xl bg-white border border-[#e6dfd5] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#881337] border border-rose-100 flex items-center justify-center font-black text-sm">
                    {currentPack.subject.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Current Lecture Completed
                    </p>
                    <h3 className="text-base font-bold text-slate-900">{currentPack.topic}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Cohort Mastery: {analytics?.averageScore ? `${(analytics.averageScore * 20).toFixed(0)}%` : '84%'}
                  </span>
                  <span className="text-slate-500 font-medium">
                    Instructor: Dr. {instructorName}
                  </span>
                </div>
              </div>

              {/* Recommendations Cards Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#881337]" />
                    Recommended Next Topics for Tomorrow&apos;s Lecture
                  </h4>
                  <span className="text-xs text-slate-500">Select one or type custom topic below</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((rec) => {
                    const isSelected = selectedTopic === rec.topic && !customTopicInput;
                    const isRemedial = rec.category === 'Remedial Refresher';

                    return (
                      <div
                        key={rec.id}
                        onClick={() => {
                          setSelectedTopic(rec.topic);
                          setCustomTopicInput('');
                          setTargetDuration(rec.suggestedDuration);
                        }}
                        className={`cursor-pointer rounded-2xl p-4.5 border transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-rose-50/70 border-[#881337] shadow-sm ring-2 ring-[#881337]/20'
                            : 'bg-white border-[#e6dfd5] hover:border-slate-400 hover:shadow-2xs'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                isRemedial
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : rec.category === 'Direct Sequential'
                                  ? 'bg-blue-100 text-blue-900 border-blue-200'
                                  : rec.category === 'Downstream Application'
                                  ? 'bg-purple-100 text-purple-900 border-purple-200'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                              }`}
                            >
                              {rec.category}
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-slate-500">
                              {rec.suggestedDuration}m
                            </span>
                          </div>

                          <h5 className="text-sm font-bold text-slate-900 leading-snug">
                            {rec.topic}
                          </h5>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {rec.reason}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#f0ece4] flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">
                            Diff: <strong className="text-slate-800">{rec.estimatedDifficulty}</strong>
                          </span>
                          <span
                            className={`font-bold flex items-center gap-1 ${
                              isSelected ? 'text-[#881337]' : 'text-slate-400'
                            }`}
                          >
                            {isSelected ? 'Selected ✓' : 'Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Topic Input & Settings */}
              <div className="p-5 rounded-2xl bg-white border border-[#e6dfd5] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Or Enter a Specific Custom Topic
                  </h4>
                  <span className="text-xs text-slate-500">Free-form curriculum prompt</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={customTopicInput}
                    onChange={(e) => {
                      setCustomTopicInput(e.target.value);
                      if (e.target.value) setSelectedTopic(e.target.value);
                    }}
                    placeholder="e.g. Attention Mechanism & Multi-Head Self Attention in Transformers"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-[#e6dfd5] bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-[#881337] transition-all"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600 shrink-0">Duration:</span>
                    <select
                      value={targetDuration}
                      onChange={(e) => setTargetDuration(Number(e.target.value))}
                      className="px-3 py-2.5 rounded-xl text-xs font-bold border border-[#e6dfd5] bg-[#faf8f5] focus:outline-none"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes (Standard)</option>
                      <option value={60}>60 Minutes (Full Lecture)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-4.5 rounded-2xl bg-gradient-to-r from-rose-50 to-teal-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h5 className="text-sm font-bold text-slate-900">
                    Ready to generate slides for:{' '}
                    <span className="text-[#881337]">
                      &quot;{customTopicInput || selectedTopic}&quot;
                    </span>
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Will synthesize prerequisite bridge, mathematical proofs, bottleneck architectures, diagram guides, and presenter delivery cues.
                  </p>
                </div>

                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || (!selectedTopic && !customTopicInput)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#881337] hover:bg-[#9f1239] text-white shadow-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50 shrink-0"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing Academic Deck...</span>
                    </>
                  ) : (
                    <>
                      <Presentation className="w-4 h-4 text-amber-200" />
                      <span>Generate Next Topic PPT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: PRESENTATION SLIDE VIEWER & EXPORT */
            <div className="space-y-5">
              {/* Deck Summary Bar & Download Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#e6dfd5] shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0d9488] border border-teal-200">
                      Generated Deck • {generatedDeck?.slides.length || 7} Slides
                    </span>
                    <span className="text-xs text-slate-500">
                      Duration: {generatedDeck?.targetDuration || 45} mins
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {generatedDeck?.topic}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* PPTX Instant Download Button */}
                  <button
                    onClick={handleDownloadPPTX}
                    disabled={isDownloading}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all transform hover:-translate-y-0.5 ${
                      downloadSuccess
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-[#881337] hover:bg-[#9f1239]'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Compiling .pptx...</span>
                      </>
                    ) : downloadSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>PPTX Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-amber-200" />
                        <span>Download PowerPoint (.pptx)</span>
                      </>
                    )}
                  </button>

                  {/* Copy Slide Outline for Google Slides */}
                  <button
                    onClick={handleCopySlideOutline}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#faf8f5] hover:bg-slate-100 text-slate-700 border border-[#e6dfd5] transition-all"
                  >
                    {copiedNotification ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Copy for Google Slides</span>
                      </>
                    )}
                  </button>

                  {/* Promote to Full Pack */}
                  {onPromoteToFullPack && (
                    <button
                      onClick={() => {
                        if (generatedDeck) {
                          onPromoteToFullPack(generatedDeck.topic, generatedDeck.targetDuration);
                          onClose();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#0d9488] hover:bg-[#0f766e] text-white transition-all shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Promote to Full Classroom Pack</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Pedagogical Rationale Callout */}
              {generatedDeck?.rationale && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <p>
                    <strong>Curriculum Continuity Justification:</strong> {generatedDeck.rationale}
                  </p>
                </div>
              )}

              {/* Interactive Slide Viewer Canvas */}
              {currentSlide && (
                <div className="bg-white rounded-3xl border border-[#e6dfd5] p-6 sm:p-8 shadow-xs space-y-6">
                  {/* Slide Top Metadata */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#f0ece4]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#881337] text-white">
                        Slide {currentSlide.slideNumber} of {generatedDeck?.slides.length}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {currentSlide.slideNumber === 1
                          ? 'Prerequisite Context Bridge'
                          : currentSlide.slideNumber === (generatedDeck?.slides.length || 7)
                          ? 'Summary & Examination Prep'
                          : 'Core Theoretical Architecture'}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowNotes(!showNotes)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                        showNotes
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {showNotes ? 'Hide Speaking Notes' : 'Show Speaking Notes'}
                    </button>
                  </div>

                  {/* Slide Title & Subtitle */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
                      {currentSlide.title}
                    </h3>
                    {currentSlide.subtitle && (
                      <p className="text-sm font-medium text-slate-500 mt-1 italic">
                        {currentSlide.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Slide Content: 2-Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Bullet Points */}
                    <div className="lg:col-span-7 space-y-3.5">
                      {currentSlide.bulletPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#881337] mt-2 shrink-0" />
                          <p className="text-sm text-slate-800 leading-relaxed font-sans">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Visual Diagram Guide Box */}
                    <div className="lg:col-span-5 p-5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#881337] uppercase tracking-wider">
                        <span className="p-1 rounded-md bg-rose-100">🎨</span>
                        <span>Slide Visual Diagram Blueprint</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-xl border border-[#e6dfd5]">
                        {currentSlide.visualPrompt}
                      </p>
                      <p className="text-[10px] text-slate-500 italic">
                        Embedded into the generated .pptx as visual styling guidelines.
                      </p>
                    </div>
                  </div>

                  {/* Presenter Delivery Script Notes */}
                  {showNotes && currentSlide.presenterNotes && (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5 animate-fade-in">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                        <span>Dr. {instructorName}&apos;s Live Verbal Delivery Cue</span>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-950 italic leading-relaxed font-serif">
                        &quot;{currentSlide.presenterNotes}&quot;
                      </p>
                    </div>
                  )}

                  {/* Slide Navigation Pagination */}
                  <div className="pt-4 border-t border-[#f0ece4] flex items-center justify-between">
                    <button
                      onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                      disabled={currentSlideIndex === 0}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#faf8f5] hover:bg-slate-100 text-slate-700 border border-[#e6dfd5] disabled:opacity-40 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous Slide
                    </button>

                    {/* Jump Dots */}
                    <div className="flex items-center gap-1.5">
                      {generatedDeck?.slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlideIndex(i)}
                          className={`h-2 rounded-full transition-all ${
                            currentSlideIndex === i
                              ? 'w-6 bg-[#881337]'
                              : 'w-2 bg-slate-300 hover:bg-slate-400'
                          }`}
                          title={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentSlideIndex(
                          Math.min((generatedDeck?.slides.length || 1) - 1, currentSlideIndex + 1)
                        )
                      }
                      disabled={currentSlideIndex === (generatedDeck?.slides.length || 1) - 1}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#881337] hover:bg-[#9f1239] text-white disabled:opacity-40 transition-all"
                    >
                      Next Slide
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#faf8f5] border-t border-[#e6dfd5] flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>PowerPoint (.pptx) Client-Side Binary Engine Ready</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
