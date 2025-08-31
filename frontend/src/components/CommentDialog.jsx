import { useState,useEffect } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { FiMoreHorizontal } from "react-icons/fi"
import { Button } from "./ui/button"
import { useSelector } from "react-redux"
import Comment from "./Comment"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setPosts } from "./redux/postSlice"

const CommentDialog = ({ open, setOpen }) => {
    const [text,setText] = useState("");
    const {selectedPost,posts} = useSelector(store => store.post);
    const dispatch = useDispatch();
    const [comment,setComment] = useState(selectedPost?.comments);

    useEffect(()=>{
        if(selectedPost){
            setComment(selectedPost.comments);  
        }
    },[selectedPost])

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");
        }
    }

    const sendMessageHandler = async () => {
            // handle comment logic here
            try {
                const response = await axios.post(`http://localhost:8080/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                if (response.data.success) {
                    const updateCommentData = [...comment, response.data.comment];
                    setComment(updateCommentData);
    
                    const updatedPostData = posts.map(p =>
                        p._id === selectedPost?._id ? { ...p, comments: updateCommentData } : p
                    );
                    dispatch(setPosts(updatedPostData));
                    setText("");
                    toast.success(response.data.message);
                    // Optionally, you might want to update the comments in the UI here
                }
            } catch (error) {
                console.log(error)
            }
        }
    return (
        <Dialog open={open} >
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col' >
                <div className="flex flex-1">
                    <div className="w-1/2">
                        <img
                            className='rounded-l-lg w-full h-full object-cover'
                            src={selectedPost?.image} alt="post"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col justify-between">
                        <div className='flex items-center justify-between p-4'>
                            <div className="flex gap-3 items-center">
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className="font-semibold text-xs">{selectedPost?.author?.username}</Link>
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
                            {
                                comment?.map((comment) => <Comment key={comment._id} comment={comment} />)
                            }
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