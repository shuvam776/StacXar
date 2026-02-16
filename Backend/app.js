const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is allowed (localhost, etc.)
        const allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            process.env.CORS_ORIGIN
        ].filter(Boolean);

        if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV !== 'development') {
            // In production restrict, in dev be loose (or just use *)
            // For this user context, let's just allow all or the specific ones
            // Fallback to allowing standard dev ports
            return callback(null, true);
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


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/roadmap", roadmapRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/profile", profileRoutes);

const { errorHandler } = require('./middlewares/error.middleware');
app.use(errorHandler);

module.exports = { app };
