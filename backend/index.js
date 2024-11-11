import dotenv from 'dotenv'
dotenv.config()
import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from './util/db.js'
const app = express()

app.get('/',(req,res)=>{
    res.json({
        message : 'i am comming from backend',
        success : true
    })
})

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended: true}))
const corsOption = {
    origin: 'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOption))

const PORT = process.env.PORT || 8000

app.listen(PORT,()=>{
    connectDB()
    console.log(`server listen at port ${PORT}`)
})