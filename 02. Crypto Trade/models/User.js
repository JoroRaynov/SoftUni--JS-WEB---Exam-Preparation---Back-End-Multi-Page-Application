const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
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