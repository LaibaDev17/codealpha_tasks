const audio = document.getElementById("audio");

const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");

const playlist = document.getElementById("playlist");

const fileInput = document.getElementById("fileInput");

const favoriteBtn = document.getElementById("favoriteBtn");

const shuffleBtn = document.getElementById("shuffleBtn");

const repeatBtn = document.getElementById("repeatBtn");

const autoplay = document.getElementById("autoplay");

const statusText = document.getElementById("status");

const visualizer = document.querySelector(".visualizer");

const songCount = document.getElementById("songCount");


// SONGS

let songs = [
    {
        title: "Magical Forest",
        artist: "Leyora Collection",
        src: "music/song1.mp3"
    },
    {
        title: "With You",
        artist: "Leyora Collection",
        src: "music/song2.mp3"
    },
    {
        title: "Sunny Day",
        artist: "Leyora Collection",
        src: "music/song3.mp3"
    },
    {
        title: "From Here on In",
        artist: "Leyora Collection",
        src: "music/song4.mp3"
    }
];

let currentSong = 0;
let isShuffle = false;
let isRepeat = false;


// INITIAL LOAD
if (songs.length > 0) {
    loadSong(currentSong);
}


// LOAD SONG 
function loadSong(index) {
    if (songs.length === 0) return;

    const song = songs[index];
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    updatePlaylist();
    statusText.textContent = "Ready to play";
}


// PLAY 
function playSong() {
    audio.play()
        .then(() => {
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            visualizer.classList.remove("paused");
            statusText.textContent = "Now playing";
            updatePlaylist();
        })
        .catch(() => {
            statusText.textContent = "Add an audio file to start";
        });
}


// PAUSE 
function pauseSong() {
    audio.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    visualizer.classList.add("paused");
    statusText.textContent = "Paused";
    updatePlaylist();
}


// PLAY / PAUSE BTN
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});


// UPDATE PLAYLIST UI
function updatePlaylist() {
    playlist.innerHTML = "";
    songs.forEach((song, index) => {
        const songDiv = document.createElement("div");
        songDiv.classList.add("song");
        if (index === currentSong && !audio.paused) {
            songDiv.classList.add("active");
        }

        songDiv.innerHTML = `
            <div class="song-number">${index + 1}</div>
            <div class="song-image">
                <i class="fa-solid fa-music"></i>
            </div>
            <div class="song-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
        `;

        songDiv.addEventListener("click", () => {
            currentSong = index;
            loadSong(currentSong);
            playSong();
        });

        playlist.appendChild(songDiv);
    });

    if (songCount) {
        songCount.textContent = `${songs.length} tracks`;
    }
}


// NEXT SONG
function nextSong() {
    if (isShuffle) {
        currentSong = Math.floor(Math.random() * songs.length);
    } else {
        currentSong = (currentSong + 1) % songs.length;
    }
    loadSong(currentSong);
    playSong();
}

nextBtn.addEventListener("click", nextSong);


// PREVIOUS SONG
previousBtn.addEventListener("click", () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    playSong();
});


// PROGRESS BAR TIME UPDATE
audio.addEventListener("timeupdate", (e) => {
    const { duration: audioDuration, currentTime: audioCurrentTime } = e.srcElement;
    if (isNaN(audioDuration)) return;

    const progressPercent = (audioCurrentTime / audioDuration) * 100;
    progress.value = progressPercent;

    // Current Time Formatting
    let currentMinutes = Math.floor(audioCurrentTime / 60);
    let currentSeconds = Math.floor(audioCurrentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTime.textContent = `${currentMinutes}:${currentSeconds}`;

    // Duration Formatting
    let durationMinutes = Math.floor(audioDuration / 60);
    let durationSeconds = Math.floor(audioDuration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    duration.textContent = `${durationMinutes}:${durationSeconds}`;
});


// SEEK BAR
progress.addEventListener("input", (e) => {
    const audioDuration = audio.duration;
    audio.currentTime = (e.target.value / 100) * audioDuration;
});


// VOLUME CONTROL
volume.addEventListener("input", (e) => {
    audio.volume = e.target.value;
});


// FILE UPLOAD (ADD MUSIC)
fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        songs.push({
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Local Track",
            src: URL.createObjectURL(file)
        });
    }
    updatePlaylist();
});


// SHUFFLE TOGGLE
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
});


// REPEAT TOGGLE
repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active", isRepeat);
});


// FAVORITE TOGGLE
favoriteBtn.addEventListener("click", () => {
    favoriteBtn.classList.toggle("favorite");
    const icon = favoriteBtn.querySelector("i");
    if (favoriteBtn.classList.contains("favorite")) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
    } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
    }
});


// AUDIO ENDED EVENT (AUTOPLAY / REPEAT)
audio.addEventListener("ended", () => {
    if (isRepeat) {
        playSong();
    } else if (autoplay.checked) {
        nextSong();
    } else {
        pauseSong();
    }
});
