import { useSelector } from "react-redux"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link } from "react-router-dom"

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(state => state.auth)
  return (
    <div className="my-10">
      <div className="flex items-center justify-between gap-4 text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {
        suggestedUsers?.map(user => (
          <div key={user._id} className="flex items-center justify-between my-4">
            <div className='flex items-center gap-2'>
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className='font-semibold text-sm capitalize'>
                  <Link to={`/profile/${user?._id}`}>
                    {user?.username}
                  </Link>
                </h1>
                <span className='text-gray-600 text-xs'>
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495D6]">Follow</span>
          </div>

        ))
      }
    </div>
  )
}

export default SuggestedUsers