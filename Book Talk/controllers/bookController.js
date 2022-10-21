const bookController = require('express').Router();
const bookService = require('../services/bookService');
const errorParser = require('../utils/errorParser');
const { isAuth } = require('../middlewares/authMiddleware');


bookController.get('/catalog', async (req, res) => {
    const books = await bookService.getAllBooks().lean();
    res.render('catalog', { books });
});

bookController.get('/create', isAuth, async (req, res) => {
    res.render('create')
});


bookController.post('/create', isAuth,  async (req, res) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: req.body.stars,
        imageUrl: req.body.imageUrl,
        bookReview: req.body.bookReview,
        owner: req.user._id
    }


    try {
        if (Object.values(book).some(k => !k)) {
            throw new Error('All fields are required');
        }
        await bookService.create(book);
        res.redirect('catalog')
    } catch (error) {
        res.render('create', {
            body: req.body,
            errors: errorParser(error)
        })
    }

});

bookController.get('/:id/details', async (req, res) => {
    const book = await bookService.getById(req.params.id);
    const isOwner = book.owner == req.user?._id;
    console.log(isOwner);
    res.render('details', { book, isOwner });
})
module.exports = bookController;