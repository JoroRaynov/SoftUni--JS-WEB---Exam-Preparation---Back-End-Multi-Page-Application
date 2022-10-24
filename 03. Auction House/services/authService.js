const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS, SECRET } = require('../constants');

//TODO check requirement if registration make token or redirect to login page;

exports.register = async ({ email, firstName, lastName, password }) => {
    const existing = await User.findOne({ email });  //.collation({locale: 'en', strength: 2}) <-- if email is uniques

    if (existing) {
        throw new Error('This email is already taken');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        email,
        firstName,
        lastName,
        password: hashedPassword
    });
    return createSession(user);

}


exports.login = async (email, password) => {
    const user = await User.findOne({ email }); //.collation({locale: 'en', strength: 2}) <-- if email is unique

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
    const payload = {
        _id: user._id,
        username: user.username
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });
    return token;
}