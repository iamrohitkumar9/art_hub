require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./utilities/db");
// import middlerwares
const errorLogger = require("./utilities/errorLogger");
const requestLogger = require("./utilities/requestLogger");

// Connect MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(requestLogger);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const artistRoutes = require("./routes/artistsRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const orderRoutes = require("./routes/orderRoutes");
const communityRoutes = require("./routes/communityRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");

// Route Mapping
app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/categories", categoriesRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Arthub Backend Running Successfully...");
});
app.use(errorLogger);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
