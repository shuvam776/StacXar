const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const app = express();

// Simple Request Logger for Debugging 404s
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is allowed (localhost, etc.)
        const allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:8000',
            'http://localhost:5000',
            'https://stacxar.onrender.com',
            process.env.CORS_ORIGIN
        ].filter(Boolean);

        if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV !== 'development') {
            // In production restrict to known origins
            return callback(new Error('Not allowed by CORS'), false);
        }
        return callback(null, true);
    },
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
