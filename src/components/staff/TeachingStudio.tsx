'use client';

import React, { useState } from 'react';
import { ClassroomPack, LectureInput } from '@/types';
import { Sparkles, Wand2, Search, Brain, BookOpen, Presentation, FileText, CheckCircle2 } from 'lucide-react';
import { runResearch, runGeneratePack } from '@/lib/geminiService';

interface TeachingStudioProps {
  onPackGenerated: (pack: ClassroomPack) => void;
  initialTopic?: string;
  initialSubject?: string;
  initialDuration?: number;
  initialInstructions?: string;
  apiKey?: string;
}

export const TeachingStudio: React.FC<TeachingStudioProps> = ({
  onPackGenerated,
  initialTopic = 'Convolutional Neural Networks',
  initialSubject = 'Artificial Intelligence & Machine Learning',
  initialDuration = 60,
  initialInstructions = 'Use practical examples, biological intuition, and clear sizing arithmetic.',
  apiKey,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [grade, setGrade] = useState('Semester 5');
  const [duration, setDuration] = useState(initialDuration);
  const [teachingStyle, setTeachingStyle] = useState<LectureInput['teachingStyle']>('Interactive');
  const [classSize, setClassSize] = useState(45);
  const [learningLevel, setLearningLevel] = useState<LectureInput['learningLevel']>('Intermediate');
  const [language, setLanguage] = useState('English');
  const [additionalInstructions, setAdditionalInstructions] = useState(initialInstructions);

  const [availableResources, setAvailableResources] = useState<string[]>([
    'Whiteboard',
    'Printed material',
    'Projector',
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Google Search Grounding', desc: 'Analyzing papers, course sites & video citations', icon: Search },
    { title: 'Source Synthesis', desc: 'Synthesizing core concepts and architectural formulas', icon: Brain },
    { title: 'Structuring Lesson Plan', desc: 'Distributing 60-min timeline and Bloom objectives', icon: BookOpen },
    { title: 'Creating Presentation Deck', desc: 'Formatting 13 slides with speaker notes & visuals', icon: Presentation },
    { title: 'Generating Assessment & Worksheets', desc: 'Drafting 3-tier worksheets, 5-question quiz & answer key', icon: FileText },
  ];

  const handleToggleResource = (res: string) => {
    if (availableResources.includes(res)) {
      setAvailableResources(availableResources.filter((r) => r !== res));
    } else {
      setAvailableResources([...availableResources, res]);
    }
  };

  const handleBuildLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCurrentStep(0);

    const inputData: LectureInput = {
      topic,
      subject,
      grade,
      duration,
      teachingStyle,
      classSize,
      availableResources,
      learningLevel,
      language,
      additionalInstructions,
    };

    try {
      setCurrentStep(0);
      const researchPack = await runResearch(topic, subject, grade, apiKey);

      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 600));

      setCurrentStep(3);
      const classroomPack = await runGeneratePack(inputData, researchPack, apiKey);

      setCurrentStep(4);
      await new Promise((r) => setTimeout(r, 600));

      if (classroomPack) {
        onPackGenerated(classroomPack);
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Studio Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#881337]/10 text-[#881337] border border-[#881337]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
          Powered by Gemini 3.8 Flash & Google Search Grounding
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          AI Teaching Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Enter any academic topic. Kaksha.ai researches authoritative sources, synthesizes the concepts, and generates an entire classroom pack in seconds.
        </p>
      </div>

      {/* Generation Stepper Overlay */}
      {isGenerating ? (
        <div className="bg-white rounded-3xl p-8 border border-[#e6dfd5] shadow-lg space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-[#0d9488]">
              <Wand2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Synthesizing Classroom Pack...</h3>
            <p className="text-xs text-slate-600">
              Researching &quot;{topic}&quot; across peer-reviewed papers and university syllabi
            </p>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isDone = currentStep > idx;
              const isCurrent = currentStep === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-teal-50 border-teal-300 text-teal-950 shadow-xs'
                      : 'bg-[#faf8f5] border-[#e6dfd5] text-slate-400'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCurrent
                        ? 'bg-teal-100 text-teal-700 animate-bounce'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{step.title}</p>
                    <p className="text-[10px] opacity-80 truncate">{step.desc}</p>
                  </div>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Form Card */
        <form onSubmit={handleBuildLecture} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-sm space-y-6">
          {/* Main Topic & Subject Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Lecture Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Convolutional Neural Networks"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-sm focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] transition-all font-semibold shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Subject / Discipline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-sm focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] transition-all font-semibold shadow-2xs"
              />
            </div>
          </div>

          {/* Grade, Duration, Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Grade / Semester
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Semester 5 or Grade 11"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-sm focus:outline-none focus:border-[#0d9488] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Class Duration (Minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={15}
                  max={180}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-sm focus:outline-none focus:border-[#0d9488] transition-all font-mono"
                />
                <span className="absolute right-4 top-3 text-xs text-slate-500">mins</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Teaching Style
              </label>
              <select
                value={teachingStyle}
                onChange={(e) => setTeachingStyle(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-sm focus:outline-none focus:border-[#0d9488] transition-all"
              >
                <option value="Interactive">Interactive (Discussions + Q&A)</option>
                <option value="Lecture">Standard Lecture (Theory + Examples)</option>
                <option value="Discussion-Based">Discussion-Based (Socratic)</option>
                <option value="Flipped Classroom">Flipped Classroom</option>
                <option value="Hands-on Lab">Hands-on Lab / Practical</option>
              </select>
            </div>
          </div>

          {/* Resources Checkboxes & Learning Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[#e6dfd5]">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Available Classroom Resources
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Whiteboard', 'Printed material', 'Projector', 'Computers'].map((res) => {
                  const isSelected = availableResources.includes(res);
                  return (
                    <button
                      type="button"
                      key={res}
                      onClick={() => handleToggleResource(res)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-teal-50 border-[#0d9488] text-[#0d9488]'
                          : 'bg-[#faf8f5] border-[#e6dfd5] text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{res}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0d9488]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Difficulty Level & Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={learningLevel}
                  onChange={(e) => setLearningLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-xs focus:outline-none focus:border-[#0d9488]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-xs focus:outline-none focus:border-[#0d9488]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Kaksha.ai adapts terminology and analogies to the chosen audience.
              </p>
            </div>
          </div>

          {/* Additional Guidance Prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Specific Instructions / Pedagogical Focus (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="e.g. Include a worked dimension calculation problem, focus on real-world vision applications..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d4cbbe] text-slate-900 text-xs focus:outline-none focus:border-[#0d9488] transition-all resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-xl text-sm font-black tracking-wide uppercase bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#0d9488] hover:opacity-95 text-white shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              Build My Lecture (One-Click Classroom Pack)
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
