import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { toast } from "sonner"
import axios from "axios"
import { BiLoader } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { setAuthUser } from "./redux/authSlice"

const EditProfile = () => {
    const { user } = useSelector(store => store.auth)
    const imageRef = useRef()
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fileChangeHandler = (e) => {
        const file = e.target.files[0]
        if (file) setInput({ ...input, profilePhoto: file })

    }

    const selectChangehandler = (value) => {
        setInput({ ...input, gender: value })
    }

    const EditProfileHandler = async () => {
        const formData = new FormData()
        formData.append("bio",input.bio)
        formData.append("gender",input.gender)
        if(input.profilePhoto) {
            formData.append('profilePicture',input.profilePhoto)
        }
        try {
            console.log(input)
            setLoading(true)
            const response = await axios.post('http://localhost:8080/api/v1/user/profile/edit',formData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })

            if(response.data.success){
                const updatedUserData = {
                    ...user,
                    bio: response.data.user?.bio,
                    profilePicture: response.data.user?.profilePicture,
                    gender: response.data.user?.gender
                }
                dispatch(setAuthUser(updatedUserData))
                navigate(`/profile/${user?._id}`)
                toast.success(response.data.message)
            }
        } catch(error) {
            toast.error(error.response.data.message)
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className="flex max-w-2xl mx-auto pl-10 ">
            <section className="flex flex-col gap-6 w-full my-8">
                <h1 className="font-bold text-xl">
                    Edit Profile
                </h1>
                <div className='flex items-center justify-between gap-2 bg-gray-100 rounded-xl p-4'>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="post_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm capitalize'>
                                {user?.username}
                            </h1>
                            <span className='text-gray-600'>
                                {user?.bio || "Bio here..."}
                            </span>
                        </div>
                    </div>
                    <input onChange={fileChangeHandler} ref={imageRef} type="file" className="hidden" />
                    <Button onClick={() => imageRef.current.click()} className="bg-[#0095F6] hover:bg-[#0381d4]">Change Photo</Button>
                </div>
                <div>
                    <h1 className="font-bold text-xl mb-2">Bio</h1>
                    <Textarea value={input.bio} placeholder="bio here..." onChange={(e) => setInput({ ...input, bio: e.target.value })} name="bio" className="focus-visible:ring-transparent" />
                </div>
                <div>
                    <h1 className="font-bold mb-2">Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangehandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end">
                    {
                        loading ? (
                            <Button className="w-fit bg-[#0095F6] hover:bg-[#0381d4]">
                                <BiLoader className="animate-spin" />
                                Please wait
                            </Button>
                        )
                            :
                            (
                                <Button onClick={EditProfileHandler} className="w-fit bg-[#0095F6] hover:bg-[#0381d4]">Submit</Button>
                            )
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile