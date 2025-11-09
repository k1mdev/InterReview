import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface TimestampedFeedback {
  category: string;
  detail: string;
  start_time_ms: number;
  end_time_ms: number;
  transcript_segment: string;
}

interface Feedback {
  overall_feedback: string;
  timestamped_feedback: TimestampedFeedback[];
}

const msToTimestamp = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const Analysis = () => {
    const navigate = useNavigate();
  const { getSession } = useAuth();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const { attemptId } = useParams();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const feedbackContainerRef = useRef<HTMLDivElement | null>(null);
  const feedbackCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDeleteClick = async () => {
    const session = await getSession();
    const userId = session.data.session?.user.id;
    await fetch(`http://127.0.0.1:5000/api/attempt?attempt_id=${attemptId}&user_id=${userId}`, {
        method: 'DELETE'
    });
    navigate('/create');
  };

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const session = await getSession();
        const userId = session.data.session?.user.id;

        const res = await fetch(
          `http://127.0.0.1:5000/api/attempt?attempt_id=${attemptId}&user_id=${userId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const data = await res.json();
        const { question, answer, feedback, audio } = data.data;

        setAudioSrc(audio);
        setFeedback(feedback);
        setTranscript(answer);
        setQuestion(question);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchAttempt();
  }, [attemptId, getSession]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !feedback?.timestamped_feedback) return;

    const onTimeUpdate = () => {
      const currentMs = audioEl.currentTime * 1000;
      const index = feedback.timestamped_feedback.findIndex(
        (seg) =>
          currentMs >= seg.start_time_ms && currentMs <= seg.end_time_ms
      );
      setActiveIndex(index === -1 ? null : index);
    };

    audioEl.addEventListener('timeupdate', onTimeUpdate);
    return () => audioEl.removeEventListener('timeupdate', onTimeUpdate);
  }, [feedback]);

  useEffect(() => {
    if (
      activeIndex !== null &&
      feedbackCardRefs.current[activeIndex] &&
      feedbackContainerRef.current
    ) {
      const card = feedbackCardRefs.current[activeIndex];
      const container = feedbackContainerRef.current;
      const cardRect = card!.getBoundingClientRect();
      const containerRect = container!.getBoundingClientRect();

      const offset =
        cardRect.top -
        containerRect.top -
        containerRect.height / 2 +
        cardRect.height / 2;

      container.scrollBy({ top: offset, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <MainLayout>
      <div className="relative min-h-screen w-full flex flex-col items-center pt-10 pb-16 overflow-hidden bg-gradient-to-b from-white via-indigo-50 to-gray-50">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-32 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-120px] -right-40 w-96 h-96 rounded-full bg-purple-300/40 blur-3xl animate-pulse" />
        </div>

        <div className="absolute top-12 right-8">
      <Button
        onClick={handleDeleteClick}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-4 w-full"
        >
          {/* Question Card */}
          <div className="w-[70vw] max-w-5xl">
            <div className="backdrop-blur-sm bg-white/70 rounded-2xl border border-indigo-100/70 shadow-sm hover:shadow-md transition-shadow p-6">
              <p className="text-xs font-medium tracking-wide text-indigo-500 mb-2 uppercase">Question</p>
          <textarea
                className="w-full h-[14vh] resize-none bg-white/60 rounded-xl border border-indigo-100 focus:border-indigo-300 focus:ring-0 p-5 text-xl font-medium leading-snug shadow-inner"
                value={question || 'QUESTION HERE'}
                readOnly
              />
              <audio
                ref={audioRef}
                controls
                src={audioSrc || ''}
                className="mt-3 w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Transcript Card */}
          <div className="w-[72vw] max-w-5xl">
            <div className="backdrop-blur-sm bg-white/70 rounded-2xl border border-indigo-100/70 shadow-sm hover:shadow-md transition-shadow p-6">
              <p className="font-semibold mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">You responded</p>
              <textarea
                className="w-full h-[18vh] resize-none rounded-xl bg-white/60 border border-indigo-100 focus:border-indigo-300 p-5 text-sm leading-relaxed shadow-inner"
                value={("\"" + transcript + "\"") || 'Transcript'}
                readOnly
              />
            </div>
          </div>

          {/* Feedback Section */}
          {feedback && (
            <div className="w-[75vw] max-w-6xl flex flex-col items-start space-y-6">
              <p className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Timestamped Feedback</p>
              <div
                ref={feedbackContainerRef}
                className="flex flex-col w-full space-y-3 rounded-2xl p-4 h-[40vh] overflow-y-auto backdrop-blur-sm bg-white/60 border border-indigo-100/70 shadow-inner"
              >
                {feedback.timestamped_feedback.map((seg, idx) => {
                    const isActive = idx === activeIndex;
                    const isPast = activeIndex !== null && idx < activeIndex;
                    return (
                        <motion.div
                        key={idx}
                        ref={(el) => { feedbackCardRefs.current[idx] = el; }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`relative rounded-xl border px-5 py-4 transition-all duration-300 text-sm leading-snug shadow-sm ${
                            isActive
                            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-md scale-[1.015]'
                            : isPast
                            ? 'bg-white/70 border-indigo-200 text-gray-700'
                            : 'bg-white/40 border-indigo-100 hover:border-indigo-300 hover:bg-white/60'
                        }`}
                        >
                        <p
                            className={`absolute top-4 left-5 text-xs font-medium ${
                            isActive ? 'text-indigo-100' : 'text-gray-500'
                            }`}
                        >
                            {msToTimestamp(seg.start_time_ms)} – {msToTimestamp(seg.end_time_ms)}
                        </p>

                        <div className="flex justify-center">
                            <p className="font-semibold tracking-tight mt-1">
                            {seg.category}
                            </p>
                        </div>

                        <p className={`mt-2 ${isActive ? 'text-indigo-50' : 'text-gray-600'}`}>
                            {seg.detail}
                        </p>
                        <p
                            className={`italic text-xs mt-2 ${
                            isActive ? 'text-indigo-100' : 'text-gray-500'
                            }`}
                        >
                            "{seg.transcript_segment}"
                        </p>
                        </motion.div>
                    );
                })}



              </div>

              <p className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Overall Feedback</p>
              <textarea
                className="rounded-2xl border w-full h-[28vh] p-6 text-sm resize-none bg-white/70 border-indigo-100 focus:border-indigo-300 shadow-inner"
                value={feedback.overall_feedback}
                readOnly
              />
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Analysis;
