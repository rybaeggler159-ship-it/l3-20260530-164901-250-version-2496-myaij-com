(function () {
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    var showSlide = function (index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }
  }

  var normalize = function (value) {
    return String(value || '').toLowerCase().trim();
  };

  var applyFilter = function (input) {
    var value = normalize(input.value);
    var section = input.closest('section') || document;
    var cards = Array.prototype.slice.call(section.querySelectorAll('[data-movie-card]'));

    if (!cards.length) {
      cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    }

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-category')
      ].join(' '));
      card.classList.toggle('hidden-by-filter', value && haystack.indexOf(value) === -1);
    });
  };

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';

  document.querySelectorAll('[data-filter-input]').forEach(function (input) {
    if (input.hasAttribute('data-auto-search') && query) {
      input.value = query;
    }

    applyFilter(input);

    input.addEventListener('input', function () {
      applyFilter(input);
    });
  });

  document.querySelectorAll('[data-filter-clear]').forEach(function (button) {
    button.addEventListener('click', function () {
      var scope = button.closest('section') || document;
      var input = scope.querySelector('[data-filter-input]');

      if (input) {
        input.value = '';
        applyFilter(input);
        input.focus();
      }
    });
  });
})();
