const AdModel = require('../models/AdModel')


exports.getAll = () => AdModel.find().lean();
exports.getOneByIdAndInfo = (id) => AdModel.findById(id).populate('author').lean();
exports.getOneById = (id) => AdModel.findById(id);
exports.createAd = (adData) => AdModel.create(adData);