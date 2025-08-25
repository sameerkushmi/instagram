import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { FiMoreHorizontal } from "react-icons/fi"
import { Button } from "./ui/button"
import { useState } from "react"

const CommentDialog = ({ open, setOpen }) => {
    const [text,setText] = useState("");

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");
        }
    }

    const sendMessageHandler = () => {

    }
    return (
        <Dialog open={open} >
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col' >
                <div className="flex flex-1">
                    <div className="w-1/2">
                        <img
                            className='rounded-l-lg w-full h-full object-cover'
                            src="https://cdn.pixabay.com/photo/2025/08/03/15/10/cat-9752539_960_720.jpg" alt="post"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col justify-between">
                        <div className='flex items-center justify-between p-4'>
                            <div className="flex gap-3 items-center">
                                <Link>
                                    <Avatar>
                                        <AvatarImage src="" alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className="font-semibold text-xs">username</Link>
                                    {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                                </div>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <FiMoreHorizontal className="cursor-pointer"/>
                                </DialogTrigger>
                                <DialogContent className={'flex flex-col items-center text-sm text-center'}>
                                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                                        Unfollow
                                    </div>
                                    <div className="cursor-pointer w-full">
                                        Add to favorites
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className="flex-1 p-4 overflow-y-auto max-h-96">
                            comments here..
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..." 
                                    value={text}
                                    onChange={changeEventHandler}
                                    className="w-full outline-none border border-gray-300 p-2 rounded"
                                />
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog