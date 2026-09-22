import {
  researchTopicWithSearch,
  generateClassroomPackWithGemini,
  askStudentAITutor,
  solveStudentDoubt,
  regeneratePackComponent,
} from './gemini';
import { ClassroomPack, LectureInput, ResearchPack, StudentDoubt } from '@/types';

/**
 * Universal Gemini Service for Kaksha.ai
 * Seamlessly executes direct client-side Gemini 2.5 Flash SDK + dynamic grounding packs for Firebase Hosting.
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

export async function runSolveDoubt(
  question: string,
  pack: ClassroomPack,
  studentName: string,
  apiKey?: string
): Promise<StudentDoubt> {
  return await solveStudentDoubt(question, pack, studentName, apiKey);
}

export async function runRegenerate(
  componentType: string,
  currentContent: any,
  instructions: string,
  apiKey?: string
): Promise<any> {
  return await regeneratePackComponent(componentType as any, instructions, currentContent, apiKey);
}

