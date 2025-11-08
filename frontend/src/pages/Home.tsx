import React from 'react'
import Banner from '../components/Banner'
import Hero from '../components/Hero'
import MainLayout from '@/layouts/MainLayout'

const Home = () => {
  return (
    <MainLayout>
      <Banner />
      <Hero />
    </MainLayout>
  )
}

export default Home
