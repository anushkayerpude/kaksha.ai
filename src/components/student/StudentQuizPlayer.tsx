'use client';

import React, { useState } from 'react';
import { ClassroomPack, StudentQuizSubmission } from '@/types';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Award,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface StudentQuizPlayerProps {
  pack: ClassroomPack;
  studentId: string;
  studentName: string;
  onSubmitScore: (submission: StudentQuizSubmission) => void;
  onAskTutorWithContext?: (context: string) => void;
}

export const StudentQuizPlayer: React.FC<StudentQuizPlayerProps> = ({
  pack,
  studentId,
  studentName,
  onSubmitScore,
  onAskTutorWithContext,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (questionId: string, optionChar: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionChar,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalScore = 0;
    pack.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        totalScore += 1;
      }
    });

    setScore(totalScore);
    setIsSubmitted(true);

    if (totalScore >= 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    const submission: StudentQuizSubmission = {
      id: `sub-${Date.now()}`,
      studentId,
      studentName,
      lectureId: pack.id,
      answers: selectedAnswers,
      score: totalScore,
      totalQuestions: pack.quiz.length,
      submittedAt: new Date().toISOString(),
    };

    onSubmitScore(submission);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const allAnswered = pack.quiz.every((q) => !!selectedAnswers[q.id]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16 font-sans">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e6dfd5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#0d9488] border border-teal-200">
            Practice & Self-Check
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {pack.topic} Quick Quiz
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            5 Simple Questions • Instant Explanations & Friendly Feedback
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href={pack.googleExports.formsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all"
            title="Open in Google Forms"
          >
            <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>Google Forms</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Progress Pill Bar (before submission) */}
      {!isSubmitted && (
        <div className="bg-white rounded-2xl p-4 border border-[#e6dfd5] shadow-xs flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Answered {totalAnswered} of {pack.quiz.length} questions
          </span>
          <div className="flex items-center gap-1.5">
            {pack.quiz.map((q, idx) => (
              <div
                key={q.id}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  selectedAnswers[q.id]
                    ? 'bg-[#0d9488] text-white shadow-2xs'
                    : 'bg-[#ede8df] text-slate-600'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Celebration Card */}
      {isSubmitted && (
        <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-teal-200 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-white text-[#0d9488] border border-teal-200 flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {score === 5
                ? `🎉 Full Marks, ${studentName.split(' ')[0]}!`
                : score >= 3
                ? `👏 Great Job, ${studentName.split(' ')[0]}!`
                : `💪 Good Try, ${studentName.split(' ')[0]}!`}
            </h2>
            <p className="text-base font-bold text-[#0d9488]">
              You scored {score} out of {pack.quiz.length} correct
            </p>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {score >= 4
                ? 'You have a solid grasp of 2D convolution, padding, stride, and max pooling!'
                : 'Review the friendly explanations below to clear up any tricky spots, or ask the AI Study Buddy!'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleRetake}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-[#e6dfd5] hover:bg-slate-50 shadow-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* Question Cards */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {pack.quiz.map((q, qIndex) => {
          const chosenOpt = selectedAnswers[q.id];
          const isCorrect = isSubmitted && chosenOpt === q.correctAnswer;
          const isWrong = isSubmitted && chosenOpt && chosenOpt !== q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl p-6 border transition-all space-y-4 shadow-xs ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : isWrong
                    ? 'border-rose-300 bg-rose-50/30'
                    : 'border-[#e6dfd5]'
                  : 'border-[#e6dfd5]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#881337] bg-[#881337]/5 px-2.5 py-0.5 rounded-lg border border-[#881337]/15">
                  Question {qIndex + 1}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {q.learningObjective}
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const optChar = opt.slice(0, 1);
                  const isSelected = chosenOpt === optChar;
                  const isThisCorrect = isSubmitted && optChar === q.correctAnswer;

                  return (
                    <div
                      key={optChar}
                      onClick={() => handleSelectOption(q.id, optChar)}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${
                        isSubmitted
                          ? isThisCorrect
                            ? 'bg-emerald-100/80 border-emerald-400 text-emerald-950 font-bold'
                            : isSelected
                            ? 'bg-rose-100/80 border-rose-400 text-rose-950 font-semibold'
                            : 'bg-slate-50/60 border-slate-200 text-slate-400'
                          : isSelected
                          ? 'bg-teal-50 border-[#0d9488] text-[#0d9488] font-bold shadow-2xs'
                          : 'bg-[#faf8f5] border-[#e6dfd5] text-slate-700 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected
                              ? 'bg-[#0d9488] text-white'
                              : 'bg-white border border-[#ded6c9] text-slate-600'
                          }`}
                        >
                          {optChar}
                        </span>
                        <span>{opt.slice(3)}</span>
                      </div>

                      {isSubmitted && isThisCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isThisCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Reveal after submission */}
              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-white border border-[#e6dfd5] text-xs text-slate-700 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Correct Answer: Option {q.correctAnswer}
                    </p>
                    {onAskTutorWithContext && (
                      <button
                        type="button"
                        onClick={() =>
                          onAskTutorWithContext(
                            `Question ${qIndex + 1}: "${q.question}". Why is Option ${q.correctAnswer} correct?`
                          )
                        }
                        className="text-[11px] font-bold text-[#0d9488] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Ask AI Buddy why
                      </button>
                    )}
                  </div>
                  <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="pt-2">
            <button
              type="submit"
              disabled={!allAnswered}
              className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-wider bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Submit Answers & Check Score</span>
            </button>
            {!allAnswered && (
              <p className="text-center text-[11px] text-slate-500 mt-2">
                Please answer all {pack.quiz.length} questions ({totalAnswered}/{pack.quiz.length} completed)
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
