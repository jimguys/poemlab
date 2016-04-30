$(function() {
  var poetSearch = $('.poet-search');
  var poetsList = $('.poet-list');
  var poets = poetsList.find('.poet').map(function() { return $(this).data('poet'); });

  poetSearch.typeahead({
    name: 'poets',
    valueKey: 'username',
    remote: {
      url: '/poets?q=%QUERY',
      filter: function(poets) {
        return poets.filter(function(p) {
          return poetsList.find('input[value=' + p.id + ']').length === 0;
        });
      }
    }
  }).on('typeahead:selected', function(element, poet) {
    poets.push(poet);
    renderPoets();
    $(this).typeahead('setQuery', '');
  });

  poetsList.on('click', '.poet', function() {
    var thisPoet = $(this).data('poet');
    poets = poets.filter(function(i, poet) { return i === 0 || poet.id !== thisPoet.id; });
    renderPoets();
  });

  function renderPoets() {
    var div = $(jade.render('server/views/partials/poets.jade', {
      poets: poets
    }));
    poetsList.html(div);
  }

  function supportsAudioApi() {
    return window.AudioContext || window.webkitAudioContext;
  }

  if (supportsAudioApi()) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0;
    oscillator.connect(gainNode);
    oscillator.type = 'sine';
    oscillator.frequency.value = 360; // value in hertz
    oscillator.detune.value = 100; // value in cents
    oscillator.start(0);

    function currentTime() {
      return this.performance ? window.performance.now() : new Date().getTime();
    };

    function clamp(num, min, max) {
      return num < min ? min : num > max ? max : num;
    }

    function duration(startTime, divisor) {
      return Math.ceil(clamp(currentTime() - startTime, 2, 2000) / divisor);
    }

    var recordingStartTime, recordingRhythm, recordingElement;
    var playback = [];
    var playingRhythm, playbackStartTime, playbackIndex;

    $('.syllable-pad').on('tapstart', function() {
      recordRhythmOn();
    });

    $('.syllable-pad').on('tapend', function() {
      recordRhythmOff();
    });

    $(document).on('keydown', function(e) {
      if (e.which === 32 && !recordingRhythm) {
        recordRhythmOn();
      }
    });

    $(document).on('keyup', function(e) {
      if (e.which === 32) {
        recordRhythmOff();
      }
    });

    $('.rhythm-play').on('click', function() {
      playingRhythm = true;
      playbackStartTime = currentTime();
      playbackIndex = 0;
    });

    function recordRhythmOn() {
      if (recordingStartTime !== undefined) {
        $('.rhythm').append($('<div/>').addClass('rest').css('width', duration(recordingStartTime, 10)));
        playback.push({ duration: duration(recordingStartTime, 1), gain: 0 });
      }
      $('.rhythm').append(recordingElement = $('<div/>').addClass('bar'));
      recordingStartTime = currentTime();
      recordingRhythm = true;
    }

    function recordRhythmOff() {
      playback.push({ duration: duration(recordingStartTime, 1), gain: 0.8 });
      recordingStartTime = currentTime();
      recordingRhythm = false;
      gainNode.gain.value = 0;
    }

    function getPlaybackGain(offset) {
      if (playbackIndex >= playback.length) {
        playingRhythm = false;
        return 0;
      }
      if (currentTime() - playbackStartTime > playback[playbackIndex].duration) {
        playbackStartTime = currentTime();
        playbackIndex++;
        return getPlaybackGain(offset);
      }
      return playback[playbackIndex].gain;
    }

    setInterval(function() {
      if (playingRhythm) {
        gainNode.gain.value = getPlaybackGain(currentTime() - playbackStartTime);
      } else if (recordingRhythm && recordingStartTime !== undefined){
        recordingElement.css('width', duration(recordingStartTime, 4));
        gainNode.gain.value = 0.8;
      }
    }, 10);
  }
});
