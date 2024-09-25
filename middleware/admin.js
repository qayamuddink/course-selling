
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req,res,next){
    const token = req.headers.token ;
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
    // console.log((decoded));
    if(decoded){
        req.userId = decoded.id;
        next();
    }
    else{
        res.status(403).json({
        msg : " admin is not signed in"
        })
    }
}

module.exports = {
    adminMiddleware : adminMiddleware
}