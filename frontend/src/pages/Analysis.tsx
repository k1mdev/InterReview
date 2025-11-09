import MainLayout from '@/layouts/MainLayout'
import React from 'react'

const Analysis = ({ recordedURL }) => {
  return (
    <>
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen pt-[25vh]">
            <span className='absolute top-1/18 flex flex-col items-center p-0 m-0'>
                <textarea className='rounded-2xl border-2 w-[45vw] h-[13vh] p-7 text-2xl resize-none' defaultValue="QUESTION HERE" readOnly/>
                <audio className='p-2' controls src={recordedURL} />
            </span>
            
            <div className='mb-4'>
                <p>Transcript</p>
                <textarea className='rounded-2xl border-2 w-[55vw] h-[20vh] p-7 text-sm resize-none' defaultValue="TRANSCRIPT HERE" readOnly/>
            </div>

                <textarea className='rounded-2xl border-2 w-[65vw] h-[40vh] p-7 text-sm resize-none' defaultValue="HIGHLIGHTS HERE" readOnly/>
        </div>


      </MainLayout>
    </>  )
}

export default Analysis