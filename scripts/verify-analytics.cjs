// Uses local build files at an intercepted production origin. No test events reach Google.
const { chromium } = require(process.env.AALOPRO_PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const id = 'G-YYPTQER95H';
const key = 'aalopro.analytics-consent.v1';
const routes = ['', 'aaloapp/', 'aalodot/', 'terms/', 'privacy/'];
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const realTagPath = process.argv[2];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const saved = choice => JSON.stringify({ choice, expires: Date.now() + 86400000 });

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const evidence = { date: '2026-10-16', measurementId: id, published: false, testEventsSentToGoogle: false, checks: [] };
  async function context(options = {}) {
    const { real = false, ...browserOptions } = options;
    const context = await browser.newContext(browserOptions);
    const network = [], errors = [];
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    await context.route('**/*', async route => {
      const req = route.request(), url = new URL(req.url());
      if (['aalopro.com', 'www.aalopro.com', '127.0.0.1'].includes(url.hostname)) {
        let rel = decodeURIComponent(url.pathname).replace(/^\//, '');
        if (!rel || rel.endsWith('/')) rel += 'index.html';
        const file = path.resolve(root, 'dist', rel);
        assert.ok(file.startsWith(path.join(root, 'dist') + path.sep));
        if (!fs.existsSync(file)) return route.fulfill({ status: 404 });
        const bytes = fs.readFileSync(file), type = mime[path.extname(file)] || 'application/octet-stream';
        const range = req.headers().range?.match(/^bytes=(\d+)-(\d*)$/);
        if (range) {
          const start = Number(range[1]), end = range[2] ? Number(range[2]) : bytes.length - 1;
          return route.fulfill({ status: 206, contentType: type, headers: { 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${bytes.length}` }, body: bytes.subarray(start, end + 1) });
        }
        return route.fulfill({ status: 200, contentType: type, body: bytes });
      }
      network.push({ url: req.url(), body: req.postData() || '' });
      if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') {
        assert.equal(url.searchParams.get('id'), id);
        return route.fulfill({ contentType: 'text/javascript', body: real ? fs.readFileSync(realTagPath) : 'window.__testTagLoaded = true;' });
      }
      // Fulfil collection requests locally; do not transmit them to the real property.
      return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true' } });
    });
    return { context, network, errors };
  }
  const commands = page => page.evaluate(() => (window.dataLayer || []).filter(x => typeof x.length === 'number').map(x => Array.from(x)));
  const events = async page => (await commands(page)).filter(x => x[0] === 'event');

  try {
    // Every page starts with analytics blocked, including direct visits to legal pages.
    for (const route of routes) {
      const fixture = await context(); const page = await fixture.context.newPage();
      await page.goto('https://aalopro.com/' + route);
      assert.ok(await page.locator('#analytics-consent').isVisible());
      assert.equal(await page.locator('[data-cookie-settings]').count(), 1);
      assert.equal(fixture.network.length, 0);
      assert.equal((await fixture.context.cookies()).filter(c => c.name.startsWith('_ga')).length, 0);
      await page.locator('[data-consent-reject]').click();
      await page.reload();
      assert.equal(await page.locator('#analytics-consent').isVisible(), false);
      assert.equal(fixture.network.length, 0);
      assert.deepEqual(await events(page), []);
      assert.deepEqual(fixture.errors, []);
      await fixture.context.close();
    }
    evidence.checks.push('All five pages: no external tag, cookies or events before consent or after rejection/reload.');

    const fixture = await context(); const page = await fixture.context.newPage();
    await page.goto('https://aalopro.com/');
    await page.locator('[data-consent-accept]').click();
    await page.waitForFunction(() => window.__testTagLoaded);
    let log = await commands(page);
    assert.deepEqual(log[0].slice(0, 2), ['consent', 'default']);
    assert.equal(log[0][2].analytics_storage, 'denied');
    assert.equal(log[1][2].analytics_storage, 'granted');
    for (const kind of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(log[1][2][kind], 'denied');
    const config = log.find(x => x[0] === 'config');
    assert.equal(config[1], id); assert.equal(config[2].allow_google_signals, false);
    assert.equal(config[2].allow_ad_personalization_signals, false);
    assert.equal((await events(page)).filter(x => x[1] === 'page_view').length, 1);
    await page.locator('[data-cookie-settings]').click();
    assert.equal(await page.locator('#analytics-consent-title').evaluate(el => el === document.activeElement), true);
    await page.locator('[data-consent-accept]').click();
    assert.equal(fixture.network.length, 1); // No duplicate tag after accepting again.
    assert.equal((await events(page)).filter(x => x[1] === 'page_view').length, 1);
    await page.evaluate(() => document.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault(); }));
    await page.locator('.hero-actions a').first().click();
    await page.locator('.footer-contact-link').click();
    log = await events(page);
    assert.equal(log.find(x => x[1] === 'product_click')[2].product, 'aaloapp');
    assert.ok(log.some(x => x[1] === 'contact_click'));
    assert.ok(!JSON.stringify(log).includes('mailto:'));
    await page.goto('https://aalopro.com/aaloapp/');
    await page.waitForFunction(() => window.__testTagLoaded);
    assert.equal(await page.locator('#analytics-consent').isVisible(), false);
    assert.equal((await events(page)).filter(x => x[1] === 'page_view').length, 1);
    // Play one actual ten-second clip; the custom handler supports self-hosted MP4.
    await page.locator('video').evaluate(async video => { video.muted = true; await video.play(); });
    await page.waitForFunction(() => document.querySelector('video').ended, { timeout: 15000 });
    log = await events(page);
    assert.equal(log.filter(x => x[1] === 'video_start').length, 1);
    assert.deepEqual(log.filter(x => x[1] === 'video_progress').map(x => x[2].video_percent), [25, 50, 75]);
    assert.equal(log.filter(x => x[1] === 'video_complete').length, 1);
    evidence.checks.push('Acceptance: consent order, ads denied, one tag/page view, saved choice across pages, product/contact and native-video events.');

    const secondPage = await fixture.context.newPage(); await secondPage.goto('https://aalopro.com/aalodot/');
    await secondPage.waitForFunction(() => window.__testTagLoaded);
    await fixture.context.addCookies([{ name: '_ga', value: 'test', domain: '.aalopro.com', path: '/' }, { name: '_ga_YYPTQER95H', value: 'test', domain: '.aalopro.com', path: '/' }]);
    const tagCount = fixture.network.length;
    await page.locator('[data-cookie-settings]').click();
    await page.locator('[data-consent-reject]').click();
    await page.waitForFunction(() => !window.__testTagLoaded && window['ga-disable-G-YYPTQER95H'] === true);
    await secondPage.waitForFunction(() => !window.__testTagLoaded && window['ga-disable-G-YYPTQER95H'] === true);
    assert.equal(fixture.network.length, tagCount);
    assert.equal((await fixture.context.cookies()).filter(c => c.name.startsWith('_ga')).length, 0);
    assert.deepEqual(fixture.errors, []);
    await fixture.context.close();
    evidence.checks.push('Withdrawal: cookies removed, loaded library unloaded, no further tag loads; refusal propagates to a second tab.');

    for (const storage of ['blocked', 'expired', 'invalid']) {
      const fixture = await context();
      await fixture.context.addInitScript(({ key, storage }) => {
        if (location.protocol !== 'https:') return;
        if (storage === 'blocked') {
          Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
        } else localStorage.setItem(key, storage === 'expired' ? JSON.stringify({ choice: 'accepted', expires: 1 }) : 'invalid-json');
      }, { key, storage });
      const page = await fixture.context.newPage(); await page.goto('https://aalopro.com/');
      assert.ok(await page.locator('#analytics-consent').isVisible()); assert.equal(fixture.network.length, 0);
      if (storage === 'blocked') {
        await page.locator('[data-consent-accept]').click(); await page.waitForFunction(() => window.__testTagLoaded);
        await page.locator('[data-cookie-settings]').click(); await page.locator('[data-consent-reject]').click();
        await page.waitForFunction(() => !window.__testTagLoaded && window['ga-disable-G-YYPTQER95H']);
      }
      assert.deepEqual(fixture.errors, []); await fixture.context.close();
    }
    const local = await context(); const localPage = await local.context.newPage();
    await localPage.goto('http://127.0.0.1/'); await localPage.locator('[data-consent-accept]').click();
    assert.equal(local.network.length, 0); await local.context.close();
    const noJS = await context({ javaScriptEnabled: false }); const noJSPage = await noJS.context.newPage();
    await noJSPage.goto('https://aalopro.com/'); assert.equal(noJS.network.length, 0);
    assert.equal(await noJSPage.locator('#analytics-consent').isVisible(), false); await noJS.context.close();
    evidence.checks.push('Local previews, no JavaScript, unavailable storage, invalid consent and expired consent fail closed.');

    for (const width of [1440, 768, 390, 320]) {
      const fixture = await context({ viewport: { width, height: 900 } }); const page = await fixture.context.newPage();
      await page.goto('https://aalopro.com/'); await page.evaluate(() => document.fonts.ready);
      const rect = await page.locator('#analytics-consent').boundingBox();
      assert.ok(rect.x >= 0 && rect.x + rect.width <= width && rect.y >= 0 && rect.y + rect.height <= 900);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      for (const selector of ['[data-consent-accept]', '[data-consent-reject]']) assert.ok(await page.locator(selector).isVisible());
      if ([1440, 390].includes(width)) await page.screenshot({ path: path.join(root, `qa/analytics-consent-${width}.png`) });
      await fixture.context.close();
    }
    evidence.checks.push('Consent panel fits 1440, 768, 390 and 320px with both choices visible.');

    if (realTagPath) {
      const fixture = await context({ real: true }); const page = await fixture.context.newPage();
      await page.goto('https://aalopro.com/?email=example%40example.test&search=sensitive_test#contact', { referer: 'https://example.test/campaign?email=private' });
      assert.equal(fixture.network.length, 0);
      await page.locator('[data-consent-accept]').click();
      for (let i = 0; i < 30 && !fixture.network.some(x => (x.url + x.body).includes('page_view')); i++) await delay(250);
      const collects = fixture.network.filter(x => x.url.includes('/g/collect'));
      assert.ok(collects.length > 0, 'Real Google library should produce an intercepted collection request');
      const payload = collects.map(x => decodeURIComponent(x.url + '\n' + x.body)).join('\n');
      assert.ok(payload.includes(id)); assert.ok(payload.includes('page_view'), payload);
      assert.ok(!payload.includes('example@example.test'), payload);
      assert.ok(!payload.includes('sensitive_test'), payload);
      assert.ok(!payload.includes('email=private'), payload);
      const cookies = await fixture.context.cookies(); assert.ok(cookies.some(c => c.name === '_ga'));
      assert.ok(cookies.filter(c => c.name.startsWith('_ga')).every(c => c.expires - Date.now() / 1000 <= 181 * 86400));
      const beforeWithdrawal = fixture.network.length;
      await page.locator('[data-cookie-settings]').click(); await page.locator('[data-consent-reject]').click();
      await page.waitForFunction(() => window['ga-disable-G-YYPTQER95H'] && !document.querySelector('#aalopro-google-tag'));
      await delay(500); assert.equal(fixture.network.length, beforeWithdrawal, 'No request should be emitted during withdrawal');
      assert.equal((await fixture.context.cookies()).filter(c => c.name.startsWith('_ga')).length, 0);
      evidence.realTag = { collectionRequestsIntercepted: collects.length, correctMeasurementId: true, queryAndReferrerDetailsExcluded: true, cookieLifetimeUnder181Days: true, withdrawalVerified: true };
      assert.deepEqual(fixture.errors, []); await fixture.context.close();
    }
    fs.writeFileSync(path.join(root, 'reports', 'analytics-checks.json'), JSON.stringify(evidence, null, 2) + '\n');
    console.log(JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
