const userController = require('express').Router();
const {isAuth } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');


userController.get('/profile', isAuth, async (req, res) => {

    const user = await authService.getUserById(req.user._id).populate('tripHistory').lean();
    const trips = user.tripHistory;
    console.log(user.tripHistory.length);
        res.render('user/profile', {trips})
});


module.exports = userController;