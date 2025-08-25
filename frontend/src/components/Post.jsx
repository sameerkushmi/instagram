import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { IoIosMore } from "react-icons/io";
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FaRegHeart } from "react-icons/fa";
import { FiBookmark, FiMessageCircle, FiSend } from 'react-icons/fi';
import CommentDialog from './CommentDialog';

const Post = ({post}) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex item-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>{post.author?.username}</h1>
                </div>
                <Dialog className='flex flex-col items-center text-sm text-center'>
                    <DialogTrigger asChild>
                        <IoIosMore className='cursor-pointer' size={20} />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold" >Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold" >Add to favorites</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold" >Delete</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image} alt="post"
            />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4'>
                    <FaRegHeart size={`22px`} className='cursor-pointer hover:text-gray-600' />
                    <FiMessageCircle onClick={()=>setOpen(true)} size={`22px`} className='cursor-pointer hover:text-gray-600' />
                    <FiSend size={`22px`} className='cursor-pointer hover:text-gray-600' />
                </div>
                <FiBookmark size={`22px`} className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>{post.likes.length} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            <span onClick={()=>setOpen(true)} className='cursor-pointer text-sm text-gray-400'>View all 10 comments</span>
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between my-2 gap-2'>
                <input
                    type='text'
                    value={text}
                    onChange={changeEventHandler}
                    placeholder='Add a comment...'
                    className='w-full text-sm focus:ring-0 outline-none'
                />
                {
                    text.length > 0 &&
                    <span className='text-[#3badf8]'>Post</span>
                }
            </div>
        </div>
    )
}

export default Post