const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: [2, 'The name must be at least 2 characters long'] },
    imageUrl: {
        type: String, required: true,
        validate: {
            validator: function (value) {
                return value.startsWith('http')
            },
            message: 'Image URL must begin with http'
        }
    },
    price: { type: Number, required: true, min: [1, 'The price must be a positive number'] },
    description: { type: String, required: true, minLength: [10, 'Description must be at least 10 characters long'] },
    paymentMethod: { type: String, required: true, enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'] }, //TODO add payment methods
    buyACrypto: { type: [mongoose.Types.ObjectId], ref: 'User', default: [] },
    owner: { type: mongoose.Types.ObjectId, ref: 'User' }
});



const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;