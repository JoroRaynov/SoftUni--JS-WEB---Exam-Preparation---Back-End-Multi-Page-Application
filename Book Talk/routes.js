const router = require('express').Router();

const bookController = require('./controllers/bookController');
const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');


  

router.use('/', homeController);
router.use('/auth', authController);
router.use('/book', bookController);
router.use('*', (req, res) => {
    res.render('404')
});

module.exports = router;