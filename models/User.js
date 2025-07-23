const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isActive:  { type: Boolean, default: true } // for soft delete option for users
}, { timestamps: true }); // add timestamp

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
    return token;
}

const User = mongoose.model("User", userSchema);

// used for user registration and validation
const validateRegistration = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
	confirmPassword: Joi.string().required().valid(Joi.ref('password')).strip()
    });
    return schema.validate(data);
}

// used for user login and validation
const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
}

module.exports = {User, validateRegistration, validateLogin};
