const AdModel = require('../models/AdModel')


exports.getAll = () => AdModel.find().lean();