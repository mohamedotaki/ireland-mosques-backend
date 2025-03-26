const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mosquesRoutes = require("./routes/mosques");
const feedbacksRoutes = require("./routes/feedbacks");
const appDataRoutes = require("./routes/appData");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.port || 3001;
const appUrl = process.env.port || "http://192.168.0.11:3000";

app.use(cors({ origin: appUrl, credentials: true }));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/mosques", mosquesRoutes);
app.use("/api/feedbacks", feedbacksRoutes);
app.use("/api/app", appDataRoutes);
app.use("/api/auth", authRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
