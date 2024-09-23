document.addEventListener('DOMContentLoaded', () => {
  const audio = document.querySelector('#audio');
  const playPauseBtn = document.querySelector('#play-pause');
  const prevTrackBtn = document.querySelector('#prev-track');
  const nextTrackBtn = document.querySelector('#next-track');
  const playingBar = document.querySelector('#playing');
  //const volumeBar = document.querySelector('#volume-bar');
  const currentTimeEl = document.querySelector('#current-time');
  const durationEl = document.querySelector('#duration');
  const titleEl = document.querySelector('#title');
  const artistEl = document.querySelector('#artist');
  const coverEl = document.querySelector('#cover');
  const playlistContainer = document.querySelector('.playlist');
  const togglePlaylistBtn = document.querySelector('#toggle-playlist');
  durationEl.textContent = '0:00';
  let tracks = [];
  let currentTrackIndex = 0;
  let isPlaying = false;

  // JSON

  fetch('tracks.json')
    .then(response => response.json())
    .then(data => {
      tracks = data;
      loadTrack(currentTrackIndex);
      generatePlaylist();
    });

  //controls

  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.innerHTML = `ii<svg width="32" height="41" viewbox="0 0 32 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.133876 39.2765C0.13658 40.0678 1.01372 40.5427 1.67775 40.1123L30.6255 21.3505C31.2362 20.9548 31.2331 20.0601 30.6198 19.6685L1.54447 1.10503C0.877514 0.679201 0.00363977 1.16001 0.00634346 1.9513L0.133876 39.2765Z" fill="white" fill-opacity="0.41" /></svg>`;
      // playPauseBtn.textContent = `>`;
    } else {
      audio.play();
      playPauseBtn.innerHTML = `<svg width="30" height="60" viewbox="0 0 30 60" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="26.25" y1="56.25" x2="26.25" y2="3.75" stroke="white" stroke-opacity="0.48" stroke-width="7.5" stroke-linecap="round" /><line x1="3.75" y1="3.75" x2="3.75" y2="56.25" stroke="white" stroke-opacity="0.48" stroke-width="7.5" stroke-linecap="round" /></svg>`;
      // playPauseBtn.textContent = `||`;
    }
    isPlaying = !isPlaying;
  });


  prevTrackBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
    playPauseBtn.innerHTML = `<svg width="30" height="60" viewbox="0 0 30 60" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="26.25" y1="56.25" x2="26.25" y2="3.75" stroke="white" stroke-opacity="0.48" stroke-width="7.5" stroke-linecap="round" /><line x1="3.75" y1="3.75" x2="3.75" y2="56.25" stroke="white" stroke-opacity="0.48" stroke-width="7.5" stroke-linecap="round" /></svg>`;
    // playPauseBtn.textContent = `||`;
    isPlaying = true;
  });

  nextTrackBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
    playPauseBtn.innerHTML = `<svg width="30" height="60" viewbox="0 0 30 60" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="26.25" y1="56.25" x2="26.25" y2="3.75" stroke="white" stroke-opacity="0.48" stroke-width="7.5" stroke-linecap="round" /><line x1="3.75" y1="3.75" x2="3.75" y2="56.25" stroke="white" stroke-opacity="0.48" stroke-width="7.5" stroke-linecap="round" /></svg>`;
    // playPauseBtn.textContent = `||`;
    isPlaying = true;
  });

  audio.addEventListener('ended', () => {
    nextTrackBtn.click();
  });

  //playlist

  togglePlaylistBtn.addEventListener('click', () => {
    playlistContainer.classList.toggle('hidden');
  });

  function generatePlaylist() {
    playlistContainer.innerHTML = '';
    tracks.forEach((track, index) => {
      const button = document.createElement('button');
      button.classList.add('track-btn');
      button.textContent = `${track.title} - ${track.artist}`;
      button.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audio.play();
        playPauseBtn.innerHTML = `<svg width="30" height="60" viewbox="0 0 30 60" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="26.25" y1="56.25" x2="26.25" y2="3.75" stroke="white" stroke-opacity="0.48" stroke-width="7.5" stroke-linecap="round" /><line x1="3.75" y1="3.75" x2="3.75" y2="56.25" stroke="white" stroke-opacity="0.48" stroke-width="7.5" stroke-linecap="round" /></svg>`;
        // playPauseBtn.textContent = `||`;
        isPlaying = true;
      });
      playlistContainer.appendChild(button);
    });
  }

  function loadTrack(index) {
    const track = tracks[index];
    audio.src = track.src;
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist;
    coverEl.src = track.cover;
  }

  //playing-bar

  audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    if (duration > 0) {
      playingBar.value = (currentTime / duration) * 100;
      currentTimeEl.textContent = formatTime(currentTime);
      durationEl.textContent = formatTime(duration);
    } else {
      playingBar.value = 0;
      durationEl.textContent = formatTime(0);
    }
  });


  playingBar.addEventListener('input', () => {
    const seekTo = audio.duration * (playingBar.value / 100);
    audio.currentTime = seekTo;
  });

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  durationEl.textContent = formatTime(0);


  // volume

  // volumeBar.addEventListener('input', () => {
  //   audio.volume = volumeBar.value;
  // });

  const volumeDownBtn = document.querySelector('#volume-down');
  const volumeUpBtn = document.querySelector('#volume-up');

  const volumeStep = 0.1;

  volumeDownBtn.addEventListener('click', () => {
    audio.volume = Math.max(0, audio.volume - volumeStep);
  });

  volumeUpBtn.addEventListener('click', () => {
    audio.volume = Math.min(1, audio.volume + volumeStep);
  });

});