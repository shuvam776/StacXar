
const express = require('express');
const router = express.Router();
const { getDSAStats, getWebDevStats } = require('../controllers/dashboard.controller');

// Consistent Auth Handling (placeholder for now, matches roadmap routes)
const authMiddleware = (req, res, next) => {
    // If we have middleware that populates req.user, it would run before this
    // If not, controller handles header fallback
    next();
};

router.get('/dsa', authMiddleware, getDSAStats);
router.get('/webdev', authMiddleware, getWebDevStats);

module.exports = router;
