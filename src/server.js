const app = require('./app');
const { connectDB } = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
})();
