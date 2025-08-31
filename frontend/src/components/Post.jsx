import { useState } from 'react'
import axios from 'axios';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { IoIosMore } from "react-icons/io";
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiBookmark, FiMessageCircle, FiSend } from 'react-icons/fi';
import CommentDialog from './CommentDialog';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setPosts } from './redux/postSlice.js';
import { setSelectedPost } from './redux/postSlice.js';
import { Badge } from './ui/badge';

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length || 0);
    const dispatch = useDispatch();
    const [comment, setComment] = useState(post.comments);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        console.log(inputText)
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async (postId) => {
        // handle like or dislike logic here 
        try {
            const action = liked ? "dislike" : "like";
            const response = await axios.get(`http://localhost:8080/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (response.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);
                const updatedPosts = posts.map(p =>
                    p._id === post._id ? { ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] } : p)
                dispatch(setPosts(updatedPosts));
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    }

    const commentHandler = async () => {
        // handle comment logic here
        try {
            const response = await axios.post(`http://localhost:8080/api/v1/post/${post?._id}/comment`, { text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (response.data.success) {
                const updateCommentData = [...comment, response.data.comment];
                setComment(updateCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updateCommentData } : p
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

    const deletePostHandler = async () => {
        // handle delete post logic here
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/post/delete/${post?._id}`, {
                withCredentials: true
            });
            if (response.data.success) {
                const updatedPosts = posts.filter(p => p._id !== post._id);
                dispatch(setPosts(updatedPosts));
                toast.success(response.data.message);
                // Optionally, you might want to remove the post from the UI here
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error)
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
                    <div className='flex items-center gap-2'>
                        <h1>{post.author?.username}</h1>
                        {user._id === post?.author?._id && <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog className='flex flex-col items-center text-sm text-center'>
                    <DialogTrigger asChild>
                        <IoIosMore className='cursor-pointer' size={20} />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold" >Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold" >Add to favorites</Button>
                        {
                            user && user?._id === post?.author?._id &&
                            <Button variant="ghost" onClick={deletePostHandler} className="cursor-pointer w-fit font-bold" >Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image} alt="post"
            />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4'>
                    {
                        liked ?
                            <FaHeart onClick={likeOrDislikeHandler} size={`22px`} className='cursor-pointer text-red-600' />
                            :
                            <FaRegHeart onClick={likeOrDislikeHandler} size={`22px`} className='cursor-pointer' />
                    }
                    <FiMessageCircle
                        onClick={() => {
                            dispatch(setSelectedPost(post)),
                            setOpen(true)
                        }}
                        size={`22px`}
                        className='cursor-pointer hover:text-gray-600'
                    />
                    <FiSend size={`22px`} className='cursor-pointer hover:text-gray-600' />
                </div>
                <FiBookmark size={`22px`} className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            {
                comment.length > 0 &&
                <span
                    onClick={() => {
                        dispatch(setSelectedPost(post)),
                        setOpen(true)
                    }}
                    className='cursor-pointer text-sm text-gray-400'>
                    View all {comment.length} comments
                </span>
            }
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
                    <span onClick={commentHandler} className='text-[#3badf8] cursor-pointer'>Post</span>
                }
            </div>
        </div>
    )
}

export default Post