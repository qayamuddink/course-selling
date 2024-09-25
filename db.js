
// const mongoose = require("mongoose") ;
// const Schema = mongoose.Schema ;

const { Schema, default: mongoose } = require("mongoose")

const ObjectId = mongoose.Types.ObjectId;

// console.log("db is connected")


const userSchema = new Schema({
    email: {type :String , unique: true},
    password : String ,
    firstName : String,
    lastName : String

})

const adminSchema = new Schema ({
    email : String,
    password : String,
    firstName : String,
    lastName : String
})

const courseSchema = new Schema({
    title: String,
    description : String,
    price: Number,
    imageUrl : String,
    creatorId : ObjectId
})

const purchaseSchema = new Schema({

    courseId : {type:ObjectId , ref: "courses"},
    userId : {type: ObjectId , ref : "users"}   
})



const userModel = mongoose.model("users" , userSchema);
const courseModel = mongoose.model("courses" , courseSchema) ;
const adminModel = mongoose.model("admin" , adminSchema);
const purchaseModel = mongoose.model("purchase" , purchaseSchema)

module.exports = {
    userModel,
    courseModel,
    adminModel,
    purchaseModel
}



