import { IoMdSearch } from "react-icons/io";
import { GoHome, GoHeart, GoPlusCircle } from "react-icons/go";
import { MdOutlineTrendingUp } from 'react-icons/md'
import { FiMessageCircle } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BiLogOut } from "react-icons/bi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "./redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts } from "./redux/postSlice";

const LeftSidebar = () => {

    const navigate = useNavigate();
    const {user} = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const [open,setOpen] = useState(false)

    const logoutHandler = async () => {
        // logout functionality
        try {
            // perform logout operation
            const response = await axios.get('http://localhost:8080/api/v1/user/logout', {
                withCredentials: true
            });
            if (response.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setPosts([]));
                toast.success(response.data.message);
                // additional actions like redirecting to login page can be done here
                navigate('/login');
            }

        } catch (error) {
            console.error("Logout failed:", error);
            toast.error(error.response?.data?.message || "Logout failed. Please try again.");
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') logoutHandler();
        if(textType === 'Create') setOpen(true);
    }

    const sidebarItems = [
    {
        icons: <GoHome className="text-2xl" />,
        text: "Home",
    },
    {
        icons: <IoMdSearch />,
        text: "Search"
    },
    {
        icons: <MdOutlineTrendingUp />,
        text: "Explore"
    },
    {
        icons: <FiMessageCircle />,
        text: "Messages"
    },
    {
        icons: <GoHeart />,
        text: "Notifications"
    },
    {
        icons: <GoPlusCircle />,
        text: "Create"
    },
    {
        icons: (
            <Avatar className={"w-6 h-6"}>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text: "Profile"
    },
    {
        icons: <BiLogOut />,
        text: 'Logout'
    }
]

    return (
        <div className="fixed left-0 top-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen">
            <div className='flex flex-col'>
                <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => (
                            <div key={index} onClick={() => sidebarHandler(item.text)} className='flex item-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3' >
                                {item.icons}
                                <span className="text-sm font-medium">{item.text}</span>
                            </div>
                        ))
                    }
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSidebar