const mongoose = require('mongoose');


const adSchema = new mongoose.Schema({
    headline: {type: String, required: true, minLength: [4, 'Headline must be at least 4 characters long']},
    location: {type: String, required: true, minLength: [8, 'Location must be at least 8 characters long']},
    companyName: {type: String, required: true, minLength: [3, 'Company Name must be at least 3 characters long']},
    author: {type: mongoose.Types.ObjectId, ref: 'User'},
    usersApplied: {type: [mongoose.Types.ObjectId], ref: 'User', default: []}
});


const AdModel = mongoose.model('Ad', adSchema);

module.exports = AdModel;