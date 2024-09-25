
require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const app = express();

app.use(express.json())

const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const { userRouter } = require("./routes/user");

app.use("/api/v1/user" ,userRouter)
app.use("/api/v1/admin" , adminRouter)
app.use("/api/v1/course" , courseRouter)


async function main(){

    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000)
    // console.log("listening to port 3000")
}

main()