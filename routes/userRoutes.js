
const userRouter = require("express").Router();


//user -Admin routes
userRouter.get('/all',(req,res) => res.send({"message":"Admin: get all user profile data"}));


//user Routes, protected-JWT
userRouter.get('/',(req,res) => res.send({"message":"get user profile data"}));

userRouter.put('/',(req,res) => res.send({"message":"Update user profile data"}));

userRouter.delete('/',(req,res) => res.send({"message":"Delete user profile data"}));


module.exports = {userRouter};