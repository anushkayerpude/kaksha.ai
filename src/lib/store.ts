'use client';

import { useState, useEffect } from 'react';
import {
  ClassroomPack,
  ClassAnalytics,
  UserProfile,
  UserRole,
  StudentQuizSubmission,
  StudentDoubt,
  OnlineClassSession,
  OnlineParticipant,
  LiveChatMessage,
  LivePollState,
} from '../types';
import { demoClassroomPack, mockClassAnalytics, mockUsers } from './mockData';
import {
  savePackToFirestore,
  fetchPacksFromFirestore,
  submitQuizToFirestore,
} from './firebase';

const STORAGE_KEYS = {
  ACTIVE_ROLE: 'kaksha_active_role',
  ACTIVE_PACK: 'kaksha_active_pack',
  PACKS_LIST: 'kaksha_packs_list',
  QUIZ_SUBMISSIONS: 'kaksha_quiz_submissions',
  ANALYTICS: 'kaksha_class_analytics',
  DOUBTS: 'kaksha_student_doubts',
  API_KEY: 'kaksha_gemini_api_key',
  ONLINE_SESSION: 'kaksha_online_session',
  USER_PROFILE: 'kaksha_user_profile',
};

export function useKakshaStore() {
  const [isClient, setIsClient] = useState(false);
  const [role, setRoleState] = useState<UserRole>('STAFF');
  const [activePack, setActivePackState] = useState<ClassroomPack>(demoClassroomPack);
  const [packsList, setPacksListState] = useState<ClassroomPack[]>([demoClassroomPack]);
  const [analytics, setAnalyticsState] = useState<ClassAnalytics>(mockClassAnalytics);
  const [submissions, setSubmissionsState] = useState<StudentQuizSubmission[]>([]);
  const [onlineSession, setOnlineSessionState] = useState<OnlineClassSession | null>(null);
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
  const [customUser, setCustomUserState] = useState<UserProfile | null>(null);

  // Hydrate from localStorage and sync Cloud Firestore on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (savedUser) {
        try {
          setCustomUserState(JSON.parse(savedUser));
        } catch (e) {}
      }

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

    // Pull shared Cloud Firestore packs
    fetchPacksFromFirestore()
      .then((cloudPacks) => {
        if (cloudPacks && cloudPacks.length > 0) {
          setPacksListState((prev) => {
            const map = new Map<string, ClassroomPack>();
            [...cloudPacks, ...prev].forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
          });
          const latestPublished = cloudPacks.find((p) => p.publishedToStudents);
          if (latestPublished) {
            setActivePackState(latestPublished);
          }
        }
      })
      .catch((e) => console.log('[Firebase] Local sync active:', e?.message));
  }, []);

  const setCurrentUser = (user: UserProfile | null) => {
    setCustomUserState(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      }
    }
  };

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
    // Cloud Firestore synchronization
    savePackToFirestore(pack);
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
    // Cloud Firestore synchronization
    savePackToFirestore(updatedPack);
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
    // Cloud Firestore synchronization
    submitQuizToFirestore(submission);
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

  const startOnlineClass = (pack: ClassroomPack) => {
    const initialParticipants: OnlineParticipant[] = [
      {
        id: 'user-yerpude',
        name: 'Dr. Anushka Yerpude',
        role: 'TEACHER',
        isAudioOn: true,
        isVideoOn: true,
        isHandRaised: false,
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarBg: 'bg-[#881337]',
      },
      {
        id: 'user-aryan',
        name: 'Aryan Verma',
        role: 'STUDENT',
        isAudioOn: false,
        isVideoOn: true,
        isHandRaised: false,
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarBg: 'bg-[#0d9488]',
      },
      {
        id: 'user-priya',
        name: 'Priya Patel',
        role: 'STUDENT',
        isAudioOn: false,
        isVideoOn: false,
        isHandRaised: false,
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarBg: 'bg-indigo-600',
      },
      {
        id: 'user-rohan',
        name: 'Rohan Mehta',
        role: 'STUDENT',
        isAudioOn: false,
        isVideoOn: true,
        isHandRaised: false,
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarBg: 'bg-amber-600',
      },
      {
        id: 'user-sneha',
        name: 'Sneha Joshi',
        role: 'STUDENT',
        isAudioOn: false,
        isVideoOn: true,
        isHandRaised: false,
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarBg: 'bg-emerald-600',
      },
    ];

    const initialMessages: LiveChatMessage[] = [
      {
        id: 'chat-1',
        senderId: 'user-yerpude',
        senderName: 'Dr. Anushka Yerpude',
        senderRole: 'TEACHER',
        text: `Welcome everyone to our live online lecture on "${pack.topic}"! Please let me know in the chat if slides and audio are clear.`,
        timestamp: '10:00 AM',
      },
      {
        id: 'chat-2',
        senderId: 'user-aryan',
        senderName: 'Aryan Verma',
        senderRole: 'STUDENT',
        text: 'Good morning Professor! Audio and slides are crystal clear.',
        timestamp: '10:01 AM',
      },
      {
        id: 'chat-3',
        senderId: 'ai-cohost',
        senderName: 'Kaksha AI Co-Host',
        senderRole: 'AI_COHOST',
        text: '👋 AI Co-Host is active. I will summarize chat questions and provide quick formula references during the lecture.',
        timestamp: '10:01 AM',
      },
    ];

    const newSession: OnlineClassSession = {
      id: `session-${Date.now()}`,
      packId: pack.id,
      topic: pack.topic,
      subject: pack.subject,
      teacherName: 'Dr. Anushka Yerpude',
      isLive: true,
      startedAt: new Date().toISOString(),
      currentSlideIndex: 0,
      participants: initialParticipants,
      chatMessages: initialMessages,
      activePoll: null,
      recordingActive: true,
    };

    setOnlineSessionState(newSession);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ONLINE_SESSION, JSON.stringify(newSession));
    }
    return newSession;
  };

  const endOnlineClass = () => {
    if (onlineSession) {
      const endedSession = { ...onlineSession, isLive: false, recordingActive: false };
      setOnlineSessionState(endedSession);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ONLINE_SESSION, JSON.stringify(endedSession));
      }
    }
  };

  const setOnlineSlide = (index: number) => {
    if (onlineSession) {
      const updated = { ...onlineSession, currentSlideIndex: index };
      setOnlineSessionState(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ONLINE_SESSION, JSON.stringify(updated));
      }
    }
  };

  const sendOnlineChatMessage = async (text: string, isQuestion = false) => {
    if (!onlineSession) return;
    const user = currentUser;
    const newMsg: LiveChatMessage = {
      id: `chat-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role === 'STAFF' ? 'TEACHER' : 'STUDENT',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuestion,
    };

    const updatedMessages = [...onlineSession.chatMessages, newMsg];
    const updatedSession = { ...onlineSession, chatMessages: updatedMessages };
    setOnlineSessionState(updatedSession);

    // If student asked a question, trigger AI Co-Host reply
    if (isQuestion || text.includes('?')) {
      setTimeout(() => {
        const aiReplyText = `💡 [AI Co-Host]: Great question on "${text.slice(0, 45)}"! Slide ${onlineSession.currentSlideIndex + 1} explains that ${activePack.teacherBrief.coreConcepts[0] || 'the governing principle'} directly regulates this parameter.`;
        const aiMsg: LiveChatMessage = {
          id: `ai-${Date.now()}`,
          senderId: 'ai-cohost',
          senderName: 'Kaksha AI Co-Host',
          senderRole: 'AI_COHOST',
          text: aiReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setOnlineSessionState((prev) => (prev ? { ...prev, chatMessages: [...prev.chatMessages, aiMsg] } : null));
      }, 1000);
    }
  };

  const launchLivePoll = (question: string, options: string[], correctAnswer?: string) => {
    if (!onlineSession) return;
    const newPoll: LivePollState = {
      id: `poll-${Date.now()}`,
      question,
      options,
      correctAnswer,
      votes: { 0: 1, 1: 3, 2: 0, 3: 0 },
      totalVotes: 4,
      isActive: true,
    };
    const updated = { ...onlineSession, activePoll: newPoll };
    setOnlineSessionState(updated);
  };

  const voteInPoll = (optionIndex: number) => {
    if (!onlineSession || !onlineSession.activePoll) return;
    const poll = onlineSession.activePoll;
    if (poll.userVotedIndex !== undefined) return;
    const newVotes = {
      ...poll.votes,
      [optionIndex]: (poll.votes[optionIndex] || 0) + 1,
    };
    const updatedPoll: LivePollState = {
      ...poll,
      votes: newVotes,
      totalVotes: poll.totalVotes + 1,
      userVotedIndex: optionIndex,
    };
    setOnlineSessionState({ ...onlineSession, activePoll: updatedPoll });
  };

  const toggleHandRaise = (studentId: string) => {
    if (!onlineSession) return;
    const updatedParticipants = onlineSession.participants.map((p) =>
      p.id === studentId ? { ...p, isHandRaised: !p.isHandRaised } : p
    );
    setOnlineSessionState({ ...onlineSession, participants: updatedParticipants });
  };

  const resetToDemo = () => {
    setActivePackState(demoClassroomPack);
    setPacksListState([demoClassroomPack]);
    setAnalyticsState(mockClassAnalytics);
    setSubmissionsState([]);
    setOnlineSessionState(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PACK, JSON.stringify(demoClassroomPack));
      localStorage.setItem(STORAGE_KEYS.PACKS_LIST, JSON.stringify([demoClassroomPack]));
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(mockClassAnalytics));
      localStorage.setItem(STORAGE_KEYS.QUIZ_SUBMISSIONS, JSON.stringify([]));
      localStorage.removeItem(STORAGE_KEYS.ONLINE_SESSION);
    }
  };

  const currentUser: UserProfile = customUser || (role === 'STAFF' ? mockUsers[0] : mockUsers[1]);

  return {
    isClient,
    role,
    setRole,
    currentUser,
    setCurrentUser,
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
    onlineSession,
    isOnlineClassActive: !!onlineSession?.isLive,
    startOnlineClass,
    endOnlineClass,
    setOnlineSlide,
    sendOnlineChatMessage,
    launchLivePoll,
    voteInPoll,
    toggleHandRaise,
  };
}
