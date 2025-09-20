const mongoose = require('mongoose');

// Do NOT call dotenv here if you already load it once in server.js
// ...existing code...
const connectDB = async () => {
  try {
    // console.log('MONGO_URI=', process.env.MONGO_URI);
    // driver v4+ ignores useNewUrlParser/useUnifiedTopology options; call with URI only
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected ->', mongoose.connection.host, mongoose.connection.name);
  } catch (err) {
    console.error('Mongo connect error ->', err.message);
    throw err;
  }
};

module.exports = connectDB;