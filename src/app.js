require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require("path"); 

const { notFound, errorHandler } = require('./middlewares/error.middleware');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const hostelRoutes = require("./routes/hostelRoutes");
const logger = require('./config/logger');
const authRoutes = require('./routes/auth.routes');


const app = express();

// Core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/hostels", hostelRoutes);

app.use('/api/auth', authRoutes);

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'NAG Tiffin API',
    version: '1.0.0',
    description: 'API docs for Tiffin endpoints'
  },
  servers: [
    { url: process.env.SWAGGER_BASE_URL || 'http://localhost:5000' }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/controllers/*.js'] // JSDoc in these files will be included
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 404 + error
app.use(notFound);
app.use(errorHandler(logger));

module.exports = app;



