import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build (copied into server/dist in the image)
app.use(express.static(path.join(__dirname, 'dist')));

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('✓ SMTP server is ready to send emails');
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Prepare email to admin
    const adminEmailBody = `
New Contact Form Submission from UptoCode.co.za

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}

Message:
${message}

---
Sent from UptoCode Contact Form
    `.trim();

    const adminHtmlBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Sent from UptoCode Contact Form</small></p>
    `;

    // Prepare email to user
    const userHtmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
          <h1 style="color: #1a1a1a; margin: 0 0 1rem 0; font-size: 2rem;">Thank you for contacting UptoCode!</h1>
          <p style="margin: 0; font-size: 1.1rem;">Hi ${name.split(' ')[0]},</p>
        </div>

        <p style="margin: 0 0 1.5rem 0;">Thank you for reaching out to us. We've received your message and appreciate your interest in UptoCode's custom software solutions.</p>

        <p style="margin: 0 0 1.5rem 0;"><strong>What happens next?</strong> Our team will review your inquiry and get back to you within 24 hours to discuss how we can help transform your business.</p>

        <div style="background: #f8f9fa; padding: 2rem; border-radius: 8px; margin: 2rem 0;">
          <h2 style="color: #1a1a1a; margin: 0 0 1.5rem 0; font-size: 1.5rem;">Take a look at some of our recent work</h2>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="color: #0066cc; margin: 0 0 0.5rem 0; font-size: 1.1rem;">
              <a href="https://nudgie.co.za" style="color: #0066cc; text-decoration: none;">Nudgie</a>
            </h3>
            <p style="margin: 0 0 1rem 0; color: #666;">Intelligent notification and reminder system designed to help teams stay on top of important deadlines and communications.</p>
          </div>

          <div style="margin-bottom: 2rem;">
            <h3 style="color: #0066cc; margin: 0 0 0.5rem 0; font-size: 1.1rem;">
              <a href="https://waflowbot.com" style="color: #0066cc; text-decoration: none;">WaFlowBot</a>
            </h3>
            <p style="margin: 0 0 1rem 0; color: #666;">WhatsApp automation and workflow management platform that streamlines business communication and customer engagement.</p>
          </div>

          <div style="margin-bottom: 2rem;">
            <h3 style="color: #0066cc; margin: 0 0 0.5rem 0; font-size: 1.1rem;">
              <a href="https://retreathub.co.za" style="color: #0066cc; text-decoration: none;">RetreatHub</a>
            </h3>
            <p style="margin: 0 0 0; color: #666;">Retreat and venue booking management system built specifically for hospitality businesses to streamline reservations and customer management.</p>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 2rem; border-radius: 8px; margin: 2rem 0; text-align: center;">
          <p style="margin: 0 0 1rem 0;">Want to see more of our work? Check out our full portfolio:</p>
          <a href="https://uptocode.co.za/projects" style="display: inline-block; background: #0066cc; color: white; text-decoration: none; padding: 0.875rem 1.5rem; border-radius: 6px; font-weight: 600;">View All Projects</a>
        </div>

        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 2rem 0;">

        <p style="margin: 0 0 1rem 0; color: #666; font-size: 0.95rem;">
          <strong>UptoCode</strong><br>
          Custom Software Solutions<br>
          South Africa<br>
          <a href="mailto:info@uptocode.co.za" style="color: #0066cc; text-decoration: none;">info@uptocode.co.za</a>
        </p>

        <p style="margin: 0; color: #999; font-size: 0.85rem;">This email was sent in response to your contact form submission. If you did not submit this form, please disregard this email.</p>
      </div>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: `"UptoCode Contact Form" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_TO,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: adminEmailBody,
      html: adminHtmlBody,
    });

    // Send email to user
    await transporter.sendMail({
      from: `"UptoCode" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Thank you for contacting UptoCode',
      html: userHtmlBody,
    });

    console.log(`✓ Emails sent successfully - Admin: ${process.env.SMTP_TO}, User: ${email}`);
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Runtime check: confirm the built frontend exists and log contents for debugging
const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  try {
    const entries = fs.readdirSync(distPath);
    console.log(`✓ Serving static files from: ${distPath}`);
    console.log(`✓ dist contains ${entries.length} entries: ${entries.slice(0, 20).join(', ')}`);
  } catch (err) {
    console.log('⚠️ Could not read dist directory contents:', err);
  }
} else {
  console.warn(`⚠️ Warning: ${indexHtmlPath} not found. Static UI will not be served.`);
}

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
