const { chromium } = require(process.env.AALOPRO_PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const url = process.argv[2] || 'http://127.0.0.1:8080/';
const widths = [1440, 1201, 1024, 721, 640, 480, 390, 320];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const checks = [];
  const errors = [];
  fs.mkdirSync(path.join(root, 'qa'), { recursive: true });
  try {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 950 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => errors.push({ width, message: error.message }));
      page.on('response', response => {
        if (response.status() >= 400) errors.push({ width, url: response.url(), status: response.status() });
      });
      const response = await page.goto(url);
      if (response.status() !== 200) throw new Error(`Preview HTTP ${response.status()}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(async image => {
          image.loading = 'eager';
          await image.decode().catch(() => {});
        }));
      });
      const result = await page.evaluate(() => {
        const intro = document.querySelector('.product-intro');
        const range = document.createRange();
        range.selectNodeContents(intro);
        const origin = getComputedStyle(document.querySelector('.origin'));
        const cards = [...document.querySelectorAll('.product-card')].map(card => {
          const purchase = card.querySelector('.product-purchase');
          const purchaseRect = purchase.getBoundingClientRect();
          const artwork = card.querySelector('.app-preview,.dot-image').getBoundingClientRect();
          const features = card.querySelector('.feature-list').getBoundingClientRect();
          const tiers = card.querySelector('.price-tiers').getBoundingClientRect();
          const button = purchase.querySelector('.button').getBoundingClientRect();
          return {
            prices: [...card.querySelectorAll('.price-tier')].map(tier => ({
              label: tier.querySelector('dt').innerText,
              price: tier.querySelector('dd').innerText.replace(/\n/g, ' '),
              fits: tier.querySelector('dd').scrollWidth <= tier.clientWidth
            })),
            fits: purchase.scrollWidth <= purchase.clientWidth,
            artworkClearance: purchaseRect.top - artwork.bottom,
            featuresClearance: purchaseRect.top - features.bottom,
            buttonClear: button.left >= tiers.right - 1 || button.top >= tiers.bottom - 1
          };
        });
        const missingAnchors = [...document.querySelectorAll('a[href^="#"],use[href^="#"]')]
          .map(el => el.getAttribute('href')).filter(href => href.length > 1 && !document.getElementById(href.slice(1)));
        return {
          width: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          missingImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
          fontsLoaded: document.fonts.check('900 16px Nunito') && document.fonts.check('400 16px Kalam'),
          missingAnchors,
          intro: intro.innerText,
          introSingleLine: range.getClientRects().length === 1,
          introFits: range.getBoundingClientRect().width <= intro.clientWidth,
          originWeight: origin.fontWeight,
          originBottomSpace: origin.marginBottom,
          contact: document.querySelector('.footer-contact-link').getAttribute('href'),
          stats: [...document.querySelectorAll('.stat')].map(el => el.innerText.replace(/\n/g, ' ')),
          teacher: document.querySelectorAll('.testimonial')[1].innerText,
          cards
        };
      });
      if (result.documentWidth !== width || result.missingImages.length || result.missingAnchors.length || !result.fontsLoaded || !result.introSingleLine || !result.introFits || result.originWeight !== '800' || result.originBottomSpace !== '24px' || result.contact !== 'mailto:help@aalopro.com') throw new Error(JSON.stringify(result));
      if (result.cards.some(card => !card.fits || !card.buttonClear || card.artworkClearance <= 0 || card.featuresClearance <= 0 || card.prices.some(price => !price.fits))) throw new Error(JSON.stringify(result));
      if (!result.teacher.includes('Ms. Rabeya') || !result.teacher.includes('Teacher, Dhaka, Bangladesh')) throw new Error('Teacher details mismatch');
      await page.screenshot({ path: path.join(root, `qa/recovered-${width}.png`), fullPage: true });
      const triggers = page.locator('[data-app-open]');
      for (let i = 0; i < await triggers.count(); i++) {
        const trigger = triggers.nth(i);
        if (!await trigger.isVisible()) continue;
        await trigger.click();
        await page.locator('.app-dialog').waitFor({ state: 'visible', timeout: 3000 });
        await page.keyboard.press('Escape');
        await page.locator('.app-dialog').waitFor({ state: 'hidden', timeout: 3000 });
        if (!await trigger.evaluate(el => document.activeElement === el)) throw new Error('Dialog focus did not return');
      }
      result.appPlaceholderAndFocus = true;
      if (width <= 960) {
        await page.locator('.menu-toggle').click();
        if (await page.locator('.menu-toggle').getAttribute('aria-expanded') !== 'true') throw new Error('Menu did not open');
        await page.locator('#navigation a[href="#products"]').click();
        if (await page.locator('.menu-toggle').getAttribute('aria-expanded') !== 'false') throw new Error('Menu did not close');
        result.mobileMenu = true;
      }
      checks.push(result);
      await page.close();
    }
    if (errors.length) throw new Error(JSON.stringify(errors));
    fs.writeFileSync(path.join(root, 'quality-checks.json'), JSON.stringify({ date: '2026-10-16', recovery: true, checks, errors }, null, 2) + '\n');
    console.log(JSON.stringify({ widths, imageFontAndAnchorChecks: 'passed', layout: 'passed', placeholderAndFocus: 'passed', mobileMenu: 'passed', errors }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
