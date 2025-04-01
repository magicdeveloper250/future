import React from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import MainContent from '../components/MainContent'
const Dashboard = () => {
  return (
    <>
        <div className='flex'>
           <section id='sidebar'>
              <Sidebar /> 
           </section>
           <div>
            <section id='header'>
            <Header />
            </section>
            <section id='hero'>
              <Card />
            </section>
            <section>
              <MainContent/>
            </section>
           </div>
        </div>
    </>
  )
}

export default Dashboard