const nodemailer = require('nodemailer');

/**
 * Transporter Factory:
 * - Public: for candidate confirmations, contact acknowledgments, and newsletter welcome (from info@klubnikabytes.com)
 * - Admin/System: for internal team notifications (from klubnika.bytes.email@gmail.com)
 */
const getTransporter = (isPublic = false) => {
    // If dedicated SMTP credentials for info@klubnikabytes.com are provided in .env
    if (isPublic && process.env.PUBLIC_SMTP_PASS) {
        const authUser = (process.env.PUBLIC_SMTP_USER || process.env.EMAIL_FROM || 'info@klubnikabytes.com').trim();
        const authPass = (process.env.PUBLIC_SMTP_PASS || '').trim().replace(/\s+/g, '');

        if (process.env.PUBLIC_SMTP_SERVICE) {
            return nodemailer.createTransport({
                service: process.env.PUBLIC_SMTP_SERVICE.trim(),
                auth: { user: authUser, pass: authPass }
            });
        }

        if (process.env.PUBLIC_SMTP_HOST) {
            return nodemailer.createTransport({
                host: process.env.PUBLIC_SMTP_HOST.trim(),
                port: Number(process.env.PUBLIC_SMTP_PORT || 465),
                secure: process.env.PUBLIC_SMTP_SECURE !== 'false',
                auth: { user: authUser, pass: authPass }
            });
        }

        // Default to Google Workspace if no custom host specified
        return nodemailer.createTransport({
            service: 'gmail',
            auth: { user: authUser, pass: authPass }
        });
    }

    const user = (process.env.EMAIL_USER || 'klubnika.bytes.email@gmail.com').trim();
    const pass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user,
            pass
        }
    });
};

/**
 * User-facing sender identity helper.
 * User receives emails strictly from info@klubnikabytes.com
 */
const getPublicSender = () => {
    const fromEmail = (process.env.EMAIL_FROM || 'info@klubnikabytes.com').trim();
    const brandName = (process.env.EMAIL_FROM_NAME || 'Klubnika Bytes').trim();
    return `"${brandName}" <${fromEmail}>`;
};

/**
 * Admin notification sender identity helper.
 * Admin receives notifications sent from klubnika.bytes.email@gmail.com
 */
const getAdminSender = () => {
    const emailUser = (process.env.EMAIL_USER || 'klubnika.bytes.email@gmail.com').trim();
    return `"Klubnika Bytes System" <${emailUser}>`;
};

/**
 * Helper to build admin recipient list.
 * Safely parses comma/semicolon/space-separated emails,
 * and ensures system operational mailbox (EMAIL_USER) is included as a backup recipient
 * so admin notifications are never dropped.
 */
const getAdminRecipients = (envVarKey, defaultAddress) => {
    const configured = (process.env[envVarKey] || defaultAddress || '').trim();
    const backup = (process.env.EMAIL_USER || '').trim();

    const merged = [configured, backup].filter(Boolean).join(',');
    const list = Array.from(new Set(
        merged.split(/[,;\s]+/)
            .map(e => e.trim().toLowerCase())
            .filter(e => e && e.includes('@'))
    ));

    return list.length > 0 ? list : [defaultAddress];
};

const logAuthError = (actionName, details) => {
    console.error(`\n⚠️  [GMAIL AUTHENTICATION FAILED - 535 BadCredentials for ${actionName}]`);
    console.error(`Reason: The 16-character App Password in backend/.env (EMAIL_PASS) is invalid, expired, or was revoked by Google.`);
    console.error(`Steps to fix (takes ~30 seconds):`);
    console.error(`  1. Open: https://myaccount.google.com/apppasswords in your browser (login as ${process.env.EMAIL_USER || 'klubnikabytes@gmail.com'})`);
    console.error(`  2. Ensure 2-Step Verification is ON, then create a new App Password named "Klubnika Website".`);
    console.error(`  3. Copy the 16-letter password and paste it into backend/.env: EMAIL_PASS=your_16_letters`);
    console.error(`  4. Restart the server: npm start\n`);
    if (details) {
        console.log(`📋 [BACKUP LOCAL AUDIT LOG - ${actionName.toUpperCase()}]:`, JSON.stringify(details, null, 2));
    }
};

