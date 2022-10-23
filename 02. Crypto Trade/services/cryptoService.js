const Crypto = require('../models/Crypto');


exports.getAll = () => Crypto.find().lean();

exports.getCoinById = (id) => Crypto.findById(id);
exports.create = (coin) => Crypto.create(coin);

exports.update = async (coinId, coinData) => {
    const existing = await Crypto.findById(coinId);

    existing.name= coinData.name,
    existing.imageUrl = coinData.imageUrl,
    existing.price = coinData.price,
    existing.description = coinData.description,
    existing.paymentMethod = coinData.paymentMethod

    await existing.save();
}

exports.delete = (id) => Crypto.findByIdAndDelete(id)
