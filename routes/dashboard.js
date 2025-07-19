const express = require('express');
const Quote = require('../models/Quote');
const Contact = require('../models/Contact');
const { sendQuoteReply, sendContactReply } = require('../services/emailService');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalQuotes = await Quote.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalemail = totalQuotes + totalContacts;

    res.json({ totalQuotes, totalContacts , totalemail });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all quotes
router.get('/quotes', authMiddleware, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contacts
router.get('/contacts', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quote status
router.patch('/quotes/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await Quote.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact status
router.patch('/contacts/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await Contact.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single quote
router.get('/quotes/:id', authMiddleware, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single contact
router.get('/contacts/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quote
router.delete('/quotes/:id', authMiddleware, async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quote deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact
router.delete('/contacts/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reply to quote
router.post('/quotes/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    
    await sendQuoteReply(quote, { message });
    await Quote.findByIdAndUpdate(req.params.id, { status: 'processed' });
    
    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reply' });
  }
});

// Reply to contact
router.post('/contacts/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    await sendContactReply(contact, { message });
    await Contact.findByIdAndUpdate(req.params.id, { status: 'processed' });
    
    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reply' });
  }
});

module.exports = router;