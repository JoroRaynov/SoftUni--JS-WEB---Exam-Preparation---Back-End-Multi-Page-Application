const tripController = require('express').Router();
const tripService = require('../services/tripService');
const { isAuth } = require('../middlewares/authMiddleware')
const errorParser = require('../utils/errorParser');
const authService = require('../services/authService');


tripController.get('/shared', async (req, res) => {
    const allTrips = await tripService.getAll();
    res.render('shared-trips', { allTrips });
});

tripController.get('/:tripId/details', async (req, res) => {
    const trip = await tripService.getOneById(req.params.tripId);
    const isOwner = trip.creator?._id == req.user?._id;

    const joinedTheTrip = trip.buddies.includes(req.user?.email);
    const allBuddies = trip.buddies.join(', ');
    const availableSeats = trip.seats > 0;
    res.render('trip-details', { trip, allBuddies, isOwner, joinedTheTrip, availableSeats });

});

tripController.get('/create', isAuth, (req, res) => {
    res.render('trip-create');
});

tripController.post('/create', isAuth, async (req, res) => {
    const user = await authService.getUserById(req.user._id)
    req.body.seats = Number(req.body.seats);
    req.body.price = Number(req.body.price);
    req.body.creator = req.user._id;
    try {
        const created = await tripService.create(req.body);
        user.tripHistory.push(created._id);
        await user.save();
        res.redirect('/trip/shared')
    } catch (error) {
        res.render('trip-create', { body: req.body, errors: errorParser(error) })
    }
});

tripController.get('/:tripId/join', isAuth, async (req, res) => {
    const trip = await tripService.getOneById(req.params.tripId);
    const tripNotLean = await tripService.getOneByIdNotLean(req.params.tripId);
    const isJoined = trip.buddies.includes(req.user.email);
    try {
        if (isJoined) {
            throw new Error('You already joined this trip');
        }
        tripNotLean.seats -= 1;
        tripNotLean.buddies.push(req.user.email);
        await tripNotLean.save();
        res.redirect(`/trip/${req.params.tripId}/details`)
    } catch (error) {
        res.render('404', { errors: errorParser(error) })
    }
})

tripController.get('/:tripId/delete', isAuth, async (req, res) => {
    const trip = await tripService.getOneById(req.params.tripId);

        if (trip.creator._id != req.user._id) {
            return res.redirect('/')
        }
        await tripService.delete(req.params.tripId);
        res.redirect('/trip/shared');
});


tripController.get('/:tripId/edit', isAuth, async (req, res) => {
    const trip = await tripService.getOneById(req.params.tripId);
    const isOwner = trip.creator?._id == req.user?._id;
    if(!isOwner) {
       return res.redirect('/')
    }
    res.render('trip-edit', { trip })
});

tripController.post('/:tripId/edit', isAuth, async (req, res)=> {
    const trip = await tripService.getOneById(req.params.tripId);

        const updated = {
            startPoint: req.body.startPoint,
            endPoint: req.body.endPoint,
            date: req.body.date,
            time: req.body.time,
            imageUrl: req.body.imageUrl,
            carBrand: req.body.carBrand,
            seats: req.body.seats,
            price: req.body.price,
            description: req.body.description
        }
        try {
            if(trip.creator._id != req.user._id) {
                throw new Error('Only the owner of trip can edit this trip')
            }
            if(Object.values(updated).some(u => !u)){
                throw new Error('All fields are required')
            }
            await tripService.update(req.params.tripId, updated );
            res.redirect(`/trip/${req.params.tripId}/details`)
        } catch (error) {
            res.render('trip-edit', {trip, errors: errorParser(error)})
        }
})

module.exports = tripController;