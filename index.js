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

app.use(cors({ origin: "*", credentials: true }));

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
  console.log(err);
  let code = 500;
  let message = "";
  switch (err.code) {
    case 1451:
      message = "Item cannot be deleted or update as its used somewhere else";
      break;
    case 404:
      message = err.message + " not found";
      break;
    case 500:
      message = "Internal Server Error in " + err.message;
      break;
    default:
      if (typeof err === "string") {
        message = err;
      } else {
        message = "Internal Server Error in " + err.message;
      }
      break;
  }
  res.status(code).json({ message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
