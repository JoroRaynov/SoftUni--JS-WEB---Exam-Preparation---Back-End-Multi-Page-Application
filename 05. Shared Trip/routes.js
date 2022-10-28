const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');
const tripController = require('./controllers/tripController');
const userController = require('./controllers/userController');

const router = require('express').Router();

  

router.use('/', homeController);
router.use('/auth', authController);
router.use('/trip', tripController);
router.use('/user', userController);
router.use('*', (req, res) => {
    res.render('404')
});

module.exports = router;