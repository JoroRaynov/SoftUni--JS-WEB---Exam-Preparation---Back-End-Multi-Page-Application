const Book = require('../models/Book');


exports.getAllBooks = () => Book.find().lean();

exports.getById = (lean = true, id) => {
    if (lean == true) {
        return Book.findById( id ).lean();
    }
    return Book.findById( id );
};
exports.create = (book) => Book.create(book);

exports.update = async (id, book) => {
    const existing = await Book.findById( id );

    existing.title = book.title,
    existing.author = book.author,
    existing.genre = book.genre,
    existing.stars = book.stars,
    existing.imageUrl = book.imageUrl,
    existing.bookReview = book.bookReview

    await existing.save();
}

exports.delete = (id) => Book.findByIdAndDelete(id)