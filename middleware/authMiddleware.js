const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.key || "TestingKey";
const { validationResult } = require("express-validator");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.Authorization;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please login", redirectTo: "/" });
    }

    if (decoded.account_status !== "Active" && req.path !== "/verify") {
      return res
        .status(403)
        .json({ message: `Your account is ${decoded.account_status}.` });
    }
    req.body.user = decoded;
    next();
  });
};

exports.inputValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  } else {
    next();
  }
};
/* 
// Basic rate limiter middleware
exports.loginLimiter = async (req, res, next) => {
  try {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ip = forwardedFor ? forwardedFor.split(",")[0] : req.ip;
    req.userIP = ip;
    const availableIP = await blackList.getIp(ip);
    if (availableIP) {
      if (availableIP.count < 3) {
        if (await blackList.loginCountUp(ip, availableIP.count)) {
          req.availableIp = { count: availableIP.count + 1 };
          next();
        }
      } else {
        res.status(429).json({ message: "Acount Blocked. Contact Admin." });
      }
    } else {
      if (await blackList.addToBlackList(ip)) {
        req.availableIp = { count: 1 };
        next();
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error." });
  }
}; */

// Middleware to check user permissions
exports.checkPermissions = (requiredPermissions) => (req, res, next) => {
  const user = req.body.user; // User should already be set by the `authenticateUser` middleware
  if (!user) {
    return res
      .status(401)
      .json({ message: "Unauthorized. User not authenticated." });
  }

  // Check if the user has the required permissions
  const hasPermission = requiredPermissions.includes(user.userType);

  if (!hasPermission) {
    return res
      .status(403)
      .json({ message: "Forbidden. Insufficient permissions." });
  }

  next(); // User has permissions, proceed to the next handler
};
