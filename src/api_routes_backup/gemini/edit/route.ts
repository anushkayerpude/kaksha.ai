import { NextRequest, NextResponse } from 'next/server';
import { regeneratePackComponent } from '@/lib/gemini';
import { ClassroomPack } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { componentType, instruction, pack, apiKey }: {
      componentType: 'quiz' | 'worksheet' | 'activity' | 'timeline';
      instruction: string;
      pack: ClassroomPack;
      apiKey?: string;
    } = body;

    if (!instruction || !componentType) {
      return NextResponse.json({ error: 'componentType and instruction are required' }, { status: 400 });
    }

    const updatedComponent = await regeneratePackComponent(
      componentType,
      instruction,
      pack,
      apiKey
    );

    return NextResponse.json({ success: true, updatedComponent });
  } catch (error: any) {
    console.error('API /api/gemini/edit error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to edit component' },
      { status: 500 }
    );
  }
}
