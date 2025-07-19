const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendQuoteEmail = async (quoteData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Quote Request',
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${quoteData.fullName}</p>
      <p><strong>Phone:</strong> ${quoteData.phoneNumber}</p>
      <p><strong>Email:</strong> ${quoteData.email}</p>
      <p><strong>Company:</strong> ${quoteData.companyName || 'N/A'}</p>
      <p><strong>Product:</strong> ${quoteData.product}</p>
      <p><strong>Quantity:</strong> ${quoteData.quantity}</p>
      <p><strong>Additional Requirements:</strong> ${quoteData.additionalRequirements || 'None'}</p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

const sendContactEmail = async (contactData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `Contact Form: ${contactData.subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${contactData.fullName}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phoneNumber || 'N/A'}</p>
      <p><strong>Company:</strong> ${contactData.companyName || 'N/A'}</p>
      <p><strong>Subject:</strong> ${contactData.subject}</p>
      <p><strong>Message:</strong> ${contactData.message}</p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

const sendQuoteReply = async (quoteData, replyData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: quoteData.email,
    subject: `Re: Your Quote Request - ${quoteData.product || 'Product'}`,
    html: `
      <h2>Quote Response from Blueneza</h2>
      <p>Dear ${quoteData.fullName},</p>
      <p>${replyData.message}</p>
      <hr>
      <h3>Your Original Request:</h3>
      <p><strong>Product:</strong> ${quoteData.product || 'N/A'}</p>
      <p><strong>Quantity:</strong> ${quoteData.quantity || 'N/A'}</p>
      <p><strong>Company:</strong> ${quoteData.companyName || 'N/A'}</p>
      <br>
      <p>Best regards,<br>Blueneza Team</p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

const sendContactReply = async (contactData, replyData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: contactData.email,
    subject: `Re: ${contactData.subject || 'Your Message'}`,
    html: `
      <h2>Response from Blueneza</h2>
      <p>Dear ${contactData.fullName},</p>
      <p>${replyData.message}</p>
      <hr>
      <h3>Your Original Message:</h3>
      <p><strong>Subject:</strong> ${contactData.subject || 'N/A'}</p>
      <p><strong>Message:</strong> ${contactData.message || 'N/A'}</p>
      <br>
      <p>Best regards,<br>Blueneza Team</p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

module.exports = { sendQuoteEmail, sendContactEmail, sendQuoteReply, sendContactReply };