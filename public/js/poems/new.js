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
      if (e.which === 32) {
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
      $('.rhythm .bar > span').css('width', 0);
    });

    function recordRhythmOn() {
      if (recordingRhythm || playingRhythm)
        return;
      if (recordingStartTime !== undefined) {
        $('.rhythm').append($('<div/>').addClass('rest').css('width', duration(recordingStartTime, 10)));
        playback.push({ duration: duration(recordingStartTime, 1), gain: 0 });
      }
      $('.rhythm').append(recordingElement = $('<div/>').addClass('bar').append($('<span/>')));
      recordingStartTime = currentTime();
      recordingRhythm = true;
    }

    function recordRhythmOff() {
      if (playingRhythm)
        return;
      playback.push({ duration: duration(recordingStartTime, 1), gain: 0.8, bar: $('.rhythm .bar:last-child') });
      recordingStartTime = currentTime();
      recordingRhythm = false;
      gainNode.gain.value = 0;
    }

    function setBarPercentage(offset) {
      var element = playback[playbackIndex];
      if (element === undefined)
        return;
      var bar = element.bar;
      if (bar === undefined)
        return;
      var percentage = Math.min((offset / playback[playbackIndex].duration) * 100.0, 100);
      bar.find('span').css('width', percentage + '%');

    }

    function advancePlaybackFrame(offset) {
      if (playback[playbackIndex] === undefined) {
        $('.rhythm .bar > span').css('width', 0);
        playingRhythm = false;
      } else if (offset > playback[playbackIndex].duration) {
        playbackStartTime = currentTime();
        playbackIndex++;
      }
    }

    function getPlaybackGain() {
      if (playback[playbackIndex] === undefined)
        return 0;
      return playback[playbackIndex].gain;
    }

    setInterval(function() {
      if (playingRhythm) {
        var offset = currentTime() - playbackStartTime;
        setBarPercentage(offset);
        advancePlaybackFrame(offset);
        gainNode.gain.value = getPlaybackGain();
      } else if (recordingRhythm && recordingStartTime !== undefined){
        recordingElement.css('width', duration(recordingStartTime, 4));
        gainNode.gain.value = 0.8;
      }
    }, 10);
  }
});
