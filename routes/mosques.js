const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const mosquesController = require("../controllers/mosquesController");
const authMiddleware = require("../middleware/authMiddleware");

// Validation middleware
const mosqueValidation = [
  body("mosque").exists().withMessage("Mosque object is required"),
  body("mosque.name")
    .notEmpty()
    .withMessage("Mosque name is required")
    .isString()
    .withMessage("Mosque name must be a string")
    .isLength({ min: 3 })
    .withMessage("Mosque name invalid length"),
  body("mosque.location")
    .notEmpty()
    .withMessage("Mosque location is required")
    .isString()
    .withMessage("Mosque location must be a string")
    .isLength({ min: 4 })
    .withMessage("Mosque name invalid length"),
  body("mosque.contact_number")
    .notEmpty()
    .withMessage("Mosque contact number is required")
    .isString()
    .withMessage("Mosque contact number must be a string")
    .isLength({ min: 7 })
    .withMessage("Mosque contact number invalid length"),
];

// Create route
router.post(
  "/",
  mosqueValidation,
  authMiddleware.inputValidation,
  mosquesController.createMosque
);

// Create route
router.get("/:date/:ssss", mosquesController.hello);
module.exports = router;

// Create route
router.put(
  "/",
  mosqueValidation,
  authMiddleware.inputValidation,
  mosquesController.createMosque
);

// Create route
router.delete(
  "/",
  mosqueValidation,
  authMiddleware.inputValidation,
  mosquesController.createMosque
);
