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
    const isOwner = trip.creator._id == req.user?._id;

    console.log(isOwner)
    const joinedTheTrip = trip.buddies.email == req.user?.email;
    const allBuddies = trip.buddies.map(b => b.email).join(', ');
    const availableSeats = trip.seats > 0;
    console.log(trip)
    res.render('trip-details', { trip, allBuddies, isOwner, joinedTheTrip, availableSeats});

});

tripController.get('/create', isAuth, (req, res) => {
    res.render('trip-create');
});

tripController.post('/create', isAuth, async(req, res) => {
    req.body.creator = req.user._id;
    try {
        const created = await tripService.create(req.body);
        res.redirect('/trip/shared')
    } catch (error) {
        res.render('trip-create', {body: req.body, errors: errorParser(error)})
    }
})



module.exports = tripController;