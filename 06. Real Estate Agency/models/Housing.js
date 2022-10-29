const mongoose = require('mongoose');



const urlPattern = /https?:\/\/./i
const housingSchema = new mongoose.Schema({
    houseName: { type: String, required: true, minLength: [6, 'The house name must be at least 6 characters long'] },
    type: { type: String, required: true, enum: ['Apartment', 'Villa', 'House'] },
    year: { type: Number, required: true, min: [1850, 'The house is too old'], mix: [2021, 'Are you sure this house exists? :)'] },
    city: { type: String, required: true, minLength: [4, 'The city name mus be at least 4 characters long'] },
    imageUrl: {
        type: String, required: true, validate: {
            validator: function (value) {
                return urlPattern.test(value)
            },
            message: 'Not valid URL'
        }
    },
    description: {type: String, required: true, maxLength: [60, 'Description can not be greater then 60 characters long']},
    availablePlaces: {type: Number, required: true, min: 0, max: [10, 'Available places can not be greater than 10']},
    usersRented: {type: [mongoose.Types.ObjectId], ref: 'User', default: []},
    owner: {type: mongoose.Types.ObjectId, ref: 'User' }
});


const Housing = mongoose.model('Housing', housingSchema);

module.exports = Housing;