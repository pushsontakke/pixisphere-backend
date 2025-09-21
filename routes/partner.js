const express = require('express');
const { submitOnboarding } = require('../controllers/partnerController');
const { protect, restrictTo } = require('../middlewares/authMiddlewares');
const { addPortfolioItem, editPortfolioItem, deletePortfolioItem, getMyPortfolio, reorderPortfolio } = require('../controllers/portfolioController');

const router = express.Router();

router.use(protect);

router.route('/onboard'). post(restrictTo('partner'), submitOnboarding);

router.route('/portfolio').post(restrictTo('partner'), addPortfolioItem);
router.route('/portfolio').get(restrictTo('partner'), getMyPortfolio);
router.route('/portfolio/:itemId').put(restrictTo('partner'), editPortfolioItem);
router.route('/portfolio/:itemId').delete(restrictTo('partner'), deletePortfolioItem);
router.route('/portfolio/reorder').put(restrictTo('partner'), reorderPortfolio);


module.exports = router;