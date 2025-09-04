const mongoose = require('mongoose');
const config = require('./index');
const logger = require('./logger');

mongoose.set('strictQuery', true);

async function connectDB() {
  const uri = config.mongoUri;
  logger.info('Connecting to MongoDB...', { uri });
  await mongoose.connect(uri, { autoIndex: true });
  logger.info('MongoDB connected');
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('error', (err) => logger.error('MongoDB error', { error: err.message }));
}

module.exports = { connectDB };
