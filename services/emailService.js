const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const buildEmailHTML = (title, bodyContent, originalData = '', includeLogo = true) => {
  return `
    <div style="margin:0;padding:0;background:linear-gradient(135deg, #f0f4ff, #e0eaff);padding:30px;font-family:'Segoe UI', sans-serif;">
      <div style="max-width:650px;margin:auto;background:rgba(255,255,255,0.85);backdrop-filter:blur(10px);border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.15);">
        
        ${includeLogo ? `
        <div style="background: linear-gradient(to right, #0046ff, #007bff); padding: 30px; text-align: center;">
          <img src="cid:logo" alt="Blueneza Logo" style="max-height:60px;border-radius:8px;">
          <h1 style="color:white; font-size:24px; margin-top:10px;">Blueneza International LLP</h1>
        </div>` : ''}
        
        <div style="padding: 30px; color: #333;">
          <h2 style="color: #0046ff; font-size: 22px; margin-bottom: 16px;">${title}</h2>
          ${bodyContent}

          ${originalData ? `
          <div style="margin-top:30px; padding: 20px; background: #f4f7ff; border-left: 4px solid #0046ff; border-radius: 8px;">
            ${originalData}
          </div>` : ''}

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Best regards,<br>
            <strong>Blueneza Team</strong>
          </p>
        </div>

        <div style="background: #f0f4ff; text-align: center; padding: 20px; font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} Blueneza International LLP. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

const attachments = [{
  filename: 'logo.png',
  path: path.join(__dirname, '../assets/png.png'),
  cid: 'logo'
}];

// --- QUOTE EMAIL ---
const sendQuoteEmail = async (quoteData) => {
  const body = `
    <p><strong>Name:</strong> ${quoteData.fullName}</p>
    <p><strong>Phone:</strong> ${quoteData.phoneNumber}</p>
    <p><strong>Email:</strong> ${quoteData.email}</p>
    <p><strong>Company:</strong> ${quoteData.companyName || 'N/A'}</p>
    <p><strong>Product:</strong> ${quoteData.product}</p>
    <p><strong>Quantity:</strong> ${quoteData.quantity}</p>
    <p><strong>Additional Requirements:</strong> ${quoteData.additionalRequirements || 'None'}</p>
  `;
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: '📝 New Quote Request',
    html: buildEmailHTML('New Quote Request Received', body),
    attachments
  });
};

// --- CONTACT EMAIL ---
const sendContactEmail = async (contactData) => {
  const body = `
    <p><strong>Name:</strong> ${contactData.fullName}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Phone:</strong> ${contactData.phoneNumber || 'N/A'}</p>
    <p><strong>Company:</strong> ${contactData.companyName || 'N/A'}</p>
    <p><strong>Subject:</strong> ${contactData.subject}</p>
    <p><strong>Message:</strong> ${contactData.message}</p>
  `;
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `📨 Contact Form: ${contactData.subject}`,
    html: buildEmailHTML('New Contact Message', body),
    attachments
  });
};

// --- QUOTE REPLY ---
const sendQuoteReply = async (quoteData, replyData) => {
  const reply = `<p>${replyData.message}</p>`;
  const original = `
    <h3>Your Original Request:</h3>
    <p><strong>Product:</strong> ${quoteData.product || 'N/A'}</p>
    <p><strong>Quantity:</strong> ${quoteData.quantity || 'N/A'}</p>
    <p><strong>Company:</strong> ${quoteData.companyName || 'N/A'}</p>
  `;
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: quoteData.email,
    subject: `📦 Re: Quote for ${quoteData.product || 'Product'}`,
    html: buildEmailHTML('Quote Response from Blueneza', reply, original),
    attachments
  });
};

// --- CONTACT REPLY ---
const sendContactReply = async (contactData, replyData) => {
  const reply = `<p>${replyData.message}</p>`;
  const original = `
    <h3>Your Original Message:</h3>
    <p><strong>Subject:</strong> ${contactData.subject || 'N/A'}</p>
    <p><strong>Message:</strong> ${contactData.message || 'N/A'}</p>
  `;
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: contactData.email,
    subject: `💬 Re: ${contactData.subject || 'Your Message'}`,
    html: buildEmailHTML('Response from Blueneza', reply, original),
    attachments
  });
};

module.exports = {
  sendQuoteEmail,
  sendContactEmail,
  sendQuoteReply,
  sendContactReply
};
