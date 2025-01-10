const connectDB = require('../config/db');

const handler = async (req, res) => {
    await connectDB();
    res.status(200).json({ message: 'API is working' });
};

module.exports = (req, res) => handler(req, res);
