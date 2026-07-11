const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser against LIVE site...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  page.on('request', req => {
    if (req.url().includes('/api/') || req.url().includes('login') || req.url().includes('dashboard')) {
      console.log(`[NETWORK REQ] ${req.method()} ${req.url()}`);
    }
  });

  try {
    console.log('Navigating to https://masarak-m0hs3n.vercel.app/login ...');
    await page.goto('https://masarak-m0hs3n.vercel.app/login', { waitUntil: 'networkidle' });

    console.log('Filling credentials...');
    await page.fill('input[type="tel"], input[name="phone"]', '01244422543');
    await page.fill('input[type="password"]', 'A1!y#4YIwkxCX6zj1Rx');
    
    console.log('Clicking login button...');
    await page.click('button[type="submit"]');

    console.log('Waiting for navigation to finish...');
    await page.waitForURL('https://masarak-m0hs3n.vercel.app/', { timeout: 15000 });
    console.log('Successfully logged in and reached homepage.');

    await page.waitForTimeout(3000);

    console.log('Clicking user dropdown...');
    await page.click('button:has(svg.lucide-chevron-down)');
    
    console.log('Waiting for dropdown to appear...');
    await page.waitForTimeout(1000);

    console.log('Clicking Dashboard link...');
    await page.click('text="لوحة التحكم"');

    console.log('Waiting 5 seconds to observe behavior...');
    await page.waitForTimeout(5000);

    console.log(`Final URL: ${page.url()}`);
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
