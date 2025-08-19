const { AdminUser, validateAdminLogin, validateAdminCreation } = require("../models/AdminUser");
const bcrypt = require("bcrypt");
const { createAdminUser } = require("../utils/createAdminUser");

exports.adminLogin = async (req, res) => {
    try {
        const { error } = validateAdminLogin( req.body );
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const adminUser = await AdminUser.findOne({email: req.body.email});
        if (!adminUser) {
            return res.status(401).send({ message: "Invalid email or password" });
        }
        
        const validPassword = await bcrypt.compare(req.body.password, adminUser.password);
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid email or password" });
        }   
        const token = adminUser.generateAuthToken();
        return res.status(200).send({ success: true, token: token, message: "Admin logged in successfully" });
    }
    catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}

// TODO: adminCreation need more refinment 
exports.adminCreation = async (req, res) => { 
    try {
      // check if mistaken superadmin creation
      if (req.user && req.user.role === "superadmin") {
        return res.status(403).json({ error: "Forbidden: Superadmin creation is not allowed." });
      }
      const admin = await createAdminUser(req.body);
      if (!admin) {
        return res.status(400).json({ error: "Admin creation failed." });
      }
      // Remove password before sending response
      const adminObj = admin.toObject ? admin.toObject() : admin;
      delete adminObj.password;
      return res.status(201).json({ success: true, admin: adminObj });
  } catch (error) {
      console.error("Error creating admin:", error.message);
      return res.status(400).send({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
 }