const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const loginValidation = [
  body("user").exists().withMessage("User object is required"),
  body("user.email")
    .notEmpty()
    .withMessage("User email is required")
    .isString()
    .withMessage("User email must be a string"),
  body("user.password")
    .notEmpty()
    .withMessage("User password is required")
    .isString()
    .withMessage("User password must be a string"),
];

const signupValidation = [
  body("user.confirmPassword")
    .notEmpty()
    .withMessage("User confirmPassword is required")
    .isString()
    .withMessage("User confirmPassword must be a string"),
  body("user.phoneNumber")
    .notEmpty()
    .withMessage("User phoneNumber is required")
    .isString()
    .withMessage("User phoneNumber must be a string"),
  body("user.settings")
    .notEmpty()
    .withMessage("User settings are required")
    .isObject()
    .withMessage("User settings must be a valid object"),
];

const settingsValidation = [
  body("updatedSettings")
    .notEmpty()
    .withMessage("updatedSettings are required")
    .isObject()
    .withMessage("updatedSettings must be a valid object"),
];

const sinoutValidation = [
  body("userID").notEmpty().withMessage("userID is required"),
];

// Register user
router.post(
  "/signup",
  loginValidation,
  signupValidation,
  authMiddleware.inputValidation,
  authController.signup
);

router.post(
  "/signin",
  loginValidation,
  authMiddleware.inputValidation,
  /*   authMiddleware.loginLimiter,
   */ authController.signin
);

router.post(
  "/verify",
  authMiddleware.verifyToken,
  /*   loginValidation,
  authMiddleware.inputValidation, */
  authController.verifyEmail
);

router.put(
  "/settings",
  authMiddleware.verifyToken,
  settingsValidation,
  authMiddleware.inputValidation,
  authController.updateSettings
);

router.get("/signout", authMiddleware.verifyToken, authController.signout);

module.exports = router;
