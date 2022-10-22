const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, minLength: [2, 'Title must be at least 2 characters long'] },
    author: { type: String, required: true, minLength: [5, 'Author must be at least 5 characters long'] },
    imageUrl: {
        type: String, required: true,
        validate: {
            validator: function (value) {
                return value.startsWith('http')
            },
            message: 'Image URL must begin with http'
        }
    },
    bookReview: { type: String, required: true, minLength: [10, 'Image review must be at least 10 characters long'] },
    genre: { type: String, required: true, minLength: [3, 'Genre must be at least 3 characters long'] },
    stars: { type: Number, required: true, min: [1, 'Stars number must be between 1 and 5 '], max: [5, 'Stars number must be between 1 and 5 '] },
    wishingList: { type: [mongoose.Types.ObjectId], ref: 'User', default: [] },
    owner: { type: mongoose.Types.ObjectId, ref: 'User' }
});



const Book = mongoose.model('Book', bookSchema);

module.exports = Book;