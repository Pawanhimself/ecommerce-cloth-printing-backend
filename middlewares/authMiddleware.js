const jwt = require("jsonwebtoken");
const { AdminUser } = require("../models/AdminUser");
const { User } = require("../models/User");
require("dotenv").config();

// @desc extract and verify token
const decodeToken = (headers, secret) => {
  // authenticate
  if (!headers.authorization || !headers.authorization.startsWith("Bearer ")) {
   throw new Error("No authorization header");
  }
  const token = headers.authorization.split(" ")[1]; // space is the separator after 'Bearer'
  if (!token) return new Error("No token provided");
  // Verify token
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("TOKEN_EXPIRED");
    }
    throw new Error("INVALID_TOKEN");
  }
};


/**
 * @desc Unified authorization middleware
 * @param {Object} options
 *    - type: "user" | "admin"  (which collection to check)
 *    - allowedRoles: Array<string>    (optional role restrictions for admin)
 *    - checkDb: boolean (optional - whether to check the database for user existence)
 */
const authorize = ({type , allowedRoles, checkDb = false}) => {
  return async (req, res, next) => {
    try {
      const secret = type === "admin" ? process.env.JWT_SECRET : process.env.JWTPRIVATEKEY;
      const decoded = decodeToken(req.headers, secret);

      let account;
      // DB lookup only if required
      if (checkDb) {
        if (type === "user") {
          account = await User.findById(decoded._id).select("_id");
          if (!account) {
            return res.status(403).json({ message: "Access denied: Not a registered user" });
          }
        } else if (type === "admin") {
          account = await AdminUser.findById(decoded._id).select("role _id");
          if (!account) {
            return res.status(403).json({ message: "Access denied: Not an admin" });
          }
          // Role check (only if allowedRoles specified)
          if (allowedRoles && allowedRoles.length && !allowedRoles.includes(account.role)) {
            return res.status(403).json({ message: "Access denied: insufficient permissions" });
          }
        }
      };

      req.user = decoded;
      next();
    } catch (error) {
      if (error.message === "TOKEN_EXPIRED") {
        return res.status(401).json({ message: "Unauthorized: Token expired" });
      }
      return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
    }
  };
};

module.exports = {
  authorize
};
