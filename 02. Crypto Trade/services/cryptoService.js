const Crypto = require('../models/Crypto');


exports.getAll = () => Crypto.find().lean();

exports.getCoinById = (id) => Crypto.findById(id);
exports.create = (coin) => Crypto.create(coin);

