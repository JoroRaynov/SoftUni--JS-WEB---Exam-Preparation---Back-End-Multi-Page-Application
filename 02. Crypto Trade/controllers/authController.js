const authController = require('express').Router();
const authService = require('../services/authService');
const errorParser = require('../utils/errorParser');


authController.get('/register', (req, res) => {
    //TODO replace register.view
    res.render('user/register', { title: 'Register Page'});
});


authController.post('/register', async (req, res) => {

    try {
        if (req.body.email == '' || req.body.username == '' || req.body.password == '') {
            throw new Error('All field are required')
        }
        if (req.body.repass != req.body.password) {
            throw new Error('Passwords don\'t match')
        }
        const token = await authService.register(req.body);
        res.cookie('session', token, { httpOnly: true });

        //TODO redirect by requirement

        res.redirect('/');

    } catch (error) {
        //TODO check the requirement and change the error

        const errors = errorParser(error);
        res.render('user/register', {
            errors,
            body: req.body
        })
    }
});

authController.get('/login', (req, res) => {
    //TODO replace register.view

    res.render('user/login');
});

authController.post('/login', async (req, res) => {
    try {
        if (req.body.email == '' || req.body.password == '') {
            throw new Error('All fields are required');
        }
        const token = await authService.login(req.body.email, req.body.password);
        res.cookie('session', token);
        res.redirect('/');

    } catch (error) {
//TODO check the requirement and change the error
        const errors = errorParser(error);
        res.render('user/login', {
            errors,
            body: req.body
        });
    }

});

authController.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

module.exports = authController;