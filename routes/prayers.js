const express = require("express");
const router = express.Router();
const prayerController = require("../controllers/prayerController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const prayerChangeValidation = [
  // mosqueID: required and must be numeric
  body("mosqueID")
    .exists({ checkFalsy: true })
    .withMessage("mosqueID is required")
    .isNumeric()
    .withMessage("mosqueID must be a number"),

  // prayerID: required and must be numeric
  body("prayerID")
    .exists({ checkFalsy: true })
    .withMessage("prayerID is required")
    .isNumeric()
    .withMessage("prayerID must be a number"),

  // isIqamah: required and must be boolean
  body("isIqamah")
    .exists()
    .withMessage("isIqamah is required")
    .isBoolean()
    .withMessage("isIqamah must be a boolean"),

  // newPrayerTime: optional if isIqamah is true, otherwise must be a date
  body("newPrayerTime")
    .optional()
    .custom(
      (value) => value === null || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
    )
    .withMessage("newPrayerTime must be in HH:mm 24-hour format or null"),

  // offset: required only if isIqamah is true and newPrayerTime is not provided
  body("offset").custom((value, { req }) => {
    const isIqamah = req.body.isIqamah;
    const newPrayerTime = req.body.newPrayerTime;

    if (isIqamah === true || isIqamah === "true") {
      if (
        !newPrayerTime &&
        (value === undefined || value === null || value === "")
      ) {
        throw new Error(
          "offset is required if isIqamah is true and newPrayerTime is not provided"
        );
      }
      if (value !== undefined && isNaN(value)) {
        throw new Error("offset must be a number");
      }
    }
    return true;
  }),
];

// Register user
router.post(
  "/prayertime",
  authMiddleware.verifyToken,
  prayerChangeValidation,
  authMiddleware.inputValidation,
  prayerController.updatePrayerTime
);

module.exports = router;
