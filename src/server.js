const path = require('path');

// load .env: try project root first, then src/.env
const rootEnv = path.join(__dirname, '..', '.env');
const srcEnv = path.join(__dirname, '.env');
const dotenv = require('dotenv');
let result = dotenv.config({ path: rootEnv });
if (result.error) {
  result = dotenv.config({ path: srcEnv });
}

console.log('.env loaded from:', result.error ? (result.error.path || 'none') : (result.config && result.config.path) || 'unknown');
console.log('MONGO_URI=', process.env.MONGO_URI);

const connectDB = require('./config/database');
const app = require('./app');

const port = Number(process.env.PORT || 5000);

// global handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err && err.message ? err.message : err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  process.exit(1);
});

(async () => {
  try {
    await connectDB();
    const server = app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${port} already in use. Change PORT in .env or stop the process using it.`);
        process.exit(1);
      }
      console.error('Server error', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server', err && err.message ? err.message : err);
    process.exit(1);
  }
})();

