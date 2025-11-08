import React, { useRef, useState } from 'react';
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react';
import { Button } from '@/components/ui/button'


export default function Recorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedURL, setRecordedURL] = useState<string>('');
  const [seconds, setSeconds] = useState<number>(0);

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setIsRecording(true);
    try {
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
      }, 1000);

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/mp3' });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedURL(url);

        chunks.current = [];
        clearInterval(timer);
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error(error);
    }
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
        <Button
          size="icon"
          variant="secondary"
          onClick={stopRecording}
        >
          <IconPlayerStop />
        </Button>
      ) : (
        <div className='flex items-center'>
          <span className="text-sm p-1">Record Your Response</span>
          <Button
            size="icon"
            variant="secondary"
            onClick={startRecording}
          >
            <IconMicrophone />
          </Button>
        </div>
      )}

      {recordedURL && (
        <>
          <audio className='p-2' controls src={recordedURL} />
          <Button size="icon" variant="secondary">
            Submit
          </Button>
        </>
      )}

    </div>
  );
}
