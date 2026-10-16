const { chromium } = require(process.env.AALOPRO_PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = process.argv[2] || 'http://127.0.0.1:8080/';
const routes = ['', 'aaloapp/', 'aalodot/'];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [], errors = [];
  fs.mkdirSync(path.join(root, 'qa'), { recursive: true });
  try {
    for (const route of routes) {
      for (const width of [1440, 1024, 768, 390, 320]) {
        const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
        page.on('pageerror', error => errors.push({ route, width, message: error.message }));
        page.on('response', response => { if (response.status() >= 400) errors.push({ route, url: response.url(), status: response.status() }); });
        assert.equal((await page.goto(new URL(route, base).href)).status(), 200);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map(async image => { image.loading = 'eager'; await image.decode().catch(() => {}); }));
        });
        const result = await page.evaluate(() => ({
          width: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          h1Count: document.querySelectorAll('h1').length,
          canonical: document.querySelector('link[rel=canonical]')?.href,
          description: document.querySelector('meta[name=description]')?.content,
          missingImages: [...document.images].filter(i => !i.naturalWidth || !i.hasAttribute('alt') || !i.hasAttribute('width') || !i.hasAttribute('height')).map(i => i.src),
          missingFragments: [...document.querySelectorAll('a[href^="#"],use[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(h.slice(1))),
          duplicateIds: [...document.querySelectorAll('[id]')].map(e => e.id).filter((id, i, ids) => ids.indexOf(id) !== i),
          schemaTypes: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'].map(x => x['@type']),
          cards: [...document.querySelectorAll('.product-card')].map(card => {
            const purchase = card.querySelector('.product-purchase').getBoundingClientRect();
            const art = card.querySelector('.app-preview,.dot-image').getBoundingClientRect();
            const features = card.querySelector('.feature-list').getBoundingClientRect();
            return { artworkClearance: purchase.top - art.bottom, featureClearance: purchase.top - features.bottom, purchaseFits: purchase.bottom <= card.getBoundingClientRect().bottom };
          })
        }));
        assert.equal(result.documentWidth, width, JSON.stringify({ route, ...result }));
        assert.equal(result.h1Count, 1);
        assert.equal(result.canonical, 'https://aalopro.com/' + route);
        assert.ok(result.description);
        assert.deepEqual(result.missingImages, []);
        assert.deepEqual(result.missingFragments, []);
        assert.deepEqual(result.duplicateIds, []);
        assert.ok(result.cards.every(c => c.artworkClearance > 0 && c.featureClearance > 0 && c.purchaseFits), JSON.stringify(result.cards));
        if (route) {
          assert.ok(result.schemaTypes.includes('BreadcrumbList'));
          const questions = page.locator('.faq-list details');
          for (let i = 0; i < await questions.count(); i++) {
            await questions.nth(i).locator('summary').click();
            assert.equal(await questions.nth(i).evaluate(e => e.open), true);
            assert.ok(await questions.nth(i).locator('.faq-answer').isVisible());
            await questions.nth(i).locator('summary').click();
          }
        }
        for (const trigger of await page.locator('[data-app-open]').all()) {
          if (!await trigger.isVisible()) continue;
          await trigger.click();
          assert.equal(await page.locator('.app-dialog').evaluate(d => d.open), true);
          await page.keyboard.press('Escape');
          assert.equal(await trigger.evaluate(e => document.activeElement === e), true);
        }
        if (width <= 960) {
          await page.locator('.menu-toggle').click();
          assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
          assert.equal(await page.locator('.menu-toggle').evaluate(e => document.activeElement === e), true);
        }
        await page.evaluate(() => scrollTo(0, 0));
        if ([1440, 390].includes(width)) await page.screenshot({ path: path.join(root, 'qa', `products-${route.replace('/', '') || 'home'}-${width}.png`), fullPage: true });
        results.push({ route, ...result, interactions: 'passed' });
        await page.close();
      }
    }
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(base);
    await page.getByRole('link', { name: 'Explore AaloApp', exact: false }).click();
    assert.ok(page.url().includes('/aaloapp/'));
    assert.ok((await page.locator('main').textContent()).includes('AaloApp SG Primary'));
    await page.getByRole('link', { name: 'Explore AaloDot', exact: false }).click();
    assert.ok(page.url().includes('/aalodot/'));
    assert.ok((await page.locator('main').textContent()).includes('planning stage'));
    await page.locator('.faq-list summary').first().click();
    assert.equal(await page.locator('.faq-list details').first().evaluate(e => e.open), true);
    await page.locator('.breadcrumbs a').click();
    assert.ok((await page.locator('h1').textContent()).includes('Questions.'));
    await context.close();
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(root, 'reports', 'product-pages-checks.json'), JSON.stringify({ date: '2026-10-16', results, noJavaScriptDiscovery: 'passed', errors }, null, 2) + '\n');
    console.log(JSON.stringify({ routes, widths: [1440, 1024, 768, 390, 320], layout: 'passed', imagesAndMetadata: 'passed', interactions: 'passed', noJavaScriptDiscovery: 'passed' }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
