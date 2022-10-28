const Trip = require('../models/Trip');


exports.getOneById = (id) => Trip.findById(id).populate('buddies').populate('creator').lean();
exports.getOneByIdNotLean = (id) => Trip.findById(id);
exports.getAll = () => Trip.find().lean();

exports.create = (tripData) => Trip.create(tripData)