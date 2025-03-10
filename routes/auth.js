/* 
This File is done nothing else need to be done
 */ /* 
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const { body } = require("express-validator");

// Register user
router.post(
  "/register",
  authMiddleware.verifyToken,
  authMiddleware.checkPermissions(["Admin"]),
  [body("userToAdd").notEmpty()],
  authController.register
);

router.put(
  "/user/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermissions(["Admin"]),
  [body("userToUpdate").notEmpty()],
  authController.updateUser
);

// Login user
router.post("/login", authMiddleware.loginLimiter, authController.login);
router.get("/refreshAccess", authController.generateAccessToken);
router.get("/checkLoginStatus", authController.checkLoginStatues);
router.get("/signout", authController.signout);

// Login user Sage

router.get("/sageAuth", authController.sageAuth);
router.get("/sageCallback", authController.sageCallBack);
router.get(
  "/sageRevoke",
  authMiddleware.verifyToken,
  authController.sageTokenRevoke
);
router.get(
  "/refreshSageAccess",
  authMiddleware.verifyToken,
  authController.generateSageAccessToken
);

module.exports = router;
 */
