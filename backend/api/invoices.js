const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const connectDB = require('../config/db');

// Ensure DB connection is established before each request
const handler = async (req, res) => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Routes based on method
        switch (req.method) {
            case 'POST':
                const invoice = new Invoice(req.body);
                const savedInvoice = await invoice.save();
                return res.status(201).json(savedInvoice);

            case 'GET':
                if (req.query.id) {
                    const invoice = await Invoice.findById(req.query.id);
                    if (invoice) {
                        return res.json(invoice);
                    } else {
                        return res.status(404).json({ message: 'Invoice not found' });
                    }
                } else {
                    const invoices = await Invoice.find().sort({ createdAt: -1 });
                    return res.json(invoices);
                }

            case 'DELETE':
                const invoiceToDelete = await Invoice.findByIdAndDelete(req.query.id);
                if (invoiceToDelete) {
                    return res.json({ message: 'Invoice deleted' });
                } else {
                    return res.status(404).json({ message: 'Invoice not found' });
                }

            default:
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = (req, res) => handler(req, res);
