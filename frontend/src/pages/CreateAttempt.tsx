import React, { useState } from 'react';
import Recorder from '../components/Recorder'
import MainLayout from '@/layouts/MainLayout'


const CreateAttempt = () => {
  const [title, setTitle] = useState('');

  return (
    <>
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <span className='absolute bottom-2/3 flex flex-col items-center'>
            <textarea className='rounded-2xl border-2 w-[45vw] h-[13vh] p-7  text-2xl resize-none' placeholder="What's the question?" value={title} onChange={(event) => setTitle(event.target.value)} />
          </span>
          <Recorder title={title} />
        </div>
      </MainLayout>
    </>
  )
}

export default CreateAttempt
