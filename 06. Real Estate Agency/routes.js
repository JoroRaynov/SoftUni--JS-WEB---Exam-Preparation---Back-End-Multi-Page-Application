const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');
const housingController = require('./controllers/housingController');

const router = require('express').Router();

  

router.use('/', homeController);
router.use('/auth', authController);
router.use('/housing', housingController);
router.use('*', (req,res) => {
    res.render('404')
});

module.exports = router;