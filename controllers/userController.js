const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  try {
    // Retrieve users from database
    const user = await User.getUsers();
    res.status(200).json(user);
  } catch (error) {
    console.error("get Users", error);
    next(error);
  }
};

exports.getDrivers = async (req, res, next) => {
  try {
    // Retrieve users from database
    const user = await User.getDrivers();
    res.status(200).json(user);
  } catch (error) {
    console.error("get Drivers", error);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.deleteUser(id);
    res.status(200).json(user);
  } catch (error) {
    console.error("delete User", error);
    next(error);
  }
};

exports.storeToken = async (token, userID) => {
  try {
    const user = await User.storeToken(token, userID);
  } catch (error) {
    console.error("store Token", error);

    return false;
  }
};
