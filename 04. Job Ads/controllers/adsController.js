const adsController = require('express').Router();
const adsService = require('../services/adsService');

adsController.get('/allAds', async (req, res) => {

    const ads = await adsService.getAll();
    res.render('all-ads', { ads });
});





module.exports = adsController;