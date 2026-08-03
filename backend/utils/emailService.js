const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Custom DNS lookup that explicitly forces Node to return IPv4 addresses only
const customIPv4Lookup = (hostname, options, callback) => {
  return dns.lookup(hostname, { family: 4, hints: dns.ADDRCONFIG }, (err, address, family) => {
    callback(err, address, family);
  });
};

const nodemailer = require('nodemailer');
const User = require('../models/User');

let transporter = null;

/**
 * Get or initialize Nodemailer transporter.
 * Configured specifically for cloud hosts like Render with IPv4 forcing, pool: false, and explicit timeouts.
 * @param {number} [overridePort] Optional port override for fallback attempts
 * @param {string} [overrideHost] Optional host override for fallback attempts
 */
const getTransporter = async (overridePort = null, overrideHost = null) => {
  const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : null;
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : null;
  const emailHost = overrideHost || (process.env.EMAIL_HOST ? process.env.EMAIL_HOST.trim() : 'smtp.gmail.com');
  
  // Default to port 587 (STARTTLS) or 465 (SSL)
  const defaultPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT.trim(), 10) : 587;
  const emailPort = overridePort || defaultPort;
  
  const emailSecure = process.env.EMAIL_SECURE !== undefined 
    ? process.env.EMAIL_SECURE === 'true' 
    : emailPort === 465;

  if (emailUser && emailPass) {
    try {
      const options = {
        host: emailHost,
        port: emailPort,
        secure: emailSecure,
        lookup: customIPv4Lookup, // CRITICAL: Overrides Nodemailer internal DNS lookup to strictly return IPv4 & bind to 0.0.0.0!
        pool: false,            // CRITICAL FOR RENDER: Disable connection pooling to prevent ENETUNREACH / stale socket errors
        family: 4,               // CRITICAL FOR RENDER: Force IPv4 DNS lookup to prevent ENETUNREACH on IPv6
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000, // 10s connection timeout safeguard
        greetingTimeout: 10000,   // 10s greeting timeout safeguard
        socketTimeout: 15000,     // 15s socket timeout safeguard
      };

      if (process.env.EMAIL_SERVICE) {
        options.service = process.env.EMAIL_SERVICE;
      }

      return nodemailer.createTransport(options);
    } catch (err) {
      console.error('[EmailService] Error creating SMTP transporter:', err.message);
    }
  }

  // Fallback to Ethereal test account if credentials aren't provided
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      pool: false,
      family: 4,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      connectionTimeout: 10000,
    });
  } catch (err) {
    console.error('[EmailService] Failed to create test email account:', err.message);
    return null;
  }
};

/**
 * Send custom email with automatic fallback retries (trying alternative hosts/ports if Render encounters ENETUNREACH).
 * @param {object} mailOptions Standard nodemailer mail options
 */
