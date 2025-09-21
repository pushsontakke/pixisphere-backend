const express = require('express');

const { getPendingVerification, verifyPartner, getAdminStats } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.use(protect);

// Get pending verifications
// GET /api/admin/verifications
router.route('/verifications').get(restrictTo('admin'), getPendingVerification);

// Approve or reject a partner
// PUT /api/admin/verify/:id
router.route('/verifications/:id').put(restrictTo('admin'), verifyPartner);

// Get admin stats
// GET /api/admin/stats
router.route('/stats').get(restrictTo('admin'), getAdminStats);

module.exports = router;