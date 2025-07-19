const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Base email template with styling
const createEmailTemplate = (content, title) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .email-header {
          background-color: #ffffff;
          padding: 20px;
          text-align: center;
          border-bottom: 3px solid #0056b3;
        }
        .email-logo {
          max-height: 60px;
        }
        .email-content {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .email-title {
          color: #0056b3;
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 24px;
        }
        .email-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666666;
        }
        .data-row {
          margin-bottom: 10px;
        }
        .data-label {
          font-weight: bold;
          color: #0056b3;
        }
        .divider {
          border-top: 1px solid #eeeeee;
          margin: 20px 0;
        }
        .signature {
          margin-top: 30px;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <img src="cid:logo" alt="Blueneza Logo" class="email-logo">
        </div>
        <div class="email-content">
          ${content}
        </div>
        <div class="email-footer">
          <p>© ${new Date().getFullYear()} Blueneza. All rights reserved.</p>
          <p>This email was sent automatically. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendQuoteEmail = async (quoteData) => {
  const content = `
    <h1 class="email-title">New Quote Request</h1>
    <div class="data-row"><span class="data-label">Name:</span> ${quoteData.fullName}</div>
    <div class="data-row"><span class="data-label">Phone:</span> ${quoteData.phoneNumber}</div>
    <div class="data-row"><span class="data-label">Email:</span> ${quoteData.email}</div>
    <div class="data-row"><span class="data-label">Company:</span> ${quoteData.companyName || 'N/A'}</div>
    <div class="data-row"><span class="data-label">Product:</span> ${quoteData.product}</div>
    <div class="data-row"><span class="data-label">Quantity:</span> ${quoteData.quantity}</div>
    <div class="data-row"><span class="data-label">Additional Requirements:</span> ${quoteData.additionalRequirements || 'None'}</div>
  `;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Quote Request',
    html: createEmailTemplate(content, 'New Quote Request'),
    attachments: [{
      filename: 'logo.png',
      path: process.env.NODE_ENV === 'production' 
        ? '/path/to/production/logo.png' 
        : 'public/png.png',
      cid: 'logo'
    }]
  };
  
  return await transporter.sendMail(mailOptions);
};

const sendContactEmail = async (contactData) => {
  const content = `
    <h1 class="email-title">New Contact Message</h1>
    <div class="data-row"><span class="data-label">Name:</span> ${contactData.fullName}</div>
    <div class="data-row"><span class="data-label">Email:</span> ${contactData.email}</div>
    <div class="data-row"><span class="data-label">Phone:</span> ${contactData.phoneNumber || 'N/A'}</div>
    <div class="data-row"><span class="data-label">Company:</span> ${contactData.companyName || 'N/A'}</div>
    <div class="data-row"><span class="data-label">Subject:</span> ${contactData.subject}</div>
    <div class="data-row"><span class="data-label">Message:</span> ${contactData.message}</div>
  `;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `Contact Form: ${contactData.subject}`,
    html: createEmailTemplate(content, 'New Contact Message'),
    attachments: [{
      filename: 'logo.png',
      path: process.env.NODE_ENV === 'production' 
        ? '/path/to/production/logo.png' 
        : 'public/png.png',
      cid: 'logo'
    }]
  };
  
  return await transporter.sendMail(mailOptions);
};

const sendQuoteReply = async (quoteData, replyData) => {
  const content = `
    <h1 class="email-title">Quote Response from Blueneza</h1>
    <p>Dear ${quoteData.fullName},</p>
    <p>${replyData.message}</p>
    <div class="divider"></div>
    <h3 style="color: #0056b3;">Your Original Request:</h3>
    <div class="data-row"><span class="data-label">Product:</span> ${quoteData.product || 'N/A'}</div>
    <div class="data-row"><span class="data-label">Quantity:</span> ${quoteData.quantity || 'N/A'}</div>
    <div class="data-row"><span class="data-label">Company:</span> ${quoteData.companyName || 'N/A'}</div>
    <div class="signature">Best regards,<br>Blueneza Team</div>
  `;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: quoteData.email,
    subject: `Re: Your Quote Request - ${quoteData.product || 'Product'}`,
    html: createEmailTemplate(content, 'Quote Response'),
    attachments: [{
      filename: 'logo.png',
      path: process.env.NODE_ENV === 'production' 
        ? '/path/to/production/logo.png' 
        : 'public/png.png',
      cid: 'logo'
    }]
  };
  
  return await transporter.sendMail(mailOptions);
};

const sendContactReply = async (contactData, replyData) => {
  const content = `
    <h1 class="email-title">Response from Blueneza</h1>
    <p>Dear ${contactData.fullName},</p>
    <p>${replyData.message}</p>
    <div class="divider"></div>
    <h3 style="color: #0056b3;">Your Original Message:</h3>
    <div class="data-row"><span class="data-label">Subject:</span> ${contactData.subject || 'N/A'}</div>
    <div class="data-row"><span class="data-label">Message:</span> ${contactData.message || 'N/A'}</div>
    <div class="signature">Best regards,<br>Blueneza Team</div>
  `;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: contactData.email,
    subject: `Re: ${contactData.subject || 'Your Message'}`,
    html: createEmailTemplate(content, 'Response from Blueneza'),
    attachments: [{
      filename: 'logo.png',
      path: process.env.NODE_ENV === 'production' 
        ? '/path/to/production/logo.png' 
        : 'public/png.png',
      cid: 'logo'
    }]
  };
  
  return await transporter.sendMail(mailOptions);
};

module.exports = { sendQuoteEmail, sendContactEmail, sendQuoteReply, sendContactReply };
