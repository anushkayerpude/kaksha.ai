'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClassroomPack, OnlineClassSession, UserProfile } from '@/types';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Hand,
  MessageSquare,
  Users,
  BarChart2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  CheckCircle2,
  Smile,
  Clock,
  Download,
  FileText,
  Radio,
  BookOpen
} from 'lucide-react';

interface OnlineClassRoomProps {
  pack: ClassroomPack;
  session: OnlineClassSession;
  currentUser: UserProfile;
  onClose: () => void;
  onEndClass: () => void;
  onSlideChange: (index: number) => void;
  onSendMessage: (text: string, isQuestion?: boolean) => void;
  onLaunchPoll: (question: string, options: string[], correctAnswer?: string) => void;
  onVotePoll: (optionIndex: number) => void;
  onToggleHandRaise: (studentId: string) => void;
  apiKey?: string;
}

export const OnlineClassRoom: React.FC<OnlineClassRoomProps> = ({
  pack,
  session,
  currentUser,
  onClose,
  onEndClass,
  onSlideChange,
  onSendMessage,
  onLaunchPoll,
  onVotePoll,
  onToggleHandRaise,
  apiKey,
}) => {
  const isTeacher = currentUser.role === 'STAFF';

  // Video and Audio Hardware States
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Classroom Navigation & Sidebars
  const [activeTab, setActiveTab] = useState<'chat' | 'poll' | 'roster'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Live Timer
  const [secondsElapsed, setSecondsElapsed] = useState(120); // starts with 2 mins elapsed
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Attempt real camera stream, fallback gracefully if permissions denied
  useEffect(() => {
    let active = true;
    async function initCamera() {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && isVideoOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: isAudioOn,
          });
          if (active) {
            mediaStreamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setCameraError(false);
          }
        } catch (err) {
          console.warn('[OnlineClass] Camera permission denied or not found. Falling back to avatar presentation stream.', err);
          if (active) setCameraError(true);
        }
      }
    }

    if (isVideoOn) {
      initCamera();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    }

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isVideoOn, isAudioOn]);

  // Screen Sharing
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = stream;
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = stream;
          }
          setIsScreenSharing(true);
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
        }
      } catch (e) {
        console.warn('Screen share cancelled', e);
      }
    }
  };

  // Trigger floating reaction
  const triggerReaction = (emoji: string) => {
    const newId = `reaction-${Date.now()}-${Math.random()}`;
    const x = Math.random() * 60 + 20; // 20% to 80% width
    setFloatingReactions((prev) => [...prev, { id: newId, emoji, x }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newId));
    }, 2500);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim(), chatInput.includes('?'));
    setChatInput('');
  };

  const currentSlide = pack.presentation[session.currentSlideIndex] || pack.presentation[0];
  const myParticipant = session.participants.find((p) => p.id === currentUser.id);

  // Download Attendance CSV
  const handleDownloadAttendanceCSV = () => {
    const headers = 'Student Name,Role,Status,Join Time\n';
    const rows = session.participants
      .map((p) => `"${p.name}","${p.role}","Present","${p.joinedAt}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${pack.topic.replace(/[^a-z0-9]/gi, '_')}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden animate-fade-in">
      {/* ================= 1. Top Online Class Bar ================= */}
      <div className="h-16 px-4 sm:px-6 bg-[#161b22] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            <span>Live Class</span>
          </div>

          <span className="text-white/20">|</span>

          <div>
            <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {pack.topic}
            </h2>
            <p className="text-[11px] text-slate-400">
              Instructor: <strong className="text-amber-300 font-semibold">{session.teacherName}</strong> • {pack.subject}
            </p>
          </div>
        </div>

        {/* Center Live Badge & Timer */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold">REC</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>{session.participants.length} Present</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isTeacher ? (
            <button
              onClick={() => setShowSummaryModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End Online Class</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-all"
            >
              <span>Leave Class</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= 2. Main Classroom Theatre Stage ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left/Center Presentation Screen & Video Stream */}
        <div className="flex-1 flex flex-col bg-[#070a0f] relative overflow-hidden">
          {/* Floating Reactions Container */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {floatingReactions.map((r) => (
              <div
                key={r.id}
                style={{ left: `${r.x}%` }}
                className="absolute bottom-16 text-3xl animate-float-up pointer-events-none"
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Screen Content: Slides or Screen Share */}
          <div className="flex-1 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
            {isScreenSharing ? (
              <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center relative shadow-2xl">
                <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Teacher Screen Share Active</span>
                </div>
              </div>
            ) : (
              /* Synchronized Presentation Slide Projection */
              <div className="w-full h-full max-w-5xl rounded-3xl bg-[#fbf9f5] text-slate-900 border border-[#e6dfd5] shadow-2xl flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden transition-all">
                {/* Slide Header */}
                <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#881337] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {currentSlide.slideNumber}
                    </span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {currentSlide.title}
                      </h3>
                      {currentSlide.subtitle && (
                        <p className="text-xs text-slate-500">{currentSlide.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono font-bold">
                    Slide {session.currentSlideIndex + 1} of {pack.presentation.length}
                  </span>
                </div>

                {/* Slide Body */}
                <div className="my-auto py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <ul className="space-y-3">
                      {currentSlide.bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-800 leading-relaxed font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#0d9488] mt-2 shrink-0" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Diagram Box */}
                  <div className="p-5 rounded-2xl bg-white border border-[#e6dfd5] shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#0d9488]" />
                      <span>Classroom Visual Concept</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] text-xs font-mono text-slate-700 leading-relaxed italic">
                      &quot;{currentSlide.visualPrompt}&quot;
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Synchronized live across all connected student desks.
                    </p>
                  </div>
                </div>

                {/* Slide Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#e6dfd5] text-xs text-slate-500">
                  <span>Kaksha.ai Live Online Classroom</span>
                  <span>{pack.topic} • {pack.subject}</span>
                </div>
              </div>
            )}

            {/* Teacher Picture-in-Picture Webcam Box */}
            <div className="absolute bottom-6 right-6 w-44 sm:w-56 h-32 sm:h-40 rounded-2xl bg-[#161b22] border-2 border-teal-500/60 shadow-2xl overflow-hidden z-20 flex flex-col">
              {isVideoOn && !cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                /* Animated Professor Avatar Fallback */
                <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-b from-[#881337] to-[#4c0519] text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-lg mb-1 shadow-inner">
                    AY
                  </div>
                  <p className="text-xs font-bold truncate max-w-[140px]">Dr. Anushka Yerpude</p>
                  <p className="text-[10px] text-amber-200">Instructor (Host)</p>
                  {/* Audio Waveform animation */}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              {/* Status Banner */}
              <div className="absolute bottom-0 inset-x-0 p-1.5 bg-black/70 backdrop-blur-sm text-[10px] flex items-center justify-between font-bold text-white px-2.5">
                <span className="truncate max-w-[120px]">Dr. Yerpude</span>
                <span className="text-emerald-400">● Speaking</span>
              </div>
            </div>
          </div>

          {/* Bottom Live Control Toolbar */}
          <div className="h-18 px-6 bg-[#161b22] border-t border-white/10 flex items-center justify-between shrink-0">
            {/* Media Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3 rounded-2xl border transition-all ${
                  isAudioOn
                    ? 'bg-slate-800 text-white border-white/10 hover:bg-slate-700'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                }`}
                title={isAudioOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-2xl border transition-all ${
                  isVideoOn
                    ? 'bg-slate-800 text-white border-white/10 hover:bg-slate-700'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                }`}
                title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              {isTeacher && (
                <button
                  onClick={handleToggleScreenShare}
                  className={`p-3 rounded-2xl border transition-all ${
                    isScreenSharing
                      ? 'bg-[#0d9488] text-white border-[#0d9488]'
                      : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                  }`}
                  title="Share Screen"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              )}

              {/* Student Raise Hand Toggle */}
              {!isTeacher && (
                <button
                  onClick={() => onToggleHandRaise(currentUser.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                    myParticipant?.isHandRaised
                      ? 'bg-amber-500 text-amber-950 border-amber-400 shadow-md animate-bounce'
                      : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{myParticipant?.isHandRaised ? 'Hand Raised!' : 'Raise Hand'}</span>
                </button>
              )}
            </div>

            {/* Slide Navigation (For Teacher or Presenter) */}
            {isTeacher && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSlideChange(Math.max(0, session.currentSlideIndex - 1))}
                  disabled={session.currentSlideIndex === 0}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-white/10 text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono font-bold text-slate-300 px-2">
                  {session.currentSlideIndex + 1} / {pack.presentation.length}
                </span>

                <button
                  onClick={() => onSlideChange(Math.min(pack.presentation.length - 1, session.currentSlideIndex + 1))}
                  disabled={session.currentSlideIndex === pack.presentation.length - 1}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-white/10 text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowNotesDrawer(!showNotesDrawer)}
                  className={`ml-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    showNotesDrawer ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-white/10'
                  }`}
                >
                  Notes
                </button>
              </div>
            )}

            {/* Floating Reactions Bar */}
            <div className="flex items-center gap-1.5">
              {['💡', '👏', '❓', '🚀', '❤️'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerReaction(emoji)}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-base flex items-center justify-center transition-transform hover:scale-125 active:scale-95"
                  title="Send reaction"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 3. Right Interactive Classroom HUD ================= */}
        <div className="w-full lg:w-96 bg-[#161b22] border-l border-white/10 flex flex-col shrink-0">
          {/* HUD Tabs */}
          <div className="flex items-center border-b border-white/10 p-2 gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                activeTab === 'chat'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('poll')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                activeTab === 'poll'
                  ? 'bg-slate-800 text-[#0d9488] shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Live Poll</span>
              {session.activePoll?.isActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                activeTab === 'roster'
                  ? 'bg-slate-800 text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students ({session.participants.length})</span>
            </button>
          </div>

          {/* Tab 1: Live Chat & AI Co-Host */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {session.chatMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  const isAI = msg.senderRole === 'AI_COHOST';
                  const isTeacherMsg = msg.senderRole === 'TEACHER';

                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl space-y-1 transition-all ${
                        isAI
                          ? 'bg-teal-950/50 border border-teal-500/30 text-teal-100'
                          : isTeacherMsg
                          ? 'bg-[#881337]/20 border border-[#881337]/40 text-rose-100'
                          : isMe
                          ? 'bg-slate-800 border border-white/10 text-white ml-4'
                          : 'bg-black/30 border border-white/5 text-slate-200 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold opacity-80">
                        <span className={isAI ? 'text-[#0d9488]' : isTeacherMsg ? 'text-rose-300' : 'text-slate-400'}>
                          {msg.senderName} {isAI && '🤖'}
                        </span>
                        <span className="font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask question or message class..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0d9488]"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Live In-Class Polling */}
          {activeTab === 'poll' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-5 text-xs">
              {session.activePoll ? (
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      Live In-Class Checkpoint
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {session.activePoll.totalVotes} Votes
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    {session.activePoll.question}
                  </h4>

                  {/* Poll Options with Live Percentage Bars */}
                  <div className="space-y-2">
                    {session.activePoll.options.map((opt, i) => {
                      const votes = session.activePoll?.votes[i] || 0;
                      const pct = session.activePoll?.totalVotes
                        ? Math.round((votes / session.activePoll.totalVotes) * 100)
                        : 0;
                      const hasVotedThis = session.activePoll?.userVotedIndex === i;

                      return (
                        <button
                          key={i}
                          disabled={session.activePoll?.userVotedIndex !== undefined}
                          onClick={() => onVotePoll(i)}
                          className={`w-full p-3 rounded-xl border text-left relative overflow-hidden transition-all ${
                            hasVotedThis
                              ? 'bg-[#0d9488]/30 border-[#0d9488] text-white font-bold'
                              : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/30'
                          }`}
                        >
                          <div
                            style={{ width: `${pct}%` }}
                            className="absolute inset-y-0 left-0 bg-[#0d9488]/20 transition-all duration-500"
                          />
                          <div className="relative z-10 flex items-center justify-between">
                            <span>{opt}</span>
                            <span className="font-mono font-bold text-xs">{pct}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-white/5 text-center space-y-3">
                  <BarChart2 className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-xs">No active poll right now.</p>
                  {isTeacher && (
                    <button
                      onClick={() => {
                        const firstQuiz = pack.quiz[0];
                        onLaunchPoll(
                          firstQuiz?.question || `Do you understand Slide ${session.currentSlideIndex + 1}?`,
                          firstQuiz?.options || ['A. Fully Understood', 'B. Need Another Example', 'C. Have a Doubt', 'D. Completely Lost'],
                          firstQuiz?.correctAnswer
                        );
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      🚀 Push Quiz Question 1 Live
                    </button>
                  )}
                </div>
              )}

              {/* Teacher Quick Poll Templates */}
              {isTeacher && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick Poll Triggers for Dr. Yerpude:
                  </p>
                  <button
                    onClick={() =>
                      onLaunchPoll(
                        `How confident are you with ${pack.teacherBrief.coreConcepts[0] || pack.topic}?`,
                        ['1. Exam Ready (100%)', '2. Understand Concept (75%)', '3. A bit hazy (50%)', '4. Need Recap (25%)']
                      )
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-left border border-white/5 transition-all text-xs font-medium"
                  >
                    📊 Check Concept Confidence
                  </button>
                  <button
                    onClick={() =>
                      onLaunchPoll(
                        `True or False: ${pack.misconceptions[0]?.belief || 'Pooling layers contain learnable weights'}?`,
                        ['A. True', 'B. False (It is a common exam trap!)'],
                        'B'
                      )
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-left border border-white/5 transition-all text-xs font-medium"
                  >
                    ⚠️ Launch Misconception True/False
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Attendance & Class Roster */}
          {activeTab === 'roster' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">
                  Enrolled Students ({session.participants.length})
                </span>
                {isTeacher && (
                  <button
                    onClick={handleDownloadAttendanceCSV}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#0d9488] hover:underline"
                  >
                    <Download className="w-3 h-3" />
                    CSV Export
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {session.participants.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${p.avatarBg} text-white flex items-center justify-center font-bold text-xs`}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white leading-tight">{p.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{p.role.toLowerCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.isHandRaised && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                          <Hand className="w-3 h-3" /> Hand
                        </span>
                      )}
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= 4. Teacher Speaker Notes Drawer ================= */}
      {showNotesDrawer && isTeacher && (
        <div className="fixed bottom-20 left-6 z-40 w-96 p-5 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-2 text-slate-200 text-xs animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 uppercase text-[10px]">
              Dr. Yerpude&apos;s Presenter Notes (Slide {session.currentSlideIndex + 1})
            </span>
            <button onClick={() => setShowNotesDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <p className="leading-relaxed">{currentSlide.presenterNotes}</p>
        </div>
      )}

      {/* ================= 5. End Class Summary & Attendance Modal ================= */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#faf8f5] text-slate-900 rounded-3xl p-6 sm:p-8 border border-[#e6dfd5] shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Online Class Concluded</h3>
              <p className="text-xs text-slate-600">
                Lecture on &quot;{pack.topic}&quot; completed successfully with full attendance.
              </p>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#e6dfd5] text-center">
                <p className="text-[10px] uppercase font-bold text-slate-500">Duration</p>
                <p className="text-lg font-black text-slate-900">{formatTimer(secondsElapsed)}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#e6dfd5] text-center">
                <p className="text-[10px] uppercase font-bold text-slate-500">Attendance</p>
                <p className="text-lg font-black text-emerald-600">
                  {session.participants.length} / {session.participants.length} (100%)
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#e6dfd5] text-center">
                <p className="text-[10px] uppercase font-bold text-slate-500">Poll Responses</p>
                <p className="text-lg font-black text-[#0d9488]">
                  {session.activePoll?.totalVotes || 4}
                </p>
              </div>
            </div>

            {/* Auto-Generated AI Recap for Students */}
            <div className="p-4 rounded-2xl bg-[#f5f2eb] border border-[#e6dfd5] space-y-2 text-xs">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
                Auto-Generated Lecture Recap (Pushed to Absent Students):
              </p>
              <p className="text-slate-700 leading-relaxed">
                &quot;In today&apos;s online class, Dr. Yerpude covered {pack.topic} with emphasis on {pack.teacherBrief.coreConcepts[0]}. Students completed a live checkpoint poll with 85% mastery. Homework worksheet is available on the Student Desk.&quot;
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleDownloadAttendanceCSV}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#d4cbbe] text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <Download className="w-3.5 h-3.5" />
                Download Attendance (.csv)
              </button>
              <button
                onClick={() => {
                  onEndClass();
                  setShowSummaryModal(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#881337] hover:bg-[#9f1239] text-white text-xs font-bold shadow-sm"
              >
                Done & Return to ERP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
