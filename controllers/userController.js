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

// soft delete. user data needes for admin analytics
const deleteUser = async (req, res) => {
  try {
   
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isActive = false;
    await user.save();// need to add isActive to the userSchema
    
    res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (err) {
    console.error("Delete profile error:", err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

//@desc re activate user after deletion
const reactivateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already active
    if (user.isActive) {
      return res.status(400).json({ message: "User is already active" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Reactivate user
    user.isActive = true;
    await user.save();

    return res.status(200).json({ success: true, message: "User reactivated successfully" });

  } catch (error) {
    console.error("Error reactivating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
    getUser,
    getUsers,
    updatePassword,
    deleteUser,
    reactivateUser
};