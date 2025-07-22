const userRouter = require("express").Router();
const authorize = require("../middlewares/authMiddleware");

//Controllers import
const { getUsers, getUser } = require("../controllers/userController");


//user -Admin routes
userRouter.get('/all',getUsers); //need admin authorization


//user Routes, protected-JWT
userRouter.get('/', authorize, getUser);

userRouter.put('/',(req,res) => res.send({"message":"Update user profile data"}));

userRouter.delete('/',(req,res) => res.send({"message":"Delete user profile data"}));


module.exports = {userRouter};