import express from "express";
import { 
    register,
    login, 
    logout,
    getUserProfile,
    updateUserProfile,
    getSuggestedUsers ,
    followOrUnfollowUser,
    refreshToken
} from "../controllers/user.controller.js";    
import isAuthenticated from "../middlewares/isAuthenticated.js";
import refresh from "../middlewares/refresh.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// User registration route
router.post("/register", register);
// User login route
router.post("/login", login);
// User logout route
router.get("/logout", logout);
// Get user profile route
router.get("/:id/profile",isAuthenticated, getUserProfile);
// Update user profile route
router.post("/profile/edit", isAuthenticated, upload.single('profilePicture'), updateUserProfile);
// Get suggested users route
router.get("/suggested",isAuthenticated, getSuggestedUsers);
// Follow or unfollow user route
router.post("/follow-unfollow/:id",isAuthenticated , followOrUnfollowUser);
//refresh user profile
router.get('/refresh',refresh,refreshToken)

export default router;