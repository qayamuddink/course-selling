
// const { Router } = require("express");
// const courseRouter = Router();

// const express = require("express");

// const Router = express.Router;

// const express = require("express")


const { Router } = require('express') ;
const courseRouter = Router() ;

courseRouter.post("/purchase" , function(req,res){
    
    res.json({
        msg : "course signup endpoint"
    })
})



courseRouter.post("/preview" , function(req,res){
    
    res.json({
        msg : "course signin endpoint"
    })
})

courseRouter.get("/bulk" , function(res,res){

    res.json({
        msg : "course purchases end point"
    })
})






module.exports = {
    courseRouter
}
