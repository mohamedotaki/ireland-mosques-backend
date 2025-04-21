const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const newPostValidation = [
  // mosqueID: required and must be numeric
  body("post").exists({ checkFalsy: true }).withMessage("post is required"),
  body("post.contant").isString().withMessage("post must be a string"),
];

// Register user
router.post(
  "/",
  authMiddleware.verifyToken,
  newPostValidation,
  authMiddleware.inputValidation,
  postsController.createPost
);

/* // Register user
router.put(
  "/",
  authMiddleware.verifyToken,
  newPostValidation,
  authMiddleware.inputValidation,
  prayerController.updatePrayerTime
); */

/* router.delete(
  "/",
  authMiddleware.verifyToken,
  newPostValidation,
  authMiddleware.inputValidation,
  prayerController.updatePrayerTime
); */

router.get("/", postsController.getPost);

module.exports = router;
