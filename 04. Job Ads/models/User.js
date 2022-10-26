const mongoose = require('mongoose');

const validEmail = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]/i

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, 
        validate: { validator: 
            function (value) {
                return validEmail.test(value)
            }
        }
     },
    password: { type: String, required: true},
    skills: { type: String, required: true, maxLength: [40, 'Description of skills must be maximum 40 characters long']},
    myAds: {type: [mongoose.Types.ObjectId], ref: 'AdModel', default: []}
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