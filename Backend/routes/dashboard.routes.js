
const express = require('express');
const router = express.Router();
const { getDSAStats, getWebDevStats, getAppDevStats } = require('../controllers/dashboard.controller');

// Consistent Auth Handling (placeholder for now, matches roadmap routes)
const authMiddleware = (req, res, next) => {
    next();
};

router.get('/dsa', authMiddleware, getDSAStats);
router.get('/webdev', authMiddleware, getWebDevStats);
router.get('/appdev', authMiddleware, getAppDevStats);

module.exports = router;
