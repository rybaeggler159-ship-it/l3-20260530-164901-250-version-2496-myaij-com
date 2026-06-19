(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function normalize(text) {
    return String(text || "").toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function cardTemplate(movie) {
    return [
      '<article class="movie-card">',
      '<a class="poster" href="' + escapeHtml(movie.url) + '" aria-label="' + escapeHtml(movie.title) + '">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="poster-badge">' + escapeHtml(movie.type) + '</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<div class="movie-meta-line">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + '</div>',
      '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<div class="tag-row"><span>' + escapeHtml(movie.genre) + '</span></div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function setupMenu() {
    var toggle = qs('[data-menu-toggle]');
    var panel = qs('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function setupSearchForms() {
    qsa('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = qs('input[name="q"]', form);
        var query = input ? input.value.trim() : '';
        var target = './search.html';
        if (query) {
          target += '?q=' + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });
  }

  function setupHeroCarousel() {
    var slides = qsa('[data-hero-slide]');
    var dots = qsa('[data-hero-dot]');
    if (!slides.length || !dots.length) {
      return;
    }
    var index = 0;
    var timer;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(i);
        start();
      });
    });
    start();
  }

  function setupLocalFilters() {
    qsa('[data-local-filter]').forEach(function (input) {
      var selector = input.getAttribute('data-local-filter');
      var scope = selector ? qs(selector) : null;
      if (!scope) {
        return;
      }
      var items = qsa('[data-searchable]', scope);
      input.addEventListener('input', function () {
        var query = normalize(input.value);
        items.forEach(function (item) {
          var text = normalize([
            item.getAttribute('data-title'),
            item.getAttribute('data-tags'),
            item.getAttribute('data-year'),
            item.getAttribute('data-type'),
            item.textContent
          ].join(' '));
          item.classList.toggle('hidden-by-filter', query && text.indexOf(query) === -1);
        });
      });
    });
  }

  function setupSearchPage() {
    var results = qs('[data-search-results]');
    if (!results || !window.SITE_MOVIES) {
      return;
    }
    var title = qs('[data-search-title]');
    var input = qs('[data-search-input]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (input) {
      input.value = query;
    }
    var words = normalize(query).split(/\s+/).filter(Boolean);
    var movies = window.SITE_MOVIES.filter(function (movie) {
      if (!words.length) {
        return true;
      }
      var haystack = normalize([
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.tags,
        movie.oneLine
      ].join(' '));
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    }).slice(0, 96);
    if (title) {
      title.textContent = query ? '搜索结果：' + query : '精选视频';
    }
    results.innerHTML = movies.map(cardTemplate).join('');
  }

  function initMoviePlayer(videoId, buttonId, source) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !source) {
      return;
    }
    var prepared = false;
    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        video._hlsInstance = hls;
        return;
      }
      video.src = source;
    }
    function play() {
      prepare();
      button.classList.add('is-hidden');
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }
    button.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
  }

  window.initMoviePlayer = initMoviePlayer;

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupSearchForms();
    setupHeroCarousel();
    setupLocalFilters();
    setupSearchPage();
  });
})();
