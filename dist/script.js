const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); }
menu.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('header')) closeMenu(); });
const icons = { phone: 'phone', book: 'book', chart: 'chart', mic: 'mic', wifi: 'wifi', offline: 'offline', shield: 'shield', people: 'people' };
document.querySelectorAll('i').forEach(element => { const name = icons[element.textContent]; if (name) { const image = document.createElement('img'); image.src = `assets/icons/${name}.svg`; image.alt = ''; image.setAttribute('aria-hidden', 'true'); element.replaceChildren(image); } });
