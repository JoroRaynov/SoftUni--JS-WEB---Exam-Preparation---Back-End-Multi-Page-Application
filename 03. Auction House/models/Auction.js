const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    title: { type: String, required: true, minLength: [4, 'Types must be at least 4 characters long'] },
    description: { type: String, required: true, maxLength: [200, 'Description must be at least 200 characters long'] },
    category: { type: String, required: true, enum: ['Vehicles', 'Real Estate', 'Electronics', 'Furniture', 'Other'] },
    imageUrl: {
        type: String,
        validate: {
            validator: function (value) {
                return value.startsWith('http')
            },
            message: 'imageUrl must start with http'
        }
    },
    price: { type: Number, required: true, min: [1, 'The price can not be a negative number'] },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    bidder: { type: [mongoose.Types.ObjectId], ref: 'User', default: [] }
});



const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;