const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS, SECRET } = require('../constants');

//TODO check requirement if registration make token or redirect to login page;

exports.register = async ({ email, password, skills }) => {
    const existing = await User.findOne({ email });  //.collation({locale: 'en', strength: 2}) <-- if email is uniques

    if (existing) {
        throw new Error('This email is already taken');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        email,
        password: hashedPassword,
        skills
    });
    return createSession(user);

}

exports.getOneById = (id) => User.findById(id);
exports.getOneByIdInfo = (id) => User.findById(id).populate('myAds').lean();
exports.login = async (email, password) => {
    const user = await User.findOne({ email }); //.collation({locale: 'en', strength: 2}) <-- if email is unique

    if (!user) {
        throw new Error('Incorrect email or password!');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Incorrect email or password!');
    }

    return createSession(user);
}


async function createSession(user) {
    const payload = {
        _id: user._id,
        email: user.email, 
        skills: user.skills
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });
    return token;
}

exports.getUserByEmail = (email) => User.find({email}).lean();
