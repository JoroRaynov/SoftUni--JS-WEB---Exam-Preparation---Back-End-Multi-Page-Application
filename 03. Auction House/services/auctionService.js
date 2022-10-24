const Auction = require('../models/Auction');


exports.getAll = () => Auction.find().lean();
exports.getOne = (id) => Auction.findById(id).lean();

exports.create = (auctionData) => Auction.create(auctionData);


