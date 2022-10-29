const housingController = require('express').Router();



housingController.get('/catalog', async(req, res) => {
    const allHousings = await housingService.getAll();
    res.render('catalog', {allHousings})
})




module.exports = housingController;