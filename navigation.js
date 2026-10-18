document.querySelectorAll('.site-nav').forEach((siteNav) => {
  const toggle = siteNav.querySelector('.menu-toggle');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(willOpen));
    siteNav.classList.toggle('is-open', willOpen);
  });

  siteNav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 52.01rem)').addEventListener('change', (event) => {
    if (event.matches) {
      toggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    }
  });
});
