const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Specific email templates
const sendComplaintSubmittedEmail = async (userEmail, complaintTitle) => {
  console.log(`Sending complaint submitted email to: ${userEmail} for complaint: ${complaintTitle}`);
  const subject = 'Complaint Submitted Successfully';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00D4B8;">Complaint Submitted</h2>
      <p>Dear User,</p>
      <p>Your complaint titled "<strong>${complaintTitle}</strong>" has been successfully submitted to our system.</p>
      <p>We will review your complaint and update you on the progress.</p>
      <p>Thank you for using CMS Portal.</p>
      <br>
      <p>Best regards,<br>CMS Portal Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
};

const sendComplaintResolvedEmail = async (userEmail, complaintTitle) => {
  console.log(`Sending complaint resolved email to: ${userEmail} for complaint: ${complaintTitle}`);
  const subject = 'Complaint Resolved';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00D4B8;">Complaint Resolved</h2>
      <p>Dear User,</p>
      <p>Your complaint titled "<strong>${complaintTitle}</strong>" has been resolved.</p>
      <p>Please check your dashboard for more details.</p>
      <p>Thank you for your patience.</p>
      <br>
      <p>Best regards,<br>CMS Portal Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendComplaintSubmittedEmail,
  sendComplaintResolvedEmail
};