const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const feedbackController = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");

// Validation middleware
const feedbackValidation = [
  body("feedback").exists().withMessage("feedback object is required"),
  body("feedback.name")
    .notEmpty()
    .withMessage("User name is required")
    .isString()
    .withMessage("User name must be a string")
    .isLength({ min: 3 })
    .withMessage("Mosque name invalid length"),
  body("feedback.email")
    .notEmpty()
    .withMessage("feedback email is required")
    .isString()
    .withMessage("feedback email must be a string")
    .isLength({ min: 8 })
    .withMessage("Email invalid length"),
  body("feedback.message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string")
    .isLength({ min: 10 })
    .withMessage("Message invalid length"),
];

// Create route
router.post(
  "/",
  feedbackValidation,
  authMiddleware.inputValidation,
  feedbackController.createFeedback
);

// Create route
router.get(
  "/:id",
  feedbackValidation,
  authMiddleware.inputValidation,
  feedbackController.getAllFeedbacks
);

// Create route
router.put(
  "/:id",
  feedbackValidation,
  authMiddleware.inputValidation,
  feedbackController.markFeedbackAsCompleted
);

module.exports = router;
