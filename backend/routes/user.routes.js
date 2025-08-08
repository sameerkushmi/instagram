import express from "express";
import { 
    register,
    login, 
    logout,
    getUserProfile,
    updateUserProfile,
    getSuggestedUsers ,
    followOrUnfollowUser
} from "../controllers/user.controller.js";    
import isAuthenticated from "../middlewares/isAuthenticated.js";
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
router.put("/profile/edit", isAuthenticated,upload.single('profilePicture'),updateUserProfile);
// Get suggested users route
router.get("/suggested-users", getSuggestedUsers);
// Follow or unfollow user route
router.put("/follow-unfollow/:userId", followOrUnfollowUser);

export default router;