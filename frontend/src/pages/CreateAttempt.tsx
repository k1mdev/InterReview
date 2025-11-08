import React from 'react'
import Recorder from '../components/Recorder'
import MainLayout from '@/layouts/MainLayout'


const CreateAttempt = () => {


  return (
    <>
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <textarea className='rounded-2xl border-2 w-[45vw] h-[13vh] p-7 text-2xl' placeholder="What's the question?" />
          <Recorder />
        </div>
      </MainLayout>
    </>
  )
}

export default CreateAttempt