const path = require('path');
// load env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('./config/database');
const app = require('./app');

const port = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
