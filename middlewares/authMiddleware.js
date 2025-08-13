const jwt = require("jsonwebtoken");

// used to authorize the user access
const authorizeUser = async (req, res, next) => {
  try {
    let token;

    // authorization 
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // space is the separator after 'Bearer'
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);// JWTPRIVATEKEY - for users
    req.userId = decoded._id;  // Only attach the ID, not the full user
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

module.exports = authorizeUser;
