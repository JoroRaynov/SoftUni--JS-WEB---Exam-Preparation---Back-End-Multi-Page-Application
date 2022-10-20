const mongoose = require('mongoose');
//TODO change db name 

const connectionString = 'mongodb://localhost:27017/scaffold';
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