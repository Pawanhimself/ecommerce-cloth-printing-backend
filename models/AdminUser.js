const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const adminUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

adminUserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
}

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

const validateAdminCreation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(100).required().label("First Name"),
    lastName: Joi.string().min(2).max(100).required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"), // TODO: password complexity required
    role: Joi.string().valid('admin', 'superadmin').required().label("Role")
  });
  return schema.validate(data);
}

const validateAdminLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password")
  });
  return schema.validate(data);
}

module.exports = { AdminUser, validateAdminCreation, validateAdminLogin };