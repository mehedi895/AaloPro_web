const { chromium } = require(process.env.AALOPRO_PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = process.argv[2] || 'http://127.0.0.1:8080/';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [], errors = [];
  fs.mkdirSync(path.join(root, 'qa'), { recursive: true });
  try {
    for (const product of ['aaloapp', 'aalodot']) {
      for (const width of [1440, 768, 390, 320]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const mediaRequests = [];
        page.on('request', req => { if (req.url().endsWith('.mp4')) mediaRequests.push(req.url()); });
        page.on('pageerror', err => errors.push(err.message));
        page.on('response', res => { if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`); });
        assert.equal((await page.goto(new URL(product + '/', base).href)).status(), 200);
        await page.evaluate(() => document.fonts.ready);
        const section = page.locator('.detail-video');
        await section.scrollIntoViewIfNeeded();
        const initial = await page.locator('video').evaluate(async video => {
          const image = new Image(); image.src = video.poster; await image.decode();
          const rect = video.getBoundingClientRect();
          return { controls: video.controls, inline: video.playsInline, preload: video.preload,
            autoplay: video.autoplay, muted: video.muted, paused: video.paused,
            width: rect.width, height: rect.height, posterWidth: image.naturalWidth,
            documentWidth: document.documentElement.scrollWidth,
            followsHero: !!video.closest('section').previousElementSibling.matches('.detail-hero'),
            precedesFeatures: !!video.closest('section').nextElementSibling.matches('.detail-features') };
        });
        assert.equal(initial.controls, true); assert.equal(initial.inline, true);
        assert.equal(initial.preload, 'none'); assert.equal(initial.autoplay, false);
        assert.equal(initial.muted, false); assert.equal(initial.paused, true);
        assert.equal(initial.documentWidth, width); assert.equal(initial.posterWidth, 1280);
        assert.ok(Math.abs(initial.width / initial.height - 16 / 9) < 0.01);
        assert.ok(initial.followsHero && initial.precedesFeatures);
        assert.equal(mediaRequests.length, 0, 'Video should not download before play');
        if (width === 1440 || width === 390) {
          await section.screenshot({ path: path.join(root, 'qa', `video-${product}-${width}.png`) });
        }
        // Decode and play the supplied media without producing sound during automated QA.
        await page.locator('video').evaluate(async video => { video.muted = true; await video.play(); });
        await page.waitForFunction(() => document.querySelector('video').currentTime > 0.3);
        const playback = await page.locator('video').evaluate(video => {
          video.pause();
          return { duration: video.duration, width: video.videoWidth, height: video.videoHeight,
            currentTime: video.currentTime, paused: video.paused, error: video.error?.code || null };
        });
        assert.ok(Math.abs(playback.duration - 10) < 0.05); assert.equal(playback.width, 1280);
        assert.equal(playback.height, 720); assert.equal(playback.error, null);
        assert.equal(playback.paused, true);
        await page.locator('video').evaluate(video => { video.currentTime = 8; });
        await page.waitForFunction(() => !document.querySelector('video').seeking && document.querySelector('video').currentTime >= 8);
        const link = page.locator('.detail-video-caption a');
        assert.equal(await link.getAttribute('href'), `../assets/videos/${product}-preview.mp4`);
        results.push({ product, viewport: width, initial, playback, seekToEightSeconds: true, downloadLink: true });
        await page.close();
      }
      const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      await page.goto(new URL(product + '/', base).href);
      assert.equal(await page.locator('video[controls]').count(), 1);
      assert.equal(await page.locator('.detail-video-caption a').count(), 1);
      await page.close();
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(root, 'reports', 'product-video-checks.json'), JSON.stringify({
      date: '2026-10-16', published: false, checks: results, errors,
      worksWithoutJavaScript: true,
      audio: 'Original audio streams retained. Automated playback muted for QA; dialogue was not transcribed or reviewed.',
      captions: 'No verified transcript supplied; no generated captions added.'
    }, null, 2) + '\n');
    console.log(`Passed video playback, pause, seek, poster, lazy loading and layout checks for ${results.length} page/viewport combinations.`);
  } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
