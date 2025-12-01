// ===== AUTHENTICATION MODAL LOGIC =====
const authModal = document.getElementById('authModal');
const authClose = document.querySelector('.auth-close');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const loginFormSubmit = document.getElementById('loginFormSubmit');
const registerFormSubmit = document.getElementById('registerFormSubmit');

// Show modal on page load
window.addEventListener('load', () => {
  authModal.style.display = 'block';
});

// Close modal when X is clicked
authClose.addEventListener('click', () => {
  authModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === authModal) {
    authModal.style.display = 'none';
  }
});

// Switch to registration form
showRegisterBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
});

// Switch to login form
showLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
});

// Handle login submission
loginFormSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Invalid email or password");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);

    alert(`Welcome, ${data.name}!`);
    authModal.style.display = "none";
  } catch (err) {
    alert("Server error — try again later");
  }
});

// Handle registration submission
registerFormSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("registerConfirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful — please login");
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  } catch (err) {
    alert("Server error — try again later");
  }
});
// ===== MUSIC PLAYER LOGIC =====
// Select main controls
const playPauseBtn = document.querySelector(
  ".player-control-icon:nth-child(3)"
);
const progressBar = document.querySelector(".progress-bar");
const currentTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".total-time");
const albumImg = document.querySelector(".album-img img");
const songTitle = document.querySelector(".song");
const artistName = document.querySelector(".artist");

// Initial audio setup
let audio = new Audio();
let isPlaying = false;

// Songs data
const songs = {
  "John Cena Theme": {
    src: "music/John_Cena.mp3",
    img: "./assets/John_Cena.jpg",
    title: "John Cena Theme",
    artist: "WWE",
  },
  "Randy Orton Theme": {
    src: "music/Randy_Orton.mp3",
    img: "./assets/Randy_Orton.jpg",
    title: "Randy Orton Theme",
    artist: "WWE",
  },
  "Shawn McMan Theme": {
    src: "music/here_comes_the_money.mp3",
    img: "./assets/Money.webp",
    title: "Shawn McMan Theme",
    artist: "WWE",
  },
};

// Attach click listeners to cards
document.querySelectorAll(".cards-container .card").forEach((card) => {
  const cardInfo = card.querySelector(".card-info").textContent;
  card.addEventListener("click", () => {
    if (songs[cardInfo]) {
      loadSong(songs[cardInfo]);
      playSong();
    }
  });
});

// Load song data
function loadSong(song) {
  if (audio) {
    audio.pause();
  }

  audio = new Audio(song.src);
  albumImg.src = song.img;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;

  audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });
}

// Play the current audio
function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.src = "assets/Pause.jpg"; // pause icon
}

// Pause the current audio
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.src = "./assets/player_icon3.png"; // play icon
}

// Play/pause button control
playPauseBtn.addEventListener("click", () => {
  if (!isPlaying) {
    playSong();
  } else {
    pauseSong();
  }
});

// Seek bar control
progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
});

// Helper: format mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
