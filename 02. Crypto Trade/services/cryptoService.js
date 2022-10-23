const Crypto = require('../models/Crypto');


exports.getAll = () => Crypto.find().lean();

exports.getCoinById = (id) => Crypto.findById(id);
exports.create = (coin) => Crypto.create(coin);

exports.update = async (coinId, coinData) => {
    const existing = await Crypto.findById(coinId);

    existing.name = coinData.name,
        existing.imageUrl = coinData.imageUrl,
        existing.price = coinData.price,
        existing.description = coinData.description,
        existing.paymentMethod = coinData.paymentMethod

    await existing.save();
}

exports.search = (text, method) => {
    const matches = Crypto.find({ name: { $regex: new RegExp(text, 'i') } })
        .where({ paymentMethod: { $regex: new RegExp(method, 'i') } }).lean();
        return matches;
}
// const cubes = await Cube.find({ name: { $regex: new RegExp(search, 'i') } })
// .where('difficultyLevel').gte(from).lte(to)
exports.delete = (id) => Crypto.findByIdAndDelete(id)
