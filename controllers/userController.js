const bcrypt = require('bcrypt');


const { User } = require('../models/User');

const { getUserInfodb } = require('../utils/userUtils');

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
        const user = await getUserInfodb(req.userId); //utils
        res.status(200).json({success:true, data: user});
    } catch (error) {
        next(error);
    }
};

// change user password 
const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // password rules
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await getUserInfodb(req.userId, false); //utils + excludepassword =false

    const isMatch = await bcrypt.compare(oldPassword, user.password);


    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });

  } catch (error) {
    next(error);
    }
};

module.exports = { 
    getUser,
    getUsers,
    updatePassword,
};