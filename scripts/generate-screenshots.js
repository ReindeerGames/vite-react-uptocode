import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projects = [
  { name: 'chatboss', url: 'https://chatboss.co.za' },
  { name: 'nudgie', url: 'https://nudgie.co.za' },
  { name: 'waflowbot', url: 'https://waflowbot.com' },
  { name: 'anytimechat', url: 'https://anytimechat.co.za' },
  { name: 'retreathub', url: 'https://retreathub.co.za' },
  { name: 'sarcastic-shtf', url: 'https://sarcastic.shtf.co.za' },
  { name: 'zetac', url: 'https://zetac.co.za' }
];

const screenshotsDir = path.join(__dirname, '../public/screenshots');

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log('✓ Created screenshots directory');
}

async function captureScreenshot(project) {
  let browser;
  try {
    console.log(`Capturing screenshot for: ${project.name} (${project.url})`);
    
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
    await page.goto(project.url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Take screenshot
    const screenshotPath = path.join(screenshotsDir, `${project.name}.jpg`);
    await page.screenshot({
      path: screenshotPath,
      type: 'jpeg',
      quality: 85
    });

    await browser.close();
    console.log(`✓ Screenshot saved: ${project.name}.jpg`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to capture ${project.name}:`, error.message);
    
    if (browser) {
      await browser.close();
    }
    return false;
  }
}

async function generateAllScreenshots() {
  console.log('Starting screenshot generation...\n');
  
  const results = [];
  
  // Capture screenshots sequentially to avoid overwhelming the system
  for (const project of projects) {
    const success = await captureScreenshot(project);
    results.push({ project: project.name, success });
    
    // Small delay between captures
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n=== Screenshot Generation Complete ===');
  console.log(`Successful: ${results.filter(r => r.success).length}/${results.length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}/${results.length}`);
  
  if (results.some(r => !r.success)) {
    console.log('\nFailed projects:');
    results.filter(r => !r.success).forEach(r => console.log(`  - ${r.project}`));
  }
}

// Run the script
generateAllScreenshots().catch(console.error);
