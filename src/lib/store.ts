'use client';

import { useState, useEffect } from 'react';
import { ClassroomPack, ClassAnalytics, UserProfile, UserRole, StudentQuizSubmission, StudentDoubt } from '../types';
import { demoClassroomPack, mockClassAnalytics, mockUsers } from './mockData';

const STORAGE_KEYS = {
  ACTIVE_ROLE: 'kaksha_active_role',
  ACTIVE_PACK: 'kaksha_active_pack',
  PACKS_LIST: 'kaksha_packs_list',
  QUIZ_SUBMISSIONS: 'kaksha_quiz_submissions',
  ANALYTICS: 'kaksha_class_analytics',
  DOUBTS: 'kaksha_student_doubts',
  API_KEY: 'kaksha_gemini_api_key',
};

export function useKakshaStore() {
  const [isClient, setIsClient] = useState(false);
  const [role, setRoleState] = useState<UserRole>('STAFF');
  const [activePack, setActivePackState] = useState<ClassroomPack>(demoClassroomPack);
  const [packsList, setPacksListState] = useState<ClassroomPack[]>([demoClassroomPack]);
  const [analytics, setAnalyticsState] = useState<ClassAnalytics>(mockClassAnalytics);
  const [submissions, setSubmissionsState] = useState<StudentQuizSubmission[]>([]);
  const [doubts, setDoubtsState] = useState<StudentDoubt[]>([
    {
      id: 'doubt-1',
      studentId: 'student-aryan',
      studentName: 'Aryan Verma',
      questionText: 'How does backpropagation route gradients through a Max Pooling layer if pooling has no weights?',
      identifiedConcepts: ['Backpropagation', 'Max Pooling Argmax Mask', 'Gradient Routing'],
      relevantLecture: 'Convolutional Neural Networks (Slide 8 & 12)',
      answerText:
        'During the forward pass, Max Pooling saves an "argmax switch mask" noting which coordinate had the highest value. In the backward pass, incoming gradients flow 100% to that winning coordinate, and 0% to the other 3 coordinates.',
      status: 'Resolved',
      createdAt: '2026-09-22T10:30:00Z',
    },
  ]);
  const [apiKey, setApiKeyState] = useState<string>('');

  // Hydrate from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedRole = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as UserRole | null;
      if (savedRole) setRoleState(savedRole);

      const savedPack = localStorage.getItem(STORAGE_KEYS.ACTIVE_PACK);
      if (savedPack) setActivePackState(JSON.parse(savedPack));

      const savedPacksList = localStorage.getItem(STORAGE_KEYS.PACKS_LIST);
      if (savedPacksList) setPacksListState(JSON.parse(savedPacksList));

      const savedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      if (savedAnalytics) setAnalyticsState(JSON.parse(savedAnalytics));

      const savedSubs = localStorage.getItem(STORAGE_KEYS.QUIZ_SUBMISSIONS);
      if (savedSubs) setSubmissionsState(JSON.parse(savedSubs));

      const savedDoubts = localStorage.getItem(STORAGE_KEYS.DOUBTS);
      if (savedDoubts) setDoubtsState(JSON.parse(savedDoubts));

      const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
      if (savedKey) setApiKeyState(savedKey);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, newRole);
    }
  };

  const setActivePack = (pack: ClassroomPack) => {
    setActivePackState(pack);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PACK, JSON.stringify(pack));
    }
  };

  const saveNewPack = (pack: ClassroomPack) => {
    const updated = [pack, ...packsList.filter((p) => p.id !== pack.id)];
    setPacksListState(updated);
    setActivePackState(pack);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PACKS_LIST, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PACK, JSON.stringify(pack));
    }
  };

  const publishPackToStudents = (packId: string) => {
    const updatedPack = {
      ...activePack,
      publishedToStudents: true,
      publishedAt: new Date().toISOString(),
    };
    setActivePackState(updatedPack);
    const updatedList = packsList.map((p) => (p.id === packId ? updatedPack : p));
    setPacksListState(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PACK, JSON.stringify(updatedPack));
      localStorage.setItem(STORAGE_KEYS.PACKS_LIST, JSON.stringify(updatedList));
    }
  };

  const submitStudentQuiz = (submission: StudentQuizSubmission) => {
    const updated = [submission, ...submissions];
    setSubmissionsState(updated);

    // Dynamically update class analytics
    const newCount = analytics.submissionsCount + 1;
    const newAvg = Number(((analytics.averageScore * analytics.submissionsCount + submission.score) / newCount).toFixed(2));
    const updatedAnalytics: ClassAnalytics = {
      ...analytics,
      submissionsCount: newCount,
      averageScore: newAvg,
    };
    setAnalyticsState(updatedAnalytics);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.QUIZ_SUBMISSIONS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(updatedAnalytics));
    }
  };

  const addStudentDoubt = (doubt: StudentDoubt) => {
    const updated = [doubt, ...doubts];
    setDoubtsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(updated));
    }
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    }
  };

  const resetToDemo = () => {
    setActivePackState(demoClassroomPack);
    setPacksListState([demoClassroomPack]);
    setAnalyticsState(mockClassAnalytics);
    setSubmissionsState([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PACK, JSON.stringify(demoClassroomPack));
      localStorage.setItem(STORAGE_KEYS.PACKS_LIST, JSON.stringify([demoClassroomPack]));
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(mockClassAnalytics));
      localStorage.setItem(STORAGE_KEYS.QUIZ_SUBMISSIONS, JSON.stringify([]));
    }
  };

  const currentUser: UserProfile = role === 'STAFF' ? mockUsers[0] : mockUsers[1];

  return {
    isClient,
    role,
    setRole,
    currentUser,
    activePack,
    setActivePack,
    packsList,
    saveNewPack,
    publishPackToStudents,
    analytics,
    setAnalyticsState,
    submissions,
    submitStudentQuiz,
    doubts,
    addStudentDoubt,
    apiKey,
    setApiKey,
    resetToDemo,
  };
}
