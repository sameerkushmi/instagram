import jwt from 'jsonwebtoken'

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ 
                message: 'Authentication token is missing', 
                success: false 
            });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(401).json({ 
                message: 'Invalid authentication token', 
                success: false 
            });   
        }
        req.userId = decoded.userId; // Assuming the token contains userId
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid authentication token', success: false });
    }
}
export default isAuthenticated;