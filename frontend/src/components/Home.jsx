import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import userGetAllPost from '@/hooks/userGetAllPost'

const Home = () => {
  userGetAllPost()
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet/>
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home