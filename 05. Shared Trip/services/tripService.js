const Trip = require('../models/Trip');


exports.getOneById = (id) => Trip.findById(id).populate('buddies').populate('creator').lean();

exports.getAll = () => Trip.find().lean();

exports.create = (tripData) => Trip.create(tripData)