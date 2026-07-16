const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('request', req => {
    if (req.method() === 'POST' && req.url().includes('login')) {
      console.log('LOGIN REQ TO:', req.url());
    }
  });
  await page.goto('https://masarak-m0hs3n.vercel.app/login');
  await page.fill('input[type="tel"], input[name="phone"]', '01244422543');
  await page.fill('input[type="password"]', 'A1!y#4YIwkxCX6zj1Rx');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  await browser.close();
})();
