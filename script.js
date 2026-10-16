const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const dialog = document.querySelector('.app-dialog');
let dialogTrigger = null;

function closeMenu({ restoreFocus = false } = {}) {
  const wasOpen = menu.getAttribute('aria-expanded') === 'true';
  navigation.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open menu');
  if (wasOpen && restoreFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !dialog.open) closeMenu({ restoreFocus: true });
});
matchMedia('(min-width: 961px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
document.querySelectorAll('[data-app-open]').forEach(button => {
  button.addEventListener('click', () => {
    dialogTrigger = button;
    closeMenu();
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelectorAll('[data-app-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  dialogTrigger?.focus();
});
function updateHeader() { header.classList.toggle('scrolled', scrollY > 12); }
addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
document.querySelector('#year').textContent = new Date().getFullYear();
