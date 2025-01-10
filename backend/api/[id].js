const connectDB = require('../config/db');
const Invoice = require('../models/Invoice');

const handler = async (req, res) => {
    await connectDB();

    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const invoice = await Invoice.findById(id);
                if (invoice) {
                    return res.status(200).json(invoice);
                } else {
                    return res.status(404).json({ message: 'Invoice not found' });
                }
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }

        case 'DELETE':
            try {
                const invoice = await Invoice.findByIdAndDelete(id);
                if (invoice) {
                    return res.status(200).json({ message: 'Invoice deleted' });
                } else {
                    return res.status(404).json({ message: 'Invoice not found' });
                }
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }

        default:
            return res.status(405).json({ message: 'Method Not Allowed' });
    }
};

module.exports = (req, res) => handler(req, res);
