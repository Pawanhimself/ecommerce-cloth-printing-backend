const router = require("express").Router();
const { userRegister, userLogin } = require('../controllers/authController');
const { adminLogin } = require('../controllers/adminAuthController');

router.post("/register", userRegister);
router.post("/login", userLogin);

router.post("/admin/login", adminLogin);

module.exports = {
    authRoutes: router
  };