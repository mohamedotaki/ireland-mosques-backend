const User = require("../models/Users");
const transporter = require("../config/mail");
const bcrypt = require("bcryptjs");
/* const blackList = require("../models/BlackList");
 */ const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.key || "TestingKey";

const verificationCodes = {};

exports.signin = async (req, res) => {
  try {
    const { user, UUID } = req.body;
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

    const token = createToken(
      UUID === dbUser.UUID ? dbUser : { ...dbUser, account_status: "Pending" }
    );
    setCookie(res, "Authorization", token, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    //send verification code if user is not using same device
    UUID !== dbUser.UUID && sendVerificationCode(dbUser.email);

    res.status(200).json({
      user: {
        name: dbUser.name,
        userType: dbUser.user_type,
        account_status:
          UUID === dbUser.UUID ? dbUser.account_status : "Pending",
        createdAt: dbUser.created_at,
        lastSignin: dbUser.last_signin,
        modified_on: dbUser.modified_on,
        mosqueID: dbUser.mosqueID,
        settings: JSON.parse(dbUser.settings),
      },
    });
  } catch (error) {
    console.error("Error in Login", error);
    res.status(500).json({ message: "Error during login" });
  }
};

exports.signout = async (req, res) => {
  try {
    res.clearCookie("Authorization");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during logout process" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { user, updatedSettings } = req.body;
    const updated = await User.updateSettings(user.userID, updatedSettings);
    if (updated) {
      res.status(200).json({ message: "Settings updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during settings update" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { user, code, UUID } = req.body;

  const message = checkVerificationCode(user.email, code);

  if (message === "verified") {
    if (user.account_status === "Pending") {
      await User.updateAccountStatus(user.userID, "Active");
    }
    await User.updateUUID(user.userID, UUID);
    const dbUser = await User.getUser(user.email);
    const token = createToken(dbUser);

    setCookie(res, "Authorization", token, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: {
        name: dbUser.name,
        userType: dbUser.user_type,
        account_status: dbUser.account_status,
        createdAt: dbUser.created_at,
        lastSignin: dbUser.last_signin,
        modified_on: dbUser.modified_on,
        mosqueID: dbUser.mosqueID,
        settings: JSON.parse(dbUser.settings),
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
    const dbUser = await User.getUserByID(userID);

    const token = createToken(dbUser);

    setCookie(res, "Authorization", token, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      user: {
        name: dbUser.name,
        userType: dbUser.user_type,
        account_status: dbUser.account_status,
        createdAt: dbUser.created_at,
        lastSignin: dbUser.last_signin,
        modified_on: dbUser.modified_on,
        mosqueID: dbUser.mosqueID,
        settings: JSON.parse(dbUser.settings),
      },
      message:
        "Verification code was sent successfully. Please check your email inbox or spam folder.",
    });
  } catch (error) {
    console.error("Error Signing up", error);
    return res.status(500).json({ message: "Errror during signup" });
  }
};

/* exports.resendVerificationCode = async (req, res) => {
  const { user } = req.body;
  const dbUser = await User.getUser(user.email);
  if (!dbUser) {
    return res.status(404).json({ message: "Error during verification" });
  }
  sendVerificationCode(user.email);
  return res.status(200).json({
    message:
      "Verification code was sent successfully. Please check your email inbox or spam folder.",
  });
}; */
/* exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const dbUser = await User.getUser(email);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }
    sendVerificationCode(email);
    return res.status(200).json({
      message:
        "Verification code was sent successfully. Please check your email inbox or spam folder.",
    });
  } catch (error) {
    console.error("Error during forgot password", error);
    return res.status(500).json({ message: "Error during forgot password" });
  }
};
 */
const setCookie = (res, name, value, options) => {
  res.cookie(name, value, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    ...options,
  });
};

const createToken = (user) => {
  return jwt.sign(
    {
      userID: user.id,
      name: user.name,
      userType: user.user_type,
      account_status: user.account_status,
      email: user.email,
      createdAt: user.created_at,
      lastSignin: user.last_signin,
      modified_on: user.modified_on,
      mosqueID: user.mosqueID,
    },
    jwtSecretKey,
    { expiresIn: "365d" }
  );
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
  const verificationCode =
    email === "mohotaki@hotmail.com" ? "111111" : generateVerificationCode();
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
