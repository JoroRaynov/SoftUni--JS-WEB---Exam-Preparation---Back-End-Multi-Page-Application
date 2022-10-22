const bookController = require('express').Router();
const bookService = require('../services/bookService');
const errorParser = require('../utils/errorParser');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');

bookController.get('/catalog', async (req, res) => {
    const books = await bookService.getAllBooks();
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

    const isOwner = book.owner == req.user?._id;
    // const isWished = book.wished == req.user?._id;
    if (req.user) {
        const isWished = book.wishingList.map(b => b.toString()).includes(req.user._id.toString());
        return res.render('details', { book, isOwner, isWished });
    }
    res.render('details', { book })

});


bookController.get('/:id/wish', isAuth, async (req, res) => {

    const book = await bookService.getById(false, req.params.id);

    const isOwner = book.owner == req.user?._id;
    try {
        if (isOwner) {
            throw new Error('The owner can\'t add his own book in wish list!');
        }
        if (book.wishingList.map(b => b.toString()).includes(req.user._id.toString())) {
            throw new Error('You can\'t add twice in wish list!')
        }
        authService.wishBook(req.user._id, req.params.id);

        book.wishingList.push(req.user._id);
        await book.save();
        res.redirect(`/book/${book._id}/details`);
    } catch (error) {
        res.render('home', { errors: errorParser(error) });
    }
});

bookController.get('/:id/edit', isAuth, async (req, res) => {
    const book = await bookService.getById(true, req.params.id);
    try {
        if (book.owner != req.user._id) {
            throw new Error('Only the owner can edit this book');
        }
        res.render('edit', { book })
    } catch (error) {
        res.render('404', {
            errors: errorParser(error)
        })
    }



});

bookController.post('/:id/edit', isAuth, async (req, res) => {
    const book = await bookService.getById(true, req.params.id);

    const edited = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: Number(req.body.stars),
        imageUrl: req.body.imageUrl,
        bookReview: req.body.bookReview
    }
    try {
        if (book.owner != req.user._id) {
            throw new Error('Only the owner can edit this book');
        }
        if (Object.values(edited).some(k => !k)) {
            throw new Error('All fields are required');
        }
        await bookService.update(book._id, edited);
        res.redirect(`/book/${book._id}/details`);

    } catch (error) {
        res.render('edit', {
            body: req.body,
            errors: errorParser(error)
        });
    }
});

bookController.get('/:id/delete', isAuth, async (req, res) => {
    const book = await bookService.getById(false, req.params.id);

    try {
        if (book.owner != req.user._id) {
            throw new Error('Only the owner can edit this book');
        }
        await bookService.delete(book._id);
        res.redirect('/book/catalog');
    } catch (error) {
        res.render('404', { errors: errorParser(error) });
    }
});




module.exports = bookController;


// Cast to ObjectId failed for value "{ id: new ObjectId("63525a69b2632f27c4b07c09") }" (type Object) at path "_id" for model "Book"