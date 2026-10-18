document.querySelectorAll('[data-project-carousel]').forEach((carousel) => {
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const track = carousel.querySelector('[data-carousel-track]');
  const cards = Array.from(track?.children || []);
  const controls = carousel.querySelector('[data-carousel-controls]');
  const status = carousel.querySelector('[data-carousel-status]');
  const previous = carousel.querySelector('[data-carousel-previous]');
  const next = carousel.querySelector('[data-carousel-next]');

  if (!viewport || !track || !cards.length || !controls || !status || !previous || !next) return;

  cards.forEach((card, index) => {
    card.setAttribute('aria-label', `${index + 1} of ${cards.length}`);
  });

  let visibleCount = 1;
  let currentIndex = 0;
  let updateFrame;
  const oneCardLayout = window.matchMedia('(max-width: 52rem)');

  const cardStep = () => {
    if (cards.length < 2) return cards[0].getBoundingClientRect().width;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  };

  const update = () => {
    visibleCount = oneCardLayout.matches ? 1 : Math.min(cards.length, 2);
    currentIndex = Math.max(0, Math.min(cards.length - visibleCount, Math.round(viewport.scrollLeft / cardStep())));

    const firstVisible = currentIndex + 1;
    const lastVisible = Math.min(cards.length, currentIndex + visibleCount);
    status.textContent = visibleCount === 1
      ? `${firstVisible} of ${cards.length}`
      : `${firstVisible}–${lastVisible} of ${cards.length}`;

    controls.hidden = visibleCount !== 1 || cards.length <= 1;
    previous.disabled = currentIndex === 0;
    next.disabled = currentIndex + visibleCount >= cards.length;
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(updateFrame);
    updateFrame = requestAnimationFrame(update);
  };

  const moveTo = (index) => {
    const targetIndex = Math.max(0, Math.min(cards.length - visibleCount, index));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo({ left: cards[targetIndex].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  previous.addEventListener('click', () => moveTo(currentIndex - 1));
  next.addEventListener('click', () => moveTo(currentIndex + 1));
  viewport.addEventListener('scroll', scheduleUpdate, { passive: true });
  oneCardLayout.addEventListener('change', scheduleUpdate);

  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleUpdate).observe(viewport);
  } else {
    window.addEventListener('resize', scheduleUpdate);
  }

  update();
});
