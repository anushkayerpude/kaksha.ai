'use client';

import React, { useState } from 'react';
import { useKakshaStore } from '@/lib/store';
import { Header } from '@/components/common/Header';
import { SettingsModal } from '@/components/common/SettingsModal';
import { AuthPage } from '@/components/auth/AuthPage';

// Staff Components
import { StaffDashboard } from '@/components/staff/StaffDashboard';
import { TeachingStudio } from '@/components/staff/TeachingStudio';
import { ResearchPackViewer } from '@/components/staff/ResearchPackViewer';
import { ClassroomPackViewer } from '@/components/staff/ClassroomPackViewer';
import { TeachModeModal } from '@/components/staff/TeachModeModal';
import { AnalyticsView } from '@/components/staff/AnalyticsView';

// Student Components
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { LectureStudyView } from '@/components/student/LectureStudyView';
import { StudentQuizPlayer } from '@/components/student/StudentQuizPlayer';
import { StudentAITutor } from '@/components/student/StudentAITutor';
import { DoubtSolver } from '@/components/student/DoubtSolver';

export default function Home() {
  const store = useKakshaStore();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTeachModeOpen, setIsTeachModeOpen] = useState(false);

  // Studio pre-fill state (when triggered by revision lesson)
  const [studioTopic, setStudioTopic] = useState<string>('Convolutional Neural Networks');
  const [studioInstructions, setStudioInstructions] = useState<string>(
    'Use practical examples, biological intuition, and clear sizing arithmetic.'
  );
  const [studioDuration, setStudioDuration] = useState<number>(60);

  // Tutor initial context
  const [tutorContextQuery, setTutorContextQuery] = useState<string>('');

  const handleAuthenticate = (user: any, role: any) => {
    store.setRole(role);
    setIsLoggedIn(true);
    if (role === 'STAFF') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('student-dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleStartNewLecture = () => {
    setStudioTopic('Graph Neural Networks');
    setStudioDuration(60);
    setStudioInstructions('Cover node representations, message passing, and edge embeddings.');
    setActiveTab('studio');
  };

  const handlePackGenerated = (newPack: any) => {
    store.saveNewPack(newPack);
    setActiveTab('pack');
  };

  const handleGenerateRevision = (revisionPrompt: string) => {
    setStudioTopic('Backpropagation in CNNs & Max Pooling Gradient Routing');
    setStudioDuration(15);
    setStudioInstructions(
      'Targeted remedial lesson focusing on argmax mask gradient routing, why pooling has 0 weights, and numerical worked examples.'
    );
    setActiveTab('studio');
  };

  const handleAskTutorWithContext = (contextStr: string) => {
    setTutorContextQuery(`Can you explain ${contextStr} in simple terms?`);
    setActiveTab('student-tutor');
  };

  const recentStudentScore =
    store.submissions.length > 0 ? store.submissions[0].score : undefined;

  // Render Institutional Split Landing Page if not logged in
  if (!isLoggedIn) {
    return <AuthPage onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#181c24] selection:bg-indigo-100 selection:text-indigo-900">
      {/* Universal Header with Role Switcher & Institutional Theme */}
      <Header
        role={store.role}
        setRole={(newRole) => {
          store.setRole(newRole);
          if (newRole === 'STAFF') {
            setActiveTab('dashboard');
          } else {
            setActiveTab('student-dashboard');
          }
        }}
        userName={store.currentUser.name}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetDemo={() => {
          store.resetToDemo();
          setActiveTab(store.role === 'STAFF' ? 'dashboard' : 'student-dashboard');
        }}
        onLogout={handleLogout}
        hasPublishedPack={store.activePack.publishedToStudents}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* ================= STAFF ERP FLOW ================= */}
        {store.role === 'STAFF' && (
          <>
            {activeTab === 'dashboard' && (
              <StaffDashboard
                onStartNewLecture={handleStartNewLecture}
                onViewPack={(pack) => {
                  store.setActivePack(pack);
                  setActiveTab('pack');
                }}
                onOpenAnalytics={() => setActiveTab('analytics')}
                onEnterTeachMode={() => setIsTeachModeOpen(true)}
                activePack={store.activePack}
                recentPacks={store.packsList}
                analytics={store.analytics}
              />
            )}

            {activeTab === 'studio' && (
              <div className="space-y-12">
                <TeachingStudio
                  onPackGenerated={handlePackGenerated}
                  initialTopic={studioTopic}
                  initialDuration={studioDuration}
                  initialInstructions={studioInstructions}
                  apiKey={store.apiKey}
                />
              </div>
            )}

            {activeTab === 'pack' && (
              <div className="space-y-8">
                <ClassroomPackViewer
                  pack={store.activePack}
                  onPublishToStudents={(packId) => {
                    store.publishPackToStudents(packId);
                  }}
                  onEnterTeachMode={() => setIsTeachModeOpen(true)}
                  apiKey={store.apiKey}
                />
                <ResearchPackViewer
                  researchPack={store.activePack.researchPack}
                  apiKey={store.apiKey}
                />
              </div>
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                analytics={store.analytics}
                pack={store.activePack}
                onGenerateRevision={handleGenerateRevision}
              />
            )}
          </>
        )}

        {/* ================= STUDENT ERP FLOW ================= */}
        {store.role === 'STUDENT' && (
          <>
            {activeTab === 'student-dashboard' && (
              <StudentDashboard
                student={store.currentUser}
                activePack={store.activePack}
                onNavigate={setActiveTab}
                hasSubmittedQuiz={store.submissions.length > 0}
                recentScore={recentStudentScore}
              />
            )}

            {activeTab === 'student-lecture' && (
              <LectureStudyView
                pack={store.activePack}
                onAskTutorWithContext={handleAskTutorWithContext}
              />
            )}

            {activeTab === 'student-quiz' && (
              <StudentQuizPlayer
                pack={store.activePack}
                studentId={store.currentUser.id}
                studentName={store.currentUser.name}
                onSubmitScore={(sub) => {
                  store.submitStudentQuiz(sub);
                }}
                onAskTutorWithContext={handleAskTutorWithContext}
              />
            )}

            {activeTab === 'student-tutor' && (
              <StudentAITutor
                pack={store.activePack}
                apiKey={store.apiKey}
                initialQuery={tutorContextQuery}
              />
            )}

            {activeTab === 'student-doubts' && (
              <DoubtSolver
                pack={store.activePack}
                doubts={store.doubts}
                onAddDoubt={store.addStudentDoubt}
                studentName={store.currentUser.name}
                apiKey={store.apiKey}
              />
            )}
          </>
        )}
      </main>

      {/* Live Teach Mode Modal */}
      {isTeachModeOpen && (
        <TeachModeModal
          pack={store.activePack}
          onClose={() => setIsTeachModeOpen(false)}
          apiKey={store.apiKey}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={store.apiKey}
        onSaveApiKey={store.setApiKey}
      />
    </div>
  );
}
