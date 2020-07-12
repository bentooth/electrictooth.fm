'use strict';

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== 'undefined' &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === 'number')
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var ETAudioPlayer = /*#__PURE__*/ (function () {
  function ETAudioPlayer() {
    var _this = this;

    _classCallCheck(this, ETAudioPlayer);

    _defineProperty(this, 'mouseDown', function () {
      _this.moving = true;
      document.addEventListener('mousemove', _this.moveplayhead, true);

      _this.audio.removeEventListener('timeupdate', _this.timeUpdate, false);
    });

    _defineProperty(this, 'moveplayhead', function (e) {
      var shiftX =
        e.clientX - _this.DesktopProgressBarTrack.getBoundingClientRect().left;

      var newButtonPosition =
        100 * (shiftX / _this.DesktopProgressBarTrack.offsetWidth);
      var newProgressBarPosition = newButtonPosition - 100;

      if (newButtonPosition > 100) {
        _this.DesktopProgressBarButton.style.left = ''.concat(100, '%');
        _this.DesktopProgressBar.style.transform = 'translateX('.concat(
          0,
          '%)',
        );
        return;
      }

      if (newButtonPosition < 0) {
        _this.DesktopProgressBarButton.style.left = ''.concat(0, '%');
        _this.DesktopProgressBar.style.transform = 'translateX('.concat(
          -100,
          '%)',
        );
        return;
      }

      _this.DesktopProgressBarButton.style.left = ''.concat(
        newButtonPosition,
        '%',
      );
      _this.DesktopProgressBar.style.transform = 'translateX('.concat(
        newProgressBarPosition,
        '%)',
      );
      return;
    });

    _defineProperty(this, 'mouseUp', function (e) {
      if (_this.moving) {
        _this.moveplayhead(e);

        document.removeEventListener('mousemove', _this.moveplayhead, true);
        var buttonPositionInPercent = _this.DesktopProgressBarButton.style.left;
        var percentDeci = buttonPositionInPercent.substring(
          0,
          buttonPositionInPercent.length - 1,
        );
        percentDeci = percentDeci / 100;
        var newCurrentTime = _this.currentSong.duration * percentDeci;
        newCurrentTime = newCurrentTime.toFixed(0);
        newCurrentTime = newCurrentTime / 1000;
        _this.audio.currentTime = newCurrentTime;

        _this.audio.addEventListener('timeupdate', _this.timeUpdate, false);
      }

      _this.moving = false;
    });

    _defineProperty(this, 'touchplayhead', function (e) {
      _this.audio.removeEventListener('timeupdate', _this.timeUpdate, false);

      var newClient;

      if (e.touches[0].clientX) {
        newClient =
          e.touches[0].clientX -
          _this.progressBarTrack.getBoundingClientRect().left;
      }

      if (e.clientX) {
        newClient =
          e.clientX - _this.progressBarTrack.getBoundingClientRect().left;
      }

      var newbutton = 100 * (newClient / _this.progressBarTrack.offsetWidth);
      var newprogress = newbutton - 100;

      if (newbutton > 100) {
        _this.progressBarButton.style.left = ''.concat(100, '%');
        _this.progressBar.style.transform = 'translateX('.concat(0, '%)');
        _this.miniProgressBar.style.transform = 'translateX('.concat(0, '%)');
        return;
      }

      if (newbutton < 0) {
        _this.progressBarButton.style.left = ''.concat(0, '%');
        _this.progressBar.style.transform = 'translateX('.concat(-100, '%)');
        _this.miniProgressBar.style.transform = 'translateX('.concat(
          -100,
          '%)',
        );
        return;
      }

      _this.progressBarButton.style.left = ''.concat(newbutton, '%');
      _this.progressBar.style.transform = 'translateX('.concat(
        newprogress,
        '%)',
      );
      _this.miniProgressBar.style.transform = 'translateX('.concat(
        newprogress,
        '%)',
      );
      return;
    });

    _defineProperty(this, 'timeUpdate', function () {
      var buttonPercent =
        100000 * (_this.audio.currentTime / _this.currentSong.duration);
      var trackPercent = buttonPercent - 100;
      _this.progressBarButton.style.left = ''.concat(buttonPercent, '%');
      _this.progressBar.style.transform = 'translateX('.concat(
        trackPercent,
        '%)',
      );
      _this.DesktopProgressBarButton.style.left = ''.concat(buttonPercent, '%');
      _this.DesktopProgressBar.style.transform = 'translateX('.concat(
        trackPercent,
        '%)',
      );
      _this.miniProgressBar.style.transform = 'translateX('.concat(
        trackPercent,
        '%)',
      );
    });

    _defineProperty(this, 'endTouch', function () {
      var buttonPositionInPercent = _this.progressBarButton.style.left;
      var percentDeci = buttonPositionInPercent.substring(
        0,
        buttonPositionInPercent.length - 1,
      );
      percentDeci = percentDeci / 100;
      var newCurrentTime = _this.currentSong.duration * percentDeci;
      newCurrentTime = newCurrentTime.toFixed(0);
      newCurrentTime = newCurrentTime / 1000;
      _this.audio.currentTime = newCurrentTime;

      _this.audio.addEventListener('timeupdate', _this.timeUpdate, false);
    });

    this.playlist = [];
    this.fullMobilePlayerShow = false;
    this.fullMobileList = false;
    this.currentSong = {};
    this.previousSongId = -1;
    this.playing = false;
    this.loading = false;
    this.moving = false;
    this.audio = document.getElementById('audio-ele');
    this.playerTitle = document.getElementsByClassName('player-title');
    this.playerSinger = document.getElementsByClassName('player-singer');
    this.playerCover = document.getElementsByClassName('fmp-img');
    this.fullPlayer = document.getElementById('fmp');
    this.fullPlaylistPanel = document.getElementById('fml');
    this.progressBarTrack = document.getElementById('progress-bar__track');
    this.progressBar = document.getElementById('progress-bar__progress');
    this.progressBarButton = document.getElementById('progress-bar__button');
    this.DesktopProgressBarTrack = document.getElementById(
      'desktop-player__progress-bar_track',
    );
    this.DesktopProgressBar = document.getElementById(
      'desktop-player__progress-bar_progress',
    );
    this.DesktopProgressBarButton = document.getElementById(
      'desktop-player__progress-bar_button',
    );
    this.playButtons = document.getElementsByClassName('play-icon');
    this.miniPlayer = document.getElementById('smp');
    this.miniProgressBarTrack = document.getElementById(
      'mini-progress-bar__track',
    );
    this.miniProgressBar = document.getElementById(
      'mini-progress-bar__progress',
    );
    this.initializeSC();
    this.loadPlaylistFromSC();
    this.initProgressBars();
    this.setEventListeners();
  }

  _createClass(ETAudioPlayer, [
    {
      key: 'initializeSC',
      value: function initializeSC() {
        SC.initialize({
          client_id: 'qar87rq7vEGGfgjM0PqrmTBUYhSzUcQ5',
          redirect_uri: 'https://example.com/callback',
        });
      },
    },
    {
      key: 'loadPlaylistFromSC',
      value: function loadPlaylistFromSC() {
        var _this2 = this;

        SC.get('playlists/1064225653').then(function (_ref) {
          var tracks = _ref.tracks;
          tracks.forEach(function (song, i) {
            // let me = song.title.split('-')
            // let singer = me[0].trim();
            // let title = me[1].trim();
            _this2.playlist.push({
              id: i,
              title: song.title,
              singer: '',
              cover: song.artwork_url.replace('large', 't500x500'),
              musicSrc: ''.concat(
                song.stream_url,
                '?client_id=qar87rq7vEGGfgjM0PqrmTBUYhSzUcQ5',
              ),
              duration: song.duration,
            });
          });

          _this2.initPlayer();
        });
      },
    },
    {
      key: 'initPlayer',
      value: function initPlayer() {
        this.updatePlayer(this.playlist[0]);
        this.updatePlaylistPanel();
        this.updatePanel();
      },
    },
    {
      key: 'initProgressBars',
      value: function initProgressBars() {
        this.progressBar.style.transform = 'translateX('.concat(-100, '%)');
        this.miniProgressBar.style.transform = 'translateX('.concat(-100, '%)');
        this.DesktopProgressBar.style.transform = 'translateX('.concat(
          -100,
          '%)',
        );
      },
    },
    {
      key: 'setEventListeners',
      value: function setEventListeners() {
        var _this3 = this;

        this.audio.addEventListener('timeupdate', this.timeUpdate, false);
        this.audio.addEventListener('ended', function () {
          return _this3.next();
        }); //mobile

        this.progressBarButton.addEventListener(
          'touchstart',
          function (e) {
            return _this3.touchplayhead(e);
          },
          {
            passive: true,
          },
        );
        this.progressBarButton.addEventListener(
          'touchmove',
          function (e) {
            return _this3.touchplayhead(e);
          },
          {
            passive: true,
          },
        );
        this.progressBarButton.addEventListener('touchend', function (e) {
          return _this3.endTouch(e);
        });
        this.progressBarTrack.addEventListener(
          'touchstart',
          function (e) {
            return _this3.touchplayhead(e);
          },
          {
            passive: true,
          },
        );
        this.progressBarTrack.addEventListener(
          'touchmove',
          function (e) {
            return _this3.touchplayhead(e);
          },
          {
            passive: true,
          },
        );
        this.progressBarTrack.addEventListener('touchend', function (e) {
          return _this3.endTouch(e);
        }); //desktop

        this.DesktopProgressBarTrack.addEventListener(
          'mousedown',
          this.mouseDown,
        );
        this.DesktopProgressBarTrack.addEventListener('mouseup', function (e) {
          return _this3.mouseUp(e);
        });
        this.DesktopProgressBarButton.addEventListener(
          'mousedown',
          this.mouseDown,
        );
        document.addEventListener('mouseup', this.mouseUp);
      },
    },
    {
      key: 'play',
      value: function play() {
        if (this.playing) {
          this.playing = false;
          this.audio.pause();
          this.showPlay();
        } else {
          this.playing = true;
          this.audio.play();
          this.showPause();
          this.updatePanel();
        }
      },
    },
    {
      key: 'updatePanel',
      value: function updatePanel() {
        if (this.currentSong.id !== this.previousSongId) {
          var current = document.getElementById(this.currentSong.id);
          current.style.fontWeight = 'bold';
          current.style.color = '#05aea5';
          var previous = document.getElementById(this.previousSongId);

          if (previous) {
            previous.style.fontWeight = 'normal';
            previous.style.color = 'black';
          }
        }
      },
    },
    {
      key: 'updatePlayer',
      value: function updatePlayer(newSong) {
        this.audio.src = newSong.musicSrc;

        var _iterator = _createForOfIteratorHelper(this.playerTitle),
          _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var e = _step.value;
            e.innerHTML = newSong.title;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var _iterator2 = _createForOfIteratorHelper(this.playerSinger),
          _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
            var s = _step2.value;
            s.innerHTML = newSong.singer;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var _iterator3 = _createForOfIteratorHelper(this.playerCover),
          _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
            var i = _step3.value;
            i.src = newSong.cover;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        this.currentSong = newSong;
      },
    },
    {
      key: 'updatePlaylistPanel',
      value: function updatePlaylistPanel() {
        var temp, item, a, i;
        var plist = document.getElementById('mp');
        temp = document.getElementsByTagName('template')[0];
        item = temp.content.querySelector('div');

        for (i = 0; i < this.playlist.length; i++) {
          //Create a new node, based on the template:
          a = document.importNode(item, true);
          a.id = i;
          a.setAttribute(
            'onclick',
            'ETPlayer.playNow('.concat(this.playlist[i].id, ')'),
          );
          var playlistImg = a.querySelector('img');
          playlistImg.src = this.playlist[i].cover;
          var playlistTitle = a.querySelector('p');
          playlistTitle.innerHTML = ''.concat(this.playlist[i].title);
          plist.appendChild(a);
        }
      },
    },
    {
      key: 'showPause',
      value: function showPause() {
        var _iterator4 = _createForOfIteratorHelper(this.playButtons),
          _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done; ) {
            var b = _step4.value;
            b.classList.remove('fa-play');
            b.classList.add('fa-pause');
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      },
    },
    {
      key: 'showPlay',
      value: function showPlay() {
        var _iterator5 = _createForOfIteratorHelper(this.playButtons),
          _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done; ) {
            var b = _step5.value;
            b.classList.remove('fa-pause');
            b.classList.add('fa-play');
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      },
    },
    {
      key: 'playNow',
      value: function playNow(id) {
        this.previousSongId = this.currentSong.id;
        this.updatePlayer(this.playlist[id]);
        this.updatePanel();
        this.showPause();
        this.audio.play();
        this.playing = true;
      },
    },
    {
      key: 'next',
      value: function next() {
        this.previousSongId = this.currentSong.id;
        var next = this.currentSong.id + 1;

        if (this.playlist.length === next) {
          next = 0;
        }

        this.updatePlayer(this.playlist[next]);
        this.updatePanel();
        this.showPause();
        this.audio.play();
        this.playing = true;
      },
    },
    {
      key: 'prev',
      value: function prev() {
        this.previousSongId = this.currentSong.id;
        var prev = this.currentSong.id - 1;

        if (prev < 0) {
          prev = this.playlist.length - 1;
        }

        this.updatePlayer(this.playlist[prev]);
        this.updatePanel();
        this.showPause();
        this.audio.play();
        this.playing = true;
      },
    },
    {
      key: 'toggleMobileList',
      value: function toggleMobileList() {
        if (this.fullMobileList) {
          history.replaceState(null, '', '/index.html#player');
          this.fullPlaylistPanel.style.transform = 'translateY(100vh)';
          this.fullMobileList = !this.fullMobileList;
        } else {
          history.pushState(null, '', '/index.html#playlist');
          this.fullPlaylistPanel.style.transform = 'translateY(0)';
          this.fullMobileList = !this.fullMobileList;
        }
      },
    },
    {
      key: 'toggleMobilePlayer',
      value: function toggleMobilePlayer() {
        if (this.fullMobilePlayerShow) {
          history.pushState(null, '', '/index.html');
          this.miniPlayer.style.transitionDelay = '350ms';
          this.miniPlayer.style.transform = 'translateY(0)';
          this.fullPlayer.style.transform = 'translateY(200vh)';
          this.fullMobilePlayerShow = !this.fullMobilePlayerShow;
        } else {
          history.pushState(null, '', '/index.html#player');
          this.miniPlayer.style.transitionDelay = '0ms';
          this.miniPlayer.style.transform = 'translateY(160px)';
          this.fullPlayer.style.transform = 'translateY(0)';
          this.fullMobilePlayerShow = !this.fullMobilePlayerShow;
        }
      },
    },
  ]);

  return ETAudioPlayer;
})();

var ETPlayer = new ETAudioPlayer();

window.onload = function () {
  ETPlayer.miniPlayer.style.transform = 'translateY(0)';
};

window.onpopstate = function () {
  if (window.location.hash === '#player') {
    ETPlayer.toggleMobileList();
  }

  if (window.location.hash === '') {
    ETPlayer.toggleMobilePlayer();
  }
};
