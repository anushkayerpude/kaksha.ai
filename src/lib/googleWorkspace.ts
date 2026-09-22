import { ClassroomPack } from '../types';

/**
 * Generates Google Docs API batchUpdate JSON payload
 */
export function buildGoogleDocsPayload(pack: ClassroomPack): any {
  return {
    title: `${pack.topic} — Complete Lesson Plan & Classroom Pack | Kaksha.ai`,
    documentStyle: {
      pageSize: { height: { magnitude: 792, unit: 'PT' }, width: { magnitude: 612, unit: 'PT' } },
      marginTop: { magnitude: 72, unit: 'PT' },
      marginBottom: { magnitude: 72, unit: 'PT' },
      marginLeft: { magnitude: 72, unit: 'PT' },
      marginRight: { magnitude: 72, unit: 'PT' },
    },
    sections: [
      {
        title: `LESSON PLAN: ${pack.topic.toUpperCase()}`,
        subject: pack.subject,
        grade: pack.grade,
        duration: `${pack.duration} Minutes`,
        objectives: pack.learningObjectives,
        timeline: pack.lessonTimeline.map((t) => ({
          time: t.timeRange,
          step: t.title,
          description: t.description,
          guidance: t.teacherGuidance,
        })),
        teacherBrief: pack.teacherBrief,
        activity: pack.classroomActivity,
      },
    ],
  };
}

/**
 * Generates Google Slides API batchUpdate JSON payload
 */
export function buildGoogleSlidesPayload(pack: ClassroomPack): any {
  return {
    title: `${pack.topic} — Lecture Presentation | Kaksha.ai`,
    slides: pack.presentation.map((slide) => ({
      slideNumber: slide.slideNumber,
      title: slide.title,
      subtitle: slide.subtitle || '',
      bullets: slide.bulletPoints,
      visualPrompt: slide.visualPrompt,
      notes: slide.presenterNotes,
    })),
  };
}

/**
 * Generates Google Forms API create & batchUpdate JSON payload
 */
export function buildGoogleFormsPayload(pack: ClassroomPack): any {
  return {
    info: {
      title: `${pack.topic} — 5-Question Mastery Quiz`,
      documentTitle: `${pack.topic} Quiz (Kaksha.ai)`,
      description: `Automated assessment for ${pack.subject} (${pack.grade}). Answer all questions carefully. Explanations will be revealed upon submission.`,
    },
    settings: {
      quizSettings: {
        isQuiz: true,
      },
    },
    items: pack.quiz.map((q) => ({
      title: `Q${q.questionNumber}: ${q.question}`,
      description: `Target Objective: ${q.learningObjective}`,
      questionItem: {
        question: {
          required: true,
          grading: {
            pointValue: 1,
            correctAnswers: {
              answers: [{ value: q.correctAnswer }],
            },
            generalFeedback: {
              text: q.explanation,
            },
          },
          choiceQuestion: {
            type: 'RADIO',
            options: q.options.map((opt) => ({ value: opt.slice(0, 1) })), // A, B, C, D
            shuffle: false,
          },
        },
      },
    })),
  };
}

/**
 * Generates clean, printer-friendly HTML for direct browser print dialog
 */
export function generatePrintableWorksheetHTML(pack: ClassroomPack, tier: 'foundation' | 'standard' | 'challenge'): string {
  const currentTier = pack.worksheet[tier];
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${pack.topic} - Worksheet (${tier.toUpperCase()})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #111; padding: 30px; max-width: 800px; margin: auto; }
    .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
    .header-title { font-size: 20px; font-weight: bold; margin: 0 0 6px; }
    .header-meta { display: flex; justify-content: space-between; font-size: 13px; color: #444; }
    .student-fields { display: flex; justify-content: space-between; border: 1px dashed #666; padding: 10px; margin: 15px 0; font-size: 13px; }
    .section-title { font-size: 15px; font-weight: bold; background: #f0f0f0; padding: 4px 8px; margin-top: 20px; border-left: 4px solid #2563eb; }
    .question-item { margin: 14px 0; }
    .question-prompt { font-weight: 600; font-size: 14px; }
    .hint { font-size: 12px; color: #666; font-style: italic; margin-top: 2px; }
    .work-space { height: 75px; border: 1px dotted #bbb; border-radius: 4px; margin-top: 8px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-title">KAKSHA.AI ACADEMIC WORKSHEET — ${pack.topic.toUpperCase()}</div>
    <div class="header-meta">
      <span><strong>Subject:</strong> ${pack.subject}</span>
      <span><strong>Grade:</strong> ${pack.grade}</span>
      <span><strong>Difficulty:</strong> ${tier.toUpperCase()} LEVEL</span>
    </div>
  </div>

  <div class="student-fields">
    <span><strong>Student Name:</strong> ___________________________________</span>
    <span><strong>Roll Number:</strong> ____________</span>
    <span><strong>Date:</strong> ____________</span>
  </div>

  <div class="section-title">SECTION A: FOUNDATIONAL UNDERSTANDING</div>
  ${currentTier.sectionA_Basic
    .map(
      (q) => `
    <div class="question-item">
      <div class="question-prompt">Q${q.number}. ${q.question}</div>
      ${q.hint ? `<div class="hint">Hint: ${q.hint}</div>` : ''}
      <div class="work-space"></div>
    </div>`
    )
    .join('')}

  <div class="section-title">SECTION B: CONCEPTUAL UNDERSTANDING</div>
  ${currentTier.sectionB_Conceptual
    .map(
      (q) => `
    <div class="question-item">
      <div class="question-prompt">Q${q.number}. ${q.question}</div>
      ${q.hint ? `<div class="hint">Hint: ${q.hint}</div>` : ''}
      <div class="work-space"></div>
    </div>`
    )
    .join('')}

  <div class="section-title">SECTION C: APPLICATION & PROBLEM SOLVING</div>
  ${currentTier.sectionC_Application
    .map(
      (q) => `
    <div class="question-item">
      <div class="question-prompt">Q${q.number}. ${q.question}</div>
      ${q.hint ? `<div class="hint">Hint: ${q.hint}</div>` : ''}
      <div class="work-space"></div>
    </div>`
    )
    .join('')}

  ${
    currentTier.sectionD_Challenge && currentTier.sectionD_Challenge.length > 0
      ? `
    <div class="section-title">SECTION D: CHALLENGE & EXTENSION QUESTION</div>
    ${currentTier.sectionD_Challenge
      .map(
        (q) => `
      <div class="question-item">
        <div class="question-prompt">Q${q.number}. ${q.question}</div>
        ${q.hint ? `<div class="hint">Hint: ${q.hint}</div>` : ''}
        <div class="work-space"></div>
      </div>`
      )
      .join('')}`
      : ''
  }

  <div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 8px; font-size: 11px; color: #777; text-align: center;">
    Generated with Kaksha.ai • AI-Powered Academic ERP • Grounded with Gemini & Google Search
  </div>
</body>
</html>`;
}
