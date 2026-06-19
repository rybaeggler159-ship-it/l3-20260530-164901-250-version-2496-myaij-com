(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterType = document.querySelector('[data-filter-type]');
  var filterYear = document.querySelector('[data-filter-year]');
  var filterItems = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
  var emptyState = document.querySelector('[data-empty-state]');

  function applyLocalFilter() {
    if (!filterItems.length) {
      return;
    }
    var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var type = filterType ? filterType.value : '';
    var year = filterYear ? filterYear.value : '';
    var visible = 0;

    filterItems.forEach(function (item) {
      var haystack = [
        item.getAttribute('data-title'),
        item.getAttribute('data-region'),
        item.getAttribute('data-type'),
        item.getAttribute('data-year'),
        item.getAttribute('data-genre')
      ].join(' ').toLowerCase();
      var matchQuery = !query || haystack.indexOf(query) !== -1;
      var matchType = !type || item.getAttribute('data-type') === type;
      var matchYear = !year || item.getAttribute('data-year') === year;
      var show = matchQuery && matchType && matchYear;
      item.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visible ? 'none' : 'block';
    }
  }

  [filterInput, filterType, filterYear].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyLocalFilter);
      control.addEventListener('change', applyLocalFilter);
    }
  });

  var searchRoot = document.querySelector('[data-search-root]');
  if (searchRoot && window.SEARCH_MOVIES) {
    var searchInput = document.querySelector('[data-search-input]');
    var regionSelect = document.querySelector('[data-search-region]');
    var typeSelect = document.querySelector('[data-search-type]');
    var resultGrid = document.querySelector('[data-search-results]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (searchInput) {
      searchInput.value = initialQuery;
    }

    function renderSearch() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var region = regionSelect ? regionSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var items = window.SEARCH_MOVIES.filter(function (movie) {
        var text = [movie.title, movie.region, movie.type, movie.genre, movie.category, movie.description, (movie.tags || []).join(' ')].join(' ').toLowerCase();
        return (!query || text.indexOf(query) !== -1) && (!region || movie.region === region) && (!type || movie.type === type);
      }).slice(0, 240);

      if (!resultGrid) {
        return;
      }

      if (!items.length) {
        resultGrid.innerHTML = '<div class="empty-state">没有找到匹配内容</div>';
        return;
      }

      resultGrid.innerHTML = items.map(function (movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
          return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<article class="movie-card">' +
          '<a class="poster-link" href="' + movie.url + '">' +
          '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
          '<span class="poster-shade"></span><span class="play-badge">▶</span><span class="corner-pill">' + escapeHtml(movie.type) + '</span></a>' +
          '<div class="card-body"><h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
          '<p class="meta-line">' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.genre) + '</p>' +
          '<p class="card-desc">' + escapeHtml(movie.description) + '</p><div class="tag-row">' + tags + '</div></div></article>';
      }).join('');
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    [searchInput, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', renderSearch);
        control.addEventListener('change', renderSearch);
      }
    });

    renderSearch();
  }
})();
