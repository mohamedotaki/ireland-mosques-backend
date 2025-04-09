const express = require("express");
const router = express.Router();
const appDataController = require("../controllers/appDataController");

// Create route
router.get(
  "/",

  appDataController.appLunch
);

// Create route
router.get(
  "/checkForNewData",

  appDataController.checkForNewData
);

module.exports = router;
