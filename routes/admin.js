const express = require('express');

const {
    getPendingVerification,
    verifyPartner,
    getAdminStats,
    createCategory,
    createLocation,
    deleteCategory,
    deleteLocation,
    getCategories,
    getLocations,
    promotePartner,
    updateCategory,
    updateLocation
} = require('../controllers/adminController');
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

router.route('/categories').post(restrictTo('admin'), createCategory).get(restrictTo('admin'), getCategories);

router.route('/categories/:id').put(restrictTo('admin'), updateCategory).delete(restrictTo('admin'), deleteCategory);

// --- Locations CRUD ---
router.route('/locations').post(restrictTo('admin'), createLocation).get(restrictTo('admin'), getLocations);

router.route('/locations/:id').put(restrictTo('admin'), updateLocation).delete(restrictTo('admin'), deleteLocation);


module.exports = router;