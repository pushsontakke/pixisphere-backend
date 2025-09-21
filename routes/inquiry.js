const express = require('express');
const { submitInquiry, getPartnerLeads } = require('../controllers/inquiryController');
const { protect, restrictTo } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.use(protect);

router.route('/').post(restrictTo('client'), submitInquiry);

router.route('/partner/leads').get(restrictTo('partner'), getPartnerLeads);

module.exports = router;
