const mongoose = require('mongoose');

const emailPattern = /[a-zA-Z0-9]+@[a-zA-Z0-9\.[a-zA-Z]/i

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, 
        validate: { 
            validator: function(value){
                return emailPattern.test(value);
            }, 
            message: 'Not valid email'
        }
    },
    password: { type: String, required: true},
    gender: { type: String, required: true, enum: ['male', 'female'] },
    tripHistory: {type: [mongoose.Types.ObjectId], ref: 'Trip', default: []}
});



const User = mongoose.model('User', userSchema);

module.exports = User;