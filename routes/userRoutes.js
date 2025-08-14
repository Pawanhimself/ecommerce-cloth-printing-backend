const userRouter = require("express").Router();


//Controllers import
const { getUsers, getUser, updatePassword, deleteUser, reactivateUser } = require("../controllers/userController");
const { authorize } = require("../middlewares/authMiddleware");


//user -Admin routes
userRouter.get('/all', getUsers);


//user Routes, protected-JWT
userRouter.get('/', authorize({ type: "user" }), getUser);

userRouter.put('/password', authorize({ type: "user" }), updatePassword);

userRouter.patch('/', authorize({ type: "user" }), deleteUser );

userRouter.patch('/reactivate', reactivateUser );


module.exports = {userRouter};