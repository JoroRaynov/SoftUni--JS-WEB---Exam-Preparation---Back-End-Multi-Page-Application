const Book = require('../models/Book');


exports.getAllBooks = () => Book.find();
exports.getById = (id) => Book.findOne({id}).lean();
exports.create = (book) => Book.create(book);
