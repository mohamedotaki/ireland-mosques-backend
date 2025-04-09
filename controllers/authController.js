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

    sendVerificationCode(dbUser.email);

    res.status(200).json({
      user: {
        userID: dbUser.id,
        name: dbUser.name,
        userType: dbUser.user_type,
        account_status: "Pending",
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
  const dbUser = await User.getUser(user.email);
  if (!dbUser) {
    return res.status(404).json({ message: "Error during verification" });
  }

  const message = checkVerificationCode(user.email, code);
  if (message === "verified") {
    if (dbUser.account_status === "Pending") {
      await User.updateAccountStatus(dbUser.id, "Active");
    }
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
  return res.status(400).json({ message });
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
    sendVerificationCode(user.email);

    return res.status(200).json({
      user: {
        userID,
        name: user.name,
        email: user.email,
        account_status: "Pending",
        user_type: "User",
        createdAt: new Date(),
      },
      message:
        "Verification code was sent successfully. Please check your email inbox or spam folder.",
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

const sendVerificationCode = async (email) => {
  const verificationCode = generateVerificationCode();
  // Create the email message
  const mailOptions = {
    from: "noreply@alotaki.com", // Replace with your email
    to: email, // Recipient's email
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };
  const expirationTime = Date.now() + 5 * 60 * 1000; // Code expires in 5 minutes

  verificationCodes[email] = {
    verificationCode,
    expiresAt: expirationTime,
    attempts: verificationCodes[email]?.attempts || 0,
    date: verificationCodes[email]?.Date || new Date().getDate(),
  };
  await transporter.sendMail(mailOptions);
};

const checkVerificationCode = (email, code) => {
  if (verificationCodes[email]) {
    if (verificationCodes[email].attempts >= 6) {
      if (verificationCodes[email].date === new Date().getDate()) {
        return "Too many attempts. Please try again later";
      } else {
        verificationCodes[email].attempts = 0;
        verificationCodes[email].date = new Date().getDate();
      }
    }
    verificationCodes[email].attempts++;
    if (verificationCodes[email].verificationCode === code) {
      if (verificationCodes[email].expiresAt < new Date()) {
        return "Verification code has expired";
      }
      /*     const dbUser = await User.getUser(email);
       */
      delete verificationCodes[email];
      return "verified";
    }
  }

  return "Invalid verification code";
};
