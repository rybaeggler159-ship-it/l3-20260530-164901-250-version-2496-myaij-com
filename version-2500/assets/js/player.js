(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var frame = document.querySelector('[data-player]');

    if (!frame) {
      return;
    }

    var video = frame.querySelector('video');
    var playButton = frame.querySelector('.player-play');
    var source = frame.getAttribute('data-src');
    var loaded = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function loadSource() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      loadSource();
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          frame.classList.remove('is-playing');
        });
      }
    }

    if (playButton) {
      playButton.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      frame.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      frame.classList.remove('is-playing');
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
