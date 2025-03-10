const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected route (example)
/* router.get("/profile", authMiddleware.verifyToken, userController.ge);

 */
router.get("/", authMiddleware.verifyToken, userController.getUsers);

router.get("/drivers", authMiddleware.verifyToken, userController.getDrivers);

router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermissions(["Admin"]),
  userController.deleteUser
);

module.exports = router;
