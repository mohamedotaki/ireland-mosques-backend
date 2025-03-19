const User = require("../models/Users");

exports.signin = async (req, res, next) => {
  try {
    // Retrieve users from database
    const user = await User.getUsers();
    res.status(200).json(user);
  } catch (error) {
    console.error("get Users", error);
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { user } = req.body;
    // Check if user already exists
    const existingUser = await User.getUser(user.email);
    console.log(existingUser);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (user.password !== user.password2) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }
    // Create new user
    const userId = await User.createUser(user);
    res.status(201).json({ message: userToAdd.username + " was added" });
  } catch (error) {
    console.error("get Users", error);
    next(error);
  }
};
