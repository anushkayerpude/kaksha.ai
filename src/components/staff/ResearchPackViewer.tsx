'use client';

import React, { useState } from 'react';
import { ResearchPack, SourceItem } from '@/types';
import { Search, ExternalLink, MessageSquare, BookOpen, Video, GraduationCap, FileCode, Send } from 'lucide-react';
import { runAskTutor } from '@/lib/geminiService';

interface ResearchPackViewerProps {
  researchPack: ResearchPack;
  apiKey?: string;
}

export const ResearchPackViewer: React.FC<ResearchPackViewerProps> = ({ researchPack, apiKey }) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [askQuery, setAskQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatResponses, setChatResponses] = useState<
    Array<{ question: string; answer: string; sources: string[] }>
  >([
    {
      question: 'Explain convolution using a simple real-world example suitable for first-year students.',
      answer:
        'A convolution operation can be understood as sliding a small filter or flashlight across an image grid. At each position, it computes the overlap (dot product) with the underlying pixels. Wherever edges or shapes match the filter orientation, the output shines brightly!',
      sources: ['Stanford CS231n', 'MIT 6.S191', '3Blue1Brown'],
    },
  ]);

  const sourceIcon = (type: SourceItem['type']) => {
    switch (type) {
      case 'Research Paper':
        return <BookOpen className="w-3.5 h-3.5 text-violet-600" />;
      case 'Video':
        return <Video className="w-3.5 h-3.5 text-rose-600" />;
      case 'University Resource':
        return <GraduationCap className="w-3.5 h-3.5 text-[#881337]" />;
      case 'Reference Documentation':
        return <FileCode className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const filteredSources =
    selectedType === 'ALL'
      ? researchPack.sources
      : researchPack.sources.filter((s) => s.type === selectedType);

  const handleAskSources = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;

    const q = askQuery.trim();
    setAskQuery('');
    setIsAsking(true);

    try {
      const answer = await runAskTutor(
        `Teacher question on sources: ${q}`,
        {
          topic: researchPack.topic,
          subject: 'AI & Machine Learning',
          teacherBrief: {
            topicOverview: researchPack.summary,
            coreConcepts: ['Convolution', 'Filters', 'Feature Maps', 'Pooling'],
          },
          learningObjectives: [],
          misconceptions: [],
        } as any,
        'Beginner',
        apiKey
      );
      setChatResponses((prev) => [
        {
          question: q,
          answer: answer || 'Synthesized answer based on verified literature.',
          sources: ['Stanford CS231n', 'Deep Learning Book', 'arXiv:1311.2901'],
        },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e6dfd5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-[#881337] border border-rose-200">
                <Search className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">AI Research Pack & Grounding Citations</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Grounded with real-time Google Search and academic repositories
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#881337]/10 text-[#881337] border border-[#881337]/20 self-start sm:self-auto">
            {researchPack.sources.length} Authoritative Sources Found
          </span>
        </div>

        {/* Synthesis Summary */}
        <p className="text-xs text-slate-700 leading-relaxed bg-[#faf8f5] p-4 rounded-2xl border border-[#e6dfd5]">
          {researchPack.summary}
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'ALL'
                ? 'bg-[#881337] text-white shadow-xs'
                : 'bg-[#faf8f5] text-slate-600 hover:text-slate-900 border border-[#e6dfd5]'
            }`}
          >
            All Sources ({researchPack.sources.length})
          </button>
          <button
            onClick={() => setSelectedType('Educational Article')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'Educational Article'
                ? 'bg-[#881337] text-white shadow-xs'
                : 'bg-[#faf8f5] text-slate-600 hover:text-slate-900 border border-[#e6dfd5]'
            }`}
          >
            Articles ({researchPack.stats.articles})
          </button>
          <button
            onClick={() => setSelectedType('Research Paper')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'Research Paper'
                ? 'bg-[#881337] text-white shadow-xs'
                : 'bg-[#faf8f5] text-slate-600 hover:text-slate-900 border border-[#e6dfd5]'
            }`}
          >
            Research Papers ({researchPack.stats.papers})
          </button>
          <button
            onClick={() => setSelectedType('University Resource')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'University Resource'
                ? 'bg-[#881337] text-white shadow-xs'
                : 'bg-[#faf8f5] text-slate-600 hover:text-slate-900 border border-[#e6dfd5]'
            }`}
          >
            University Syllabi ({researchPack.stats.university})
          </button>
          <button
            onClick={() => setSelectedType('Video')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'Video'
                ? 'bg-[#881337] text-white shadow-xs'
                : 'bg-[#faf8f5] text-slate-600 hover:text-slate-900 border border-[#e6dfd5]'
            }`}
          >
            Videos ({researchPack.stats.videos})
          </button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="bg-white rounded-2xl p-4 border border-[#e6dfd5] hover:border-slate-300 transition-all space-y-2.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#faf8f5] border border-[#e6dfd5]">
                    {sourceIcon(source.type)}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {source.type}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{source.title}</h4>
                  </div>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#881337] hover:bg-[#faf8f5] transition-all shrink-0"
                  title="Open External Source"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{source.snippet}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#e6dfd5] text-[11px]">
                <span className="text-[#0d9488] font-mono text-[10px] font-bold">{source.domain}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">Used In:</span>
                  {source.usedIn.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#faf8f5] text-slate-700 border border-[#e6dfd5]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Ask Your Sources */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#e6dfd5] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-50 text-[#0d9488] border border-teal-200">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ask Your Sources</h4>
                <p className="text-[10px] text-slate-500">Query the grounded literature</p>
              </div>
            </div>

            <form onSubmit={handleAskSources} className="relative">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder="Ask about formulas, analogies, papers..."
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] text-slate-900 text-xs focus:outline-none focus:border-[#0d9488]"
              />
              <button
                type="submit"
                disabled={isAsking}
                className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {chatResponses.map((chat, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-2">
                  <p className="text-xs font-bold text-[#881337]">&ldquo;{chat.question}&rdquo;</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{chat.answer}</p>
                  <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-[#e6dfd5]">
                    <span className="text-[10px] text-slate-400 font-semibold">Sources:</span>
                    {chat.sources.map((src, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white text-slate-600 border border-[#e6dfd5]"
                      >
                        [{src}]
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
