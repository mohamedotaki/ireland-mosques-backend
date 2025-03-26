const nodemailer = require("nodemailer");

// Create a transporter for sending emails using SMTP (Gmail example)
const transporter = nodemailer.createTransport({
  host: "mosqueapp.alotaki.com", // Replace with your cPanel email server address
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: true, // Set to true for SSL
  auth: {
    user: "noreply@mosqueapp.alotaki.com", // Replace with your email address
    pass: "j({oKnYJih~A", // Replace with your email password (or app password)
  },
});

module.exports = transporter;
