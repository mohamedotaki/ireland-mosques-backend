const User = require("../models/Users");
const transporter = require("../config/mail");
const bcrypt = require("bcryptjs");
/* const crypto = require("crypto");
 */ /* const blackList = require("../models/BlackList");
 */ const jwt = require("jsonwebtoken");
/* const { validationResult } = require("express-validator");
 */ const jwtSecretKey = process.env.key || "TestingKey";
/* const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "1Sfr%3£%^GDhr5";
 */

const verificationCodes = {};

exports.signin = async (req, res) => {
  try {
    const { user } = req.body;
    // Retrieve user from database
    const dbUser = await User.getUser(user.email);
    const message = {
      message: "Invalid credentials",
    };
    if (!dbUser) {
      return res.status(401).json(message);
    }
    // Validate password
    const passwordMatch = await bcrypt.compare(user.password, dbUser.password);

    if (!passwordMatch) {
      return res.status(401).json(message);
    }
    if (dbUser.account_status === "Active") {
      const token = jwt.sign(
        {
          userID: dbUser.id,
          email: dbUser.email,
          userType: dbUser.user_type,
        },
        jwtSecretKey,
        { expiresIn: "365d" }
      );
      setCookie(
        res,
        "Authorization",
        token,
        { maxAge: 365 * 24 * 60 * 60 * 1000 },
        false
      );
    }
    res.status(200).json({
      user: {
        userID: dbUser.id,
        name: dbUser.name,
        userType: dbUser.user_type,
        account_status: dbUser.acount_status,
        email: dbUser.email,
        createdAt: dbUser.created_at,
      },
    });
  } catch (error) {
    console.error("Error in Login", error);
    res.status(500).json({ message: "Error during login" });
  }
};

exports.signout = async (req, res) => {
  try {
    const { user } = req.body;
    const dbUser = await User.getUserByID(user.userID);
    if (!dbUser) {
      return res.status(500).json({ message: "Error during logout process" });
    }
    // Clear cookies
    res.clearCookie("Authorization");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during logout process" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { user, code } = req.body;
  console.log(user, code);
  const dbUser = await User.getUser(user.email);
  if (!dbUser) {
    return res.status(404).json({ message: "Error during verification" });
  }
  if (
    verificationCodes[user.email] &&
    verificationCodes[user.email].verificationCode === code
  ) {
    verificationCodes[user.email].attempts++;
    if (verificationCodes[user.email].expiresAt < new Date()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }
    if (verificationCodes[user.email].attempts >= 6) {
      return res.status(400).json({
        message: "Too many attempts",
      });
    }
    await User.updateAccountStatus(dbUser.id, "Active");
    const token = jwt.sign(
      {
        userID: dbUser.id,
        email: dbUser.email,
        userType: dbUser.user_type,
      },
      jwtSecretKey,
      { expiresIn: "365d" }
    );
    setCookie(
      res,
      "Authorization",
      token,
      { maxAge: 365 * 24 * 60 * 60 * 1000 },
      false
    );
    verificationCodes[user.email].attempts = 0;
    return res.status(200).json({
      user: {
        userID: dbUser.id,
        name: dbUser.name,
        userType: dbUser.user_type,
        account_status: "Active",
        email: dbUser.email,
        createdAt: dbUser.created_at,
      },
      message: "Email verified successfully",
    });
  }
  verificationCodes[email].attempts++;
  return res.status(400).json({ message: "Invalid verification code" });
};

exports.signup = async (req, res, next) => {
  try {
    const { user } = req.body;
    // Check if user already exists
    const existingUser = await User.getUser(user.email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    const userID = await User.createUser(user);
    const verificationCode = generateVerificationCode();
    sendVerificationCode(user.email, verificationCode);
    verificationCodes[user.email] = {
      verificationCode,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
      attempts: verificationCodes[user.email].attempts || 0,
    };

    return res.status(200).json({
      user: {
        userID,
        name: user.name,
        email: user.email,
        account_status: "Pending",
        user_type: "User",
        createdAt: new Date(),
      },
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Error Signing up", error);
    return res.status(500).json({ message: "Errror during signup" });
  }
};

const setCookie = (res, name, value, options, httpOnly = true) => {
  res.cookie(name, value, {
    httpOnly,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    ...options,
  });
};

// Generate a random verification code
const generateVerificationCode = () => {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const sendVerificationCode = async (email, code) => {
  // Create the email message
  const mailOptions = {
    from: "noreply@alotaki.com", // Replace with your email
    to: email, // Recipient's email
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };
  const expirationTime = Date.now() + 5 * 60 * 1000; // Code expires in 5 minutes
  verificationCodes[email] = { code: code, expiresAt: expirationTime };
  await transporter.sendMail(mailOptions);
};
