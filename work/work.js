// Shared init for project detail pages.
// Persists `mood`, `voice`, `energy` from the host portfolio if available.
(function () {
  const ENERGY_MAP = {
    calm:    { energy: 0.4, motion: 1100 },
    kinetic: { energy: 1.0, motion: 700 },
    chaotic: { energy: 1.8, motion: 380 },
  };

  // Pick up tweak state from sessionStorage if any
  let state = { mood: 'light', voice: 'brutalist', energy: 'kinetic' };
  try {
    const raw = sessionStorage.getItem('porto-tweaks');
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch (e) {}

  function apply() {
    document.body.dataset.mood = state.mood;
    document.body.dataset.voice = state.voice;
    const e = ENERGY_MAP[state.energy] || ENERGY_MAP.kinetic;
    document.documentElement.style.setProperty('--energy', e.energy);
    document.documentElement.style.setProperty('--motion-ms', e.motion);
  }
  apply();

  // Reveal-on-scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
