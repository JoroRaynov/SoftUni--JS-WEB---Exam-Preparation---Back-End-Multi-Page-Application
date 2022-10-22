const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS, SECRET } = require('../constants');

//TODO check requirement if registration make token or redirect to login page;

exports.register = async ({ email, username, password }) => {
    const existing = await User.findOne({ email });  //.collation({locale: 'en', strength: 2}) <-- if email is uniques

    if (existing) {
        throw new Error('This email is already taken');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        email,
        username,
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
exports.getUserById = (id) => User.findById(id).lean().populate('wishList');
exports.wishBook = async (userId, bookId) => {

    const user = await User.findById(userId);
    user.wishList.push(bookId);
    await user.save();

}

async function createSession(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        username: user.username
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });
    return token;
}