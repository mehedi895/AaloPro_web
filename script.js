/* Optional progressive enhancement. Content and email actions work without JS. */
'use strict';

document.documentElement.classList.add('js');

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

function setMenu(isOpen) {
  if (!toggle || !navigation) return;
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', isOpen);
  const image = toggle.querySelector('img');
  if (image) image.src = isOpen ? 'assets/icons/close.svg' : 'assets/icons/menu.svg';
}

if (toggle && navigation) {
  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !toggle.contains(event.target)) {
      setMenu(false);
    }
  });
}

// Highlight the section currently in view, while preserving ordinary anchor links.
if ('IntersectionObserver' in window && navigation) {
  const links = Array.from(navigation.querySelectorAll('.nav-link'));
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach((link) => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-8% 0px -65% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}