const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: getPublicSender(),
            sender: (process.env.EMAIL_FROM || 'info@klubnikabytes.com').trim(),
            to: email,
            subject: 'Your Login OTP Code — Klubnika Bytes',
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

        const info = await getTransporter(true).sendMail(mailOptions);
        console.log('OTP Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            logAuthError('OTP Verification Email', { to: email });
        } else {
            console.error('Error sending OTP email:', error.message);
        }
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
            from: getPublicSender(),
            sender: (process.env.EMAIL_FROM || 'info@klubnikabytes.com').trim(),
            to: email,
            replyTo: (process.env.CAREERS_EMAIL || 'hr@klubnikabytes.com').trim(),
            subject: subject,
            text: textContent,
            html: htmlContent
        };

        const info = await getTransporter(true).sendMail(mailOptions);
        console.log('Status Email Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            logAuthError('Application Status Email', { to: email, name, status, jobId });
        } else {
            console.error('Error sending application status email:', error.message);
        }
        return false;
    }
};

/**
 * Send notification to HR / Hiring manager when a new job application is submitted
 */
const sendJobApplicationNotification = async ({
    jobId,
    jobTitle,
    fullName,
    email,
    phone,
    address,
    workExperience,
    education,
    coverLetter,
    resumeLink,
    downloadUrl,
    referredBy,
    resumeFile
}) => {
    try {
        const recipients = getAdminRecipients('CAREERS_EMAIL', 'hr@klubnikabytes.com');
        const subject = `[New Job Application] ${jobTitle || 'Open Position'} — ${fullName}`;

        const htmlContent = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 0 auto; background-color: #F8F1E9; border-radius: 12px; overflow: hidden; border: 1px solid #D9C9BC;">
                <div style="background-color: #32201B; padding: 28px 32px; border-bottom: 4px solid #E23A48;">
                    <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #FF7B88; text-transform: uppercase;">KLUBNIKA BYTES TALENT ACQUISITION</span>
                    <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 8px 0 0 0;">New Candidate Application</h1>
                </div>

                <div style="padding: 32px; background-color: #FFFFFF;">
                    <div style="background-color: #F8F1E9; border-left: 4px solid #E23A48; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                        <span style="font-size: 12px; font-weight: 700; color: #6B5750; text-transform: uppercase;">APPLYING FOR</span>
                        <h2 style="color: #3D2B24; margin: 4px 0 0 0; font-size: 20px;">${jobTitle || 'General Application'}</h2>
                        <span style="font-size: 12px; color: #8C6F63;">Requisition ID: #${jobId ? jobId.substring(0, 8).toUpperCase() : 'N/A'}</span>
                    </div>

                    <h3 style="color: #3D2B24; font-size: 15px; border-bottom: 2px solid #F3E9DF; padding-bottom: 8px; margin-top: 0;">1. Candidate Personal Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; width: 140px; font-weight: 600;">Full Legal Name:</td>
                            <td style="padding: 8px 0; color: #3D2B24; font-weight: 700;">${fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; font-weight: 600;">Email Address:</td>
                            <td style="padding: 8px 0; color: #E23A48; font-weight: 600;"><a href="mailto:${email}" style="color: #E23A48; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; font-weight: 600;">Phone Number:</td>
                            <td style="padding: 8px 0; color: #3D2B24;"><a href="tel:${phone}" style="color: #3D2B24; text-decoration: none;">${phone}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; font-weight: 600;">Current Address:</td>
                            <td style="padding: 8px 0; color: #3D2B24;">${address}</td>
                        </tr>
                        ${referredBy ? `
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; font-weight: 600;">Referred By:</td>
                            <td style="padding: 8px 0; color: #3D2B24;">${referredBy}</td>
                        </tr>` : ''}
                    </table>

                    <h3 style="color: #3D2B24; font-size: 15px; border-bottom: 2px solid #F3E9DF; padding-bottom: 8px; margin-top: 24px;">2. Professional Qualifications</h3>
                    <div style="margin-bottom: 16px;">
                        <span style="font-size: 12px; font-weight: 700; color: #6B5750; text-transform: uppercase;">WORK EXPERIENCE:</span>
                        <p style="color: #3D2B24; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 4px 0 16px; background-color: #F8F1E9; padding: 14px; border-radius: 6px;">${workExperience}</p>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <span style="font-size: 12px; font-weight: 700; color: #6B5750; text-transform: uppercase;">EDUCATION:</span>
                        <p style="color: #3D2B24; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 4px 0 16px; background-color: #F8F1E9; padding: 14px; border-radius: 6px;">${education}</p>
                    </div>

                    ${coverLetter ? `
                    <div style="margin-bottom: 16px;">
                        <span style="font-size: 12px; font-weight: 700; color: #6B5750; text-transform: uppercase;">COVER LETTER / NOTE:</span>
                        <p style="color: #3D2B24; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 4px 0 16px; background-color: #F8F1E9; padding: 14px; border-radius: 6px;">${coverLetter}</p>
                    </div>` : ''}

                    <h3 style="color: #3D2B24; font-size: 15px; border-bottom: 2px solid #F3E9DF; padding-bottom: 8px; margin-top: 24px;">3. Candidate Resume &amp; Documents</h3>
                    
                    ${resumeFile ? `
                    <div style="background-color: #F8F1E9; border: 1px solid #D9C9BC; border-radius: 8px; padding: 22px; margin: 16px 0; text-align: center;">
                        <div style="color: #3D2B24; font-size: 15px; font-weight: 700; margin-bottom: 4px;">📎 ${resumeFile.originalname}</div>
                        <div style="color: #8C6F63; font-size: 12px; margin-bottom: 16px;">Format: ${resumeFile.mimetype || 'Document'} • Size: ${(resumeFile.size / 1024).toFixed(1)} KB</div>
                        
                        ${downloadUrl ? `
                        <div style="margin-bottom: 10px;">
                            <a href="${downloadUrl}" target="_blank" style="display: inline-block; background-color: #E23A48; color: #FFFFFF; font-size: 14px; font-weight: 800; padding: 12px 28px; border-radius: 6px; text-decoration: none; box-shadow: 0 4px 14px rgba(226, 58, 72, 0.28);">
                                📥 Click Here to Download Candidate Resume
                            </a>
                        </div>
                        <p style="margin: 8px 0 0; color: #8C6F63; font-size: 11px;">
                            Direct one-click download from server. The file is also attached below.
                        </p>
                        ` : ''}
                    </div>` : ''}

                    ${resumeLink ? `
                    <div style="background-color: #FAF6F1; border: 1px solid #E5D7CA; border-radius: 6px; padding: 14px 18px; margin: 12px 0;">
                        <strong style="color: #6B5750; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Portfolio / External Link:</strong>
                        <a href="${resumeLink}" target="_blank" style="color: #E23A48; font-weight: 700; font-size: 14px; text-decoration: underline; word-break: break-all;">${resumeLink} →</a>
                    </div>` : ''}
                </div>

                <div style="background-color: #32201B; padding: 18px 32px; color: #B9A79B; font-size: 12px; text-align: center;">
                    Submitted via Klubnika Bytes Careers Portal • Sent to: ${recipients.join(', ')}
                </div>
            </div>
        `;

        const mailOptions = {
            from: getAdminSender(),
            to: recipients,
            subject: subject,
            replyTo: email,
            headers: {
                'X-Priority': '1 (Highest)',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            },
            html: htmlContent
        };

        if (resumeFile && resumeFile.buffer) {
            const cleanFileName = (resumeFile.originalname || 'Candidate_Resume.pdf').replace(/["\r\n]/g, '');
            mailOptions.attachments = [
                {
                    filename: cleanFileName,
                    content: resumeFile.buffer,
                    contentType: resumeFile.mimetype || 'application/octet-stream',
                    contentDisposition: 'attachment'
                }
            ];
        }

        const info = await getTransporter(false).sendMail(mailOptions);
        console.log(`[Job Application Email Sent] MessageId: ${info.messageId} to ${JSON.stringify(recipients)} (Accepted: ${JSON.stringify(info.accepted)})`);
        return true;
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            logAuthError('Job Application Notification', {
                to: process.env.CAREERS_EMAIL,
                jobTitle,
                fullName,
                email,
                phone,
                workExperience,
                education,
                resumeLink
            });
        } else {
            console.error('Error sending job application notification email:', error.message);
        }
        return false;
    }
};

/**
 * Send acknowledgment email to the candidate confirming receipt of application
 */
const sendCandidateConfirmation = async (email, fullName, jobTitle) => {
    try {
        const contactEmail = (process.env.EMAIL_FROM || 'info@klubnikabytes.com').trim();
        const careersEmail = (process.env.CAREERS_EMAIL || 'hr@klubnikabytes.com').trim();

        const mailOptions = {
            from: getPublicSender('Talent Team'),
            to: email,
            replyTo: careersEmail,
            subject: `Thank you for applying to Klubnika Bytes — Application Confirmed (${jobTitle || 'Role'})`,
            html: `
                <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; border: 1px solid #D9C9BC; box-shadow: 0 4px 18px rgba(50, 32, 27, 0.06);">
                    <div style="background-color: #32201B; padding: 28px 32px; border-bottom: 4px solid #E23A48;">
                        <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #FF7B88; text-transform: uppercase; display: block; margin-bottom: 4px;">KLUBNIKA BYTES TALENT ACQUISITION</span>
                        <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Application Received &amp; Confirmed</h1>
                    </div>

                    <div style="padding: 32px; color: #3D2B24; line-height: 1.65; font-size: 15px;">
                        <p style="margin: 0 0 16px; font-size: 16px;">Dear <strong>${fullName}</strong>,</p>
                        
                        <p style="margin: 0 0 20px;">Thank you for your interest in joining <strong>Klubnika Bytes</strong>. We are pleased to confirm that your candidate profile and credentials for <strong>${jobTitle || 'the applied role'}</strong> have been safely registered with our hiring committee.</p>

                        <div style="background-color: #F8F1E9; border-left: 4px solid #E23A48; border-radius: 0 6px 6px 0; padding: 18px 20px; margin: 24px 0;">
                            <span style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #8C6F63; text-transform: uppercase; display: block; margin-bottom: 8px;">SUBMISSION SUMMARY</span>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; width: 140px; font-weight: 600;">Position Applied:</td>
                                    <td style="padding: 4px 0; color: #3D2B24; font-weight: 700;">${jobTitle || 'General Application'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Applicant Legal Name:</td>
                                    <td style="padding: 4px 0; color: #3D2B24;">${fullName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Review Facility:</td>
                                    <td style="padding: 4px 0; color: #3D2B24;">Mani Casadona, Kolkata Corporate HQ</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Current Stage:</td>
                                    <td style="padding: 4px 0; color: #E23A48; font-weight: 700;">Under Technical Review</td>
                                </tr>
                            </table>
                        </div>

                        <h3 style="color: #3D2B24; font-size: 15px; font-weight: 800; margin: 24px 0 8px;">What Happens Next?</h3>
                        <p style="margin: 0 0 24px; color: #6B5750;">Our engineering leads and practice heads review candidate submissions directly. If your technical profile and qualifications align with our scaling requirements, our talent acquisition recruiter will contact you directly via email or telephone to schedule an introductory discussion.</p>

                        <div style="background-color: #FAF6F1; border: 1px solid #D9C9BC; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: #6B5750;">
                            <strong style="color: #3D2B24; display: block; margin-bottom: 4px;">Recruitment Inquiries &amp; Questions</strong>
                            If you need to share additional portfolio files, certifications, or notice period updates, please reply directly to <a href="mailto:${careersEmail}" style="color: #E23A48; font-weight: 700; text-decoration: none;">${careersEmail}</a> or reach out to <a href="mailto:${contactEmail}" style="color: #E23A48; font-weight: 700; text-decoration: none;">${contactEmail}</a>.
                        </div>

                        <p style="margin: 28px 0 0; color: #3D2B24;">
                            Warm regards,<br/>
                            <strong style="font-size: 16px; color: #32201B;">Klubnika Bytes Talent Acquisition</strong><br/>
                            <span style="font-size: 13px; color: #6B5750;">Corporate Headquarters: 11th Floor, West Tower, Mani Casadona, International Financial Hub (CBD), Kolkata 700160</span><br/>
                            <a href="https://www.klubnikabytes.com/careers" style="color: #E23A48; font-weight: 600; font-size: 13px; text-decoration: none;">www.klubnikabytes.com/careers</a>
                        </p>
                    </div>

                    <div style="background-color: #32201B; padding: 20px 32px; color: #B9A79B; font-size: 11px; text-align: center; line-height: 1.6;">
                        © ${new Date().getFullYear()} Klubnika Bytes. All rights reserved. ISO 9001 Certified Quality Management System.<br/>
                        Kolkata (HQ) • Pune • Noida • London (Canada) • Dubai (UAE) • Jersey City (USA)
                    </div>
                </div>
            `
        };

        const info = await getTransporter(true).sendMail(mailOptions);
        console.log(`[Candidate Confirmation Sent] MessageId: ${info.messageId} to ${email}`);
        return true;
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            logAuthError('Candidate Confirmation Auto-Reply', { to: email, fullName, jobTitle });
        } else {
            console.error('Error sending candidate confirmation email:', error.message);
        }
        return false;
    }
};

/**
 * Send notification to leadership / sales when an executive contact inquiry is received
 */
const sendContactInquiryNotification = async ({ name, email, phone, subject, message }) => {
    try {
        const recipients = getAdminRecipients('CONTACT_EMAIL', 'info@klubnikabytes.com');
        const mailSubject = `[Inquiry] ${subject || 'New Enterprise Inquiry'} — ${name}`;

        const htmlContent = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #F8F1E9; border-radius: 12px; overflow: hidden; border: 1px solid #D9C9BC;">
                <div style="background-color: #32201B; padding: 26px 32px; border-bottom: 4px solid #E23A48;">
                    <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #FF7B88; text-transform: uppercase;">KLUBNIKA BYTES EXECUTIVE INQUIRY</span>
                    <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 6px 0 0 0;">New Contact Form Message</h1>
                </div>

                <div style="padding: 30px; background-color: #FFFFFF;">
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 14px;">
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; width: 140px; font-weight: 600;">Contact Name:</td>
                            <td style="padding: 8px 0; color: #3D2B24; font-weight: 700;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; font-weight: 600;">Corporate Email:</td>
                            <td style="padding: 8px 0; color: #E23A48; font-weight: 600;"><a href="mailto:${email}" style="color: #E23A48; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; font-weight: 600;">Phone Number:</td>
                            <td style="padding: 8px 0; color: #3D2B24;">${phone || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B5750; font-weight: 600;">Area of Interest:</td>
                            <td style="padding: 8px 0; color: #3D2B24; font-weight: 700;">${subject || 'General Inquiry'}</td>
                        </tr>
                    </table>

                    <div style="margin-top: 16px;">
                        <span style="font-size: 12px; font-weight: 700; color: #6B5750; text-transform: uppercase;">PROJECT DETAILS / MESSAGE:</span>
                        <p style="color: #3D2B24; font-size: 14px; line-height: 1.65; white-space: pre-wrap; margin: 8px 0 0; background-color: #F8F1E9; padding: 16px; border-radius: 6px; border-left: 3px solid #E23A48;">${message}</p>
                    </div>
                </div>

                <div style="background-color: #32201B; padding: 16px 32px; color: #B9A79B; font-size: 12px; text-align: center;">
                    Received via Klubnika Bytes Contact Gateway • Sent to: ${recipients.join(', ')}
                </div>
            </div>
        `;

        const mailOptions = {
            from: getAdminSender(),
            to: recipients,
            subject: mailSubject,
            replyTo: email,
            headers: {
                'X-Priority': '1 (Highest)',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            },
            html: htmlContent
        };

        const info = await getTransporter(false).sendMail(mailOptions);
        console.log(`[Contact Inquiry Email Sent] MessageId: ${info.messageId} to ${JSON.stringify(recipients)} (Accepted: ${JSON.stringify(info.accepted)})`);
        return true;
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            logAuthError('Contact Inquiry Notification', { name, email, phone, subject, message });
        } else {
            console.error('Error sending contact inquiry email:', error.message);
        }
        return false;
    }
};

/**
 * Send acknowledgment email to inquirer
 */
const sendContactAcknowledgment = async (email, name, subject) => {
    try {
        const contactEmail = (process.env.CONTACT_EMAIL || 'info@klubnikabytes.com').trim();
        const mailOptions = {
            from: getPublicSender('Consulting & Advisory'),
            to: email,
            replyTo: contactEmail,
            subject: `Thank you for contacting Klubnika Bytes — Consultation Request Received`,
            html: `
                <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; border: 1px solid #D9C9BC; box-shadow: 0 4px 18px rgba(50, 32, 27, 0.06);">
                    <div style="background-color: #32201B; padding: 28px 32px; border-bottom: 4px solid #E23A48;">
                        <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #FF7B88; text-transform: uppercase; display: block; margin-bottom: 4px;">KLUBNIKA BYTES CONSULTING &amp; TECHNOLOGY</span>
                        <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Consultation Request Received</h1>
                    </div>

                    <div style="padding: 32px; color: #3D2B24; line-height: 1.65; font-size: 15px;">
                        <p style="margin: 0 0 16px; font-size: 16px;">Dear <strong>${name}</strong>,</p>
                        
                        <p style="margin: 0 0 20px;">Thank you for reaching out to <strong>Klubnika Bytes</strong>. We have safely received your consultation briefing regarding <strong>${subject || 'Enterprise Digital Solutions'}</strong>.</p>

                        <div style="background-color: #F8F1E9; border-left: 4px solid #E23A48; border-radius: 0 6px 6px 0; padding: 18px 20px; margin: 24px 0;">
                            <span style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #8C6F63; text-transform: uppercase; display: block; margin-bottom: 8px;">BRIEFING OVERVIEW</span>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; width: 140px; font-weight: 600;">Contact Name:</td>
                                    <td style="padding: 4px 0; color: #3D2B24; font-weight: 700;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Corporate Email:</td>
                                    <td style="padding: 4px 0; color: #3D2B24;">${email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Area of Interest:</td>
                                    <td style="padding: 4px 0; color: #3D2B24; font-weight: 700;">${subject || 'General Consultation'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Response SLA:</td>
                                    <td style="padding: 4px 0; color: #E23A48; font-weight: 700;">Within 24 Business Hours</td>
                                </tr>
                            </table>
                        </div>

                        <h3 style="color: #3D2B24; font-size: 15px; font-weight: 800; margin: 24px 0 8px;">What Happens Next?</h3>
                        <p style="margin: 0 0 24px; color: #6B5750;">Our executive advisory team, cloud architects, and practice leaders review every client scope individually. A senior consultant aligned with your technological requirements will reach out directly within 24 business hours to evaluate your project scope and discuss technical architecture or delivery models.</p>

                        <div style="background-color: #FAF6F1; border: 1px solid #D9C9BC; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: #6B5750;">
                            <strong style="color: #3D2B24; display: block; margin-bottom: 4px;">Immediate Assistance &amp; Direct Line</strong>
                            Need immediate operational support or direct sales liaison? You can connect with our executive team directly via telephone at <a href="tel:+919831041427" style="color: #E23A48; font-weight: 700; text-decoration: none;">+91 98310 41427</a> or email <a href="mailto:${contactEmail}" style="color: #E23A48; font-weight: 700; text-decoration: none;">${contactEmail}</a>.
                        </div>

                        <p style="margin: 28px 0 0; color: #3D2B24;">
                            Warm regards,<br/>
                            <strong style="font-size: 16px; color: #32201B;">Klubnika Bytes Advisory Team</strong><br/>
                            <span style="font-size: 13px; color: #6B5750;">Corporate Headquarters: 11th Floor, West Tower, Mani Casadona, International Financial Hub (CBD), Kolkata 700160</span><br/>
                            <a href="https://www.klubnikabytes.com" style="color: #E23A48; font-weight: 600; font-size: 13px; text-decoration: none;">www.klubnikabytes.com</a>
                        </p>
                    </div>

                    <div style="background-color: #32201B; padding: 20px 32px; color: #B9A79B; font-size: 11px; text-align: center; line-height: 1.6;">
                        © ${new Date().getFullYear()} Klubnika Bytes. All rights reserved. ISO 9001 Certified Quality Management System.<br/>
                        Kolkata (HQ) • Pune • Noida • London (Canada) • Dubai (UAE) • Jersey City (USA)
                    </div>
                </div>
            `
        };

        const info = await getTransporter(true).sendMail(mailOptions);
        console.log(`[Contact Acknowledgment Sent] MessageId: ${info.messageId} to ${email}`);
        return true;
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            logAuthError('Contact Acknowledgment Auto-Reply', { email, name, subject });
        } else {
            console.error('Error sending contact acknowledgment email:', error.message);
        }
        return false;
    }
};

/**
 * Send notification when someone joins the newsletter
 */
const sendNewsletterNotification = async (email) => {
    try {
        const recipients = getAdminRecipients('NEWSLETTER_NOTIFY_EMAIL', 'info@klubnikabytes.com');

        const mailOptions = {
            from: getAdminSender(),
            to: recipients,
            subject: `[Newsletter] New Subscriber — ${email}`,
            headers: {
                'X-Priority': '1 (Highest)',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            },
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; border: 1px solid #D9C9BC;">
                    <div style="background-color: #32201B; padding: 20px 24px; border-bottom: 3px solid #E23A48;">
                        <h3 style="color: #FFFFFF; margin: 0; font-size: 18px;">New Newsletter Subscription</h3>
                    </div>
                    <div style="padding: 24px; color: #3D2B24; line-height: 1.6;">
                        <p style="font-size: 14px; margin: 0 0 12px;">A new business contact has subscribed to the Klubnika Bytes newsletter:</p>
                        <p style="font-size: 16px; font-weight: 700; color: #E23A48; margin: 0 0 16px;">${email}</p>
                        <p style="font-size: 12px; color: #8C6F63; margin: 0;">Subscription Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
                    </div>
                    <div style="background-color: #32201B; padding: 12px 24px; color: #B9A79B; font-size: 11px; text-align: center;">
                        Sent to: ${recipients.join(', ')}
                    </div>
                </div>
            `
        };

        const info = await getTransporter(false).sendMail(mailOptions);
        console.log(`[Newsletter Notification Sent] MessageId: ${info.messageId} to ${JSON.stringify(recipients)} (Accepted: ${JSON.stringify(info.accepted)})`);
        return true;
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            logAuthError('Newsletter Notification', { subscriberEmail: email });
        } else {
            console.error('Error sending newsletter notification:', error.message);
        }
        return false;
    }
};

/**
 * Send welcome email to new subscriber
 */
const sendNewsletterWelcome = async (email) => {
    try {
        const contactEmail = (process.env.EMAIL_FROM || 'info@klubnikabytes.com').trim();
        const mailOptions = {
            from: getPublicSender('Insights & Editorial'),
            to: email,
            replyTo: contactEmail,
            subject: 'Welcome to Klubnika Bytes Insights — Subscription Confirmed',
            html: `
                <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; border: 1px solid #D9C9BC; box-shadow: 0 4px 18px rgba(50, 32, 27, 0.06);">
                    <div style="background-color: #32201B; padding: 28px 32px; border-bottom: 4px solid #E23A48;">
                        <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #FF7B88; text-transform: uppercase; display: block; margin-bottom: 4px;">KLUBNIKA BYTES INSIGHTS</span>
                        <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Subscription Confirmed</h1>
                    </div>

                    <div style="padding: 32px; color: #3D2B24; line-height: 1.65; font-size: 15px;">
                        <p style="margin: 0 0 16px; font-size: 16px;">Hello,</p>
                        
                        <p style="margin: 0 0 20px;">Thank you for subscribing to <strong>Klubnika Bytes Insights</strong>! Your subscription has been successfully confirmed for <strong style="color: #E23A48;">${email}</strong>.</p>

                        <div style="background-color: #F8F1E9; border-left: 4px solid #E23A48; border-radius: 0 6px 6px 0; padding: 18px 20px; margin: 24px 0;">
                            <span style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #8C6F63; text-transform: uppercase; display: block; margin-bottom: 8px;">SUBSCRIPTION OVERVIEW</span>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; width: 140px; font-weight: 600;">Subscriber Email:</td>
                                    <td style="padding: 4px 0; color: #3D2B24; font-weight: 700;">${email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Briefing Cadence:</td>
                                    <td style="padding: 4px 0; color: #3D2B24;">Monthly Technology &amp; Leadership Perspectives</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Key Topics:</td>
                                    <td style="padding: 4px 0; color: #3D2B24;">Enterprise Cloud, AI Automation, GCC Advisory, 2.5% Payroll Club</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; color: #6B5750; font-weight: 600;">Status:</td>
                                    <td style="padding: 4px 0; color: #15803D; font-weight: 700;">Active Subscriber</td>
                                </tr>
                            </table>
                        </div>

                        <h3 style="color: #3D2B24; font-size: 15px; font-weight: 800; margin: 24px 0 8px;">What You Will Receive</h3>
                        <p style="margin: 0 0 24px; color: #6B5750;">You will receive periodic, high-impact briefings authored by senior engineering leaders, certified cloud architects, and management consultants. We focus on real-world engineering architecture, cost optimization models, and AI agent implementations without marketing fluff.</p>

                        <div style="background-color: #FAF6F1; border: 1px solid #D9C9BC; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: #6B5750;">
                            <strong style="color: #3D2B24; display: block; margin-bottom: 4px;">Explore Capabilities &amp; Case Studies</strong>
                            In the meantime, feel free to explore our core verticals and case studies at <a href="https://www.klubnikabytes.com" style="color: #E23A48; font-weight: 700; text-decoration: none;">www.klubnikabytes.com</a> or discuss a scoped project with our advisory team at <a href="mailto:${contactEmail}" style="color: #E23A48; font-weight: 700; text-decoration: none;">${contactEmail}</a>.
                        </div>

                        <p style="margin: 28px 0 0; color: #3D2B24;">
                            Warm regards,<br/>
                            <strong style="font-size: 16px; color: #32201B;">The Klubnika Bytes Editorial Team</strong><br/>
                            <span style="font-size: 13px; color: #6B5750;">Mani Casadona, International Financial Hub (CBD), Kolkata 700160</span><br/>
                            <a href="https://www.klubnikabytes.com" style="color: #E23A48; font-weight: 600; font-size: 13px; text-decoration: none;">www.klubnikabytes.com</a>
                        </p>
                    </div>

                    <div style="background-color: #32201B; padding: 20px 32px; color: #B9A79B; font-size: 11px; text-align: center; line-height: 1.6;">
                        © ${new Date().getFullYear()} Klubnika Bytes. All rights reserved. ISO 9001 Certified Quality Management System.<br/>
                        Kolkata (HQ) • Pune • Noida • London (Canada) • Dubai (UAE) • Jersey City (USA)
                    </div>
                </div>
            `
        };

        const info = await getTransporter(true).sendMail(mailOptions);
        console.log(`[Newsletter Welcome Sent] MessageId: ${info.messageId} to ${email}`);
        return true;
    } catch (error) {
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            logAuthError('Newsletter Welcome Auto-Reply', { subscriberEmail: email });
        } else {
            console.error('Error sending newsletter welcome:', error.message);
        }
        return false;
    }
};

module.exports = { 
    sendOTP, 
    sendApplicationStatusEmail,
    sendJobApplicationNotification,
    sendCandidateConfirmation,
    sendContactInquiryNotification,
    sendContactAcknowledgment,
    sendNewsletterNotification,
    sendNewsletterWelcome
};
