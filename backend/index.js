import dotenv from "dotenv"
dotenv.config({})
import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/db.js"
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js"
import messageRoute from './routes/message.route.js'
import { app,server } from "./socket/socket.js"
import path from 'path'

// Set the port for the application
const PORT = process.env.PORT || 8000
/
app.get("/", (req,res) => {
    res.json({
        message: "i am comming fron backend",
        success: true
    })
})

const __dirname = path.resolve()

// middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
// cors
const corsOption = {
    origin : "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOption))

// routes
app.use('/api/v1/user', userRoute)
app.use('/api/v1/post',postRoute)
app.use('/api/v1/message',messageRoute)

app.use(express.static(path.join(__dirname,"/frontend/dist")))

server.listen(PORT,()=>{
    connectDB()
    console.log(`Server listen at port ${PORT}`)
})