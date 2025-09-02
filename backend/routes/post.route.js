import express from 'express';
import { 
    addNewPost, 
    getAllPost, 
    getUserPosts, 
    likePost,
    dislikePost,
    addComment, 
    getCommentsOfPost,
    deletePost ,
    bookmarkPost
} from '../controllers/post.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();
// Route to create a new post
router.post('/addpost', isAuthenticated,upload.single('image') , addNewPost);
// Route to get all posts
router.get('/all',isAuthenticated, getAllPost);
// Route to get a post by ID
router.get('/userpost/all', getUserPosts);
// Route to like a post
router.get('/:id/like', isAuthenticated, likePost);
// Route to dislike a post
router.get('/:id/dislike', isAuthenticated, dislikePost);
// Route to add a comment to a post
router.post('/:id/comment', isAuthenticated, addComment);
// Route to get comments of a post
router.post('/:id/comment/all', isAuthenticated, getCommentsOfPost);
// Route to delete a post by ID
router.delete('/delete/:id', isAuthenticated, deletePost);
// Route to bookmark a post
router.get('/:id/bookmark', isAuthenticated, bookmarkPost);

// Export the router
export default router;