import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import morgan from 'morgan';
import puppeteer from 'puppeteer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for real IP detection (Cloudflare/reverse proxy)
app.set('trust proxy', true);

// Create access log directory if it doesn't exist
const logDir = path.join(__dirname);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create write stream for access log
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

// Custom morgan token to get real IP
morgan.token('real-ip', (req) => {
  return req.ip || req.connection.remoteAddress;
});

// Custom format that includes real IP
const logFormat = ':real-ip - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Setup morgan logging - stream to both file and stdout, but skip health checks for stdout
app.use(morgan(logFormat, {
  stream: accessLogStream
}));

app.use(morgan(logFormat, {
  skip: (req) => req.url === '/api/health'
}));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
// In production (Nixpacks/Coolify), files are in ./dist
// In Docker, files are copied to ./server/dist
const distPath = fs.existsSync(path.join(__dirname, 'dist')) 
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, '../dist');

app.use(express.static(distPath));

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

// Helper function to normalize phone number for WhatsApp API
function normalizePhoneNumber(phone) {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with 27 (South African country code)
  if (cleaned.startsWith('0')) {
    cleaned = '27' + cleaned.substring(1);
  }
  
  return cleaned;
}

// Helper function to send WhatsApp message
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    // Normalize the phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    
    console.log(`Sending WhatsApp to normalized number: ${normalizedPhone}`);
    
    const response = await fetch(`https://ultra.shtf.co.za/${process.env.WHATSAPP_INSTANCE_ID}/messages/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: process.env.WHATSAPP_API_TOKEN,
        to: normalizedPhone,
        body: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WhatsApp API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('WhatsApp API response:', result);
    return result;
  } catch (error) {
    console.error('WhatsApp send error:', error);
    throw error;
  }
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

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
Phone: ${phone || 'Not provided'}
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
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
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

    // Send WhatsApp message if phone number is provided
    if (phone && phone.trim()) {
      try {
        const whatsappMessage = `Hi ${name.split(' ')[0]}! 👋\n\nThank you for reaching out to UptoCode. We've received your message and our team will get back to you within 24 hours.\n\nIn the meantime, feel free to check out our recent projects at https://uptocode.co.za/projects\n\nLooking forward to discussing how we can help transform your business!\n\n- The UptoCode Team`;
        
        await sendWhatsAppMessage(phone, whatsappMessage);
        console.log(`✓ WhatsApp message sent to ${phone}`);
      } catch (whatsappError) {
        // Log the error but don't fail the request
        console.error('WhatsApp send failed (non-critical):', whatsappError.message);
      }
    }

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

// Screenshot endpoint
app.get('/api/screenshot', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Validate URL
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  let browser;
  try {
    console.log(`Capturing screenshot for: ${url}`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport to 16:9 ratio (1600x900)
    await page.setViewport({
      width: 1600,
      height: 900,
      deviceScaleFactor: 1
    });

    // Navigate to the URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 85
    });

    await browser.close();

    // Set cache headers (cache for 1 day)
    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
      'Content-Length': screenshot.length
    });

    res.send(screenshot);
    console.log(`✓ Screenshot captured successfully for ${url}`);
  } catch (error) {
    console.error('Screenshot error:', error);
    
    if (browser) {
      await browser.close();
    }

    res.status(500).json({ 
      error: 'Failed to capture screenshot',
      message: error.message 
    });
  }
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  const indexPath = fs.existsSync(path.join(__dirname, 'dist/index.html'))
    ? path.join(__dirname, 'dist/index.html')
    : path.join(__dirname, '../dist/index.html');
  res.sendFile(indexPath);
});

// Runtime check: confirm the built frontend exists and log contents for debugging
const runtimeDistPath = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, '../dist');
const indexHtmlPath = path.join(runtimeDistPath, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  try {
    const entries = fs.readdirSync(runtimeDistPath);
    console.log(`✓ Serving static files from: ${runtimeDistPath}`);
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
