
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile.controller');

// Consistent Auth Handling (placeholder)
const authMiddleware = (req, res, next) => {
    // If auth middleware exists, run it here.
    // For now, controller checks headers['user-email']
    next();
};

const { upload } = require('../middlewares/multer.middleware');

router.get('/', authMiddleware, getProfile);
router.post('/update', authMiddleware, upload.single('avatar'), updateProfile);

module.exports = router;
