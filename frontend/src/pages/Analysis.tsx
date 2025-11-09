import { useAuth } from '@/auth/AuthProvider';
import MainLayout from '@/layouts/MainLayout'
import React, { useEffect, useState } from 'react'

const Analysis = () => {
  const { getSession } = useAuth();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);


  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const session = await getSession();
        const userId = session.data.session?.user.id;
        const params = new URLSearchParams({ attempt_id: attemptId });
        const res = await fetch(`http://127.0.0.1:5000/api/attempt${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        const {
          attempt_id,
          question,
          answer,
          feedback,
          user_id,
          created,
          audio
        } = data;

        const base64String = audio.audioBase64;
        const src = `data:audio/mp3;base64,${base64String}`;
        setAudioSrc(src);
        setFeedback(feedback)
        setTranscript(answer)
      } catch (err) {
        console.error("Failed to fetch audio:", err);
      }
    };
    fetchAttempt();
  }, []);

  return (
    <>
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen pt-[25vh]">
          <span className='absolute top-1/18 flex flex-col items-center p-0 m-0'>
            <textarea className='rounded-2xl border-2 w-[45vw] h-[13vh] p-7 text-2xl resize-none' defaultValue="QUESTION HERE" readOnly />
            <audio className='p-2' controls src={audioSrc} />
          </span>

          <div className='mb-4'>
            <p>You responded:</p>
            <textarea className='rounded-2xl border-2 w-[55vw] h-[20vh] p-7 text-sm resize-none' defaultValue={transcript ? transcript : 'Transcript'} readOnly />
          </div>

          <textarea className='rounded-2xl border-2 w-[65vw] h-[40vh] p-7 text-sm resize-none' defaultValue={"HIGHLIGHTS HERE"} readOnly />
        </div>


      </MainLayout>
    </>)
}

export default Analysis
