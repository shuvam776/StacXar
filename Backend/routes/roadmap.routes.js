const express = require('express');
const router = express.Router();
const { getRoadmapProgress, updateRoadmapProgress } = require('../controllers/roadmap.controller');
// Placeholder for auth middleware if exists, otherwise mock
const authMiddleware = (req, res, next) => {
    // Assuming req.user is populated by some auth middleware already
    // If not, we'd need to extract it from headers/token
    next();
};

router.get('/progress', authMiddleware, getRoadmapProgress);
router.post('/update', authMiddleware, updateRoadmapProgress);

module.exports = router;
