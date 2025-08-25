import { useState } from 'react';
import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { RiLoader5Fill } from "react-icons/ri";
import { toast } from 'sonner';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setPosts } from './redux/postSlice.js';

const CreatePost = ({ open, setOpen }) => {
    const imageRef = useRef()
    const [file, setFile] = useState("")
    const [caption, setCaption] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const [loading, setLoading] = useState(false)
    const {user} = useSelector(state => state.auth);
    const {posts} = useSelector(state => state.post);
    const dispatch = useDispatch()

    const createPostHandler = async(e) => {
        e.preventDefault();
        // handle create post logic here
        const formData = new FormData();
        formData.append('caption', caption);
        if(imagePreview) formData.append('image', file);
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/api/v1/post/addpost',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'   
                },
                withCredentials: true
            });
            if(response.data.success) {
                dispatch(setPosts([...posts,response.data.post]))
                toast.success(response.data.message);
                setCaption("");
                setFile("");
                setImagePreview("");
                setOpen(false);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong");
        }finally{
            setLoading(false);
        }
    }

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }

    return (
        <>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)}>
                    <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>
                    <div onSubmit={createPostHandler} className="flex gap-3 items-center">
                        <Avatar>
                            <AvatarImage src={user?.profilePicutre} alti="img" />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-semibold text-xs'>{user?.username}</h1>
                            <span className='text-gray-600'>Bio here...</span>
                        </div>
                    </div>
                    <Textarea
                        className="focus-visible:ring-transparent border-none"
                        placeholder="Write a caption..."
                        rows={4}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    {
                        imagePreview && (
                            <div className='w-full h-64 flex items-center justify-center '>
                                <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                            </div>
                        )
                    }
                    <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
                    <Button
                        onClick={() => imageRef.current.click()}
                        className='w-fit mx-auto bg-[#0095F6] hover:bg-[#0086df]'
                    >
                        Select from computer
                    </Button>
                    {
                        imagePreview && (
                            loading ? (
                                <Button className="w-full" disabled>
                                    <RiLoader5Fill className='animate-spin' />
                                    Please wait
                                </Button>
                            ) : (
                                <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
                            )
                        )
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreatePost