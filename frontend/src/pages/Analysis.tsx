import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

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
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 space-y-6">
        <div className="flex flex-col items-center">
            <Button
          onClick={() => handleDeleteClick()}
          className="absolute right-8 top-4 bg-red-500 hover:bg-red-600 text-white"
        >
          Delete
        </Button>
          <textarea
            className="rounded-2xl border-2 w-[45vw] h-[13vh] p-7 text-2xl resize-none"
            value={question || 'QUESTION HERE'}
            readOnly
          />
          <audio ref={audioRef} controls src={audioSrc || ''} className="p-2" />
        </div>

        <div className="mb-4 w-[55vw]">
          <p className="font-semibold mb-2">You responded:</p>
          <i><textarea
            className="text-center w-full p-7 text-sm resize-none"
            value={("\"" + transcript + "\"") || 'Transcript'}
            readOnly
          /></i>
        </div>

        {feedback && (
          <div className="w-[65vw] flex flex-col items-start space-y-3">
            <p className="font-semibold text-lg">Timestamped Feedback</p>
            <div
              ref={feedbackContainerRef}
              className="flex flex-col w-full space-y-2 border rounded-2xl p-3 h-[35vh] overflow-y-auto bg-gray-50"
            >
              {feedback.timestamped_feedback.map((seg, idx) => {
                const isActive = idx === activeIndex;
                const isPast = activeIndex !== null && idx < activeIndex;
                return (
                  <div
                    key={idx}
                    ref={(el) => (feedbackCardRefs.current[idx] = el)}
                    className={`border rounded-2xl p-4 transition-all duration-300 ${
                      isActive
                        ? 'bg-green-50 border-green-200'
                        : isPast
                        ? 'bg-gray-100 border-gray-300 opacity-90'
                        : 'bg-white border-gray-200 opacity-70'
                    }`}
                  >
                    <p className="font-semibold">{seg.category}</p>
                    <p className="text-sm mt-1">{seg.detail}</p>
                    <p className="italic text-xs mt-2 text-gray-600">
                      “{seg.transcript_segment}”
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="font-semibold text-lg mt-6">Overall Feedback</p>
            <textarea
              className="rounded-2xl border-2 w-full h-[25vh] p-7 text-sm resize-none bg-white"
              value={feedback.overall_feedback}
              readOnly
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Analysis;
