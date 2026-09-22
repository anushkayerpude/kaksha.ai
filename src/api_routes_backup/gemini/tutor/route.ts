import { NextRequest, NextResponse } from 'next/server';
import { askStudentAITutor } from '@/lib/gemini';
import { ClassroomPack } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, lecturePack, mode, apiKey }: {
      query: string;
      lecturePack: ClassroomPack;
      mode: any;
      apiKey?: string;
    } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const answer = await askStudentAITutor(
      query,
      lecturePack,
      mode || 'Beginner',
      apiKey
    );

    return NextResponse.json({ success: true, answer });
  } catch (error: any) {
    console.error('API /api/gemini/tutor error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get tutor answer' },
      { status: 500 }
    );
  }
}
