import { FaHeart, FaSearch } from 'react-icons/fa'
import {MdHome,MdOutlineTrendingUp } from 'react-icons/md'
import { FaRegMessage,FaRegSquarePlus  } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CiLogout } from "react-icons/ci";

const sidebarItems = [
    {
        icons: <MdHome className="text-2xl" />,
        text: "Home",
    },
    {
        icons: <FaSearch/>,
        text: "Search"
    },
    {
        icons: <MdOutlineTrendingUp />,
        text: "Explore"
    },
    {
        icons: <FaRegMessage />,
        text: "Messages"
    },
    {
        icons: <FaHeart />,
        text: "Notifications"
    },
    {
        icons: <FaRegSquarePlus  />,
        text: "Create"
    },
    {
        icons: (
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text: "Profile"
    },
    {
        icons: <CiLogout/>,
        text: 'Logout'
    }
]

const LeftSidebar = () => {
  return (
    <div>
        {
            sidebarItems.map((item, index) => (
                <div key={index} >
                    <div className="text-xl">
                        {item.icons}
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>    
                </div>
            ))
        }
    </div>
  )
}

export default LeftSidebar