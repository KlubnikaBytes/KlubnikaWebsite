const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: '"Klubnika Bytes Security" <no-reply@klubnikabytes.com>',
            to: email,
            subject: 'Your Login OTP Code',
            text: `Your One-Time Password (OTP) for Klubnika Bytes is: ${otp}. It will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; color: #333;">
                    <h2>Welcome back to Klubnika Bytes!</h2>
                    <p>Your One-Time Password (OTP) to securely log in is:</p>
                    <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 8px; letter-spacing: 2px;">${otp}</h1>
                    <p style="color: #888; font-size: 0.9em;">This code will expire in 10 minutes. Please do not share this with anyone.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

const sendApplicationStatusEmail = async (email, name, status, jobId) => {
    try {
        const isAccepted = status === 'Accepted';
        const subject = isAccepted 
            ? 'Update on your application at Klubnika Bytes: You have been shortlisted!' 
            : 'Update on your application at Klubnika Bytes';
            
        const textContent = isAccepted
            ? `Dear ${name},\n\nCongratulations! We are pleased to inform you that your application for the position (Job ID: ${jobId}) has been shortlisted. Our hiring team will contact you shortly for the further process.\n\nBest regards,\nKlubnika Bytes Hiring Team`
            : `Dear ${name},\n\nThank you for your interest in joining Klubnika Bytes and for applying for the position (Job ID: ${jobId}). After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe wish you the best in your future endeavors.\n\nBest regards,\nKlubnika Bytes Hiring Team`;

        const htmlContent = isAccepted
            ? `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Congratulations, ${name}!</h2>
                    <p>We are pleased to inform you that your application for the position (Job ID: ${jobId}) has been shortlisted.</p>
                    <p style="font-weight: bold; color: #6366f1;">Our hiring team will contact you shortly for the further process.</p>
                    <br/>
                    <p>Best regards,<br/><strong>Klubnika Bytes Hiring Team</strong></p>
                </div>
            `
            : `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Update on your application, ${name}</h2>
                    <p>Thank you for your interest in joining Klubnika Bytes and for applying for the position (Job ID: ${jobId}).</p>
                    <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
                    <p>We wish you the best in your future professional endeavors.</p>
                    <br/>
                    <p>Best regards,<br/><strong>Klubnika Bytes Hiring Team</strong></p>
                </div>
            `;

        const mailOptions = {
            from: '"Klubnika Bytes Hiring" <careers@klubnikabytes.com>',
            to: email,
            subject: subject,
            text: textContent,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Status Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error('Error sending application status email:', error);
        return false;
    }
};

module.exports = { sendOTP, sendApplicationStatusEmail };
