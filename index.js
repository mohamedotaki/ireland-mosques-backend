const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mosquesRoutes = require("./routes/mosques");
const feedbacksRoutes = require("./routes/feedbacks");
const appDataRoutes = require("./routes/appData");
const authRoute = require("./routes/auth");
const prayersRoute = require("./routes/prayers");
const postsRoute = require("./routes/posts");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const app = express();
app.use(compression());
const port = process.env.PORT || 3001;
const apiVersion = "v3";

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://irelandmuslims.alotaki.com"
        : "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/mosques", mosquesRoutes);
app.use("/api/feedbacks", feedbacksRoutes);
app.use("/api/app", appDataRoutes);
app.use("/api/auth", authRoute);
app.use("/api/prayers", prayersRoute);
app.use("/api/posts", postsRoute);

app.get("/", (req, res) => {
  res.send(apiVersion);
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      "Internal Server Error: An unknown error occurred. Please try again later.",
  });
});

// Start server
app.listen(port, () => {
  console.error(`Server running on port ${port}`);
});
