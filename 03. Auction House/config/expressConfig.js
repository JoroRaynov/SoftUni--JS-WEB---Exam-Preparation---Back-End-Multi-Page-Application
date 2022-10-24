const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const {auth} = require('../middlewares/authMiddleware');
const {trim} = require('../middlewares/trimMiddleware');
module.exports = (app) => {
   
    
    app.engine('hbs', hbs.engine({
        extname: 'hbs',
        helpers: {
            select:  function(selected, options) {
                return options.fn(this).replace(
                    new RegExp(' value=\"' + selected + '\"'),
                    '$& selected="selected"');
            }
        }
    }));

    app.use(express.urlencoded({extended: false}));
    app.use('/static', express.static('static'));
    app.use(cookieParser());
    app.use(auth);
    app.use(trim);

    app.set('view engine', 'hbs');
    app.set('views', 'views');
}

 