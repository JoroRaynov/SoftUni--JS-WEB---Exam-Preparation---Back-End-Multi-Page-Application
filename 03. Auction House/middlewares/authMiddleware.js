const jwt = require('jsonwebtoken');
const { SECRET } = require('../constants');


exports.auth = (req, res, next) => {
    const token = req.cookies['session'];


    if (token) {
        try {
            const userData = jwt.verify(token, SECRET);
            req.user = userData;
            res.locals.user = userData;
            
        } catch (error) {
            res.clearCookie('session');
            res.redirect('auth/login');
            return;
        }

    }
    next();
}

exports.isAuth = (req, res, next) => {
    if(req.user){
        next();
    } else {
        res.render('/auth/login');
    }
}

exports.isGuest = (req, res, next) => {
    if(!req.user){
        next();
    } else {
        res.redirect('/'); //TODO check assignment for correct redirect
    }
}