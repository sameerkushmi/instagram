import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import Post from '../models/post.model.js';

export const register = async (req, res) => {
    try {
        // Simulate user registration logic
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ 
                message: 'Username and password and email are required',
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                message: 'Email already exists',
                success: false
            });
        }
        // hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user object with hashed password
        const newUser = {
            username,
            email,
            password: hashedPassword,
        };
        // Save the user to the database
        const createdUser = new User(newUser);
        await createdUser.save();
        // Respond with success message
        return res.status(201).json({ message: 'User registered successfully', createdUser, success: true });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    try {
        // Simulate user login logic
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required',
                success: false
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid email or password',
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                message: 'Invalid email or password',
                success: false
            });
        }
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );
        // populate each post if in the posts array
        const populatePosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId)
                if(post.author.equals(user._id)) {
                    return post
                }
                return null
            })
        );

        // Prepare user data to send back
        const users = {
            _id : user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,  
            followers: user.followers,
            following: user.following,  
            posts: populatePosts
        }
        
        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict', // CSRF protection  
            maxAge: 3600000 * 12 // 1 hour
        }).json({ 
            message: 'Login successful', 
            success: true,
            users
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 

export const logout = async (req, res) => {
    try {
        // Clear the cookie to log out the user
        return res.clearCookie('token').json({ 
            message: 'Logout successful', 
            success: true 
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const getUserProfile = async (req, res) => {
    try {
        // Get user ID from request parameters
        const userId  = req.userId;
        if (!userId) {
            return res.status(400).json({ 
                message: 'User ID is required',
                success: false
            });
        }

        // Find user by ID
        const user = await User.findById(userId).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({ 
            message: 'User profile retrieved successfully', 
            success: true, 
            user
        });
    } catch (error) {
        console.error('Get User Profile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}   

export const updateUserProfile = async (req, res) => {
    try {
        // Get user ID from request parameters
        const userId = req.userId;
        const {bio,gender} = req.body;
        const profilePicture = req.file;
        let cloudResponse 

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        if (!userId) {
            return res.status(400).json({ 
                message: 'User ID is required',
                success: false
            });
        }

        // Find user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                success: false
            });
        }

        // Update user fields
        if (bio) user.bio = bio;
        if (bio) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        // Save updated user to the database
        await user.save();

        return res.status(200).json({ 
            message: 'User profile updated successfully', 
            success: true, 
        });
    } catch (error) {
        console.error('Update User Profile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        // Get user ID from request parameters
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ 
                message: 'User ID is required',
                success: false
            });
        }

        // Find the user to exclude them from suggestions
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                success: false
            });
        }

        // Find users excluding the current user
        const suggestedUsers = await User.find({ _id: { $ne: userId } })
            .select('-password') // Exclude sensitive fields
            .limit(10); // Limit to 10 suggestions

        if(!suggestedUsers) {
            return res.status(404).json({ 
                message: 'No suggested users found',
                success: false
            });
        }
        // Respond with the suggested users
        return res.status(200).json({ 
            message: 'Suggested users retrieved successfully', 
            success: true, 
            users: suggestedUsers 
        });
    } catch (error) {
        console.error('Get Suggested Users error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const followOrUnfollowUser = async (req, res) => {
    try {
        // Get user ID from request parameters
        const userId = req.userId;
        const targetUserId  = req.params.id;
        console.log(targetUserId)

        if (!userId || !targetUserId) {
            return res.status(400).json({ 
                message: 'User ID and target user ID are required',
                success: false
            });
        }

        if(userId === targetUserId) {
            return res.status(400).json({   
                message: 'You cannot follow or unfollow yourself',
                success: false
            }); 
        }

        // Find the user and the target user
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ 
                message: 'User or target user not found',
                success: false
            });
        }

        // Check if the user is already following the target user
        const isFollowing = user.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow the target user
            await Promise.all([
                User.updateOne({ _id: userId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: userId } })
            ]);
            return res.status(200).json({ 
                message: 'Unfollowed successfully', 
                success: true 
            });
        } else {
            // Follow the target user
            await Promise.all([
                User.updateOne({ _id: userId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: userId } })
            ]);
            
            return res.status(200).json({ 
                message: 'Followed successfully', 
                success: true 
            });
        }
    } catch (error) {
        console.error('Follow/Unfollow User error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}