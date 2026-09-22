import {
  researchTopicWithSearch,
  generateClassroomPackWithGemini,
  askStudentAITutor,
  regeneratePackComponent,
} from './gemini';
import { ClassroomPack, LectureInput, ResearchPack } from '@/types';

/**
 * Universal Gemini Service for Kaksha.ai
 * Seamlessly executes direct client-side Gemini 3.8 Flash SDK + verified grounding packs for Firebase Hosting.
 */

export async function runResearch(
  topic: string,
  subject: string,
  grade: string,
  apiKey?: string
): Promise<ResearchPack> {
  return await researchTopicWithSearch(topic, subject, grade, apiKey);
}

export async function runGeneratePack(
  input: LectureInput,
  researchPack: ResearchPack,
  apiKey?: string
): Promise<ClassroomPack> {
  return await generateClassroomPackWithGemini(input, researchPack, apiKey);
}

export async function runAskTutor(
  query: string,
  lecturePack: ClassroomPack,
  mode: string,
  apiKey?: string
): Promise<string> {
  return await askStudentAITutor(query, lecturePack, mode as any, apiKey);
}

export async function runRegenerate(
  componentType: string,
  currentContent: any,
  instructions: string,
  apiKey?: string
): Promise<any> {
  return await regeneratePackComponent(componentType as any, instructions, currentContent, apiKey);
}
