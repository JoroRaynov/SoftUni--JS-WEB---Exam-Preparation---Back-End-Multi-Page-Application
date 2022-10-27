const adsController = require('express').Router();
const adsService = require('../services/adsService');
const { isAuth } = require('../middlewares/authMiddleware')
const errorParser = require('../utils/errorParser');
const authService = require('../services/authService');
adsController.get('/allAds', async (req, res) => {

    const ads = await adsService.getAll();
    res.render('all-ads', { ads });
});

adsController.get('/create', isAuth, (req, res) => {
    res.render('create')
});

adsController.post('/create', isAuth, async (req, res) => {
    const user = await authService.getOneById(req.user._id);
    req.body.author = req.user._id;
    try {
        const created = await adsService.createAd(req.body);
        user.myAds.push(created._id);
        await user.save();
        res.redirect('/ads/allAds');
    } catch (error) {
        const errors = errorParser(error);
        res.render('create', {
            errors,
            body: req.body
        });
    }
});


adsController.get('/:adId/details', async (req, res) => {
    const ad = await adsService.getOneByIdAndInfo(req.params.adId);
    const isAuthor = ad.author?._id == req.user?._id;
    const isApplied = ad.usersApplied.map(a => a._id.toString()).includes(req.user?._id.toString());

    const applied = ad.usersApplied;
    res.render('details', { ad, isAuthor, isApplied, applied });
});


adsController.get('/:adId/apply', isAuth, async (req, res) => {
    const ad = await adsService.getOneById(req.params.adId);
    const adPopulated = await adsService.getOneByIdAndInfo(req.params.adId);
    const isApplied = ad.usersApplied.map(a => a.toString()).includes(req.user?._id.toString());

    try {
        if (ad.usersApplied.map(a => a.toString()).includes(req.user._id?.toString())) {
            throw new Error('You have already applied this ad')
        }
        ad.usersApplied.push(req.user._id);
        await ad.save();
        res.redirect(`/ads/${req.params.adId}/details`)
    } catch (error) {
        res.render('details', {
            errors: errorParser(error),
            adPopulated, isApplied
        })
    }
});

adsController.get('/:adId/delete', isAuth, async (req, res) => {
    const ad = await adsService.getOneById(req.params.adId);

    try {
        if (ad.author._id != req.user._id) {
            throw new Error('Only the author can delete his own ad')
        }
        await adsService.delete(req.params.adId);
        res.redirect('/ads/allAds')
    } catch (error) {
        res.render('404', { errors: errorParser(error) });
    }
});


adsController.get('/:adId/edit', isAuth, async (req, res) => {
    const ad = await adsService.getOneByIdAndInfo(req.params.adId);
    try {
        if (ad.author._id != req.user._id) {
            throw new Error('Only the author can delete his own ad')
        }
        res.render('edit', { ad })
    } catch (error) {
        res.redirect('/');
    }

});


adsController.post('/:adId/edit', isAuth, async (req, res) => {
    const existed = await adsService.getOneById(req.params.adId);
    const ad = await adsService.getOneByIdAndInfo(req.params.adId);
    const updated = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        description: req.body.description,
    }

    try {

        if (Object.values(updated).some(u => !u)) {
            throw new Error('All fields are required')
        }
        adsService.update(existed, updated);
        res.redirect(`/ads/${req.params.adId}/details`)
    } catch (error) {
        res.render('edit', {
            ad,
            errors: errorParser(error)
        })
    }

});

adsController.get('/search', isAuth, (req, res) => {
    
    res.render('search', {search: false})
})

adsController.post('/search', isAuth, async (req, res) => {
    // const match = await adsService.search(req.body.email);
    const emailMatch = await authService.getUserByEmail(req.body.email);
    const user = await authService.getOneByIdInfo(emailMatch[0]._id);
    console.log(user.myAds)
if(emailMatch){
    res.render('search', { userMatch: user.myAds, search: true })
} else {
    res.render('search')
}
})
module.exports = adsController;