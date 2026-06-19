
(function(){
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));
  const slides = [...document.querySelectorAll('[data-hero-slide]')];
  if (slides.length > 1) {
    let index = 0;
    const go = (n) => {
      slides[index].classList.remove('active');
      index = (n + slides.length) % slides.length;
      slides[index].classList.add('active');
      document.querySelectorAll('[data-hero-dot]').forEach((d,i)=>d.classList.toggle('active', i===index));
    };
    document.querySelectorAll('[data-hero-dot]').forEach((dot, i) => dot.addEventListener('click', () => go(i)));
    setInterval(() => go(index + 1), 6000);
    window.addEventListener('keydown', (e)=>{ if (e.key === 'ArrowRight') go(index+1); if (e.key === 'ArrowLeft') go(index-1); });
  }
  const search = document.querySelector('[data-live-search]');
  const results = document.querySelector('[data-live-results]');
  if (search && results && window.MOVIE_DATA) {
    const render = (list) => {
      if (!list.length) {
        results.innerHTML = '<div class="empty-state">未找到匹配影片，请尝试其它关键词。</div>';
        return;
      }
      results.innerHTML = list.map(item => `
        <article class="movie-card">
          <a href="${item.page}" class="movie-link">
            <div class="movie-poster"><img src="${item.coverImage}" alt="${item.title} 海报" loading="lazy"></div>
            <div class="movie-body">
              <h3>${item.title}</h3>
              <p>${item.description}</p>
              <div class="meta-row"><span>${item.year}</span><span>${item.type}</span><span>${item.rating}分</span></div>
              <div class="tag-row">${item.tags.slice(0,3).map(t=>`<span>${t}</span>`).join('')}</div>
            </div>
          </a>
        </article>`).join('');
    };
    const doSearch = () => {
      const q = search.value.trim().toLowerCase();
      const list = window.MOVIE_DATA.filter(item => {
        const hay = [item.title,item.description,item.summary,item.review,item.category,item.genre,item.year,...item.tags].join(' ').toLowerCase();
        return !q || hay.includes(q);
      }).sort((a,b)=>b.rating-a.rating || b.views-a.views).slice(0, 30);
      render(list);
    };
    search.addEventListener('input', doSearch);
    doSearch();
  }
  const player = document.querySelector('[data-hls-player]');
  const overlay = document.querySelector('[data-play-overlay]');
  if (player) {
    const source = player.getAttribute('data-src');
    const start = () => {
      if (window.Hls && Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(player);
        hls.on(Hls.Events.MANIFEST_PARSED, () => player.play().catch(()=>{}));
        hls.on(Hls.Events.ERROR, function(evt, data){
          if (data.fatal) {
            try { hls.destroy(); } catch(e){}
            player.src = source;
            player.play().catch(()=>{});
          }
        });
      } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = source;
        player.play().catch(()=>{});
      } else {
        player.src = source;
      }
      if (overlay) overlay.style.display = 'none';
    };
    if (overlay) overlay.addEventListener('click', start);
    const btn = document.querySelector('[data-play-button]');
    if (btn) btn.addEventListener('click', start);
  }
})();
