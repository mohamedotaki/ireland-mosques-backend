const express = require("express");
const router = express.Router();
const appDataController = require("../controllers/appDataController");

// Create route
router.get(
  "/",

  appDataController.appLunch
);

module.exports = router;
