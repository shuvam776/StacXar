const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const app = express();



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

const authRoutes = require('./routes/auth.routes');
const videoRoutes = require('./routes/video.routes');
const roadmapRoutes = require('./routes/roadmap.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const profileRoutes = require('./routes/profile.routes');


app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);

const { errorHandler } = require('./middlewares/error.middleware');
app.use(errorHandler);

module.exports = { app };
