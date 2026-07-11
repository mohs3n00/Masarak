/**
 * DIAGNOSTIC SCRIPT — يرصد كل redirect بالترتيب والسبب
 * يعمل مع الخادم المحلي على port 3000
 */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    // لا نريد أي حالة سابقة
    storageState: undefined,
  });
  const page = await context.newPage();

  const events = [];
  let eventOrder = 0;

  // Intercept كل console messages
  page.on('console', msg => {
    const text = msg.text();
    if (
      text.includes('[AuthProvider]') ||
      text.includes('[GuestGuard]') ||
      text.includes('[RoleGuard]') ||
      text.includes('[PROBE]')
    ) {
      events.push({ order: ++eventOrder, type: 'CONSOLE', text, ts: Date.now() });
      console.log(`[CONSOLE #${eventOrder}] ${text}`);
    }
  });

  // Intercept كل redirects من الشبكة
  page.on('response', response => {
    const status = response.status();
    if ([301, 302, 307, 308].includes(status)) {
      const loc = response.headers()['location'];
      events.push({ order: ++eventOrder, type: 'NETWORK_REDIRECT', from: response.url(), to: loc, status, ts: Date.now() });
      console.log(`[REDIRECT #${eventOrder}] ${response.url()} --(${status})--> ${loc}`);
    }
  });

  // Intercept Client-Side Navigation (Next.js router)
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      events.push({ order: ++eventOrder, type: 'NAVIGATION', url: frame.url(), ts: Date.now() });
      console.log(`[NAVIGATION #${eventOrder}] → ${frame.url()}`);
    }
  });

  try {
    console.log('\n===== PHASE 1: LOGIN =====');
    await page.goto('http://127.0.0.1:3000/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    // Check current state
    const ls = await page.evaluate(() => localStorage.getItem('masarak_user_data'));
    console.log(`[STATE] localStorage masarak_user_data = ${ls}`);
    const cookies = await context.cookies('http://127.0.0.1:3000');
    console.log(`[STATE] cookies = ${JSON.stringify(cookies.map(c => ({ name: c.name, value: c.value.slice(0, 30) + '...' })))}`);

    console.log('\n===== PHASE 2: FILL CREDENTIALS =====');
    await page.fill('input[type="tel"], input[id="identifier"]', '01244422543');
    await page.fill('input[type="password"], input[id="password"]', 'A1!y#4YIwkxCX6zj1Rx');

    console.log('\n===== PHASE 3: SUBMIT LOGIN =====');
    eventOrder = 0; // Reset event order for cleaner tracking
    events.length = 0;
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000); // Wait to observe all side effects

    const ls2 = await page.evaluate(() => localStorage.getItem('masarak_user_data'));
    const cookies2 = await context.cookies('http://127.0.0.1:3000');
    console.log(`\n[STATE AFTER LOGIN] URL = ${page.url()}`);
    console.log(`[STATE AFTER LOGIN] localStorage = ${ls2}`);
    console.log(`[STATE AFTER LOGIN] cookies = ${JSON.stringify(cookies2.map(c => ({ name: c.name, value: c.value.slice(0, 50) + '...' })))}`);

    console.log('\n===== PHASE 4: CLICK DASHBOARD =====');
    eventOrder = 0;
    events.length = 0;

    // Look for the user dropdown trigger
    const dropdownBtn = await page.$('button:has(svg)');
    if (dropdownBtn) {
      await dropdownBtn.click();
      await page.waitForTimeout(500);
    }

    // Click on dashboard menu item
    const dashBtn = await page.$('text="لوحة التحكم"');
    if (dashBtn) {
      await dashBtn.click();
      console.log('[ACTION] Clicked dashboard button');
    } else {
      console.warn('[ACTION] Could not find dashboard button — trying direct navigation');
      await page.goto('http://127.0.0.1:3000/dashboard/admin', { waitUntil: 'domcontentloaded' });
    }

    await page.waitForTimeout(8000);
    
    console.log(`\n[FINAL URL] ${page.url()}`);
    console.log('\n===== EVENT SEQUENCE =====');
    events.forEach(e => {
      if (e.type === 'NETWORK_REDIRECT') {
        console.log(`  [${e.order}] NETWORK_REDIRECT: ${e.from} → ${e.to} (HTTP ${e.status})`);
      } else if (e.type === 'NAVIGATION') {
        console.log(`  [${e.order}] CLIENT_NAV: → ${e.url}`);
      } else {
        console.log(`  [${e.order}] CONSOLE: ${e.text}`);
      }
    });

  } catch (err) {
    console.error('[ERROR]', err.message);
  } finally {
    await browser.close();
  }
})();
