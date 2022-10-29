const homeController = require('express').Router(); 
const housingService = require('../services/housingService')
//TODO replace with the real homecontroller

homeController.get('/', async (req, res) => {
    const firstThree = await housingService.getFirstThree();
    res.render('home', {firstThree});
});




module.exports = homeController;