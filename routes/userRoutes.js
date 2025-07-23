const userRouter = require("express").Router();
const authorize = require("../middlewares/authMiddleware");

//Controllers import
const { getUsers, getUser, updatePassword, deleteUser, reactivateUser } = require("../controllers/userController");


//user -Admin routes
userRouter.get('/all',getUsers); // - [ ] To Do: admin authorization


//user Routes, protected-JWT
userRouter.get('/', authorize, getUser);

userRouter.put('/password', authorize, updatePassword);

userRouter.patch('/', authorize, deleteUser );

userRouter.patch('/reactivate', reactivateUser );


module.exports = {userRouter};