const auctionController = require('./controllers/auctionController');
const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');

const router = require('express').Router();

  

router.use('/', homeController);
router.use('/auth', authController);
router.use('/auction', auctionController);

module.exports = router;