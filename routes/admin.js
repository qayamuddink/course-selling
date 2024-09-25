
const { Router } = require("express") ;
const { adminModel, courseModel } = require("../db")
const { z, string } = require("zod")
const adminRouter = Router() ;
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const admin = require("../middleware/admin");


adminRouter.post("/signup" ,async function(req,res){
    
    const requiredBody = z.object({
        email : z.string().min(5).max(100).email() ,
        password : z.string().min(7).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/),
        firstName: z.string(),
        lastName : z.string()
    }) ;

    // console.log(req.body)
    const isvalidate = requiredBody.safeParse(req.body)
    if(!isvalidate.success){
        // console.log(isvalidate.error.errors)
        res.json({
            msg : "incorrect credential",
            error : isvalidate.error.errors
        })
        return
         
    }
    const email = req.body.email ;
    const password = req.body.password ;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // console.log(req.body);


    const hashedPassword = await bcrypt.hash(password,6)
    
    try{
        await adminModel.create({
            email,
            password : hashedPassword,
            firstName,
            lastName
        })
    }catch(e){
        console.log(e)
    }

    res.json({
      msg : " signup succeded "
    })
})


adminRouter.post("/signin" , async function(req,res){

    const { email , password } = req.body;

    const admin = await adminModel.findOne({
        email
    })

    if(!admin){
        res.json({
            msg : "admin is not find"
        })
        return 
    }
    
    const passwordMatch = await bcrypt.compare(password , admin.password) ;


    if(passwordMatch){
        const token = jwt.sign({
            id : admin._id
        },JWT_ADMIN_PASSWORD)
        
        // cookie based authentication 

        res.json({
            token
        })
    }else{
        
    res.status(403).json({
        msg: " Incorrect Credential" 
    })
    }
})






  

// adminRouter.post("/courseCreate" , adminMiddleware ,async function(req,res){

//     const adminId = req.userId;

//     const { title , description ,price , imageUrl } = req.body ;

//     const course = await courseModel.create({
//         title,
//         description,
//         price,
//         imageUrl,
//         creatorId : adminId
//     })


//     // console.log(`person who creates the course ${course.creatorId}`)

//     res.json({
//         msg : "course created",
//         createdCourseId : course._id
//         // courseCreatotrId : adminId
//     })
// })



// adminRouter.put("/course" , adminMiddleware ,async function(req,res){

    

//     const adminId = req.userId ;

//     const { title ,description ,imageUrl, price , courseId} = req.body 

//     // console.log(req.body) ; 



//     const course = await courseModel.updateOne({
//         _id : courseId , // 
//         creatorId : adminId // its a check where creator didn't change another creator course object
//     },{
//         title,
//         description,
//         price,
//         imageUrl
//     })

//     // console.log(randomId)

//     // console.log(course)

//     console.log({ courseId , adminId });


//     res.json({
//         msg : " course updated hjh",
//         updateCourseId : course._id 
//     })
// })


// adminRouter.post("/course", adminMiddleware, async function(req, res) {
//     const adminId = req.userId;

//     const { title, description, imageUrl, price } = req.body;

//     // creating a web3 saas in 6 hours
//     const course = await courseModel.create({
//         title: title, 
//         description: description, 
//         imageUrl: imageUrl, 
//         price: price, 
//         creatorId: adminId
//     })

//     res.json({
//         message: "Course created",
//         courseId: course._id
//     })
// })



// adminRouter.put("/course", adminMiddleware, async function(req, res) {
//     const adminId = req.userId;

//     const { title, description, imageUrl, price, courseId } = req.body;

//     // creating a web3 saas in 6 hours
//     const course = await courseModel.updateOne({
//         _id: courseId, 
//         creatorId: adminId 
//     }, {
//         title: title, 
//         description: description, 
//         imageUrl: imageUrl, 
//         price: price
//     })

//     res.json({
//         message: "Course updated",
//         courseId: course._id
//     })
// })


adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;

    // creating a web3 saas in 6 hours
    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseCreatedId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseCreatedId } = req.body;

    const courseId = await courseModel.findById(courseCreatedId);
    if(!courseId){
        res.status(403).json({
            msg : "course is not found "
        })
        return
    }
    console.log(courseId)

    const course = await courseModel.updateOne({
        _id: courseCreatedId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })

    // console.log("course id " + title)

    // console.log(" the course id is " ) 

    res.json({
        message: "Course updated",
        courseUpdateId: course._id
    })
})




adminRouter.get("/course/bulk" , adminMiddleware , async function(req,res){

    const adminId = req.userId ;

    const courses = await courseModel.find({
        creatorId : adminId
    })

    res.json({
        msg : " all course seen bulk admin endpoint is hit",
        courses
    })
})

module.exports = {
    adminRouter
}