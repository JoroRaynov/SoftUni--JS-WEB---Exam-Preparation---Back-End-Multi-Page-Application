const mongoose = require('mongoose');
const dotenv = require('dotenv'); 
//TODO change db name 
dotenv.config();
// const connectionString = 'mongodb://localhost:27017/shared-trip';
module.exports = async (app) => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to database...')

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}