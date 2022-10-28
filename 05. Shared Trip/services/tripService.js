const Trip = require('../models/Trip');


exports.getOneById = (id) => Trip.findById(id).populate('buddies').populate('creator').lean();
exports.getOneByIdNotLean = (id) => Trip.findById(id);
exports.getAll = () => Trip.find().lean();

exports.create = (tripData) => Trip.create(tripData);
exports.update = async (id, data) => {
    const existing = await Trip.findById(id);

    existing.startPoint = data.startPoint;
    existing.endPoint = data.endPoint;
    existing.date = data.date;
    existing.time = data.time;
    existing.imageUrl = data.imageUrl;
    existing.carBrand = data.carBrand;
    existing.seats = data.seats;
    existing.price = data.price;
    existing.description = data.description;

    await existing.save();

}
exports.delete = (id) => Trip.findByIdAndDelete(id);