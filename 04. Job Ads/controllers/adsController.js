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
    const isApplied = ad.usersApplied.map(a=> a.toString()).includes(req.user?._id.toString());
    console.log(isApplied);
    const applied = ad.usersApplied;
    res.render('details', {ad, isAuthor, isApplied ,applied});
});


adsController.get('/:adId/apply', isAuth, async (req, res)=> {
    const ad = await adsService.getOneById(req.params.adId);
    const adPopulated = await adsService.getOneByIdAndInfo(req.params.adId);
    console.log(ad);

    // const candidate = {
    //     email:req.user.email, 
    //     skills: req.user.skills
    // }

    
    try {
        if(ad.usersApplied.map(a=> a.toString()).includes(req.user._id?.toString())){
            
            throw new Error ('You have already applied this ad')
        }
        ad.usersApplied.push(req.user._id);
        await ad.save();
        res.redirect(`/ads/${req.params.adId}/details`);
    } catch (error) {
        res.render('details', {
            errors: errorParser(error),
            adPopulated, isApplied: true})
    }
});


module.exports = adsController;