const express= require("express");
const mongoose=require("mongoose");
const app=express();
const authRoutes=require('./routes/authRoutes')
const loanRoutes=require('./routes/loanRoutes')
const dotenv=require("dotenv")

dotenv.config()
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connected db")
}).catch((err)=>{
    console.error(err)
})

app.use('/api/auth',authRoutes);
app.use('/api/loan',loanRoutes)

app.listen(5001,()=>{
    console.log("Server is running on port 3000");
})