let lives = 3;
let time = 20;
let currentCount = 0;
let timerInterval;
let level = 1;
let correctStreak = 0;
let score = 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let currentPlayer = localStorage.getItem("currentPlayer") || "Tetamu";

function startGame() {
  document.getElementById("playerName").innerText = currentPlayer;
  document.getElementById("level").innerText = level;
  document.getElementById("score").innerText = score;
  generateQuestion();
  startTimer();
}

function generateQuestion() {
  let maxRabbits;
  if (level === 1) maxRabbits = 9;
  else if (level === 2) maxRabbits = 20;
  else maxRabbits = 30;

  currentCount = Math.floor(Math.random() * maxRabbits) + 1;
  let container = document.getElementById("question");
  container.innerHTML = "";
  for (let i = 0; i < currentCount; i++) {
    let img = document.createElement("img");
    img.src = "rabbit.png"; // letakkan gambar arnab sebenar dalam folder projek
    img.className = "rabbit";
    container.appendChild(img);
  }
  document.getElementById("answer").value = "";
  document.getElementById("message").innerText = "";
}

function startTimer() {
  time = 20;
  document.getElementById("timer").innerText = time;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = time;
    if (time <= 0) {
      loseLife();
    }
  }, 1000);
}

function checkAnswer() {
  let ans = parseInt(document.getElementById("answer").value);
  if (ans === currentCount) {
    document.getElementById("message").innerText = "✅ Betul! Hebat!";
    score += 10;
    document.getElementById("score").innerText = score;
    correctStreak++;
    if (correctStreak >= 5) {
      levelUp();
    }
    generateQuestion();
    startTimer();
  } else {
    document.getElementById("message").innerText = "❌ Salah! Cuba Lagi.";
    loseLife();
  }
}

function loseLife() {
  lives--;
  document.getElementById("lives").innerText = lives;
  correctStreak = 0;
  if (lives <= 0) {
    gameOver();
  } else {
    generateQuestion();
    startTimer();
  }
}

function levelUp() {
  if (level < 3) {
    level++;
    correctStreak = 0;
    score += 50;
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("message").innerText = "🎉 Tahniah! Anda naik ke Level " + level;
  }
}

function gameOver() {
  document.getElementById("message").innerText = "Permainan Tamat! Skor akhir: " + score;
  saveScore(currentPlayer, score);
}

function saveScore(name, score) {
  leaderboard.push({ name: name, score: score });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  showLeaderboard();
}

function showLeaderboard() {
  let html = "<h2>🏆 Leaderboard</h2>";
  html += "<table><tr><th>Rank</th><th>Nama</th><th>Skor</th></tr>";
  leaderboard.forEach((entry, index) => {
    let trophy = index === 0 ? " 🏆" : "";
    html += `<tr><td>${index+1}${trophy}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("leaderboard").innerHTML = html;

  if (leaderboard.length > 0 && leaderboard[0].name === currentPlayer) {
    launchConfetti();
  }
}

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function logout() {
  localStorage.removeItem("currentPlayer"); // buang nama pemain
  window.location.href = "index.html"; // kembali ke login/register
}
window.onload = startGame;
