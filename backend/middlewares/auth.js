const jwt = require("jsonwebtoken");
const isAuth = async(req,res,next)=>{
    try {
        let token = req.cookies.token;
        // Also check Authorization header for Bearer token
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(400).json({message:"Token not Found!!!"});
        }
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.userId = verifyToken.userId;

        next();
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({message:"is Auth Error!!!"})
    }
}

module.exports = isAuth
