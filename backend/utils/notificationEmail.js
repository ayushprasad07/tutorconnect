const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,   
        pass: process.env.EMAIL_PASS 
    }
})

const sendNotificationMail = (teacherEmail, teacherName, date,subject) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: teacherEmail,
      subject: 'Booking Remainder!',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2c3e50; max-width: 600px; margin: auto;">
            <h2 style="color:#2c3e50;">Hello ${teacherName},</h2>

            <p style="font-size:16px; color:#34495e;">
                You have an upcoming class scheduled with <strong>${studentName}</strong>.
            </p>

            <div style="background-color: #ecf0f1; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="font-size:16px; margin: 0; color:#2c3e50;"><strong>Subject:</strong> ${subject}</p>
                <p style="font-size:16px; margin: 0; color:#2c3e50;"><strong>Date & Time:</strong> ${date}</p>
            </div>

            <p style="font-size:16px; color:#34495e;">
                Kindly ensure you are available and prepared at the scheduled time.
            </p>

            <p style="font-size:16px; color:#34495e;">
                We're grateful to have you as part of the <strong>TutorConnect</strong> community!
            </p>

            <p style="font-size:14px; color:#95a5a6; margin-top: 30px;">
                — The TutorConnect Team
            </p>
        </div>
      `,
    }
    return transporter.sendMail(mailOptions)
};

module.exports = {sendNotificationMail};