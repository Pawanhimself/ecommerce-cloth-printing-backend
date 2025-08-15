const { AdminUser, validateAdminLogin } = require("../models/AdminUser");
const bcrypt = require("bcrypt");

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
        return res.status(200).send({ success: true, data: token, message: "Admin logged in successfully" });
    }
    catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}