const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const data = await page.evaluate(() => {
    function getMetrics(selector) {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return {
        selector,
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height, y: rect.y },
        overflow: style.overflow,
        overflowY: style.overflowY,
        clip: style.clip,
        clipPath: style.clipPath,
        mask: style.mask,
        transform: style.transform,
        marginTop: style.marginTop,
        paddingTop: style.paddingTop,
        position: style.position,
        height: style.height,
        boxSizing: style.boxSizing,
        display: style.display,
        alignItems: style.alignItems,
        zIndex: style.zIndex
      };
    }

    return {
      html: getMetrics('html'),
      body: getMetrics('body'),
      header: getMetrics('header'),
      container: getMetrics('header .container'),
      flex: getMetrics('header .flex'),
      logo: getMetrics('header img'),
      button: getMetrics('header button')
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
