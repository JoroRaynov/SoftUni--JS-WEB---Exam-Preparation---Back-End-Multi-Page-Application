const auctionController = require('express').Router();
const auctionService = require('../services/auctionService');
const { isAuth } = require('../middlewares/authMiddleware');
const errorParser = require('../utils/errorParser');

auctionController.get('/browse', async (req, res) => {
    const auctions = await auctionService.getAll();

    res.render('browse', { auctions });
});


auctionController.get('/create', isAuth, (req, res) => {
    res.render('create');
});

auctionController.post('/create', isAuth, async (req, res) => {

    console.log(req.body);
    const newAuction = {
        title: req.body.title,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        author: req.user._id
    }

    try {
        if (Object.values(newAuction).some(a => !a)) {
            throw new Error('All fields are required');
        }
        await auctionService.create(newAuction);
        res.redirect('/auction/browse');

    } catch (error) {
        res.render('create', { 
            errors: errorParser(error),
            body: req.body
        });
    }
 
});

module.exports = auctionController;