// Keep all timeline actions together, based on the actual credential wrapping.
document.querySelectorAll('.about-page .about-timeline').forEach((timeline) => {
  const rows = Array.from(timeline.querySelectorAll('.about-resume > div'));
  if (!rows.length) return;

  let updateFrame;

  const update = () => {
    // Always test the side-by-side layout, even when the links are currently below.
    // Measuring the wider stacked layout instead would make the two states oscillate.
    timeline.classList.add('timeline-links-inline');
    const needsStacking = rows.some((row) => {
      const lineHeight = parseFloat(getComputedStyle(row).lineHeight);
      return row.getBoundingClientRect().height > lineHeight + 1
        || row.scrollWidth > row.clientWidth + 1;
    });
    timeline.classList.toggle('timeline-links-inline', !needsStacking);
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(updateFrame);
    updateFrame = requestAnimationFrame(update);
  };

  // The container can resize independently of the browser window, e.g. in a split pane.
  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleUpdate).observe(timeline);
  }
  window.addEventListener('resize', scheduleUpdate);

  // Recheck when the real fonts replace fallbacks or additional font faces finish loading.
  if (document.fonts) {
    document.fonts.ready.then(scheduleUpdate);
    document.fonts.addEventListener('loadingdone', scheduleUpdate);
  }

  update();
});
