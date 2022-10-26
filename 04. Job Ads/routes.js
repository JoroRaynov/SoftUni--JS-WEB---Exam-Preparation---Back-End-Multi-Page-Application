const adsController = require('./controllers/adsController');
const { route } = require('./controllers/authController');
const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');

const router = require('express').Router();

  

router.use('/', homeController);
router.use('/auth', authController);
router.use('/ads', adsController);

module.exports = router;