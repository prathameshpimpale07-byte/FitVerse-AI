const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide first name, email, and message' });
    }

    const fullName = `${firstName} ${lastName || ''}`.trim();

    // 1. Save message to database (PROPER Working mechanism)
    const newContact = await Contact.create({
      name: fullName,
      email: email,
      subject: 'New Inquiry from Landing Page',
      message: message,
      status: 'new'
    });

    console.log(`[Contact] Saved new message from ${fullName} (${email}) to database.`);

    // 2. Attempt to send email
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Use Real Credentials with explicit SMTP options
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER.trim(),
            pass: process.env.EMAIL_PASS.trim(),
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        // 1. Email to Admin (You) with the user's message
        // 1. Email to Admin (You) with the user's message
        const adminMailOptions = {
          from: `"FitVerse AI" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER, 
          replyTo: email, 
          subject: `🚀 New Inquiry: ${firstName} ${lastName || ''}`,
          text: `You have received a new inquiry from ${fullName} (${email}):\n\n${message}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; min-height: 100vh;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
                
                <!-- Header -->
                <div style="background-color: #0f172a; padding: 30px; text-align: center; border-bottom: 4px solid #3b82f6;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">FitVerse <span style="color: #3b82f6;">AI</span></h1>
                  <p style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px; margin-bottom: 0;">New Lead Notification</p>
                </div>

                <!-- Body -->
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; font-size: 20px; margin-top: 0; margin-bottom: 25px;">You have a new message!</h2>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 100px; font-size: 14px; text-transform: uppercase; font-weight: bold;">Name</td>
                      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600; font-size: 16px;">${fullName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">Email</td>
                      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; color: #3b82f6; font-weight: 600; font-size: 16px;">
                        <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                      </td>
                    </tr>
                  </table>

                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px;">
                    <p style="margin-top: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; margin-bottom: 10px;">Message Content</p>
                    <p style="margin: 0; color: #334155; font-size: 16px; line-height: 1.7;">${message}</p>
                  </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">Sent automatically from the FitVerse AI contact form.</p>
                </div>

              </div>
            </div>
          `
        };

        // 2. Auto-reply to the User
        const userMailOptions = {
          from: `"FitVerse AI" <${process.env.EMAIL_USER}>`,
          to: email, 
          subject: 'We have received your message - FitVerse AI',
          text: `Dear ${firstName},\n\nThank you for reaching out to FitVerse AI.\n\nWe have successfully received your inquiry and our elite support team is currently reviewing it. You can expect a detailed and personalized reply from us shortly (usually within 24 hours).\n\nThank you for choosing the world's smartest AI fitness platform.\n\nBest Regards,\nThe FitVerse AI Team`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                
                <!-- Minimalist Premium Header -->
                <div style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="color: #0f172a; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">FitVerse <span style="color: #3b82f6;">AI</span></h1>
                  <p style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 3px; margin-top: 10px;">Support Team</p>
                </div>

                <!-- Content -->
                <div style="padding: 20px 40px 40px 40px;">
                  <h2 style="color: #1e293b; font-size: 22px; margin-bottom: 20px; font-weight: 700;">Hello ${firstName},</h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
                    Thank you for reaching out to <strong>FitVerse AI</strong>. We are thrilled to connect with you. This email is to confirm that we have successfully received your inquiry.
                  </p>
                  
                  <!-- Highlight Box -->
                  <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 25px; border-radius: 0 12px 12px 0; margin: 30px 0;">
                    <p style="color: #1e40af; font-size: 16px; line-height: 1.7; margin: 0; font-weight: 500;">
                      Our dedicated team is currently reviewing your message. We prioritize all inquiries and you can expect a detailed, helpful reply from our experts very shortly.
                    </p>
                  </div>

                  <p style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 40px;">
                    We appreciate your patience and look forward to assisting you on your journey to peak performance!
                  </p>
                  
                  <!-- Signature -->
                  <div style="border-top: 1px solid #f1f5f9; padding-top: 25px;">
                    <p style="color: #0f172a; font-size: 16px; font-weight: 700; margin: 0;">Best Regards,</p>
                    <p style="color: #64748b; font-size: 15px; margin-top: 5px;">The FitVerse AI Team</p>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} FitVerse AI. All rights reserved.</p>
                </div>
                
              </div>
            </div>
          `
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
        
        console.log(`[Contact] Admin notification and user confirmation sent.`);
      } else {
        console.log('[Contact] No EMAIL_USER/PASS found in .env. Skipping email sending, but saved to DB.');
      }
    } catch (emailErr) {
      console.error('[Contact] Failed to send email:', emailErr.message);
    }

    // 3. Return success 
    return res.status(200).json({ 
      success: true, 
      message: 'Message saved successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit form. Please try again later.' });
  }
};
