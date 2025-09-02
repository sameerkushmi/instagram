import sharp from 'sharp'
import cloudinary from '../utils/cloudinary.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const addNewPost = async(req,res) => {
    try {
        const { caption} = req.body;
        const image = req.file;
        const authorId = req.userId // Assuming userId is set by isAuthenticated middleware;
        if (!caption || !image) {
            return res.status(400).json({ 
                message: 'Caption and image are required', 
                success: false 
            });
        }
        
        // image upload logic here
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800, height:800, fit: "inside"})
        .toFormat('jpeg', {quality: 80})
        .toBuffer();

        //buffer to base64 conversion
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri)
        const post =  await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId,
        });

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        await Post.populate(post, { path: 'author', select: '-password' });

        return res.status(201).json({ 
            message: 'Post added successfully', 
            success: true, 
            post 
        });
    } catch (error) {

        console.error('Error adding new post:', error);
        return res.status(500).json({ 
            message: 'Failed to add new post', 
            success: false 
        });
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({path: 'author', select: 'username profilePicture'})
            .populate({ 
                path: 'comments',
                sort: { createdAt: -1 },
                populate: { path: 'author', select: 'username profilePicture' }
            })
            .sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.status(404).json({
                message: 'No posts found',
                success: false
            });
        }

        return res.status(200).json({ 
            message: 'Posts fetched successfully', 
            success: true, 
            posts 
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ 
            message: 'Failed to fetch posts', 
            success: false 
        });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await Post.find({ author: userId })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({ 
                path: 'comments',
                sort: { createdAt: -1 },
                populate: { path: 'author', select: 'username profilePicture' }
            })
            .sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.status(404).json({
                message: 'No posts found for this user',
                success: false
            });
        }

        return res.status(200).json({ 
            message: 'User posts fetched successfully', 
            success: true, 
            posts 
        });

    } catch (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({ 
            message: 'Failed to fetch user posts', 
            success: false 
        });
    }
}

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                message: 'Post not found', 
                success: false 
            });
        }

        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        const user = await User.findById(userId).select('username profilePicture')
        const postOwnerId = post.author.toString()

        if(postOwnerId !== userId){
            //emit a notification even
            const notification = {
                type: 'like',
                userId : userId,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSocketId).emit('notification',notification)
        }

        return res.status(200).json({ 
            message: 'Post like status updated successfully', 
            success: true, 
            likes: post.likes.length 
        });

    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({ 
            message: 'Failed to update like status', 
            success: false 
        });
    }
}

export const dislikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                message: 'Post not found', 
                success: false 
            });
        }

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ 
                message: 'You have not liked this post', 
                success: false 
            });
        }

        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        //implement socket io for real time data transfer
        const user = await User.findById(userId).select('username profilePicture')
        const postOwnerId = post.author.toString()

        if(postOwnerId !== userId){
            //emit a notification even
            const notification = {
                type: 'dislike',
                userId : userId,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSocketId).emit('notification',notification)
        }

        return res.status(200).json({ 
            message: 'Post dislike status updated successfully', 
            success: true, 
            likes: post.likes.length 
        });

    } catch (error) {
        console.error('Error disliking post:', error);
        return res.status(500).json({ 
            message: 'Failed to update dislike status', 
            success: false 
        });
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;
        const userId = req.userId;

        if (!text) {
            return res.status(400).json({ 
                message: 'Comment cannot be empty', 
                success: false 
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                message: 'Post not found', 
                success: false 
            });
        }

        const newComment = await Comment.create({
            text,
            author: userId,
            post: postId
        })
        await newComment.populate('author', 'username profilePicture');


        post.comments.push(newComment._id);
        await post.save();
        return res.status(201).json({ 
            message: 'Comment added successfully', 
            success: true, 
            comment: newComment 
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ 
            message: 'Failed to add comment', 
            success: false 
        });
    }
}

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId })
            .populate('author','username profilePicture')
            .sort({ createdAt: -1 });

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: 'No comments found for this post',
                success: false
            });
        }
        return res.status(200).json({ 
            message: 'Comments fetched successfully', 
            success: true, 
            comments 
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ 
            message: 'Failed to fetch comments', 
            success: false 
        });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                message: 'Post not found', 
                success: false 
            });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ 
                message: 'You are not authorized to delete this post', 
                success: false 
            });
        }

        await Post.deleteOne({ _id: postId });

        // Optionally, remove the post reference from the user's posts array
        const user = await User.findById(userId);
        if (user) {
            user.posts = user.posts.filter(id => id.toString() !== postId);
            await user.save();
            await Comment.deleteMany({ post: postId }); // Delete all comments associated with the post
        }
        return res.status(200).json({ 
            message: 'Post deleted successfully', 
            success: true 
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ 
            message: 'Failed to delete post', 
            success: false 
        });
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                message: 'Post not found', 
                success: false 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found', 
                success: false 
            });
        }

        if(user.bookmarks.includes(post._id)){
            // already bookmarked -> remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true});

        }else{
            // bookmark krna pdega
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked', success:true});
        }

    } catch (error) {
        console.error('Error bookmarking post:', error);
        return res.status(500).json({ 
            message: 'Failed to update bookmark status', 
            success: false 
        });
    }
}