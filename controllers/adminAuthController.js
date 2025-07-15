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
        res.status(200).send({ data: token, message: "Admin logged in successfully" });
    }
    catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}