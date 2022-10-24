const mongoose = require('mongoose');

const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+$/i

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, 
        validate: { 
            validator: function(value) {
                return emailPattern.test(value);
            },
            message: 'Not a valid email'
        }
    },
    password: { type: String, required: true, minLength: [5, 'Password must be at least 5 characters long'] },
    firstName: { type: String, required: true, minLength: [1, 'First Name must be at least 1 characters long']},
    lastName: { type: String, required: true, minLength: [1, 'Last Name must be at least 1 characters long'] },
    bid: {type: Number}
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