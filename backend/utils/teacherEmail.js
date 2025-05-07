const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,   
        pass: process.env.EMAIL_PASS 
    }
})

const sendTeacherConfirmationEmail = (teacherEmail, studentName, teacherName,subject, date) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: teacherEmail,
      subject: 'A booking request for you!',
      html: `
        <h2 style="color:#2c3e50;">Hello ${teacherName},</h2>

        <p style="font-size:16px; color:#34495e;">
            You have received a new <strong style="color:#27ae60;">booking request</strong> from 
            <strong>${studentName}</strong>.
        </p>

        <p style="font-size:16px; color:#34495e;">
            <strong>Subject:</strong> ${subject}<br>
            <strong>Scheduled Date & Time:</strong> ${date}
        </p>

        <p style="font-size:16px; color:#34495e;">
            Please log in to your TutorConnect dashboard to <strong>confirm</strong> or <strong>decline</strong> this request.
        </p>

        <p style="font-size:16px; color:#7f8c8d;">
            Thank you for being a part of <strong>TutorConnect</strong>!
        </p>

        <p style="font-size:14px; color:#bdc3c7;">
            — The TutorConnect Team
        </p>

      `,
    }
    return transporter.sendMail(mailOptions)
};

module.exports = {sendTeacherConfirmationEmail};