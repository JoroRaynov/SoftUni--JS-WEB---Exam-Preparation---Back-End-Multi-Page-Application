const Auction = require('../models/Auction');


exports.getAll = () => Auction.find().lean();
exports.getOne = (id) => Auction.findById(id).populate('author').populate('bidder');

exports.create = (auctionData) => Auction.create(auctionData);
exports.update = async (updateData, id) => {
    
    const existed = await Auction.findById(id);
    console.log(existed);
    existed.title = updateData.title,
    existed.description = updateData.description,
    existed.category = updateData.category,
    existed.imageUrl = updateData.imageUrl

    if(updateData.price) {
        existed.price = updateData.price
    }
   await existed.save()
}
exports.delete = (id) => Auction.findByIdAndDelete(id)

