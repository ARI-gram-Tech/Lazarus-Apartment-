require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

// Email transporter (minimal config)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Only show essential messages
transporter.verify(function(error) {
  if (error) {
    console.log('❌ Email server connection failed');
  } else {
    console.log('✅ Email server ready');
  }
});

// Booking endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, bookingType, date, message } = req.body;

    if (!name || !email || !phone || !bookingType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mailOptions = {
      from: `"Lazarus Apartments" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Booking: ${bookingType}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            border: 1px solid #e0e0e0;
            padding: 20px;
            border-radius: 0 0 5px 5px;
          }
          .detail-row {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: bold;
            color: #2c3e50;
            display: inline-block;
            width: 100px;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-align: center;
          }
          .message-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Booking Request</h1>
        </div>
        
        <div class="content">
          <div class="detail-row">
            <span class="label">Type:</span>
            <span>${bookingType}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Name:</span>
            <span>${name}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Email:</span>
            <span><a href="mailto:${email}">${email}</a></span>
          </div>
          
          <div class="detail-row">
            <span class="label">Phone:</span>
            <span><a href="tel:${phone}">${phone}</a></span>
          </div>
          
          <div class="detail-row">
            <span class="label">Date:</span>
            <span>${date || 'Not specified'}</span>
          </div>
          
          ${message ? `
          <div class="message-box">
            <h3>Special Requests:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>This email was sent from the Lazarus Apartments booking system</p>
            <p>© ${new Date().getFullYear()} Lazarus Apartments</p>
          </div>
        </div>
      </body>
      </html>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Booking request sent successfully!' });
    
  } catch (error) {
    console.log('⚠️ Email error:', error.message);
    res.status(500).json({ error: 'Failed to process booking' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});