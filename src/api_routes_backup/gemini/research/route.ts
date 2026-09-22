import { NextRequest, NextResponse } from 'next/server';
import { researchTopicWithSearch } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, subject, grade, apiKey } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const researchPack = await researchTopicWithSearch(
      topic,
      subject || 'General Education',
      grade || 'Undergraduate',
      apiKey
    );

    return NextResponse.json({ success: true, researchPack });
  } catch (error: any) {
    console.error('API /api/gemini/research error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to research topic' },
      { status: 500 }
    );
  }
}
