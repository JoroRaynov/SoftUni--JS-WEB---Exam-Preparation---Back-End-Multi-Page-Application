const cryptoController = require('express').Router();
const cryptoService = require('../services/cryptoService');
const errorParser = require('../utils/errorParser');
const { isAuth } = require('../middlewares/authMiddleware')


cryptoController.get('/catalog', async (req, res) => {
    const crypto = await cryptoService.getAll();
    res.render('catalog', { crypto })
});

cryptoController.get('/create', (req, res) => {
    res.render('create');
});

cryptoController.post('/create', async (req, res) => {
    console.log(req.body)
    const coin = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        price: Number(req.body.price),
        description: req.body.description,
        paymentMethod: req.body.paymentMethod,
        owner: req.user._id
    };

    try {
        if (Object.values(coin).some(c => !c)) {
            throw new Error('All field are required');
        }
        await cryptoService.create(coin);
        res.redirect('catalog')
    } catch (error) {
        res.render('create', {
            errors: errorParser(error),
            body: req.body
        });
    }
});

cryptoController.get('/:cryptoId/details', async (req, res) => {
    const coin = await cryptoService.getCoinById(req.params.cryptoId).lean();
    console.log(coin);
    if (req.user) {
        const isOwner = coin.owner == req.user._id;
        const isHaveIt = coin.buyACrypto.map(c=> c.toString()).includes(req.user._id.toString());
        return res.render('details', { coin, isOwner, isHaveIt })
    }

    res.render('details', { coin })
});

cryptoController.get('/:cryptoId/buy', isAuth, async (req, res) => {
    const coin = await cryptoService.getCoinById(req.params.cryptoId);
    console.log(coin);
    try {
        if (coin.owner == req.user._id) {
            throw new Error('You can not buy your own coin')
        }
        if(coin.buyACrypto.map(c=> c.toString()).includes(req.user._id.toString())){
            throw new Error('You can not buy twice')
        }
        coin.buyACrypto.push(req.user._id);
        await coin.save();
        res.redirect(`/crypto/${coin._id}/details`);
    } catch (error) {
        res.render('404', { errors: errorParser(error)})
    }
});




module.exports = cryptoController;