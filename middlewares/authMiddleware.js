const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

// used to authorize the user access
const authorize = async (req, res, next) => {
  try {
    let token;

    // authorization 
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // space is the separator after 'Bearer'
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);// JWT time out check

    const user = await User.findById(decoded._id).select("-password"); // Remove password from returned user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {

    // expired
    if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Unauthorized: Token expired" });
  }

    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

module.exports = authorize;
