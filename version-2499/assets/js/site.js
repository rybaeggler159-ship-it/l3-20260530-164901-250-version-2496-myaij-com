(function() {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function() {
        mobileNav.classList.toggle('open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, position) {
          var active = position === current;
          slide.classList.toggle('active', active);
          slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        });
        dots.forEach(function(dot, position) {
          dot.classList.toggle('active', position === current);
        });
      }

      function startTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(function() {
          show(current + 1);
        }, 5200);
      }

      if (prev) {
        prev.addEventListener('click', function() {
          show(current - 1);
          startTimer();
        });
      }
      if (next) {
        next.addEventListener('click', function() {
          show(current + 1);
          startTimer();
        });
      }
      dots.forEach(function(dot, position) {
        dot.addEventListener('click', function() {
          show(position);
          startTimer();
        });
      });
      show(0);
      startTimer();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function(panel) {
      var scope = panel.parentElement || document;
      var input = panel.querySelector('[data-search-input]');
      var region = panel.querySelector('[data-region-filter]');
      var type = panel.querySelector('[data-type-filter]');
      var year = panel.querySelector('[data-year-filter]');
      var reset = panel.querySelector('[data-reset-filters]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      var empty = scope.querySelector('[data-empty-state]');

      function normalize(value) {
        return String(value || '').trim().toLowerCase();
      }

      function applyFilters() {
        var keyword = normalize(input && input.value);
        var regionValue = normalize(region && region.value);
        var typeValue = normalize(type && type.value);
        var yearValue = normalize(year && year.value);
        var visible = 0;

        cards.forEach(function(card) {
          var text = normalize([
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.tags
          ].join(' '));
          var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchesRegion = !regionValue || text.indexOf(regionValue) !== -1;
          var matchesType = !typeValue || normalize(card.dataset.type).indexOf(typeValue) !== -1 || text.indexOf(typeValue) !== -1;
          var matchesYear = !yearValue || normalize(card.dataset.year).indexOf(yearValue) !== -1;
          var matched = matchesKeyword && matchesRegion && matchesType && matchesYear;
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [input, region, type, year].forEach(function(element) {
        if (element) {
          element.addEventListener('input', applyFilters);
          element.addEventListener('change', applyFilters);
        }
      });

      if (reset) {
        reset.addEventListener('click', function() {
          if (input) {
            input.value = '';
          }
          if (region) {
            region.value = '';
          }
          if (type) {
            type.value = '';
          }
          if (year) {
            year.value = '';
          }
          applyFilters();
        });
      }

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && input) {
        input.value = q;
      }
      applyFilters();
    });
  });
})();
