const express = require('express');
const Quote = require('../models/Quote');
const Contact = require('../models/Contact');
const { sendQuoteEmail, sendContactEmail } = require('../services/emailService');
const router = express.Router();

// Submit quote form
router.post('/quote', async (req, res) => {
  try {
    const { fullName, phoneNumber, email, companyName, product, quantity, additionalRequirements } = req.body;
    
    const quote = new Quote({
      fullName,
      phoneNumber,
      email,
      companyName,
      product,
      quantity,
      additionalRequirements
    });
    
    await quote.save();
    await sendQuoteEmail(quote);
    
    res.json({ message: 'Quote request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quote request' });
  }
});

// Submit contact form
router.post('/contact', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, companyName, subject, message } = req.body;
    
    const contact = new Contact({
      fullName,
      email,
      phoneNumber,
      companyName,
      subject,
      message
    });
    
    await contact.save();
    await sendContactEmail(contact);
    
    res.json({ message: 'Contact message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending contact message' });
  }
});

module.exports = router;