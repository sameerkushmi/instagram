import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';


export const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.id; // Assuming recipient ID is passed in the URL
        const senderId = req.userId;
        const { textMessage : message } = req.body;
        // 
        if (!receiverId || !message) {
            return res.status(400).json({
                message: 'Recipient ID and content are required',
                success: false
            });
        }

        // Check if the recipient ID is the same as the sender ID
        if (receiverId === senderId) {
            return res.status(400).json({
                message: 'You cannot send a message to yourself',
                success: false
            });
        }
        // Check if the message content is provided
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        // Create a new conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }
        // Create a new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        // Add the new message to the conversation
        if (newMessage) conversation.messages.push(newMessage._id);

        // Save the conversation and the new message
        await Promise.all([
            conversation.save(),
            newMessage.save()
        ]);

        // implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage)
        }
        // Return success response
        return res.status(201).json({
            success: true,
            newMessage
        });

    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({
            message: 'Failed to send message',
            success: false
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const receiverId = req.params.id; // Assuming recipient ID is passed in the URL
        const senderId = req.userId;

        // Check if the recipient ID is the same as the sender ID
        if (receiverId === senderId) {
            return res.status(400).json({
                message: 'You cannot view messages with yourself',
                success: false
            });
        }

        // Find the conversation between the sender and recipient
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!conversation) {
            return res.status(404).json({
                message: 'Conversation not found',
                success: false
            });
        }

        // Return the messages in the conversation
        return res.status(200).json({
            message: 'Messages retrieved successfully',
            success: true,
            messages: conversation?.messages
        });

    } catch (error) {
        console.error('Error retrieving messages:', error);
        return res.status(500).json({
            message: 'Failed to retrieve messages',
            success: false
        });
    }
}