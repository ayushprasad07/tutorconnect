const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,   
        pass: process.env.EMAIL_PASS 
    }
})

const sendConfirmationEmail = (studentEmail, studentName, teacherName, date) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: 'Booking Confirmed!',
      html: `
        <h3>Hello ${studentName},</h3>
        <p>Your booking with <strong>${teacherName}</strong> on <strong>${date}</strong> has been confirmed.</p>
        <p>Thank you for using TutorConnect!</p>
      `,
    }
    return transporter.sendMail(mailOptions)
};

module.exports = {sendConfirmationEmail};