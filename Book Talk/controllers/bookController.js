const bookController = require('express').Router();
const bookService = require('../services/bookService');
const errorParser = require('../utils/errorParser');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');


bookController.get('/catalog', async (req, res) => {
    const books = await bookService.getAllBooks().lean();
    res.render('catalog', { books });
});

bookController.get('/create', isAuth, async (req, res) => {
    res.render('create')
});


bookController.post('/create', isAuth, async (req, res) => {
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
    const book = await bookService.getById(true, req.params.id);
    console.log(book);
    const isOwner = book.owner == req.user?._id;
    // const isWished = book.wished == req.user?._id;
    if (req.user) {
        const isWished = book.wishingList.map(b => b.toString()).includes(req.user._id.toString());
      return  res.render('details', { book, isOwner, isWished });
    }
    res.render('details', { book})

});


bookController.get('/:id/wish', isAuth, async (req, res) => {

    const book = await bookService.getById(false, req.params.id);

    const isOwner = book.owner == req.user?._id;
    try {
        if (isOwner) {
            throw new Error('The owner can\'t add his own book in wish list!');
        }
        if(book.wishingList.map(b => b.toString()).includes(req.user._id.toString())) {
            throw new Error('You can\'t add twice in wish list!')
        }

        book.wishingList.push(req.user._id);
        await book.save();
        res.redirect(`/book/${book._id}/details`);
    } catch (error) {
        res.render('home', { errors: errorParser(error) });
    }




});
module.exports = bookController;