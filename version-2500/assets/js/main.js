(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
    setupImageFallbacks();
  });

  function setupMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.mobile-menu');

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener('click', function () {
      var opened = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!opened));
      menu.hidden = opened;
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    if (!slides.length) {
      return;
    }

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    restart();
  }

  function setupFilters() {
    var lists = Array.prototype.slice.call(document.querySelectorAll('[data-filter-list]'));

    lists.forEach(function (list) {
      var scope = list.closest('[data-filter-scope]') || document;
      var search = scope.querySelector('[data-filter-search]');
      var type = scope.querySelector('[data-filter-type]');
      var year = scope.querySelector('[data-filter-year]');
      var count = scope.querySelector('[data-result-count]');
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function apply() {
        var keyword = normalize(search && search.value);
        var typeValue = normalize(type && type.value);
        var yearValue = normalize(year && year.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year')
          ].join(' '));
          var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchesType = !typeValue || normalize(card.getAttribute('data-type')).indexOf(typeValue) !== -1;
          var matchesYear = !yearValue || normalize(card.getAttribute('data-year')).indexOf(yearValue) !== -1;
          var isVisible = matchesKeyword && matchesType && matchesYear;

          card.hidden = !isVisible;
          if (isVisible) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部作品';
        }
      }

      [search, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      apply();
    });
  }

  function setupImageFallbacks() {
    var images = Array.prototype.slice.call(document.querySelectorAll('img'));

    images.forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing-image');
        image.removeAttribute('src');
      }, { once: true });
    });
  }
})();
