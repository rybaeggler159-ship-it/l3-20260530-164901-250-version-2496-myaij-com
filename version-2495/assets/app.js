(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function initMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        if (!slides.length) {
            return;
        }
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var previous = document.querySelector('[data-hero-prev]');
        var next = document.querySelector('[data-hero-next]');
        var index = 0;
        var timer;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                restart();
            });
        });
        if (previous) {
            previous.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }
        show(0);
        restart();
    }

    function initSearchForms() {
        Array.prototype.slice.call(document.querySelectorAll('.site-search')).forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = form.querySelector('input[name="q"]');
                var query = input ? input.value.trim() : '';
                if (!query) {
                    event.preventDefault();
                    window.location.href = 'search.html';
                }
            });
        });
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
        panels.forEach(function (panel) {
            var container = panel.parentElement;
            var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));
            var input = panel.querySelector('[data-filter-input]');
            var selects = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-select]'));
            var empty = container.querySelector('[data-empty-state]');
            var params = new URLSearchParams(window.location.search);
            var query = params.get('q') || '';

            if (input && query) {
                input.value = query;
            }

            function apply() {
                var keyword = normalize(input ? input.value : '');
                var active = {};
                selects.forEach(function (select) {
                    active[select.getAttribute('data-filter-select')] = normalize(select.value);
                });
                var visible = 0;
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute('data-filter-text'));
                    var year = normalize(card.getAttribute('data-year'));
                    var type = normalize(card.getAttribute('data-type'));
                    var region = normalize(card.getAttribute('data-region'));
                    var match = true;
                    if (keyword && text.indexOf(keyword) === -1) {
                        match = false;
                    }
                    if (active.year && year !== active.year) {
                        match = false;
                    }
                    if (active.type && type !== active.type) {
                        match = false;
                    }
                    if (active.region && region !== active.region) {
                        match = false;
                    }
                    card.classList.toggle('is-hidden', !match);
                    if (match) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('show', visible === 0);
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }
            selects.forEach(function (select) {
                select.addEventListener('change', apply);
            });
            apply();
        });
    }

    function bindVideo(holder) {
        var video = holder.querySelector('video');
        var layer = holder.querySelector('.play-layer');
        var button = holder.querySelector('.player-button');
        var url = holder.getAttribute('data-play');
        var loaded = false;
        if (!video || !url) {
            return;
        }

        function attach() {
            if (loaded) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                video._hls = hls;
            } else {
                video.src = url;
            }
            loaded = true;
        }

        function play() {
            attach();
            video.controls = true;
            if (layer) {
                layer.classList.add('is-hidden');
            }
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {});
            }
        }

        if (layer) {
            layer.addEventListener('click', play);
        }
        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                play();
            });
        }
        video.addEventListener('click', function () {
            if (!loaded || video.paused) {
                play();
            }
        });
    }

    function initPlayers() {
        Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(bindVideo);
    }

    ready(function () {
        initMenu();
        initHero();
        initSearchForms();
        initFilters();
        initPlayers();
    });
})();
