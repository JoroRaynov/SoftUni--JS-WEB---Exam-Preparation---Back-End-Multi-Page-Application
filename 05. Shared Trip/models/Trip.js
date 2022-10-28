const mongoose = require('mongoose')


const tripSchema = new mongoose.Schema({
    startPoint: {type: String, required: true, minLength: [4, 'StartPoint must be at least 4 characters long']},
    endPoint: {type: String, required: true, minLength: [4, 'EndPoint must be at least 4 characters long']},
    date: {type: String, required: true},
    time: {type: String, required: true},
    imageUrl: {type: String, required: true, 
        validate: {
            validator: function(value) {
                return value.startsWith('http')
            },
            message: 'The url is not a valid'
        }
    },
    carBrand: {type: String, required: true, minLength: [4, 'Car Brand must be at least 4 characters long']},
    seats: {type: Number, required: true},
    price: {type: Number, required: true, min: [1, 'The price can not be negative'], max: [50, 'The price can not be greater than 50']},
    description: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, ref: 'User'},
    buddies: {type: [mongoose.Types.ObjectId], ref: 'User'} 
});




const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;