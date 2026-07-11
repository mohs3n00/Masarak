const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.text()}`));
  
  page.on('response', response => {
    if ([301, 302, 307, 308].includes(response.status())) {
      console.log(`[NETWORK REDIRECT] ${response.url()} -> ${response.headers().location}`);
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
    await page.waitForURL('http://127.0.0.1:3000/', { timeout: 15000 });
    console.log('Successfully logged in and reached homepage.');

    await page.waitForTimeout(1000);

    const ls1 = await page.evaluate(() => localStorage.getItem('auth-storage'));
    console.log(`[LOCAL STORAGE BEFORE CLICK]: ${ls1}`);

    console.log('Clicking user dropdown...');
    await page.click('button:has(svg.lucide-chevron-down)');
    
    console.log('Waiting for dropdown to appear...');
    await page.waitForTimeout(500);

    console.log('Clicking Dashboard link...');
    await page.click('text="لوحة التحكم"');

    console.log('Waiting 5 seconds to observe behavior...');
    await page.waitForTimeout(5000);

    const ls2 = await page.evaluate(() => localStorage.getItem('auth-storage'));
    console.log(`[LOCAL STORAGE AFTER CLICK]: ${ls2}`);

    console.log(`Final URL: ${page.url()}`);
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
