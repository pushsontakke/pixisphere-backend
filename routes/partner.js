const express = require('express');
const { submitOnboarding } = require('../controllers/partnerController');
const { protect, restrictTo } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.use(protect);

router.route('/onboard'). post(restrictTo('partner'), submitOnboarding);

module.exports = router;