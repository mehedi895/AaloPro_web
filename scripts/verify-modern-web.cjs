// Run against a local preview. Optional axe-core adds automated accessibility checks.
const { chromium } = require(process.env.AALOPRO_PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = process.argv[2] || 'http://127.0.0.1:8080/';
const output = process.env.AALOPRO_VERIFY_OUTPUT || path.join(root, 'reports/modern-web-2026-11-16/after');
const routes = ['', 'aaloapp/', 'aalodot/', 'terms/', 'privacy/', 'foundation/'];
const result = { date: '2026-11-16', base, pages: [], consentKeyboard: [], noJavaScript: [], errors: [] };
fs.mkdirSync(output, { recursive: true });
(async () => {
 const browser = await chromium.launch({ channel: 'chrome', headless: true });
 try {
  for (const route of routes) {
   for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => result.errors.push({ route, width, error: error.message }));
    page.on('response', response => { if (response.status() >= 400) result.errors.push({ url: response.url(), status: response.status() }); });
    assert.equal((await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' })).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    const initialBytes = await page.evaluate(() => performance.getEntriesByType('resource').reduce((sum, entry) => sum + entry.encodedBodySize, 0));
    assert.equal(await page.locator('#aalopro-google-tag').count(), 0);
    await page.locator('[data-consent-reject]').click();
    await page.evaluate(async () => {
     await Promise.all([...document.images].map(async image => { image.loading = 'eager'; await image.decode().catch(() => {}); }));
    });
    const state = await page.evaluate(() => ({
     documentWidth: document.documentElement.scrollWidth,
     missingImages: [...document.images].filter(i => !i.naturalWidth).map(i => i.src),
     h1Count: document.querySelectorAll('h1').length,
     duplicateIds: [...document.querySelectorAll('[id]')].map(e => e.id).filter((id, i, ids) => ids.indexOf(id) !== i),
     brokenFragments: [...document.querySelectorAll('a[href^="#"],use[href^="#"]')].map(e => e.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(h.slice(1))),
     canonical: document.querySelector('link[rel=canonical]').href,
     images: [...document.images].map(i => ({ src: i.currentSrc, renderedWidth: i.getBoundingClientRect().width, sourceWidth: i.naturalWidth })),
     foundationFont: document.fonts.check('800 32px "Noto Sans Bengali"', 'শেখার সুযোগ')
    }));
    assert.equal(state.documentWidth, width, `Overflow: ${route} ${width}`);
    assert.deepEqual(state.missingImages, []);
    assert.deepEqual(state.duplicateIds, []);
    assert.deepEqual(state.brokenFragments, []);
    assert.equal(state.h1Count, 1);
    assert.equal(state.canonical, 'https://aalopro.com/' + route);
    if (route !== 'foundation/') {
     const headerLink = page.locator('.header-cta');
     assert.ok((await headerLink.innerText()).includes('AaloPro Foundation'));
     assert.ok((await headerLink.getAttribute('href')).endsWith('foundation/index.html'));
     if (width <= 960) {
      assert.ok(await headerLink.isVisible());
      const headerBoxes = await page.locator('.header-brand,.header-cta,.menu-toggle').evaluateAll(nodes => nodes.map(n => { const r = n.getBoundingClientRect(); return { left: r.left, right: r.right }; }));
      assert.ok(headerBoxes.every(b => b.left >= 0 && b.right <= width), JSON.stringify(headerBoxes));
      assert.ok(headerBoxes[0].right <= headerBoxes[1].left + 1 && headerBoxes[1].right <= headerBoxes[2].left + 1, 'Header controls overlap');
      await page.locator('.menu-toggle').focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      assert.ok(await page.locator('.menu-toggle').evaluate(e => document.activeElement === e));
     }
    } else assert.ok(state.foundationFont);
    for (const summary of await page.locator('.faq-list summary').all()) {
     await summary.focus(); await page.keyboard.press('Enter');
     assert.ok(await summary.evaluate(e => e.parentElement.open));
     await page.keyboard.press('Enter');
    }
    const record = { route, width, initialBytes, ...state };
    if ([390, 1440].includes(width)) {
     await page.evaluate(() => scrollTo(0, 0));
     if (process.env.AALOPRO_AXE_PATH) {
      await page.addScriptTag({ path: process.env.AALOPRO_AXE_PATH });
      record.axe = await page.evaluate(async () => {
       const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
       return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), incomplete: r.incomplete.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) };
      });
     }
     if (record.axe) assert.deepEqual(record.axe.violations, [], `Accessibility violations: ${route} ${width}`);
     await page.screenshot({ path: path.join(output, `${route.replace('/', '') || 'home'}-${width}.png`), fullPage: true });
    }
    result.pages.push(record);
    console.log(JSON.stringify({ route, width, initialBytes, violations: record.axe?.violations }));
    await context.close();
   }
  }
  for (const route of ['', 'foundation/']) {
   const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
   const page = await context.newPage(); await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
   let obscured = [];
   for (let i = 0; i < 35; i++) {
    await page.keyboard.press('Tab');
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const hidden = await page.evaluate(() => {
     const e = document.activeElement, p = document.querySelector('#analytics-consent'), r = e.getBoundingClientRect();
     const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
     return top && p.contains(top) && !p.contains(e) ? e.textContent.trim() : null;
    });
    if (hidden !== null) obscured.push(hidden);
   }
   result.consentKeyboard.push({ route, obscured });
   assert.deepEqual(obscured, [], `Consent hides focus: ${route}`);
   await context.close();
  }
  for (const route of ['', 'foundation/']) {
   const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
   const page = await context.newPage(); await page.goto(new URL(route, base).href);
   const nav = page.locator(route ? '.foundation-nav' : '#navigation');
   assert.ok(await nav.isVisible());
   if (!route) { await page.locator('.header-cta').click(); assert.ok(page.url().includes('/foundation/')); }
   else { await page.getByRole('link', { name: 'মূল AaloPro ওয়েবসাইট' }).click(); assert.ok(!page.url().includes('/foundation/')); }
   result.noJavaScript.push({ route, navigation: 'passed' });
   await context.close();
  }
  assert.deepEqual(result.errors, []);
 } finally {
  fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify(result, null, 2));
  await browser.close();
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
