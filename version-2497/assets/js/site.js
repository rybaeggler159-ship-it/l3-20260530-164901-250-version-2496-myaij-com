(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var prev = document.querySelector('[data-hero-prev]');
        var next = document.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle('is-active', idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle('is-active', idx === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot, idx) {
            dot.addEventListener('click', function () {
                show(idx);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-card-search]'));
    searchInputs.forEach(function (input) {
        var scope = input.closest('main') || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card-list] .movie-card'));
        input.addEventListener('input', function () {
            var keyword = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' ').toLowerCase();
                card.classList.toggle('is-filtered-out', keyword && text.indexOf(keyword) === -1);
            });
        });
    });
})();
