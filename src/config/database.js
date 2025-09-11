const mongoose = require('mongoose');
const path = require('path');
// load env (safe)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
 
const connectDB = async () => {
    try {
        console.log('MONGO_URI=', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected ->', mongoose.connection.host, mongoose.connection.name);
    } catch (err) {
        console.log('Mongo connect error ->', err.message);
        throw err;
    }
}
 
module.exports = connectDB;