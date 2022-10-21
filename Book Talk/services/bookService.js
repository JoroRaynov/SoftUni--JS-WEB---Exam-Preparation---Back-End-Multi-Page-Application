const Book = require('../models/Book');


exports.getAllBooks = () => Book.find();

exports.getById = (lean = true, id) => {
    if (lean == true) {
        return Book.findById( id ).lean();
    }
    return Book.findById( id );
};
exports.create = (book) => Book.create(book);
