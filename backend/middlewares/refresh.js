import jwt from 'jsonwebtoken'

const refresh = async (req,res,next) => {
    const { token } = req.cookies
    
    if (!token) {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 0
        })
        return res.status(400).json({
            message: "Invalid request",
            success: false
        })
    }

    try {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = user.userId
        next()
    } catch (error) {
        console.log(error)
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 0
        })
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export default refresh