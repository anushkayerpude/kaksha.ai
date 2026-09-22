import pptxgen from 'pptxgenjs';
import { PresentationSlide } from '@/types';

/**
 * Generates a styled, academic PowerPoint (.pptx) presentation
 * and automatically triggers browser download.
 */
export async function generateAndDownloadPPTX(
  topic: string,
  subject: string,
  instructorName: string,
  slides: PresentationSlide[],
  durationMinutes = 45
): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = instructorName;
  pptx.company = 'Kaksha.ai Academic ERP';
  pptx.subject = `${subject} - ${topic}`;
  pptx.title = `${topic} Presentation Deck`;

  // Color Palette Tokens
  const COLOR_MAROON = '881337';
  const COLOR_TEAL = '0D9488';
  const COLOR_DARK = '0F172A';
  const COLOR_MUTED = '475569';
  const COLOR_BG_LIGHT = 'FBF9F5';
  const COLOR_BOX_BG = 'F1EBE1';

  // 1. SLIDE 1: Title Slide (Grand Institutional Maroon)
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: COLOR_MAROON };

  // University Header Pill
  titleSlide.addText('INSTITUTE OF ADVANCED RESEARCH • ACADEMIC STUDIO', {
    x: 0.8,
    y: 0.8,
    w: 8.5,
    h: 0.4,
    fontSize: 10,
    fontFace: 'Arial',
    bold: true,
    color: 'FDE68A', // amber-200
  });

  // Topic Title
  titleSlide.addText(topic, {
    x: 0.8,
    y: 1.4,
    w: 8.5,
    h: 2.2,
    fontSize: 34,
    fontFace: 'Georgia',
    bold: true,
    color: 'FFFFFF',
    valign: 'top',
  });

  // Subtitle / Subject
  titleSlide.addText(`Curriculum Next Topic Module • ${subject} • ${durationMinutes} Minutes`, {
    x: 0.8,
    y: 3.8,
    w: 8.5,
    h: 0.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: 'CBD5E1',
  });

  // Instructor Meta Card
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 4.8,
    w: 8.5,
    h: 0.9,
    fill: { color: '4C0519' },
    line: { color: '9F1239', width: 1 },
  });

  titleSlide.addText(`Instructor: ${instructorName}   |   Autonomous Next-Lecture Curriculum Deck`, {
    x: 1.0,
    y: 5.1,
    w: 8.1,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
  });

  // 2. BODY SLIDES
  slides.forEach((slide) => {
    const s = pptx.addSlide();
    s.background = { color: COLOR_BG_LIGHT };

    // Header bar
    s.addShape(pptx.ShapeType.rect, {
      x: 0.6,
      y: 0.4,
      w: 8.8,
      h: 0.08,
      fill: { color: COLOR_TEAL },
    });

    // Slide Tag & Number
    s.addText(`SLIDE ${slide.slideNumber} OF ${slides.length} • ${topic.toUpperCase()}`, {
      x: 0.6,
      y: 0.55,
      w: 8.8,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_TEAL,
    });

    // Slide Title
    s.addText(slide.title, {
      x: 0.6,
      y: 0.85,
      w: 8.8,
      h: 0.8,
      fontSize: 22,
      fontFace: 'Georgia',
      bold: true,
      color: COLOR_MAROON,
      valign: 'top',
    });

    // Subtitle if available
    if (slide.subtitle) {
      s.addText(slide.subtitle, {
        x: 0.6,
        y: 1.55,
        w: 8.8,
        h: 0.35,
        fontSize: 11,
        fontFace: 'Arial',
        italic: true,
        color: COLOR_MUTED,
      });
    }

    // Left Column: Bullet Points
    const bulletItems = slide.bulletPoints.map((bp) => ({
      text: bp,
      options: {
        fontSize: 13,
        fontFace: 'Arial',
        color: COLOR_DARK,
        bullet: true,
        paraSpaceAfter: 12,
      },
    }));

    s.addText(bulletItems, {
      x: 0.6,
      y: 2.0,
      w: 5.4,
      h: 4.2,
      valign: 'top',
    });

    // Right Column: Visual Diagram / Architectural Prompt Callout
    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.2,
      y: 2.0,
      w: 3.2,
      h: 4.0,
      fill: { color: COLOR_BOX_BG },
      line: { color: 'DED6C9', width: 1 },
      rectRadius: 0.15,
    });

    s.addText('🎨 VISUAL DIAGRAM GUIDE', {
      x: 6.4,
      y: 2.2,
      w: 2.8,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_MAROON,
    });

    s.addText(slide.visualPrompt || 'Concept architecture diagram illustrating state transformation and feature maps.', {
      x: 6.4,
      y: 2.55,
      w: 2.8,
      h: 3.2,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      valign: 'top',
    });

    // Embed Native Speaker / Presenter Notes in PowerPoint
    if (slide.presenterNotes) {
      s.addNotes(`Dr. ${instructorName}'s Lecture Delivery Cue:\n${slide.presenterNotes}`);
    }

    // Footer
    s.addText(`Kaksha.ai Academic AI Studio • ${instructorName}`, {
      x: 0.6,
      y: 6.8,
      w: 8.8,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: '94A3B8',
    });
  });

  // Save and download file
  const sanitized = topic.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const filename = `${sanitized}_NextLecture_Deck.pptx`;
  await pptx.writeFile({ fileName: filename });
}
