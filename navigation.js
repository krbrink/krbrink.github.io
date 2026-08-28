document.querySelectorAll('.site-nav').forEach((siteNav) => {
  const toggle = siteNav.querySelector('.menu-toggle');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(willOpen));
    siteNav.classList.toggle('is-open', willOpen);
  });

  window.matchMedia('(min-width: 32.01rem)').addEventListener('change', (event) => {
    if (event.matches) {
      toggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    }
  });
});
