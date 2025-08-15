// utils/createAdminUser.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const { AdminUser, validateAdminCreation } = require("../models/AdminUser");

async function createAdminUser({
  firstName,
  lastName,
  email,
  password,
  role = "admin" // default to 'admin' unless explicitly passed
}) {
  try {
    // Validate input
    const { error } = validateAdminCreation({ firstName, lastName, email, password, role });
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      console.log("❌ Admin user with this email already exists.");
      return;
    }
    // Check if role is valid
    const validRoles = ['admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role. Allowed roles are: ${validRoles.join(", ")}`);
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin user
    const admin = new AdminUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
    });

    await admin.save();
    console.log(`✅ ${role} user created successfully: ${email}`);
    delete admin.password; // remove password field
    return admin;
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
}

//@descr Initialize superadmin creation
async function initializeSuperAdmin() {
  try {
    // check if already exists
    const existingSuperAdmin = await AdminUser.findOne({ role: "superadmin" });
    if (existingSuperAdmin) {
      console.log("ℹ Superadmin already exists. Skipping superadmin initialization.");
      return; // exit early, nothing to create
    }
    // if not exist create
    const superAdmin = await createAdminUser({
      firstName: process.env.SUPERADMIN_FIRSTNAME,
      lastName: process.env.SUPERADMIN_LASTNAME,
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: "superadmin"
    });
    return superAdmin;
  } catch (error) {
    // Error already logged in createSuperAdminUser
    throw error;
  }
}

module.exports = {
  createAdminUser,
  initializeSuperAdmin,
};
