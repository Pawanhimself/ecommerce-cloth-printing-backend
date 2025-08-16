const router = require("express").Router();
const { userRegister, userLogin } = require('../controllers/authController');
const { adminLogin, adminCreation } = require('../controllers/adminAuthController');
const { authorize } = require("../middlewares/authMiddleware");


router.post("/register", userRegister);
router.post("/login", userLogin);

router.post("/admin/login", adminLogin);

router.post("/superadmin/createAdmin", authorize({ type: "admin", allowedRoles: ["superadmin"] }), adminCreation); //only super admin can create admins

module.exports = {
    authRoutes: router
  };