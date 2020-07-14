class ETAudioPlayer {
  constructor() {
    this.playlist = [];
    this.fullMobilePlayerShow = false;
    this.fullMobileListShow = false;
    this.currentSong = {};
    this.previousSongId = -1;
    this.playing = false;
    this.loading = false;
    this.moving = false;

    this.audio = document.getElementById('audio-ele');
    this.playerTitle = document.getElementsByClassName('player-title');
    this.playerSinger = document.getElementsByClassName('player-singer');
    this.playerCover = document.getElementsByClassName('fmp-img');

    this.volumeContol = document.getElementById('vol-control');

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

  initializeSC() {
    SC.initialize({
      client_id: 'qar87rq7vEGGfgjM0PqrmTBUYhSzUcQ5',
      redirect_uri: 'https://example.com/callback',
    });
  }

  loadPlaylistFromSC() {
    SC.get(`playlists/1064225653`).then(({ tracks }) => {
      tracks.forEach((song, i) => {
        this.playlist.push({
          id: i,
          title: song.title,
          singer: '',
          cover: song.artwork_url.replace('large', 't500x500'),
          musicSrc: `${song.stream_url}?client_id=qar87rq7vEGGfgjM0PqrmTBUYhSzUcQ5`,
          duration: song.duration,
        });
      });
      this.initPlayer();
    });
  }

  initPlayer() {
    this.updatePlayer(this.playlist[0]);
    this.updatePlaylistPanel();
    this.updatePanel();
  }

  initProgressBars() {
    this.progressBar.style.transform = `translateX(${-100}%)`;
    this.miniProgressBar.style.transform = `translateX(${-100}%)`;
    this.DesktopProgressBar.style.transform = `translateX(${-100}%)`;
  }

  setEventListeners() {
    this.audio.addEventListener('timeupdate', this.timeUpdate, false);
    this.audio.addEventListener('ended', () => this.next());

    this.volumeContol.addEventListener('change', (e) => this.setVolume(e))
    this.volumeContol.addEventListener('input', (e) => this.setVolume(e));

    //mobile
    this.progressBarButton.addEventListener(
      'touchstart',
      (e) => this.touchplayhead(e),
      { passive: true },
    );
    this.progressBarButton.addEventListener(
      'touchmove',
      (e) => this.touchplayhead(e),
      { passive: true },
    );
    this.progressBarButton.addEventListener('touchend', (e) =>
      this.endTouch(e),
    );

    this.progressBarTrack.addEventListener(
      'touchstart',
      (e) => this.touchplayhead(e),
      { passive: true },
    );
    this.progressBarTrack.addEventListener(
      'touchmove',
      (e) => this.touchplayhead(e),
      { passive: true },
    );
    this.progressBarTrack.addEventListener('touchend', (e) => this.endTouch(e));

    //desktop

    this.DesktopProgressBarTrack.addEventListener('mousedown', this.mouseDown);

    this.DesktopProgressBarTrack.addEventListener('mouseup', (e) =>
      this.mouseUp(e),
    );
    this.DesktopProgressBarButton.addEventListener('mousedown', this.mouseDown);

    document.addEventListener('mouseup', this.mouseUp);

    document.addEventListener('keypress', (e) => this.handleSpace(e));

    //window.addEventListener('resize', () => this.closeOnResize())

  }

  // closeOnResize = () => {
  //   this.toggleMobileList();
  // }

  handleSpace = (e) => { 
    if (e.code === 'Space') {
      this.play();
    }
  }

  mouseDown = () => {
    this.moving = true;
    document.addEventListener('mousemove', this.moveplayhead, true);
    this.audio.removeEventListener('timeupdate', this.timeUpdate, false);
  };

  moveplayhead = (e) => {
    let shiftX =
      e.clientX - this.DesktopProgressBarTrack.getBoundingClientRect().left;

    let newButtonPosition =
      100 * (shiftX / this.DesktopProgressBarTrack.offsetWidth);
    let newProgressBarPosition = newButtonPosition - 100;

    if (newButtonPosition > 100) {
      this.DesktopProgressBarButton.style.left = `${100}%`;
      this.DesktopProgressBar.style.transform = `translateX(${0}%)`;
      return;
    }

    if (newButtonPosition < 0) {
      this.DesktopProgressBarButton.style.left = `${0}%`;
      this.DesktopProgressBar.style.transform = `translateX(${-100}%)`;

      return;
    }

    this.DesktopProgressBarButton.style.left = `${newButtonPosition}%`;
    this.DesktopProgressBar.style.transform = `translateX(${newProgressBarPosition}%)`;
    return;
  };

  mouseUp = (e) => {
    if (this.moving) {
      this.moveplayhead(e);
      document.removeEventListener('mousemove', this.moveplayhead, true);

      let buttonPositionInPercent = this.DesktopProgressBarButton.style.left;

      let percentDeci = buttonPositionInPercent.substring(
        0,
        buttonPositionInPercent.length - 1,
      );
      percentDeci = percentDeci / 100;
      let newCurrentTime = this.currentSong.duration * percentDeci;
      newCurrentTime = newCurrentTime.toFixed(0);
      newCurrentTime = newCurrentTime / 1000;
      this.audio.currentTime = newCurrentTime;
      this.audio.addEventListener('timeupdate', this.timeUpdate, false);
    }

    this.moving = false;
  };

  touchplayhead = (e) => {
    this.audio.removeEventListener('timeupdate', this.timeUpdate, false);

    let newClient;
    if (e.touches[0].clientX) {
      newClient =
        e.touches[0].clientX -
        this.progressBarTrack.getBoundingClientRect().left;
    }

    if (e.clientX) {
      newClient =
        e.clientX - this.progressBarTrack.getBoundingClientRect().left;
    }

    let newbutton = 100 * (newClient / this.progressBarTrack.offsetWidth);
    let newprogress = newbutton - 100;

    if (newbutton > 100) {
      this.progressBarButton.style.left = `${100}%`;
      this.progressBar.style.transform = `translateX(${0}%)`;

      this.miniProgressBar.style.transform = `translateX(${0}%)`;
      return;
    }

    if (newbutton < 0) {
      this.progressBarButton.style.left = `${0}%`;
      this.progressBar.style.transform = `translateX(${-100}%)`;

      this.miniProgressBar.style.transform = `translateX(${-100}%)`;
      return;
    }

    this.progressBarButton.style.left = `${newbutton}%`;
    this.progressBar.style.transform = `translateX(${newprogress}%)`;

    this.miniProgressBar.style.transform = `translateX(${newprogress}%)`;
    return;
  };

  timeUpdate = () => {
    let buttonPercent =
      100000 * (this.audio.currentTime / this.currentSong.duration);
    let trackPercent = buttonPercent - 100;
    this.progressBarButton.style.left = `${buttonPercent}%`;
    this.progressBar.style.transform = `translateX(${trackPercent}%)`;

    this.DesktopProgressBarButton.style.left = `${buttonPercent}%`;
    this.DesktopProgressBar.style.transform = `translateX(${trackPercent}%)`;

    this.miniProgressBar.style.transform = `translateX(${trackPercent}%)`;
  };

  endTouch = () => {
    let buttonPositionInPercent = this.progressBarButton.style.left;

    let percentDeci = buttonPositionInPercent.substring(
      0,
      buttonPositionInPercent.length - 1,
    );
    percentDeci = percentDeci / 100;
    let newCurrentTime = this.currentSong.duration * percentDeci;
    newCurrentTime = newCurrentTime.toFixed(0);
    newCurrentTime = newCurrentTime / 1000;
    this.audio.currentTime = newCurrentTime;
    this.audio.addEventListener('timeupdate', this.timeUpdate, false);
  };

  play() {
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
  }

  updatePanel() {
    if (this.currentSong.id !== this.previousSongId) {
      let current = document.getElementById(this.currentSong.id);
      current.style.fontWeight = 'bold';
      current.style.color = '#05aea5';

      let previous = document.getElementById(this.previousSongId);
      if (previous) {
        previous.style.fontWeight = 'normal';
        previous.style.color = 'black';
      }
    }
  }

  updatePlayer(newSong) {
    this.audio.src = newSong.musicSrc;

    for (let e of this.playerTitle) {
      e.innerHTML = newSong.title;
    }
    for (let s of this.playerSinger) {
      s.innerHTML = newSong.singer;
    }
    for (let i of this.playerCover) {
      i.src = newSong.cover;
    }

    this.currentSong = newSong;
  }

  updatePlaylistPanel() {
    let temp, item, a, i;
    let plist = document.getElementById('mp');
    temp = document.getElementsByTagName('template')[0];
    item = temp.content.querySelector('div');
    for (i = 0; i < this.playlist.length; i++) {
      //Create a new node, based on the template:
      a = document.importNode(item, true);

      a.id = i;
      a.setAttribute('onclick', `ETPlayer.playNow(${this.playlist[i].id})`);

      let playlistImg = a.querySelector('img');
      playlistImg.src = this.playlist[i].cover;

      let playlistTitle = a.querySelector('p');
      playlistTitle.innerHTML = `${this.playlist[i].title}`;

      plist.appendChild(a);
    }
  }

  showPause() {
    for (let b of this.playButtons) {
      b.classList.remove('fa-play');
      b.classList.add('fa-pause');
    }
  }

  showPlay() {
    for (let b of this.playButtons) {
      b.classList.remove('fa-pause');
      b.classList.add('fa-play');
    }
  }

  playNow(id) {
    this.previousSongId = this.currentSong.id;

    this.updatePlayer(this.playlist[id]);
    this.updatePanel();
    this.showPause();

    this.audio.play();
    this.playing = true;
  }

  next() {
    this.previousSongId = this.currentSong.id;
    let next = this.currentSong.id + 1;

    if (this.playlist.length === next) {
      next = 0;
    }

    this.updatePlayer(this.playlist[next]);
    this.updatePanel();
    this.showPause();

    this.audio.play();
    this.playing = true;
  }

  prev() {
    this.previousSongId = this.currentSong.id;
    let prev = this.currentSong.id - 1;

    if (prev < 0) {
      prev = this.playlist.length - 1;
    }

    this.updatePlayer(this.playlist[prev]);
    this.updatePanel();
    this.showPause();

    this.audio.play();
    this.playing = true;
  }

  toggleMobileList() {
    if (this.fullMobileListShow) {
      history.replaceState(null, '', '/index.html#player');
      this.fullPlaylistPanel.style.transform = 'translateY(100vh)';
      this.fullMobileListShow = !this.fullMobileListShow;
    } else {
      history.pushState(null, '', '/index.html#playlist');
      this.fullPlaylistPanel.style.transform = 'translateY(0)';
      this.fullMobileListShow = !this.fullMobileListShow;
    }
  }

  toggleMobilePlayer() {
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
  }



  setVolume = (e) => {
    this.audio.volume = e.target.value / 100;
  }
}

const ETPlayer = new ETAudioPlayer();

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
