'use client';

import React from 'react';
import { UserRole } from '@/types';
import { Sparkles, GraduationCap, School, Settings, RotateCcw, BookOpen, BarChart3, HelpCircle, Presentation, LogOut, Radio } from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  onResetDemo: () => void;
  onLogout: () => void;
  hasPublishedPack: boolean;
  onOpenOnlineClass?: () => void;
  isOnlineLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  setRole,
  userName,
  activeTab,
  setActiveTab,
  onOpenSettings,
  onResetDemo,
  onLogout,
  hasPublishedPack,
  onOpenOnlineClass,
  isOnlineLive,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e6dfd5] bg-[#ffffff]/90 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#881337] text-white shadow-sm font-serif font-black text-lg">
              IAR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Kaksha<span className="text-[#0d9488]">.ai</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  GNUMS ERP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Institute of Advanced Research • Academic AI Studio
              </p>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f5f2eb] p-1 rounded-xl border border-[#e6dfd5]">
            {role === 'STAFF' ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-[#881337] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <School className="w-3.5 h-3.5 text-[#881337]" />
                  Staff Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('studio')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'studio'
                      ? 'bg-white text-[#0d9488] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
                  AI Teaching Studio
                </button>
                <button
                  onClick={() => setActiveTab('pack')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'pack'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Classroom Pack
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                  Learning Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('student-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'student-dashboard'
                      ? 'bg-white text-[#0d9488] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#0d9488]" />
                  My Study Desk
                </button>
                <button
                  onClick={() => setActiveTab('student-lecture')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'student-lecture'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5 text-indigo-600" />
                  Slides & Notes
                </button>
                <button
                  onClick={() => setActiveTab('student-quiz')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'student-quiz'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  Practice Quiz
                </button>
                <button
                  onClick={() => setActiveTab('student-tutor')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'student-tutor'
                      ? 'bg-white text-[#0d9488] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
                  AI Study Buddy
                </button>
                <button
                  onClick={() => setActiveTab('student-doubts')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'student-doubts'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                  Ask a Doubt
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Role Switcher & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Online Class Quick Trigger */}
            {onOpenOnlineClass && (
              <button
                onClick={onOpenOnlineClass}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border ${
                  isOnlineLive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 animate-pulse'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
                title={isOnlineLive ? 'Online Class is LIVE! Click to enter' : (role === 'STAFF' ? 'Launch Live Online Virtual Classroom' : 'Join Live Virtual Classroom')}
              >
                <Radio className={`w-3.5 h-3.5 ${isOnlineLive ? 'text-white animate-spin' : 'text-emerald-600'}`} />
                <span className="hidden sm:inline">{isOnlineLive ? '🔴 LIVE CLASS' : (role === 'STAFF' ? '🔴 Start Online' : 'Join Live')}</span>
                <span className="sm:hidden">{isOnlineLive ? 'LIVE' : 'Online'}</span>
              </button>
            )}

            {/* Role Switcher Toggle */}
            <div className="flex items-center bg-[#f5f2eb] p-1 rounded-xl border border-[#e6dfd5]">
              <button
                onClick={() => {
                  setRole('STAFF');
                  setActiveTab('dashboard');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  role === 'STAFF'
                    ? 'bg-[#881337] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Staff ERP"
              >
                <School className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Staff</span>
              </button>
              <button
                onClick={() => {
                  setRole('STUDENT');
                  setActiveTab('student-dashboard');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  role === 'STUDENT'
                    ? 'bg-[#0d9488] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Student ERP"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Student</span>
              </button>
            </div>

            {/* Quick Demo Reset */}
            <button
              onClick={onResetDemo}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-[#f5f2eb] border border-transparent hover:border-[#e6dfd5] transition-all"
              title="Reset to CNN Flagship Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Settings Modal Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-[#f5f2eb] border border-transparent hover:border-[#e6dfd5] transition-all"
              title="Configure Gemini API & Integrations"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Avatar & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#e6dfd5]">
              <div className="w-8 h-8 rounded-full bg-[#881337] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userName.charAt(0)}
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{userName}</p>
                <p className="text-[10px] text-slate-500 capitalize">{role.toLowerCase()} Portal</p>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all ml-1"
                title="Log Out to Landing Page"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
