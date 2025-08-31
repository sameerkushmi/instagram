import { useState } from "react"
import useGetUserProfile from "@/hooks/useGetUserProfile"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button } from "./ui/button"
import { FiAtSign } from "react-icons/fi"
import { Badge } from "./ui/badge"
import { BiHeart, BiMessage } from "react-icons/bi"

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const [activeTab, setActiveTab] = useState('posts')

  const { userProfile, user } = useSelector((state) => state.auth)

  const isLoggedInUserProfile = user?._id === userProfile?._id
  const isFollowing = false // Replace with actual following status

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className={"w-32 h-32"}>
              <AvatarImage src={userProfile?.profilePicture} alt="profile_pic" className="object-cover" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ?
                    (
                      <>
                        <Link to="/account/edit">
                          <Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button>
                        </Link>
                        <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                        <Button variant='secondary' className='hover:bg-gray-200 h-8'>Add tools</Button>
                      </>
                    )
                    :
                    (
                      isFollowing ?
                        <>
                          <Button variant="secondary" className=' h-8'>Unfollow</Button>
                          <Button variant="secondary" className='h-8'>Message</Button>
                        </>
                        :
                        <Button className='bg-[#0095F6] hover:bg-[#0685da] text-white h-8'>Follow</Button>

                    )

                }
              </div>
              <div className="flex items-center gap-4">
                <p><span className="font-semibold">{userProfile?.posts.length} </span> post</p>
                <p><span className="font-semibold">{userProfile?.followers.length} </span>followers </p>
                <p><span className="font-semibold">{userProfile?.following.length} </span>following </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userProfile?.bio || "bio here..."}</span>
                <Badge className="w-fit" variant="secondary"><FiAtSign /><span className="pl-1">{userProfile?.username}</span></Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t pt-4 border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' && 'font-bold'} `} onClick={() => handleTabClick('posts')}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'save' && 'font-bold'} `} onClick={() => handleTabClick('save')}>SAVE</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'reels' && 'font-bold'} `} onClick={() => handleTabClick('reels')}>REELS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'tags' && 'font-bold'} `} onClick={() => handleTabClick('tags')}>TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {
              displayedPost?.map((post) => (
                <div key={post._id} className="relative group cursor-pointer">
                  <img src={post.image} alt="post_img" className="rounded-b-sm w-full aspect-square object-cover" />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex 
                    items-center justify-center rounded transition-opacity
                    duration-300"
                  >
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <BiHeart className="cursor-pointer" />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2  hover:text-gray-300">
                        <BiMessage className="cursor-pointer" />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile