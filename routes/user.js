
const { Router } = require("express") ;
const { userSchena, userModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config")
const { z, string, ParseStatus } = require("zod")
const userRouter = Router() ;


userRouter.post("/signup" ,async function(req,res){

    const userValidation = z.object({
        email : string().email(),
        password : string().min(6).max(10).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/),
        firstName : string(),
        lastName : string()
    }) 

    const validateUser = userValidation.safeParse(req.body) ;
    if(!validateUser.success){
        res.status(403).json({
            msg : "Incorrect Credential" ,
            error : validateUser.error
        })
        return 
    }
    const { email ,password , firstName , lastName} = req.body ;

    const hashPassword = await bcrypt.hash(password , 8);

    try{
        
    await userModel.create({
        email,
        password : hashPassword,
        firstName,
        lastName
    })

        res.json({
            msg :  " User sign up successfully"
        })
    }
    catch(e){
        console.log(`errors ${e}`);
    }

})

userRouter.post("/signin" ,async function(req,res){

    const { email , password } = req.body ;

    const user = await userModel.findOne({
        email       
    })

    if(!user){
        res.status(403).json({
            msg : " user is not in the db"
        })
        return 
    }

    const validatePassword = bcrypt.compare(password , user.password);

    if(validatePassword){
        const token = jwt.sign({
            id : user._id
        } , JWT_USER_PASSWORD)
        res.json({
            msg: " user signup successfully" 
        })
    }else{
        res.status(403).json({
            msg : "Incorrect Credential"
        })
    }

})

userRouter.post("/purchases" , function(req,res){
    
    res.json({
        msg : "admin course created"
    })
})





module.exports = {
    userRouter
}