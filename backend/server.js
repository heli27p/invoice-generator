const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoices');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoutes);

// Export the handler for serverless functions
module.exports = app;
