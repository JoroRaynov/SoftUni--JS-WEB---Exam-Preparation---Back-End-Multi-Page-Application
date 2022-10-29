const authController = require('express').Router();
const authService = require('../services/authService');
const errorParser = require('../utils/errorParser');
const { isGuest, isAuth } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

authController.get('/register', isGuest, (req, res) => {

    res.render('user/register');
});


authController.post('/register', isGuest,
    body('password').isLength({min: 4}).withMessage('Password Must Be at least 4 characters long'),
    
    async (req, res) => {
        //TODO change req.body parameters by assignment

        const {errors} = validationResult(req)
        try {
            if(errors.length > 0){
                throw errors;
            }
            //TODO Change password length by assignment
            
            if (req.body.repass != req.body.password) {
                throw new Error('Passwords don\'t match')
            }
            const token = await authService.register(req.body);
            res.cookie('session', token, { httpOnly: true });

            //TODO redirect by requirement and if register creates session

            res.redirect('/'); //TODO redirect by requirement

        } catch (error) {
            //TODO check the requirement and change the error
            const errors = errorParser(error);
            res.render('user/register', {
                errors,
                body: req.body
            })
        }
    });

authController.get('/login', isGuest, (req, res) => {

    //TODO replace register.view

    res.render('user/login');
});

authController.post('/login', isGuest, async (req, res) => {
    try {
        if (req.body.username == '' || req.body.password == '') {
            throw new Error('All fields are required');
        }
        const token = await authService.login(req.body.username, req.body.password);
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

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

module.exports = authController;