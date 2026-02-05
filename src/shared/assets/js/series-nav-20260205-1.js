(function () {
  function setDisabled(link, disabled) {
    if (!link) return;

    if (disabled) {
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
      link.classList.add('is-disabled');
      link.addEventListener('click', (e) => e.preventDefault());
    } else {
      link.removeAttribute('aria-disabled');
      link.removeAttribute('tabindex');
      link.classList.remove('is-disabled');
    }
  }

  function inferFromPills(bar) {
    const pills = Array.from(bar.querySelectorAll('.pill'));
    if (pills.length === 0) return null;

    const active = bar.querySelector('.pill.active') || pills[0];
    const idx = pills.indexOf(active);
    if (idx < 0) return null;

    return { current: idx + 1, total: pills.length };
  }

  function init() {
    const bars = document.querySelectorAll('.seriesbar');
    bars.forEach((bar) => {
      const prevBtn = bar.querySelector('.series-actions .btn:nth-child(1)');
      const nextBtn = bar.querySelector('.series-actions .btn:nth-child(2)');

      let current = Number(bar.getAttribute('data-series-index'));
      let total = Number(bar.getAttribute('data-series-total'));

      if (!current || !total) {
        const inferred = inferFromPills(bar);
        if (inferred) {
          current = inferred.current;
          total = inferred.total;
        }
      }

      if (!current || !total) return;

      setDisabled(prevBtn, current <= 1);
      setDisabled(nextBtn, current >= total);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
