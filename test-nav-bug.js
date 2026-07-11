const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  page.on('request', req => {
    if (req.url().includes('/api/')) {
      console.log(`[NETWORK REQ] ${req.method()} ${req.url()}`);
    }
  });

  page.on('response', res => {
    if (res.url().includes('/api/')) {
      console.log(`[NETWORK RES] ${res.status()} ${res.url()}`);
    }
  });

  try {
    console.log('Navigating to http://127.0.0.1:3000/login ...');
    await page.goto('http://127.0.0.1:3000/login', { waitUntil: 'networkidle' });

    console.log('Filling credentials...');
    await page.fill('input[type="tel"], input[name="phone"]', '01244422543');
    await page.fill('input[type="password"]', 'A1!y#4YIwkxCX6zj1Rx');
    
    console.log('Clicking login button...');
    await page.click('button[type="submit"]');

    console.log('Waiting for navigation to finish...');
    await page.waitForURL('http://127.0.0.1:3000/', { timeout: 10000 });
    console.log('Successfully logged in and reached homepage.');

    // Wait a moment for rendering and auth state to settle
    await page.waitForTimeout(3000);

    console.log('Clicking user dropdown...');
    // We can just click the button that contains the ChevronDown icon in the Navbar
    await page.click('button:has(svg.lucide-chevron-down)');
    
    console.log('Waiting for dropdown to appear...');
    await page.waitForTimeout(1000);

    console.log('Clicking Dashboard link...');
    // Find the link that contains "لوحة التحكم"
    await page.click('text="لوحة التحكم"');

    console.log('Waiting 5 seconds to observe redirects...');
    await page.waitForTimeout(5000);

    console.log(`Final URL: ${page.url()}`);
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
