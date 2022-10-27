const homeController = require('express').Router(); 
const adsService = require('../services/adsService');
//TODO replace with the real homecontroller

homeController.get('/', async (req, res) => {
    const allAds = await adsService.getAll();
    const firstThree = allAds.slice(0, 3);
    res.render('home', {firstThree});
});




module.exports = homeController;