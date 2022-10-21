const homeController = require('express').Router(); 
const bookService = require('../services/bookService');
//TODO replace with the real homecontroller

homeController.get('/', (req, res) => {
    res.render('home');
});





module.exports = homeController;