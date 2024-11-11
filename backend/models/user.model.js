import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique : true,
        trim : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default : '',
    },
    bio: {
        type: String,
        default : ''
    },
    gender: {
        type: String,
        enum: ['male','female','other'],
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
},{timestamps: true})

export const User = mongoose.model('User',userSchema)