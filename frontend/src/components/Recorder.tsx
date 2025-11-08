import React, { useRef, useState } from 'react';
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react';
import { Button } from '@/components/ui/button'

const padnum = (x: number, space: number) => String(x).padStart(space, "0");

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedURL, setRecordedURL] = useState('');
  const [seconds, setSeconds] = useState(0);

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

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
      const recordedBlob = new Blob(chunks.current, { type: 'audio/mp3' });
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
            variant="secondary"
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
          <Button variant="secondary">
            Submit
          </Button>
        </>
      )}

    </div>
  );
}
