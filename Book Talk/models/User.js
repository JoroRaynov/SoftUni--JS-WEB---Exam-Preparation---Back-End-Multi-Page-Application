const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, minLength: [4, 'Username should be at least 4 characters long'] },
    email: { type: String, required: true, minLength: [10, 'Email should be at least 10 characters long'] },
    password: { type: String, required: true, minLength: [3, 'Password should be at least 3 characters long']}
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