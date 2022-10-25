const auctionController = require('express').Router();
const auctionService = require('../services/auctionService');
const { isAuth } = require('../middlewares/authMiddleware');
const errorParser = require('../utils/errorParser');
const authService = require('../services/authService');

const closedAuctions = [];
auctionController.get('/create', isAuth, (req, res) => {
    res.render('create');
});

auctionController.post('/create', isAuth, async (req, res) => {

    // console.log(req.body);
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

auctionController.get('/browse', async (req, res) => {
    const auctions = await auctionService.getAllMatches();
console.log(auctions);

//    console.log(toRender);
    res.render('browse', { auctions });
});


auctionController.get('/:auctionId/details', async (req, res) => {

    const auction = await auctionService.getOne(req.params.auctionId).lean();
    const isBidder = auction.bidder == req.user?.firstName + ' ' + req.user?.lastName;
    const isAuthor = auction.author._id == req.user?._id;

    try {
        if (!auction) {
            throw new Error('The auction was not found');
        }
        if (isAuthor) {
            // if (auction.bidder) {

                // auction.fullName = auction.bidder.firstName + ' ' + auction.bidder.lastName;
            // }

            return res.render('details-owner', { auction})
        }
        res.render('details', { auction, isBidder, isAuthor });

    } catch (error) {
        res.render('details', { errors: errorParser(error) })
    }
});

auctionController.post('/:auctionId/details', isAuth, async (req, res) => {
    const auction = await auctionService.getOne(req.params.auctionId);
    const isAuthor = auction.author._id == req.user?._id;

    try {
        if (auction.price > req.body.bidAmount) {
            throw new Error('The bit price must be greater then current price');
        }
        if (auction.bidder == req.user._id) {
            throw new Error('You can not set the bit price because you are last bidder')
        }
        auction.price = req.body.bidAmount;
        const fullName = req.user.firstName + ' ' + req.user.lastName;
        auction.bidder = fullName;
        await auction.save();
        res.redirect(`/auction/${req.params.auctionId}/details`);
    } catch (error) {
        res.render('details', {
            errors: errorParser(error),
            auction
        });
    }
});


auctionController.get('/:auctionId/edit', isAuth, async (req, res) => {
    const auction = await auctionService.getOne(req.params.auctionId).lean();
    res.render('edit', { auction })
});

auctionController.post('/:auctionId/edit', isAuth, async (req, res) => {
    const auction = await auctionService.getOne(req.params.auctionId).lean();
    const updated = {
        title: req.body.title,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        description: req.body.description
    }
    if (!auction.bidder) {
        updated.price = req.body.price;
    }

    try {
        if (Object.values(updated).some(a => !a)) {
            throw new Error('All fields are required');
        }
        await auctionService.update(updated, req.params.auctionId);
        res.redirect(`/auction/${req.params.auctionId}/details`)
    } catch (error) {
        res.render('edit', { errors: errorParser(error, auction) })
    }

});


auctionController.get('/:auctionId/delete', isAuth, async (req, res) => {
    const auction = await auctionService.getOne(req.params.auctionId).lean();

    try {
        if (auction.author != req.user._id) {
            throw new Error('Only the owner can delete this')
        }
        await auctionService.delete(req.params.auctionId);
        res.redirect('/auction/browse')
    } catch (error) {
        res.render('404', { errors: errorParser(error) })
    }
});

auctionController.get(`/:auctionId/closed`, isAuth, async (req, res) => {
    const user = await authService.getUserById(req.user._id);
    const auction = await auctionService.getOne(req.params.auctionId);
    auction.closed = true;
    user.closed.push(auction._id);
    
    await auction.save();
    await user.save();
    // await auctionService.delete(req.params.auctionId);
    res.redirect(`/auction/user/${req.user._id}/closed`);
});

auctionController.get(`/user/:userId/closed`,async (req, res)=> {
    const closedAuctions = await authService.getUserClosedAuctions(req.user._id).lean();
    console.log(closedAuctions.closed.bidder)
    res.render('closed-auctions', {auctions: closedAuctions.closed});
})

// auctionController.post(`/:userId/closed`, isAuth, async (req, res) => {
//     console.log(req.params.userId);
//     const user = await authService.getUserById(req.user._id);
//     user.closed.push(req.user._id);
//     await user.save();
//     res.redirect(`/auction/${req.user._id}/closed`);
// });
module.exports = auctionController;