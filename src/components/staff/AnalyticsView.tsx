'use client';

import React from 'react';
import { ClassAnalytics, ClassroomPack } from '@/types';
import { BarChart3, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

interface AnalyticsViewProps {
  analytics: ClassAnalytics;
  pack: ClassroomPack;
  onGenerateRevision: (prompt: string) => void;
  onOpenNextTopicPPT?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  pack,
  onGenerateRevision,
  onOpenNextTopicPPT,
}) => {
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#881337]/10 text-[#881337] border border-[#881337]/20 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Real-Time Learning Analytics & Assessment Loop
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Classroom Assessment Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Lecture: <span className="text-[#881337] font-bold">{pack.topic}</span> • Evaluated across 5 learning objectives
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] text-center shadow-2xs">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Submissions</p>
              <p className="text-lg font-black text-slate-900">
                {analytics.submissionsCount} / {analytics.totalStudents}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] text-center shadow-2xs">
              <p className="text-[10px] uppercase font-bold text-slate-500">Average Score</p>
              <p className="text-lg font-black text-[#0d9488]">{analytics.averageScore} / 5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Closed-Loop AI Insight & Remediation Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border border-amber-300 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-200/80 text-amber-950 border border-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
              Immediate Pedagogical Action Required
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Weak Topic Detected: {analytics.weakestTopic}
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-2xl">
              {analytics.aiInsight}
            </p>
            <p className="text-xs text-amber-950 font-semibold italic">
              <strong>Recommendation:</strong> {analytics.recommendedAction}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenNextTopicPPT && (
              <button
                onClick={onOpenNextTopicPPT}
                className="flex items-center gap-2 px-5 py-4 rounded-xl text-xs sm:text-sm font-bold bg-[#881337] hover:bg-[#9f1239] text-white shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>What to Teach Next (PPT)</span>
              </button>
            )}

            <button
              onClick={() => onGenerateRevision(analytics.revisionLessonPrompt)}
              className="flex items-center gap-2 px-6 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-white" />
              Generate 15-Min Revision Lesson
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Topic Mastery Progress Bars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Topic Mastery Breakdown</h3>
          <p className="text-xs text-slate-500">Aggregated performance across 45 student quiz responses</p>
        </div>

        <div className="space-y-4">
          {analytics.topicMastery.map((tm, idx) => {
            const isCritical = tm.percentage < 50;
            const isWarning = tm.percentage >= 50 && tm.percentage < 70;

            const barColor = isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';
            const badgeColor = isCritical
              ? 'bg-rose-100 text-rose-800 border-rose-200'
              : isWarning
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-emerald-100 text-emerald-800 border-emerald-200';

            return (
              <div key={idx} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{tm.topicName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-slate-900">{tm.percentage}%</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                      {tm.status}
                    </span>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-700`}
                    style={{ width: `${tm.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closed Loop Visual Explainer */}
      <div className="p-6 rounded-3xl bg-[#faf8f5] border border-[#e6dfd5] text-center space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">The Complete Kaksha Loop</p>
        <p className="text-xs font-mono font-bold text-[#881337]">
          RESEARCH → PLAN → PREPARE → TEACH → LEARN → ASSESS → <span className="text-[#0d9488]">IMPROVE</span>
        </p>
      </div>
    </div>
  );
};
