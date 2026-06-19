
(function () {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function initNav() {
    const toggle = qs('[data-nav-toggle]');
    const nav = qs('[data-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    qsa('.nav a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initHeroSlider() {
    const hero = qs('[data-hero-slider]');
    if (!hero) return;
    const slides = qsa('.hero-slide', hero);
    const thumbs = qsa('[data-hero-thumb]', hero);
    if (slides.length < 2) return;
    let current = 0;
    const setActive = (index) => {
      current = index;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      thumbs.forEach((thumb, i) => thumb.classList.toggle('is-active', i === index));
    };
    thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => setActive(index)));
    setActive(0);
    let timer = window.setInterval(() => setActive((current + 1) % slides.length), 5000);
    hero.addEventListener('mouseenter', () => window.clearInterval(timer));
    hero.addEventListener('mouseleave', () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => setActive((current + 1) % slides.length), 5000);
    });
  }

  function getSearchables(root) {
    return qsa('[data-search-item]', root).filter((el) => el.dataset.searchItem !== 'false');
  }

  function initSearch() {
    qsa('[data-search-input]').forEach((input) => {
      const scope = input.closest('[data-search-scope]') || document;
      const items = getSearchables(scope);
      const counter = qs('[data-search-count]', scope);
      const empty = qs('[data-search-empty]', scope);
      const filter = () => {
        const raw = input.value.trim().toLowerCase();
        let visible = 0;
        items.forEach((item) => {
          const text = (item.dataset.search || item.textContent || '').toLowerCase();
          const ok = !raw || text.includes(raw);
          item.style.display = ok ? '' : 'none';
          if (ok) visible += 1;
        });
        if (counter) counter.textContent = String(visible);
        if (empty) empty.hidden = visible !== 0;
      };
      input.addEventListener('input', filter);
      filter();
    });
  }

  function initChips() {
    qsa('[data-chip-filter]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const scope = chip.closest('[data-search-scope]') || document;
        const input = qs('[data-search-input]', scope);
        if (!input) return;
        input.value = chip.dataset.value || chip.textContent.trim();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        qsa('[data-chip-filter]', scope).forEach((btn) => btn.classList.toggle('is-active', btn === chip));
      });
    });
  }

  function initPlayer() {
    const video = qs('[data-player-video]');
    if (!video) return;
    const mp4 = video.dataset.mp4;
    const m3u8 = video.dataset.m3u8;
    if (m3u8 && window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls();
      hls.loadSource(m3u8);
      hls.attachMedia(video);
      video.dataset.hlsBound = 'true';
    } else if (m3u8 && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = m3u8;
    } else if (mp4) {
      video.src = mp4;
    }

    const play = qs('[data-player-play]');
    if (play) {
      play.addEventListener('click', async () => {
        try {
          await video.play();
          play.style.display = 'none';
        } catch (err) {
          console.warn('play failed', err);
        }
      });
      video.addEventListener('play', () => { play.style.display = 'none'; });
      video.addEventListener('pause', () => { play.style.display = ''; });
    }
  }

  function initBackTop() {
    const btn = qs('[data-backtop]');
    if (!btn) return;
    const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initHeroSlider();
    initSearch();
    initChips();
    initPlayer();
    initBackTop();
  });
})();
