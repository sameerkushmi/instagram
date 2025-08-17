import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
// Create a new router instance
const router = express.Router();
// Route to send a message
router.post('/send/:id',isAuthenticated, sendMessage);
// Route to get messages between two users
router.get('/all/:id',isAuthenticated, getMessages);
export default router;