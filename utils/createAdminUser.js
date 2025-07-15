// utils/createAdminUser.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const { AdminUser } = require("../models/AdminUser");

async function createAdminUser({
  firstName,
  lastName,
  email,
  password,
  role = "admin" // default to 'admin' unless explicitly passed
}) {
  try {
    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      console.log("❌ Admin user with this email already exists.");
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin user
    const admin = new AdminUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await admin.save();
    console.log(`✅ ${role} user created successfully.`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
}

module.exports = createAdminUser;
