export type UserRole = 'STAFF' | 'STUDENT' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  department: string;
  avatarUrl?: string;
}

export interface LectureInput {
  topic: string;
  subject: string;
  grade: string; // e.g., "Semester 5" or "Grade 10"
  duration: number; // in minutes, e.g. 60
  teachingStyle: 'Interactive' | 'Lecture' | 'Discussion-Based' | 'Flipped Classroom' | 'Hands-on Lab';
  classSize: number;
  availableResources: string[]; // ["Whiteboard", "Projector", "Printed material", "Computers"]
  learningLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  additionalInstructions?: string;
}

export interface SourceItem {
  id: string;
  title: string;
  type: 'Educational Article' | 'Research Paper' | 'Video' | 'University Resource' | 'Reference Documentation';
  url: string;
  domain: string;
  snippet: string;
  usedIn: string[]; // e.g. ["Concept Explanation", "Visual Demo", "Worked Example"]
  citationAuthor?: string;
}

export interface ResearchPack {
  topic: string;
  summary: string;
  stats: {
    articles: number;
    papers: number;
    videos: number;
    university: number;
    references: number;
  };
  sources: SourceItem[];
}

export interface LessonPlanItem {
  timeRange: string; // "00–05 min"
  startMin: number;
  endMin: number;
  title: string; // "Introduction / Hook"
  description: string;
  activityType: 'Hook' | 'Concept' | 'Visual Demonstration' | 'Worked Example' | 'Activity' | 'Discussion' | 'Quiz' | 'Exit Ticket';
  teacherGuidance: string;
  keyQuestionsToAsk: string[];
}

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  visualPrompt: string; // Description or diagram recommendation
  presenterNotes: string;
  codeSnippet?: string;
}

export interface TeacherBrief {
  topicOverview: string;
  coreConcepts: string[];
  importantTerminology: { term: string; definition: string }[];
  realWorldAnalogies: { concept: string; analogy: string; explanation: string }[];
  likelyStudentQuestions: { question: string; suggestedAnswer: string }[];
  fiveMinuteRecapScript: string;
  pacingTips: string[];
}

export interface Misconception {
  id: string;
  belief: string; // What students often mistakenly believe
  clarification: string; // Why it's flawed & the correct mental model
  suggestedCheckQuestion: string;
}

export interface ClassroomActivity {
  title: string;
  durationMinutes: number;
  groupSize: string; // e.g., "Groups of 4"
  resourcesNeeded: string[];
  objective: string;
  stepByStepInstructions: string[];
  deliverable: string;
}

export interface WorksheetQuestion {
  id: string;
  number: number;
  question: string;
  hint?: string;
  spaceForWork: boolean;
}

export interface WorksheetTier {
  tierName: 'Foundation' | 'Standard' | 'Challenge';
  targetAudience: string;
  sectionA_Basic: WorksheetQuestion[];
  sectionB_Conceptual: WorksheetQuestion[];
  sectionC_Application: WorksheetQuestion[];
  sectionD_Challenge?: WorksheetQuestion[];
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  type: 'Multiple Choice' | 'True / False' | 'Scenario-Based' | 'Application-Based';
  question: string;
  options: string[];
  correctAnswer: string; // e.g. "B" or the exact string
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  learningObjective: string;
}

export interface ExitTicket {
  prompt: string;
  diagnosticQuestion: string;
  confidenceCheck: string;
}

export interface StudentResource {
  title: string;
  type: 'Cheat Sheet' | 'Visual Diagram' | 'Practice Code' | 'Recommended Reading';
  description: string;
  url?: string;
}

export interface GoogleWorkspaceExports {
  docsUrl?: string;
  slidesUrl?: string;
  formsUrl?: string;
  docsExportId?: string;
  slidesExportId?: string;
  formsExportId?: string;
  exportedAt?: string;
}

export interface ClassroomPack {
  id: string;
  topic: string;
  subject: string;
  grade: string;
  duration: number;
  createdAt: string;
  publishedToStudents: boolean;
  publishedAt?: string;
  researchPack: ResearchPack;
  learningObjectives: string[];
  lessonTimeline: LessonPlanItem[];
  presentation: PresentationSlide[];
  teacherBrief: TeacherBrief;
  misconceptions: Misconception[];
  classroomActivity: ClassroomActivity;
  worksheet: {
    foundation: WorksheetTier;
    standard: WorksheetTier;
    challenge: WorksheetTier;
  };
  quiz: QuizQuestion[];
  answerKey: { questionNumber: number; answer: string; explanation: string }[];
  exitTicket: ExitTicket;
  studentResources: StudentResource[];
  googleExports: GoogleWorkspaceExports;
}

export interface StudentQuizSubmission {
  id: string;
  studentId: string;
  studentName: string;
  lectureId: string;
  answers: Record<string, string>; // questionId -> chosen answer
  score: number; // 0 to 5
  totalQuestions: number;
  submittedAt: string;
}

export interface TopicMastery {
  topicName: string;
  percentage: number;
  status: 'Mastered' | 'Competent' | 'Needs Improvement' | 'Critical';
}

export interface ClassAnalytics {
  lectureId: string;
  totalStudents: number;
  submissionsCount: number;
  averageScore: number;
  topicMastery: TopicMastery[];
  weakestTopic: string;
  aiInsight: string;
  recommendedAction: string;
  revisionLessonPrompt: string;
}

export interface StudentDoubt {
  id: string;
  studentId: string;
  studentName: string;
  questionText: string;
  imageUrl?: string;
  identifiedConcepts: string[];
  relevantLecture: string;
  answerText: string;
  status: 'Resolved' | 'Pending';
  createdAt: string;
}

export interface OnlineParticipant {
  id: string;
  name: string;
  role: 'TEACHER' | 'STUDENT';
  isAudioOn: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  joinedAt: string;
  avatarBg: string;
}

export interface LiveChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'TEACHER' | 'STUDENT' | 'AI_COHOST';
  text: string;
  timestamp: string;
  isQuestion?: boolean;
  aiAnswer?: string;
}

export interface LivePollState {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  votes: Record<number, number>; // optionIndex -> count
  totalVotes: number;
  isActive: boolean;
  userVotedIndex?: number;
}

export interface OnlineClassSession {
  id: string;
  packId: string;
  topic: string;
  subject: string;
  teacherName: string;
  isLive: boolean;
  startedAt: string;
  currentSlideIndex: number;
  participants: OnlineParticipant[];
  chatMessages: LiveChatMessage[];
  activePoll: LivePollState | null;
  recordingActive: boolean;
}

export interface NextTopicRecommendation {
  id: string;
  topic: string;
  category: 'Direct Sequential' | 'Downstream Application' | 'Architecture Deep-Dive' | 'Remedial Refresher';
  reason: string;
  prerequisitesMet: string[];
  estimatedDifficulty: 'Introductory' | 'Intermediate' | 'Advanced';
  suggestedDuration: number;
  highlightIcon?: string;
}

export interface GeneratedNextDeck {
  id: string;
  topic: string;
  previousTopic: string;
  subject: string;
  instructorName: string;
  targetDuration: number;
  generatedAt: string;
  rationale: string;
  slides: PresentationSlide[];
}

