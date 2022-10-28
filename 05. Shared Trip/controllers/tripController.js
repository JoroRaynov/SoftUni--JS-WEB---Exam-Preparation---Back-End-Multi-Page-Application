const tripController = require('express').Router();
const tripService = require('../services/tripService');
const {isAuth} = require('../middlewares/authMiddleware')
const errorParser = require('../utils/errorParser');
tripController.get('/shared', async (req, res) => {
    const allTrips = await tripService.getAll();
    res.render('shared-trips', {allTrips});
});

tripController.get('/:tripId/details', async (req, res) => {
    const trip = await tripService.getOneById(req.params.tripId);
    const isOwner = trip.creator?._id == req.user?._id;

    console.log(isOwner)
    const joinedTheTrip = trip.buddies.includes(req.user?.email);
    const allBuddies = trip.buddies.join(', ');
    const availableSeats = trip.seats > 0;
    console.log(trip.buddies)
    res.render('trip-details', { trip, allBuddies, isOwner, joinedTheTrip, availableSeats});

});

tripController.get('/create', isAuth, (req, res) => {
    res.render('trip-create');
});

tripController.post('/create', isAuth, async(req, res) => {
    req.body.seats = Number(req.body.seats);
    req.body.price = Number(req.body.price);
    req.body.creator = req.user._id;
    try {
        const created = await tripService.create(req.body);
        res.redirect('/trip/shared')
    } catch (error) {
        res.render('trip-create', {body: req.body, errors: errorParser(error)})
    }
});

tripController.get('/:tripId/join', isAuth, async (req, res) => {
    const trip = await tripService.getOneById(req.params.tripId);
    const tripNotLean = await tripService.getOneByIdNotLean(req.params.tripId);
    const isJoined = trip.buddies.includes(req.user.email);
    try {
            if(isJoined){
                throw new Error ('You already joined this trip');
            }
            tripNotLean.seats -= 1;
            tripNotLean.buddies.push(req.user.email);
            await tripNotLean.save();
            res.redirect(`/trip/${req.params.tripId}/details`)
    } catch (error) {
            res.render('404', { errors: errorParser(error)})
    }
})



module.exports = tripController;