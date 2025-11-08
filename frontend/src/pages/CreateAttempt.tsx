import React from 'react'
import Recorder from '../components/Recorder'
import Sidebar from '../components/Sidebar'


const CreateAttempt = () => {


  return (
    <div className='flex flex-col'>

        

        <div className='flex'>
        <span className='flex-none'>
            <Sidebar />
        </span>
        <span className='flex-1'>
            <div className='fixed top-0 left-1/2 -translate-x-1/2 p-8 mt-8 flex flex-col'>
            <textarea className='rounded-2xl border-2 w-[45vw] h-[13vh] p-7 text-2xl' placeholder="What's the question?" />
        </div>

        <Recorder />
        </span>
        </div>

    </div>
  )
}

export default CreateAttempt