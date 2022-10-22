const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, minLength: [5, 'Username must be at least 5 characters long']},
    email: { type: String, required: true,minLength: [10, 'Username must be at least 10 characters long'] },
    password: { type: String, required: true }
});


//TODO if some of userSchema properties are unique
 
// userSchema.index({ email: 1 }, {
//     collation: {
//         locale: 'en',
//         strength: 2
//     }
// });

const User = mongoose.model('User', userSchema);

module.exports = User;