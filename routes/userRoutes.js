const userRouter = require("express").Router();
const authorizeUser = require("../middlewares/authMiddleware");

//Controllers import
const { getUsers, getUser, updatePassword, deleteUser, reactivateUser } = require("../controllers/userController");


//user -Admin routes
userRouter.get('/all',getUsers); // - [ ] To Do: admin authorization


//user Routes, protected-JWT
userRouter.get('/', authorizeUser, getUser);

userRouter.put('/password', authorizeUser, updatePassword);

userRouter.patch('/', authorizeUser, deleteUser );

userRouter.patch('/reactivate', reactivateUser );


module.exports = {userRouter};