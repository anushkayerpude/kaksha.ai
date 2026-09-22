'use client';

import React, { useState, useEffect } from 'react';
import { ClassroomPack } from '@/types';
import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Sparkles, MessageSquare, Send, CheckCircle2, HelpCircle, Sun, Moon } from 'lucide-react';
import { runAskTutor } from '@/lib/geminiService';

interface TeachModeModalProps {
  pack: ClassroomPack;
  onClose: () => void;
  apiKey?: string;
}

export const TeachModeModal: React.FC<TeachModeModalProps> = ({ pack, onClose, apiKey }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [isBeigeTheme, setIsBeigeTheme] = useState(true);

  // AI Copilot state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<string>(
    'Hello Professor! I am your real-time classroom copilot. Ask me for quick analogies, spot check questions, or simpler explanations at any point during your lecture.'
  );
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  const currentStep = pack.lessonTimeline[currentStepIndex];

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAskCopilot = async (customPrompt?: string) => {
    const q = customPrompt || copilotQuery.trim();
    if (!q) return;

    setCopilotQuery('');
    setIsCopilotLoading(true);

    try {
      const answer = await runAskTutor(
        `Teacher Copilot assistance during live class on step "${currentStep.title}": ${q}`,
        pack,
        'Beginner',
        apiKey
      );
      setCopilotResponse(answer || 'Keep students engaged by asking for hands-on calculations!');
    } catch (e) {
      setCopilotResponse(
        `For ${currentStep.title}, try asking: "If we double the stride, does the output resolution double or halve?"`
      );
    } finally {
      setIsCopilotLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col animate-fade-in overflow-hidden transition-colors ${
      isBeigeTheme ? 'bg-[#fbf9f5] text-slate-900' : 'bg-[#070a12] text-white'
    }`}>
      {/* Top Teleprompter Bar */}
      <div className={`h-16 px-6 border-b flex items-center justify-between transition-colors ${
        isBeigeTheme ? 'bg-white/95 border-[#e6dfd5]' : 'bg-[#090d16]/90 border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className={`text-xs font-bold uppercase tracking-wider ${isBeigeTheme ? 'text-[#881337]' : 'text-rose-400'}`}>
              Live Teach Mode
            </span>
          </div>
          <span className={isBeigeTheme ? 'text-slate-300' : 'text-slate-500'}>|</span>
          <span className={`text-sm font-bold truncate max-w-sm ${isBeigeTheme ? 'text-slate-900' : 'text-white'}`}>
            {pack.topic}
          </span>
        </div>

        {/* Center Controls: Stopwatch Timer & Theme Switcher */}
        <div className="flex items-center gap-3">
          {/* Stopwatch Timer */}
          <div className={`flex items-center gap-3 px-4 py-1.5 rounded-2xl border transition-colors ${
            isBeigeTheme ? 'bg-[#f5f2eb] border-[#ded6c9]' : 'bg-slate-900 border-white/10'
          }`}>
            <span className={`text-sm font-mono font-bold ${isBeigeTheme ? 'text-[#0d9488]' : 'text-indigo-400'}`}>
              {formatTimer(secondsElapsed)}
            </span>
            <span className={`text-xs ${isBeigeTheme ? 'text-slate-500' : 'text-slate-500'}`}>/ {pack.duration}:00</span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`p-1 rounded-lg ${isBeigeTheme ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setSecondsElapsed(0)}
              className={`p-1 rounded-lg ${isBeigeTheme ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={() => setIsBeigeTheme(!isBeigeTheme)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isBeigeTheme
                ? 'bg-[#f5f2eb] border-[#ded6c9] text-slate-700 hover:bg-[#ede8df]'
                : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
            }`}
            title={isBeigeTheme ? 'Switch to Dark Auditorium Prompter' : 'Switch to Warm Beige Classroom'}
          >
            {isBeigeTheme ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Dark HUD</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Beige Mode</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className={`p-2 rounded-xl transition-all ${
            isBeigeTheme ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Split Body: Live Step Guidance & AI Copilot */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Left 2 Cols: Live Teleprompter & Step Progression */}
        <div className="lg:col-span-2 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto space-y-6">
          {/* Step Progress Bar */}
          <div className="space-y-2">
            <div className={`flex items-center justify-between text-xs ${isBeigeTheme ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>
                Step {currentStepIndex + 1} of {pack.lessonTimeline.length}: {currentStep.activityType}
              </span>
              <span className={`font-mono font-semibold ${isBeigeTheme ? 'text-[#0d9488]' : 'text-indigo-400'}`}>
                {currentStep.timeRange}
              </span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden flex ${isBeigeTheme ? 'bg-[#ede8df]' : 'bg-slate-800'}`}>
              {pack.lessonTimeline.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-full transition-all ${
                    idx <= currentStepIndex
                      ? isBeigeTheme ? 'bg-[#0d9488]' : 'bg-indigo-500'
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Prompter Main Content */}
          <div className="space-y-6 max-w-2xl my-auto">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
              isBeigeTheme
                ? 'bg-[#0d9488]/10 text-[#0d9488] border-[#0d9488]/30'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}>
              {currentStep.timeRange}
            </div>
            <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${isBeigeTheme ? 'text-slate-900' : 'text-white'}`}>
              {currentStep.title}
            </h1>
            <p className={`text-base sm:text-lg leading-relaxed font-normal ${isBeigeTheme ? 'text-slate-700' : 'text-slate-300'}`}>
              {currentStep.description}
            </p>

            <div className={`p-5 rounded-2xl border space-y-2 ${
              isBeigeTheme
                ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                : 'bg-indigo-950/40 border-indigo-500/30 text-slate-200'
            }`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${isBeigeTheme ? 'text-amber-800' : 'text-indigo-300'}`}>
                Teacher Guidance / Cue:
              </p>
              <p className="text-sm leading-relaxed italic">{currentStep.teacherGuidance}</p>
            </div>

            {currentStep.keyQuestionsToAsk && currentStep.keyQuestionsToAsk.length > 0 && (
              <div className={`p-4 rounded-2xl border text-xs ${
                isBeigeTheme
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
              }`}>
                <strong>Ask Students Now:</strong> &ldquo;{currentStep.keyQuestionsToAsk[0]}&rdquo;
              </div>
            )}
          </div>

          {/* Step Controls */}
          <div className={`flex items-center justify-between pt-4 border-t ${
            isBeigeTheme ? 'border-[#e6dfd5]' : 'border-white/10'
          }`}>
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border disabled:opacity-40 text-xs font-semibold transition-all ${
                isBeigeTheme
                  ? 'bg-white border-[#ded6c9] text-slate-800 hover:bg-[#f5f2eb]'
                  : 'bg-slate-900 border-white/10 text-white hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous Step
            </button>
            <span className={`text-xs ${isBeigeTheme ? 'text-slate-500' : 'text-slate-400'}`}>
              {currentStepIndex + 1} / {pack.lessonTimeline.length} Steps
            </span>
            <button
              onClick={() => setCurrentStepIndex(Math.min(pack.lessonTimeline.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === pack.lessonTimeline.length - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl disabled:opacity-40 text-xs font-semibold shadow-sm transition-all ${
                isBeigeTheme
                  ? 'bg-[#0d9488] hover:bg-[#0f766e] text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Col: AI Teacher Copilot ("Ask Kaksha") */}
        <div className={`border-l p-6 flex flex-col justify-between overflow-hidden transition-colors ${
          isBeigeTheme ? 'bg-white border-[#e6dfd5]' : 'bg-[#090d16]/80 border-white/10'
        }`}>
          <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl border ${
                isBeigeTheme
                  ? 'bg-[#881337]/10 text-[#881337] border-[#881337]/20'
                  : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
              }`}>
                <Sparkles className={`w-4 h-4 ${isBeigeTheme ? 'text-[#881337]' : 'text-emerald-400'}`} />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isBeigeTheme ? 'text-slate-900' : 'text-white'}`}>
                  AI Teacher Copilot
                </h3>
                <p className={`text-[10px] ${isBeigeTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                  Contextual classroom assistant
                </p>
              </div>
            </div>

            {/* Quick Prompt Pills */}
            <div className="space-y-1.5">
              <p className={`text-[10px] uppercase font-semibold ${isBeigeTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                Instant Classroom Cues:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Explain this more simply',
                  'Give me another real-world example',
                  'What misconception should I watch for?',
                  'Give me a 1-minute quick question',
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskCopilot(promptText)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all text-left ${
                      isBeigeTheme
                        ? 'bg-[#f5f2eb] hover:bg-[#ede8df] text-slate-800 border-[#ded6c9]'
                        : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border-white/10'
                    }`}
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Copilot Response Box */}
            <div className={`flex-1 p-4 rounded-2xl border overflow-y-auto space-y-2 text-xs leading-relaxed ${
              isBeigeTheme
                ? 'bg-[#faf8f5] border-[#e6dfd5] text-slate-800'
                : 'bg-slate-900/90 border-white/10 text-slate-200'
            }`}>
              {isCopilotLoading ? (
                <div className={`flex items-center gap-2 text-xs ${isBeigeTheme ? 'text-[#0d9488]' : 'text-indigo-400'}`}>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Generating classroom suggestion...
                </div>
              ) : (
                copilotResponse
              )}
            </div>
          </div>

          {/* Copilot Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskCopilot();
            }}
            className="relative mt-4"
          >
            <input
              type="text"
              value={copilotQuery}
              onChange={(e) => setCopilotQuery(e.target.value)}
              placeholder="Ask Kaksha anything during lecture..."
              className={`w-full pl-3 pr-10 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                isBeigeTheme
                  ? 'bg-white border-[#d4cbbe] text-slate-900 focus:border-[#0d9488]'
                  : 'bg-slate-900 border-white/10 text-white focus:border-indigo-500'
              }`}
            />
            <button
              type="submit"
              disabled={isCopilotLoading}
              className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg text-white disabled:opacity-50 transition-colors ${
                isBeigeTheme ? 'bg-[#0d9488] hover:bg-[#0f766e]' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
