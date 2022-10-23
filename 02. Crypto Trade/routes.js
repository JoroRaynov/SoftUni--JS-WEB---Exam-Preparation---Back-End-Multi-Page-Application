const authController = require('./controllers/authController');
const cryptoController = require('./controllers/cryptoController');
const homeController = require('./controllers/homeController');

const router = require('express').Router();

  

router.use('/', homeController);
router.use('/auth', authController);
router.use('/crypto', cryptoController);
router.use('*', (req, res) => {
    res.render('404')
})


module.exports = router;