const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,   
        pass: process.env.EMAIL_PASS 
    }
})

const sendConfirmationEmail = (studentEmail, studentName, teacherName,subject, date) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: 'Booking Confirmed!',
      html: `
        <h2 style="color:#2c3e50;">Hello ${studentName},</h2>

        <p style="font-size:16px; color:#34495e;">
            Great news! Your booking with <strong>${teacherName}</strong> has been 
            <span style="color:#27ae60;"><strong>confirmed</strong></span>.
        </p>

        <p style="font-size:16px; color:#34495e;">
            <strong>Subject:</strong> ${subject}<br>
            <strong>Scheduled Date & Time:</strong> ${date}
        </p>

        <p style="font-size:16px; color:#34495e;">
            Please make sure to be available at the scheduled time. You can view more details and manage your bookings in your TutorConnect dashboard.
        </p>

        <p style="font-size:16px; color:#7f8c8d;">
            Thank you for choosing <strong>TutorConnect</strong> — we wish you a productive learning session!
        </p>

        <p style="font-size:14px; color:#bdc3c7;">
            — The TutorConnect Team
        </p>

      `,
    }
    return transporter.sendMail(mailOptions)
};

module.exports = {sendConfirmationEmail};