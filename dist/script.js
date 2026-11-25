const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function setMenuBackground(open) {
  document.body.classList.toggle('menu-open', open);
  document.querySelector('main').inert = open;
  document.querySelector('footer').inert = open;
}
function closeMenu({ restoreFocus = false } = {}) {
  const wasOpen = menu.getAttribute('aria-expanded') === 'true';
  navigation.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open menu');
  setMenuBackground(false);
  if (wasOpen && restoreFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  setMenuBackground(open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu({ restoreFocus: true });
  if (event.key === 'Tab' && menu.getAttribute('aria-expanded') === 'true') {
    const controls = [...header.querySelectorAll('a,button')].filter(control => control.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
matchMedia('(min-width: 961px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
// Keep scroll work out of the rendering loop, and leave content visible without JS.
if ('IntersectionObserver' in window) {
  const marker = document.createElement('span');
  marker.className = 'header-marker';
  marker.setAttribute('aria-hidden', 'true');
  document.body.prepend(marker);
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting);
  }).observe(marker);

  if (document.body.classList.contains('home-page')) {
    const links = [...navigation.querySelectorAll('a[href^="#"]')];
    const visibleSections = new Set();
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleSections.add(entry.target.id);
        else visibleSections.delete(entry.target.id);
      });
      const current = links.find(link => visibleSections.has(link.hash.slice(1)));
      links.forEach(link => {
        if (link === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-110px 0px -30% 0px' });
    links.forEach(link => sectionObserver.observe(document.querySelector(link.hash)));

    if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        reveals.unobserve(entry.target);
      }), { threshold: .08 });
      document.querySelectorAll('.learning-steps,.why,.testimonials,.closing-cta').forEach(section => {
        section.classList.add('reveal-once');
        reveals.observe(section);
      });

      const promise = document.getElementById('promise-title');
      const words = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        words.unobserve(entry.target);
      }), { rootMargin: '0px 0px -20% 0px' });
      promise.querySelectorAll(':scope > span').forEach(line => {
        const fragment = document.createDocumentFragment();
        line.textContent.split(' ').forEach((word, index) => {
          if (index) fragment.append(' ');
          const span = document.createElement('span');
          span.className = 'promise-word';
          span.textContent = word;
          fragment.append(span);
          words.observe(span);
        });
        line.replaceChildren(fragment);
      });
      promise.classList.add('promise-animating');
    }
  }
}