const sendMail = async (mailOptions) => {
  if (!transporter) {
    transporter = await getTransporter();
  }

  if (!transporter) {
    console.warn('[EmailService] No transporter available to send email.');
    return null;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [EmailService] Email sent to ${mailOptions.to} | MessageID: ${info.messageId}`);
    
    if (!process.env.EMAIL_USER && nodemailer.getTestMessageUrl) {
      console.log('📩 Email Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (primaryErr) {
    console.warn(`⚠️ [EmailService] Primary send attempt failed (${primaryErr.message}). Trying fallback configuration...`);
    
    const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : null;
    const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : null;

    if (emailUser && emailPass) {
      // Fallback attempts array: try alternative ports and hosts (e.g. smtp.googlemail.com or smtp-relay.gmail.com)
      const fallbackConfigs = [
        { port: 587, host: 'smtp.googlemail.com' },
        { port: 465, host: 'smtp.gmail.com' },
        { port: 587, host: 'smtp-relay.gmail.com' },
      ];

      for (const config of fallbackConfigs) {
        try {
          const fallbackTransporter = await getTransporter(config.port, config.host);
          if (fallbackTransporter) {
            const info = await fallbackTransporter.sendMail(mailOptions);
            console.log(`✉️ [EmailService] Fallback email sent successfully to ${mailOptions.to} via ${config.host}:${config.port} | MessageID: ${info.messageId}`);
            transporter = fallbackTransporter; // Cache working transporter
            return info;
          }
        } catch (fallbackErr) {
          console.warn(`[EmailService] Fallback ${config.host}:${config.port} failed: ${fallbackErr.message}`);
        }
      }
    }

    console.error('❌ [EmailService] All SMTP delivery attempts failed:', primaryErr.message);
    return null;
  }
};

/**
 * Send an email notification matching a website notification.
 * @param {object} options
 * @param {string} options.to - Recipient email address
 * @param {string} [options.userName] - Recipient user name
 * @param {string} options.title - Notification title
 * @param {string} options.description - Notification description
 * @param {string} [options.category] - Category (Workout, Diet, AI, System, Trainer, Payment, Challenge, etc.)
 * @param {string} [options.priority] - Priority (High, Medium, Low)
 * @param {string} [options.actionUrl] - Optional action route/URL
 * @param {string} [options.actionText] - Optional button text
 */
const sendNotificationEmail = async (options) => {
  const {
    to,
    userName = 'FitVerse User',
    title,
    description,
    category = 'System',
    priority = 'Medium',
    actionUrl = '',
    actionText = 'Open FitVerse AI',
  } = options;

  if (!to) {
    console.warn('[EmailService] Cannot send email notification: recipient email missing');
    return null;
  }

  const appUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const fullActionUrl = actionUrl ? (actionUrl.startsWith('http') ? actionUrl : `${appUrl}${actionUrl}`) : appUrl;

  const categoryColors = {
    Workout: '#8b5cf6',
    Diet: '#10b981',
    AI: '#a855f7',
    Trainer: '#3b82f6',
    Payment: '#f59e0b',
    Achievement: '#ec4899',
    Challenge: '#f97316',
    System: '#06b6d4',
    Security: '#ef4444',
  };
  const accentColor = categoryColors[category] || '#06b6d4';

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
    <!-- Outer Container -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f19; padding: 30px 10px;">
      <tr>
        <td align="center">
          <!-- Email Card -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #111827; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
            
            <!-- Brand Header -->
            <tr>
              <td style="padding: 32px 28px; background-color: #0f172a; border-bottom: 3px solid ${accentColor}; text-align: center;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <div style="display: inline-block; padding: 10px 24px; background-color: #1e293b; border-radius: 50px; border: 1px solid #334155;">
                        <span style="font-size: 24px; font-weight: 900; letter-spacing: 0px; color: #ffffff;">
                          FIT<span style="color: ${accentColor};">VERSE</span> <span style="background-color: ${accentColor}; color: #ffffff; padding: 2px 8px; border-radius: 6px; font-size: 16px; font-weight: 900; vertical-align: middle;">AI</span>
                        </span>
                      </div>
                      <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8; font-weight: 700; letter-spacing: 1px;">YOUR INTELLIGENT FITNESS COMPANION</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content Body -->
            <tr>
              <td style="padding: 32px 28px; background-color: #111827;">
                
                <!-- Category & Priority Tag -->
                <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 6px 14px; background-color: ${accentColor}33; border: 1px solid ${accentColor}; border-radius: 20px; color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                      ${category} &bull; ${priority} Priority
                    </td>
                  </tr>
                </table>

                <!-- User Greeting -->
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #38bdf8;">
                  Hey ${userName} 👋
                </p>

                <!-- Notification Title -->
                <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3; letter-spacing: -0.3px;">
                  ${title}
                </h2>

                <!-- Notification Message Box -->
                <div style="margin: 0 0 28px 0; padding: 20px; background-color: #1e293b; border-radius: 14px; border-left: 4px solid ${accentColor}; border-top: 1px solid #334155; border-right: 1px solid #334155; border-bottom: 1px solid #334155;">
                  <p style="margin: 0; font-size: 15px; color: #f8fafc; line-height: 1.6; font-weight: 500;">
                    ${description}
                  </p>
                </div>

                <!-- CTA Button -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a href="${fullActionUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; background-color: ${accentColor}; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; border-radius: 12px; border: 1px solid #ffffff33; box-shadow: 0 8px 20px ${accentColor}44; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${actionText} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 28px; background-color: #0f172a; text-align: center; border-top: 1px solid #1e293b;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">
                  You are receiving this notification because email alerts are enabled on your <strong>FitVerse AI</strong> account.
                </p>
                <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 600;">
                  &copy; ${new Date().getFullYear()} FitVerse AI. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"FitVerse AI" <${process.env.EMAIL_USER || 'noreply@fitverse.com'}>`,
    to,
    subject: `[FitVerse AI] ${title}`,
    html: htmlTemplate,
  };

  return sendMail(mailOptions);
};

module.exports = {
  sendNotificationEmail,
  sendMail,
  getTransporter,
};

