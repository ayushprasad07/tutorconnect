var jwt = require('jsonwebtoken');
require('dotenv').config();

const fetchUser = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(400).json({error:"Please authenticate teh user"})
    }
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET);
        req.teacher = data.teacher;
        next();
    } catch (error) {
        return res.status(400).json({error:"Please authenticate the user"});
    }
}

module.exports = fetchUser;