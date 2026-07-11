const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to https://masarak-m0hs3n.vercel.app/login ...');
    await page.goto('https://masarak-m0hs3n.vercel.app/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'vercel-login.png' });
    console.log('Screenshot saved to vercel-login.png');
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
