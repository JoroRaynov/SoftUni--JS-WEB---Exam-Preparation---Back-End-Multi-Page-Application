const authController = require('express').Router();
const authService = require('../services/authService');
const errorParser = require('../utils/errorParser');


authController.get('/register', (req, res) => {
    //TODO replace register.view
    if(req.user) {
        return res.redirect('/')
    }
    res.render('user/register');
});


authController.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        if (req.body.email == '' || req.body.username == '' || req.body.password == '') {
            throw new Error('All field are required')
        }
        if (req.body.repass != req.body.password) {
            throw new Error('Passwords don\'t match')
        }
        if(req.body.password.length < 3 ){
            throw new Error('Password must be at least 3 characters long')
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
    if(req.user) {
        return res.redirect('/')
    }
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
        console.log(errors)
        res.render('user/login', {
            errors,
            body: req.body
        });
    }

});

authController.get('/logout', (req, res) => {
    if(req.user){
        res.clearCookie('session');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
    
});

module.exports = authController;