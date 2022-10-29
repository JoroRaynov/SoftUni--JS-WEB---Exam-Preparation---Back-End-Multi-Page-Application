const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/real-estate-Agency';
module.exports = async (app) => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to database...')

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}