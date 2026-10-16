/* Optional GA4 for the public marketing website; no tag loads before consent. */
(() => {
  'use strict';
  const measurementId = 'G-YYPTQER95H';
  const storageKey = 'aalopro.analytics-consent.v1';
  const consentDays = 180;
  const production = location.protocol === 'https:' && ['aalopro.com', 'www.aalopro.com'].includes(location.hostname);
  const panel = document.querySelector('#analytics-consent');
  const settingsButtons = document.querySelectorAll('[data-cookie-settings]');
  const closeButton = panel?.querySelector('[data-consent-close]');
  const status = panel?.querySelector('[data-consent-status]');
  if (!panel) return;

  let choice = readChoice();
  let started = false;
  let returnFocus = null;
  const videoStates = new Map();
  window['ga-disable-' + measurementId] = true;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && ['accepted', 'rejected'].includes(saved.choice) && saved.expires > Date.now()) return saved.choice;
    } catch (_) { /* Storage may be unavailable; consent remains off. */ }
    return null;
  }

  function remember(value) {
    choice = value;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ choice: value, expires: Date.now() + consentDays * 86400000 }));
    } catch (_) { /* This page's choice still works without persistent storage. */ }
  }

  function showSettings(trigger = null) {
    returnFocus = trigger;
    closeButton.hidden = !choice;
    status.textContent = choice ? 'Current choice: analytics ' + (choice === 'accepted' ? 'on.' : 'off.') : '';
    panel.hidden = false;
    if (trigger) panel.querySelector('h2').focus();
  }

  function hideSettings() {
    const focusWasInside = panel.contains(document.activeElement);
    panel.hidden = true;
    if (focusWasInside && returnFocus) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }

  function clearAnalyticsCookies() {
    const names = ['_ga', '_ga_' + measurementId.slice(2).replaceAll('-', '_')];
    const domains = ['', location.hostname, '.' + location.hostname, 'aalopro.com', '.aalopro.com'];
    for (const name of names) for (const domain of domains) {
      document.cookie = name + '=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
    }
  }

  function pageLocation() {
    return document.querySelector('link[rel="canonical"]').href;
  }

  function referrerOrigin() {
    try { return new URL(document.referrer).origin + '/'; } catch (_) { return ''; }
  }

  function startAnalytics() {
    if (started || choice !== 'accepted' || !production) return;
    // This static site has no query-driven features. Enhanced measurement can
    // otherwise read raw search terms even when page_location is overridden.
    // Keep real section anchors, but never expose arbitrary URL parameters.
    let fragment = '';
    try { if (document.getElementById(decodeURIComponent(location.hash.slice(1)))) fragment = location.hash; } catch (_) { /* Invalid fragment. */ }
    if (location.search || location.hash !== fragment) {
      try { history.replaceState(history.state, '', location.pathname + fragment); }
      catch (_) { return; } // Do not load a collector when the URL cannot be cleaned.
    }
    started = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const deniedAds = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
    window.gtag('consent', 'default', { ...deniedAds, analytics_storage: 'denied' });
    window.gtag('consent', 'update', { ...deniedAds, analytics_storage: 'granted' });
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('set', 'url_passthrough', false);
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: consentDays * 86400,
      cookie_update: false,
      cookie_flags: 'SameSite=Lax;Secure',
      page_location: pageLocation(),
      page_referrer: referrerOrigin(),
      send_page_view: false
    });
    track('page_view');
    const tag = document.createElement('script');
    tag.async = true;
    tag.id = 'aalopro-google-tag';
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.append(tag);
  }

  function stopAnalytics() {
    window['ga-disable-' + measurementId] = true;
    videoStates.clear();
    clearAnalyticsCookies();
    if (started) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
      });
      // Reload with the saved refusal to remove the already-loaded Google library.
      location.reload();
    }
  }

  function track(name, parameters = {}) {
    if (!production || !started || choice !== 'accepted') return false;
    window.gtag('event', name, {
      send_to: measurementId,
      page_location: pageLocation(),
      page_referrer: referrerOrigin(),
      ...parameters
    });
    return true;
  }

  for (const button of settingsButtons) {
    button.hidden = false;
    button.addEventListener('click', () => showSettings(button));
  }
  panel.querySelector('[data-consent-accept]').addEventListener('click', () => {
    remember('accepted');
    startAnalytics();
    hideSettings();
  });
  panel.querySelector('[data-consent-reject]').addEventListener('click', () => {
    remember('rejected');
    hideSettings();
    stopAnalytics();
  });
  closeButton.addEventListener('click', hideSettings);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape' && choice) { event.preventDefault(); hideSettings(); }
  });
  // A refusal in another tab must also stop this tab's collection.
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    choice = readChoice();
    if (choice === 'accepted') { startAnalytics(); hideSettings(); }
    else { stopAnalytics(); if (!choice) showSettings(); else hideSettings(); }
  });

  function placement(link) {
    if (link.closest('.site-header')) return 'header';
    if (link.closest('.hero-actions,.detail-actions')) return 'hero';
    if (link.closest('.product-card')) return 'product_card';
    if (link.closest('.site-footer')) return 'footer';
    if (link.closest('.detail-related')) return 'related_product';
    if (link.closest('.detail-faq')) return 'faq';
    return 'content';
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || choice !== 'accepted') return;
    const href = link.getAttribute('href');
    if (href.startsWith('mailto:')) {
      const product = document.body.classList.contains('detail-app') ? 'aaloapp' : document.body.classList.contains('detail-dot') ? 'aalodot' : 'general';
      track('contact_click', { product, placement: placement(link) });
      return;
    }
    const target = new URL(href, location.href);
    const product = /\/aaloapp\/(?:index\.html)?$/.test(target.pathname) ? 'aaloapp' : /\/aalodot\/(?:index\.html)?$/.test(target.pathname) ? 'aalodot' : null;
    if (product && link.classList.contains('button')) track('product_click', { product, placement: placement(link) });
    if (link.closest('.detail-video-caption') && /\/(aaloapp|aalodot)-preview\.mp4$/.test(target.pathname)) {
      track('video_download', { product: target.pathname.includes('aaloapp-') ? 'aaloapp' : 'aalodot' });
    }
  });

  for (const video of document.querySelectorAll('.detail-video video')) {
    const product = document.body.classList.contains('detail-app') ? 'aaloapp' : 'aalodot';
    const parameters = percent => ({
      product, video_title: product === 'aaloapp' ? 'AaloApp preview' : 'AaloDot concept preview',
      video_provider: 'self_hosted', video_duration: Math.round(video.duration || 0),
      video_current_time: Math.round(video.currentTime || 0), video_percent: percent
    });
    function state() {
      if (!production || !started || choice !== 'accepted') return null;
      if (!videoStates.has(video)) {
        videoStates.set(video, { last: video.currentTime, watched: 0, milestones: new Set() });
        track('video_start', parameters(0));
      }
      return videoStates.get(video);
    }
    video.addEventListener('play', () => { const value = state(); if (value) value.last = video.currentTime; });
    video.addEventListener('timeupdate', () => {
      if (video.paused || video.seeking || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const value = state(); if (!value) return;
      const delta = video.currentTime - value.last;
      // Ignore seek jumps; only count time played after analytics was accepted.
      if (delta > 0 && delta < 2) value.watched += delta;
      value.last = video.currentTime;
      for (const percent of [25, 50, 75]) {
        if (value.watched / video.duration * 100 >= percent && !value.milestones.has(percent)) {
          value.milestones.add(percent); track('video_progress', parameters(percent));
        }
      }
    });
    video.addEventListener('seeking', () => { const value = videoStates.get(video); if (value) value.last = video.currentTime; });
    video.addEventListener('seeked', () => { const value = videoStates.get(video); if (value) value.last = video.currentTime; });
    video.addEventListener('ended', () => {
      if (videoStates.has(video)) track('video_complete', parameters(100));
      videoStates.delete(video);
    });
  }

  if (choice === 'accepted') startAnalytics();
  else clearAnalyticsCookies();
  if (!choice) showSettings();
})();
