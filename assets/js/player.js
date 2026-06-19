(function () {
  var bindPlayer = function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.play-layer');
    var stream = player.getAttribute('data-stream');
    var started = false;
    var hlsInstance = null;

    if (!video || !stream) {
      return;
    }

    var hideButton = function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    };

    var loadStream = function () {
      if (started) {
        return;
      }

      started = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        if (window.Hls.Events && window.Hls.Events.MANIFEST_PARSED) {
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        }
      } else {
        video.src = stream;
      }
    };

    var play = function () {
      loadStream();
      hideButton();
      video.play().catch(function () {});
    };

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (!started || video.paused) {
        play();
      }
    });

    video.addEventListener('play', hideButton);

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };

  document.querySelectorAll('.video-player').forEach(bindPlayer);
})();
