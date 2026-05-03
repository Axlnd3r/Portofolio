// ============================================================
// Porto Alex — interactions
// ============================================================

(function () {
  // ---------- Hero entrance: split title words ----------
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.querySelectorAll('.line').forEach((line) => {
      const accentSet = (line.dataset.accent || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
      const html = line.innerHTML.trim();
      // Replace marked-up <em>accent</em> spans by treating them specially
      // Simpler: split text by spaces, keep markers via temp DOM
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      // Walk children: text nodes split into words, element nodes preserved
      line.innerHTML = '';
      tmp.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) {
              line.appendChild(document.createTextNode(' '));
              return;
            }
            const wrap = document.createElement('span');
            wrap.className = 'word';
            const inner = document.createElement('span');
            if (accentSet.includes(p.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
              inner.classList.add('accent');
            }
            inner.textContent = p;
            wrap.appendChild(inner);
            line.appendChild(wrap);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Already a span — wrap as a single word
          const wrap = document.createElement('span');
          wrap.className = 'word';
          const inner = document.createElement('span');
          inner.className = node.className || '';
          inner.innerHTML = node.innerHTML;
          wrap.appendChild(inner);
          line.appendChild(wrap);
        }
      });
    });

    const wordSpans = heroTitle.querySelectorAll('.word > span');
    wordSpans.forEach((s, i) => {
      s.style.transitionDelay = `${0.06 * i + 0.15}s`;
    });

    requestAnimationFrame(() => {
      document.querySelector('.hero').classList.add('is-in');
    });
  }

  // ---------- Scroll reveal ----------
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------- Placeholder image detection (project preview + project hero) ----------
  document.querySelectorAll('.project-preview, .project-hero-media').forEach((media) => {
    const img = media.querySelector('img');
    const label = media.dataset.placeholder || 'project image';
    const setEmpty = () => {
      if (media.dataset.empty === 'true') return;
      media.dataset.empty = 'true';
      if (img) img.style.display = 'none';
      const ph = document.createElement('div');
      ph.className = 'placeholder-label';
      const sp = document.createElement('span');
      sp.textContent = `↳  ${label}`;
      ph.appendChild(sp);
      media.appendChild(ph);
    };
    if (!img || !img.getAttribute('src')) {
      setEmpty();
    } else {
      img.addEventListener('error', setEmpty, { once: true });
    }
  });

  // ---------- Footer year ----------
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---------- Active nav link by scroll ----------
  const ids = ['work', 'about', 'experience', 'skills', 'contact'];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const navIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach((s) => navIO.observe(s));

  // ---------- Time / clock for hero ----------
  const clock = document.getElementById('hero-time');
  if (clock) {
    const tick = () => {
      const d = new Date();
      const opts = { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: false };
      clock.textContent = new Intl.DateTimeFormat('en-GB', opts).format(d) + ' WIB';
    };
    tick();
    setInterval(tick, 30000);
  }
})();
