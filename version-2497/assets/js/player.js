function initMoviePlayer(streamUrl) {
    var video = document.getElementById('movie-player');
    var button = document.getElementById('play-trigger');
    if (!video || !streamUrl) {
        return;
    }

    var loaded = false;
    var hlsInstance = null;

    function load() {
        if (!loaded) {
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        if (button) {
            button.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', load);
    }

    video.addEventListener('click', function () {
        if (!loaded || video.paused) {
            load();
        }
    });

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
