const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    function getMetrics(element) {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return {
        tag: element.tagName,
        className: element.className,
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height, y: rect.y },
        overflow: style.overflow,
        overflowY: style.overflowY,
        marginTop: style.marginTop,
        paddingTop: style.paddingTop,
        transform: style.transform,
        clip: style.clip,
        clipPath: style.clipPath,
        position: style.position,
        boxSizing: style.boxSizing,
        display: style.display,
        alignItems: style.alignItems
      };
    }

    const html = document.documentElement;
    const body = document.body;
    const header = document.querySelector('header');
    const container = header ? header.querySelector('.container') : null;
    const flex = container ? container.querySelector('.flex') : null;
    const logo = document.querySelector('header img');
    const button = document.querySelector('header button');
    
    return {
      html: getMetrics(html),
      body: getMetrics(body),
      header: getMetrics(header),
      container: getMetrics(container),
      flex: getMetrics(flex),
      logo: getMetrics(logo),
      button: getMetrics(button)
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
