const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS, SECRET } = require('../constants');

//TODO check requirement if registration make token or redirect to login page;
                        //TODO change parameters by assignment 
exports.register = async ({ name, username, password }) => {
    const existing = await User.findOne({ username });  //.collation({locale: 'en', strength: 2}) <-- if email is uniques

    if (existing) {
        throw new Error('This email is already taken');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    //TODO Change user parameters by assignment
    const user = await User.create({
        name,
        username,
        password: hashedPassword
    });
    return createSession(user);

}


exports.login = async (username, password) => {
    const user = await User.findOne({ username }); //.collation({locale: 'en', strength: 2}) <-- if email is unique

    if (!user) {
        throw new Error('Incorrect username or password!');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Incorrect username or password!');
    }

    return createSession(user);
}


async function createSession(user) {
    //TODO change payload by assignment
    const payload = {
        _id: user._id,
        username: user.username, 
        name: user.name
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });
    return token;
}