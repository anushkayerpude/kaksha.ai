'use client';

import React from 'react';
import { ClassroomPack, ClassAnalytics } from '@/types';
import { Sparkles, Plus, Clock, Users, BookOpen, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Presentation, CheckSquare } from 'lucide-react';

interface StaffDashboardProps {
  onStartNewLecture: () => void;
  onViewPack: (pack: ClassroomPack) => void;
  onOpenAnalytics: () => void;
  onEnterTeachMode: () => void;
  onStartOnlineClass?: () => void;
  isOnlineLive?: boolean;
  activePack: ClassroomPack;
  recentPacks: ClassroomPack[];
  analytics: ClassAnalytics;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  onStartNewLecture,
  onViewPack,
  onOpenAnalytics,
  onEnterTeachMode,
  onStartOnlineClass,
  isOnlineLive,
  activePack,
  recentPacks,
  analytics,
}) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#be123c] text-white shadow-md border border-[#881337]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-white border border-white/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Faculty Portal • Semester 5 Session 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Good Morning, Professor Sharma
            </h1>
            <p className="mt-1 text-sm text-white/90 max-w-xl">
              Your next lecture on <span className="text-amber-200 font-bold">{activePack.topic}</span> is scheduled for 10:00 AM. Everything you need to teach has been source-grounded and compiled.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onStartOnlineClass && (
              <button
                onClick={onStartOnlineClass}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-all transform hover:-translate-y-0.5 ${
                  isOnlineLive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>{isOnlineLive ? 'Resume Online Class' : '🔴 Start Online Class'}</span>
              </button>
            )}

            <button
              onClick={onEnterTeachMode}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Presentation className="w-4 h-4" />
              In-Class Teleprompter
            </button>
            <button
              onClick={onStartNewLecture}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-white text-[#881337] hover:bg-slate-50 shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-[#881337]" />
              Create New Lecture
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#e6dfd5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Classes</span>
            <Clock className="w-4 h-4 text-[#881337]" />
          </div>
          <p className="text-2xl font-black text-slate-900">3 Lectures</p>
          <p className="text-[11px] text-[#0d9488] font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Next: AI & ML (10:00 AM)
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e6dfd5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.totalStudents} Active</p>
          <p className="text-[11px] text-slate-500 mt-1">94% average attendance</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e6dfd5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quiz Completion</span>
            <CheckSquare className="w-4 h-4 text-[#0d9488]" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {Math.round((analytics.submissionsCount / analytics.totalStudents) * 100)}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">42 / 45 submitted</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e6dfd5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Mastery</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.averageScore} / 5.0</p>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">1 topic needs review</p>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Active Classroom Pack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Classroom Pack Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e6dfd5] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-[#881337] border border-rose-100">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Featured Classroom Pack</h2>
                  <p className="text-xs text-slate-500">
                    Complete AI-researched teaching package ready for distribution
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Published to Students
              </span>
            </div>

            {/* Pack Details Card */}
            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{activePack.topic}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activePack.subject} • {activePack.grade} • {activePack.duration} Minutes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-[#e6dfd5] shadow-2xs">
                    12 Sources Analyzed
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-[#e6dfd5] shadow-2xs">
                    13 Slides
                  </span>
                </div>
              </div>

              {/* Learning Objectives Preview */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target Learning Objectives:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activePack.learningObjectives.slice(0, 3).map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#881337] mt-1.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Package Artifacts Quick Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#e6dfd5]">
                <div className="p-2.5 rounded-xl bg-white border border-[#e6dfd5] text-center shadow-2xs">
                  <p className="text-[10px] text-slate-500 font-semibold">Lesson Timeline</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">60 Minutes</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#e6dfd5] text-center shadow-2xs">
                  <p className="text-[10px] text-slate-500 font-semibold">Worksheet</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">3 Tiers (Printable)</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#e6dfd5] text-center shadow-2xs">
                  <p className="text-[10px] text-slate-500 font-semibold">Quiz & Key</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">5 Questions</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#e6dfd5] text-center shadow-2xs">
                  <p className="text-[10px] text-slate-500 font-semibold">Teacher Brief</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">5-Min Script</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onViewPack(activePack)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#881337] hover:underline"
                >
                  Inspect Full Classroom Pack <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onEnterTeachMode}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0d9488] hover:bg-[#0f766e] text-white transition-all shadow-xs"
                >
                  Start Class in Teach Mode
                </button>
              </div>
            </div>

            {/* AI Learning Analytics Loop Closer Alert */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    AI Insight: Weak Concept Detected
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      43% Mastery
                    </span>
                  </h4>
                  <p className="text-xs text-amber-900 mt-1 max-w-lg">
                    {analytics.aiInsight}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenAnalytics}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all"
              >
                View Analytics & Revision <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Today's Schedule & Recent Materials */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#881337]" />
              Today's Teaching Schedule
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#881337]">10:00 AM – 11:00 AM</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#881337] text-white">
                    Live Next
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">AI & Machine Learning</p>
                <p className="text-xs text-slate-600 mt-0.5">Topic: {activePack.topic}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">12:00 PM – 01:00 PM</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Upcoming</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">Data Structures & Algorithms</p>
                <p className="text-xs text-slate-600 mt-0.5">Topic: Graph Traversals (BFS & DFS)</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">03:00 PM – 04:00 PM</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Upcoming</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">Computer Networks</p>
                <p className="text-xs text-slate-600 mt-0.5">Topic: TCP/IP Congestion Control</p>
              </div>
            </div>
          </div>

          {/* Recent Classroom Packs */}
          <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Recent AI Materials
            </h3>
            <div className="space-y-2.5">
              {recentPacks.map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => onViewPack(pack)}
                  className="p-3 rounded-2xl bg-[#faf8f5] hover:bg-slate-50 border border-[#e6dfd5] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#881337] transition-colors truncate">
                      {pack.topic}
                    </p>
                    <p className="text-[11px] text-slate-500">{pack.subject}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
