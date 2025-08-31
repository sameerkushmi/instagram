import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import useRefreshToken from '@/hooks/useRefreshToken'
import { useSelector } from 'react-redux'

const Home = () => {
  const { user } = useSelector(state => state.auth)

  if (!user) useRefreshToken()

  useGetAllPost()
  useGetSuggestedUsers()
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home