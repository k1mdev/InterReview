import React, { useRef, useState } from 'react';
import { IconMicrophone, IconPlayerStop, IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate } from 'react-router';

const padnum = (x: number, space: number) => String(x).padStart(space, "0");

export default function Recorder({ title }: { title: string }) {
  const { getSession } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedURL, setRecordedURL] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const navigate = useNavigate();

  const startRecording = async () => {
    setRecordedURL('');
    setIsRecording(true);
    setSeconds(0);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStream.current = stream;
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        chunks.current.push(e.data);
      }
    };

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 10);

    mediaRecorder.current.onstop = () => {
      const recordedBlob = new Blob(chunks.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(recordedBlob);
      setRecordedURL(url);

      chunks.current = [];
      clearInterval(timer);
    };

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaStream.current?.getTracks().forEach(track => track.stop());
    }
  };

  const submitAudio = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(recordedURL);
      const blob = await response.blob();
      const session = await getSession();

      const formData = new FormData();
      formData.append('file', blob, 'response.wav');
      formData.append('question', title);
      formData.append('user_id', session.data.session?.user.id!);

      const res = await fetch('http://127.0.0.1:5000/api/attempt', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        navigate(`/analysis/${data.data.attempt_id}`);
      } else {
        setError('An error occurred while submitting your response.');
      }
    } catch (err) {
      setError('An error occurred while submitting your response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {isRecording ? (
        <div>
          <div className='text-5xl font-mono'>
            {`${padnum(Math.floor(seconds / 6000), 2)}:${padnum(Math.floor(seconds / 100 % 60), 2)}:${padnum(seconds % 100, 2)}`}
          </div>
          <Button
            variant="secondary"
            onClick={stopRecording}
          >
            <IconPlayerStop /> Stop Recording
          </Button>
        </div>
      ) : (
        <div className='flex items-center justify-center'>
          <Button
            variant="default"
            onClick={startRecording}
          >
            {recordedURL ? 'Re-' : ''}Record Your Response
            <IconMicrophone />
          </Button>
        </div>
      )}

      {recordedURL && (
        <>
          <audio className='p-2' controls src={recordedURL} />
          <Button
            variant="secondary"
            onClick={submitAudio}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <IconLoader2 className="animate-spin mr-2" /> Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
          {error && (
            <div className="text-red-500 mt-2 text-sm">{error}</div>
          )}
        </>
      )}
    </div>
  );
}
