import dotenv from "dotenv"
dotenv.config({})
import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/db.js"
import userRoute from "./routes/user.routes.js"


const app = express()

const PORT = process.env.PORT || 8000

app.get("/", (req,res) => {
    res.json({
        message: "i am comming fron backend",
        success: true
    })
})

// middleware 
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))

const corsOption = {
    origin : "http//localhost:5173",
    credentials: true
}
app.use(cors(corsOption))

app.use('/api/v1/user', userRoute)

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server listen at port ${PORT}`)
})