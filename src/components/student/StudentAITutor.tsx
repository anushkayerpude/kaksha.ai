'use client';

import React, { useState } from 'react';
import { ClassroomPack } from '@/types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Code,
  BookOpen,
  Globe,
  Lightbulb,
  Brain,
  HelpCircle,
  CheckCircle2,
  Smile
} from 'lucide-react';
import { runAskTutor } from '@/lib/geminiService';

interface StudentAITutorProps {
  pack: ClassroomPack;
  apiKey?: string;
  initialQuery?: string;
}

type ExplainMode =
  | 'Like I am 10'
  | 'Exam Cheat Sheet'
  | 'Real-World Example'
  | 'Simple Python Code'
  | 'Memory Trick';

export const StudentAITutor: React.FC<StudentAITutorProps> = ({
  pack,
  apiKey,
  initialQuery = '',
}) => {
  const [mode, setMode] = useState<ExplainMode>('Like I am 10');
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<
    Array<{ id: string; role: 'user' | 'assistant'; text: string; mode?: string }>
  >([
    {
      id: 'msg-1',
      role: 'assistant',
      text: `👋 Hey Aryan! I'm your Kaksha AI Study Buddy for **${pack.topic}**.\n\nWhenever a concept feels confusing or you want a simple story, exam tip, or memory trick, just ask me! I'm grounded in Dr. Rajesh Sharma's lecture material.`,
      mode: 'Like I am 10',
    },
  ]);

  const modesList: { label: ExplainMode; icon: any; desc: string; badge: string }[] = [
    {
      label: 'Like I am 10',
      icon: Smile,
      desc: 'Simple analogies & stories without scary math',
      badge: '🧒 Simple Stories',
    },
    {
      label: 'Exam Cheat Sheet',
      icon: BookOpen,
      desc: 'Key formulas, definitions & exam trap warnings',
      badge: '📝 Exam Tips',
    },
    {
      label: 'Real-World Example',
      icon: Globe,
      desc: 'How Tesla, Instagram, or doctors use this',
      badge: '🌎 Real World',
    },
    {
      label: 'Simple Python Code',
      icon: Code,
      desc: 'PyTorch / NumPy snippet with friendly line-by-line comments',
      badge: '💻 Python Code',
    },
    {
      label: 'Memory Trick',
      icon: Brain,
      desc: 'Fun mnemonics so you never forget the formulas',
      badge: '🧠 Memory Trick',
    },
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputQuery.trim();
    if (!textToSend || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', text: textToSend, mode },
    ]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const modeParam =
        mode === 'Like I am 10'
          ? 'Beginner'
          : mode === 'Exam Cheat Sheet'
          ? 'Exam-Oriented'
          : mode === 'Simple Python Code'
          ? 'With Code'
          : mode;
      const answer = await runAskTutor(textToSend, pack, modeParam, apiKey);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: answer || 'Here is an easy-to-understand explanation based on your lecture.',
          mode,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: `In today's lecture on ${pack.topic}, remember the core focus: ${pack.teacherBrief.coreConcepts?.[0] || 'fundamental principles'}. Review Slide 5 and Section B of your worksheet for worked examples!`,
          mode,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 text-[#0d9488] border border-teal-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">AI Study Buddy</h2>
              <p className="text-xs text-slate-500">
                Grounded in Dr. Rajesh Sharma&apos;s lecture: <span className="text-[#0d9488] font-bold">{pack.topic}</span>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Class Notes Synced
          </span>
        </div>

        {/* Explain Mode Switcher */}
        <div className="pt-2 border-t border-[#e6dfd5] space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Choose how you want it explained:
          </p>
          <div className="flex flex-wrap gap-2">
            {modesList.map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.label;
              return (
                <button
                  key={m.label}
                  onClick={() => setMode(m.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#0d9488] text-white shadow-xs'
                      : 'bg-[#faf8f5] text-slate-700 hover:bg-slate-100 border border-[#e6dfd5]'
                  }`}
                  title={m.desc}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.badge}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Suggested Questions for Instant Help */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 shrink-0 font-bold">Quick prompts:</span>
        {[
          `Explain ${pack.topic} with a simple real-life story`,
          `What is the most common exam trap in ${pack.topic}?`,
          `Can you break down ${pack.teacherBrief.coreConcepts?.[0] || 'the core concept'} step-by-step?`,
          `Show me practical code or calculation for ${pack.topic}`,
          `Give me a memorable memory trick for this lecture`,
        ].map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0d9488] border border-[#e6dfd5] hover:border-[#0d9488]/40 whitespace-nowrap transition-all shadow-2xs font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs min-h-[400px] max-h-[540px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#0d9488] text-white rounded-tr-none shadow-xs'
                    : 'bg-[#faf8f5] text-slate-800 border border-[#e6dfd5] rounded-tl-none space-y-2'
                }`}
              >
                {msg.mode && !isUser && (
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-teal-100 text-[#0f766e] mb-1">
                    Style: {msg.mode}
                  </span>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Helpful quick follow-ups on assistant answers */}
                {!isUser && msg.id !== 'msg-1' && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e6dfd5]/80 mt-2 text-[10px]">
                    <span className="text-slate-400 font-semibold">Follow up:</span>
                    <button
                      onClick={() => handleSendMessage(`Can you explain that even more simply?`)}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#d4cbbe] hover:border-[#0d9488] text-slate-600 hover:text-[#0d9488] transition-all"
                    >
                      🧒 Explain more simply
                    </button>
                    <button
                      onClick={() => handleSendMessage(`Give me a quick 1-question check to see if I understood.`)}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#d4cbbe] hover:border-[#0d9488] text-slate-600 hover:text-[#0d9488] transition-all"
                    >
                      ✍️ Quiz me on this
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] text-xs text-[#0d9488] flex items-center gap-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Thinking of a simple explanation for you...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white rounded-2xl p-2 border border-[#e6dfd5] shadow-xs flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask any doubt about ${pack.topic}...`}
          className="flex-1 px-4 py-3 bg-transparent text-slate-900 text-xs sm:text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="px-5 py-3 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-2xs"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
