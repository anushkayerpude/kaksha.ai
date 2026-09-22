import { NextRequest, NextResponse } from 'next/server';
import { generateClassroomPackWithGemini } from '@/lib/gemini';
import { LectureInput, ResearchPack } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, researchPack, apiKey }: { input: LectureInput; researchPack: ResearchPack; apiKey?: string } = body;

    if (!input || !input.topic) {
      return NextResponse.json({ error: 'Valid LectureInput is required' }, { status: 400 });
    }

    const classroomPack = await generateClassroomPackWithGemini(
      input,
      researchPack,
      apiKey
    );

    return NextResponse.json({ success: true, classroomPack });
  } catch (error: any) {
    console.error('API /api/gemini/generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate classroom pack' },
      { status: 500 }
    );
  }
}
