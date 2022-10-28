const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');
const tripController = require('./controllers/tripController');

const router = require('express').Router();

  

router.use('/', homeController);
router.use('/auth', authController);
router.use('/trip', tripController);

module.exports = router;