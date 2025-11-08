import React from 'react'
import Banner from '../components/Banner'
import Hero from '../components/Hero'
import Sidebar from '../components/Sidebar'

const Home = () => {
  return (
    // <div className='flex flex-col'>
    //     <Banner />
    //     <Hero />
    // </div>
    <div className='flex'>
      <span className='flex-none'>
        <Sidebar />
      </span>
      <span className='flex-1'>
        <Banner />
        <Hero />
      </span>
    </div>
  )
}

export default Home
