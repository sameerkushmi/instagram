import { User } from "../models/user.model"
import bcrypt from 'bcryptjs'

export const register = async(req,res)=> {
    try{    
        const {username,email,password} = req.body
        if(!username || !email || !password)
            return res.status(401).json({
                message: 'Something is missing , please check!',
                success: false
            })

        const user = await User.findOne({email})
        if(user) 
        return res.status(401).json({
            message: 'try different email',
            success: false
        })

        const hashPassword = await bcrypt.hash(password,10)

        await User.create({
            username,
            email,
            password: hashPassword
        })

        return res.json({
            message : 'Account created successfully!',
            success : true
        })
    }catch(errr){
        res.status(500).json({
            message: errr,
            success: false
        })
    }
}

export const login = async(req,res) => {
    try {
        
    } catch(err){

    }
}