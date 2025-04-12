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

router.get("/signout", authMiddleware.verifyToken, authController.signout);

module.exports = router;
