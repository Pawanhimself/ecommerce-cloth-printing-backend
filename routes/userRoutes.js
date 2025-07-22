const userRouter = require("express").Router();
const authorize = require("../middlewares/authMiddleware");

//Controllers import
const { getUsers, getUser, updatePassword } = require("../controllers/userController");


//user -Admin routes
userRouter.get('/all',getUsers); // - [ ] To Do: admin authorization


//user Routes, protected-JWT
userRouter.get('/', authorize, getUser);

userRouter.put('/password', authorize, updatePassword);

userRouter.delete('/',(req,res) => res.send({"message":"Delete user profile data"}));


module.exports = {userRouter};