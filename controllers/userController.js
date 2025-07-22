const { User } = require('../models/User');

// get all users - Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({success:true, data: users});
    } catch (error) {
        next(error);
    }
}

 // get single users info
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        // no user found
        if (!user) {
            const error = new Error('User not Found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success:true, data: user});
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getUser,
    getUsers,
 };