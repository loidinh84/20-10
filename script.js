/**
 * ==========================================================
 * CẤU HÌNH THÔNG TIN 20/10 - YÊU PHẠM THỊ BÍCH TRÂM
 * ==========================================================
 */
const CONFIG = {
  // Ngày bắt đầu yêu nhau (Định dạng: YYYY-MM-DD)
  startDate: "2026-08-30",

  // Thông tin nhận lì xì mặc định (Ngân hàng TMCP Bản Việt - BVBank / ZaloPay):
  // Dùng mã BIN 970454 chuẩn Napas247 để TẤT CẢ app ngân hàng (VCB, MB, TCB...) đều quét được ngay!
  recipient: {
    bankId: "970454", // Mã Napas BVBank (Bản Việt)
    bankName: "Ngân hàng TMCP Bản Việt (BVBank)", // Tên ngân hàng
    accountNo: "99ZP26286M80195808", // Số tài khoản của Bích Trâm
    accountName: "ZALOPAY_PHAM THI BICH TRAM", // Tên chủ tài khoản khớp 100% với giao dịch thật
    amount: 50000, // Số tiền lì xì: 50.000đ
    memo: "Chuc mung 20-10 em yeu", // Nội dung chuyển khoản
  },

  // Link bài hát: "Ngày Còn Đôi Mươi - Tiểu Mỹ"
  bgmUrl: "https://youtu.be/2B8y347pwCg?si=Dbg8QwKEV0wGbWNc",
};

// ==========================================================
// TRẠNG THÁI TOÀN CỤC CỦA ỨNG DỤNG
// ==========================================================
let currentQuest = 1;
const totalQuests = 3;
let isMusicPlaying = false;
let bgMusicAudio = null;
let ytPlayer = null;
let ytReady = false;
let currentQrMode = "napas"; // Mặc định là Napas BVBank (MoMo / Mọi App Ngân Hàng đều quét được)

document.addEventListener("DOMContentLoaded", () => {
  initPetalAnimation();
  initCountdownTimer();
  initAudio();
  initEnvelopeInteraction();
  initQuestFlow();
  initRunawayButton();
  initLoveCatcherGame();
  initLuckyWheel();
  initVietQR();
  initShareModal();
});

// ==========================================================
// 1. HIỆU ỨNG CÁNH HOA HỒNG RƠI LÃNG MẠN (CANVAS)
// ==========================================================
function initPetalAnimation() {
  const canvas = document.getElementById("petalCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = Math.min(28, Math.floor(width / 22));
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 10 + 9;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.sin(Math.random() * Math.PI) * 1.0;
      this.angle = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.4 + 0.35;
      this.color = Math.random() > 0.4 ? "#ff4d79" : "#ff80a6";
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.015) + this.speedX * 0.25;
      this.angle += this.spinSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -this.size / 2,
        -this.size / 2,
        -this.size,
        this.size / 3,
        0,
        this.size,
      );
      ctx.bezierCurveTo(
        this.size,
        this.size / 3,
        this.size / 2,
        -this.size / 2,
        0,
        0,
      );
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < petalsCount; i++) {
    petals.push(new Petal());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(render);
  }
  render();
}

// ==========================================================
// 2. ĐẾM THỜI GIAN BÊN NHAU (LOVE COUNTDOWN)
// ==========================================================
function initCountdownTimer() {
  const daysEl = document.getElementById("daysCount");
  const hoursEl = document.getElementById("hoursCount");
  const minutesEl = document.getElementById("minutesCount");
  const secondsEl = document.getElementById("secondsCount");

  const dateStr = CONFIG.startDate;
  const start = (
    dateStr.includes("T") ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`)
  ).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = Math.max(0, now - start);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================
// 3. ÂM THANH & YOUTUBE PLAYER ("Ngày Còn Đôi Mươi")
// ==========================================================
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

window.onYouTubeIframeAPIReady = function () {
  const ytId = extractYouTubeId(CONFIG.bgmUrl);
  if (!ytId) return;

  try {
    ytPlayer = new YT.Player("ytPlayerContainer", {
      height: "1",
      width: "1",
      videoId: ytId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: 1,
        playlist: ytId,
        playsinline: 1,
        modestbranding: 1,
      },
      events: {
        onReady: (event) => {
          ytReady = true;
          event.target.setVolume(75);
        },
        onStateChange: (event) => {
          const icon = document.querySelector("#btnMusic .spin-record");
          if (event.data === YT.PlayerState.PLAYING) {
            isMusicPlaying = true;
            icon?.classList.remove("paused");
          } else if (event.data === YT.PlayerState.PAUSED) {
            isMusicPlaying = false;
            icon?.classList.add("paused");
          } else if (event.data === YT.PlayerState.ENDED) {
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
          }
        },
      },
    });
  } catch (err) {
    console.warn("YouTube Player error:", err);
  }
};

function initAudio() {
  const btnMusic = document.getElementById("btnMusic");
  const icon = btnMusic ? btnMusic.querySelector(".spin-record") : null;
  const ytId = extractYouTubeId(CONFIG.bgmUrl);

  // Hiệu ứng âm thanh bằng Web Audio API
  window.playChimeSound = function (type = "success") {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "pop") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          1046.5,
          ctx.currentTime + 0.15,
        );
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "win") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          o.start(ctx.currentTime + idx * 0.1);
          o.stop(ctx.currentTime + 0.8);
        });
      }
    } catch (e) {}
  };

  if (!ytId) {
    bgMusicAudio = new Audio();
    bgMusicAudio.src =
      "https://cdn.pixabay.com/download/audio/2022/05/16/audio_c976939433.mp3?filename=romantic-love-story-112196.mp3";
    bgMusicAudio.loop = true;
    bgMusicAudio.volume = 0.5;
  }

  function toggleAudio() {
    if (ytId && ytPlayer && typeof ytPlayer.getPlayerState === "function") {
      const state = ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        ytPlayer.pauseVideo();
        isMusicPlaying = false;
        icon?.classList.add("paused");
      } else {
        ytPlayer.playVideo();
        isMusicPlaying = true;
        icon?.classList.remove("paused");
      }
    } else if (bgMusicAudio) {
      if (isMusicPlaying) {
        bgMusicAudio.pause();
        isMusicPlaying = false;
        icon?.classList.add("paused");
      } else {
        bgMusicAudio
          .play()
          .then(() => {
            isMusicPlaying = true;
            icon?.classList.remove("paused");
          })
          .catch(() => {
            showToast("Chạm vào màn hình để bắt đầu nghe bài hát nhé!");
          });
      }
    }
  }

  if (btnMusic) {
    btnMusic.addEventListener("click", toggleAudio);
  }

  const startMusicOnFirstTouch = () => {
    if (!isMusicPlaying) {
      if (ytId && ytPlayer && typeof ytPlayer.playVideo === "function") {
        ytPlayer.playVideo();
      } else if (bgMusicAudio) {
        bgMusicAudio
          .play()
          .then(() => {
            isMusicPlaying = true;
            icon?.classList.remove("paused");
          })
          .catch(() => {});
      }
    }
    window.removeEventListener("click", startMusicOnFirstTouch);
    window.removeEventListener("touchstart", startMusicOnFirstTouch);
  };

  window.addEventListener("click", startMusicOnFirstTouch);
  window.addEventListener("touchstart", startMusicOnFirstTouch);
}

// ==========================================================
// 4. MỞ PHONG THƯ TƯƠNG TÁC (STAGE 1 -> STAGE 2)
// ==========================================================
function initEnvelopeInteraction() {
  const envelope = document.querySelector(".envelope");
  const stepIntro = document.getElementById("stepIntro");
  const stepLetter = document.getElementById("stepLetter");
  const btnStartQuest = document.getElementById("btnStartQuest");
  const stepQuest = document.getElementById("stepQuest");

  if (envelope) {
    envelope.addEventListener("click", () => {
      envelope.classList.add("open");
      if (window.playChimeSound) window.playChimeSound("success");

      if (typeof confetti === "function") {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

      setTimeout(() => {
        switchScreen(stepIntro, stepLetter);
      }, 900);
    });
  }

  if (btnStartQuest) {
    btnStartQuest.addEventListener("click", () => {
      if (window.playChimeSound) window.playChimeSound("success");
      switchScreen(stepLetter, stepQuest);
    });
  }
}

function switchScreen(fromEl, toEl) {
  if (fromEl) {
    fromEl.classList.remove("active");
    setTimeout(() => {
      fromEl.style.display = "none";
      if (toEl) {
        toEl.style.display = "block";
        setTimeout(() => toEl.classList.add("active"), 30);
      }
    }, 380);
  }
}

// ==========================================================
// 5. NÚT TROLL CHẠY TRỐN (VÒNG 1)
// ==========================================================
function initRunawayButton() {
  const runawayBtn = document.getElementById("runawayBtn");
  if (!runawayBtn) return;

  function moveButton(e) {
    e.preventDefault();
    const container = runawayBtn.parentElement;
    const rect = container.getBoundingClientRect();

    const maxX = rect.width - runawayBtn.offsetWidth - 20;
    const maxY = 170;

    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));

    runawayBtn.style.position = "absolute";
    runawayBtn.style.left = `${randomX}px`;
    runawayBtn.style.top = `${randomY}px`;
    runawayBtn.style.zIndex = "10";

    showToast("Ối! Nút này biết chạy trốn rồi, Bích Trâm đừng bấm nha 😜");
  }

  runawayBtn.addEventListener("mouseover", moveButton);
  runawayBtn.addEventListener("touchstart", moveButton);
  runawayBtn.addEventListener("click", moveButton);
}

// ==========================================================
// 6. TIẾN TRÌNH CHUYỂN VÒNG THỬ THÁCH
// ==========================================================
function initQuestFlow() {
  const stepQuest = document.getElementById("stepQuest");
  const stepReward = document.getElementById("stepReward");

  // Vòng 1: Chọn đáp án đúng
  const correctButtons = document.querySelectorAll(".correct-opt");
  correctButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const feedback = btn.getAttribute("data-feedback") || "Chính xác luôn!";
      showToast(feedback);
      if (window.playChimeSound) window.playChimeSound("success");

      // Chuyển sang Vòng 2 (Mini-game Bắt Trái Tim)
      setTimeout(() => {
        nextQuest();
      }, 500);
    });
  });

  const btnReplay = document.getElementById("btnReplay");
  if (btnReplay) {
    btnReplay.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

function nextQuest() {
  const progressFill = document.getElementById("progressFill");
  const questIndicator = document.getElementById("questIndicator");
  const currentPanel = document.getElementById(`quest${currentQuest}`);
  currentQuest++;

  const titles = [
    "Thử thách 1 / 3: Câu đố tình yêu",
    "Thử thách 2 / 3: Bắt trái tim yêu thương",
    "Thử thách 3 / 3: Vòng quay may mắn 20/10",
  ];

  if (currentQuest <= totalQuests) {
    const nextPanel = document.getElementById(`quest${currentQuest}`);
    if (progressFill) {
      progressFill.style.width = `${(currentQuest / totalQuests) * 100}%`;
    }
    if (questIndicator) {
      questIndicator.textContent = titles[currentQuest - 1];
    }

    if (currentPanel) currentPanel.classList.remove("active");
    setTimeout(() => {
      if (nextPanel) nextPanel.classList.add("active");
    }, 250);
  }
}

// ==========================================================
// 7. GAME 2: BẮT TRÁI TIM YÊU THƯƠNG (CANVAS INTERACTIVE)
// ==========================================================
function initLoveCatcherGame() {
  const canvas = document.getElementById("catcherCanvas");
  const overlay = document.getElementById("gameOverlay");
  const btnStart = document.getElementById("btnStartCatcher");
  const scoreEl = document.getElementById("catcherScore");
  const timerEl = document.getElementById("catcherTimer");

  if (!canvas || !btnStart) return;
  const ctx = canvas.getContext("2d");

  let gameRunning = false;
  let score = 0;
  const targetScore = 8;
  let timeLeft = 25;
  let timerInterval = null;
  let animationFrameId = null;

  // Giỏ hứng tim ở đáy
  const basket = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 35,
    width: 64,
    height: 24,
    color: "#ff3366",
  };

  // Mảng các trái tim đang rơi
  let fallingItems = [];

  class FallingHeart {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * (canvas.width - 24) + 12;
      this.y = -15;
      this.speed = Math.random() * 1.5 + 1.2;
      this.size = Math.random() * 6 + 14;
      this.type = Math.random() > 0.25 ? "heart" : "rose";
    }

    update() {
      this.y += this.speed;
      if (this.y > canvas.height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.type === "heart" ? "❤️" : "🌹", this.x, this.y);
    }
  }

  function handleMove(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const canvasX = (clientX - rect.left) * scaleX;
    basket.x = Math.max(
      0,
      Math.min(canvas.width - basket.width, canvasX - basket.width / 2),
    );
  }

  // Sự kiện chạm di chuyển trên điện thoại & chuột trên máy tính
  canvas.addEventListener("mousemove", (e) => {
    if (gameRunning) handleMove(e.clientX);
  });
  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (gameRunning && e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    },
    { passive: false },
  );

  btnStart.addEventListener("click", startGame);

  function startGame() {
    overlay.classList.add("hidden");
    gameRunning = true;
    score = 0;
    timeLeft = 25;
    if (scoreEl) scoreEl.textContent = score;
    if (timerEl) timerEl.textContent = timeLeft;

    fallingItems = [new FallingHeart(), new FallingHeart(), new FallingHeart()];

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = timeLeft;

      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);

    gameLoop();
  }

  function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ giỏ hứng tim xinh xắn
    ctx.fillStyle = basket.color;
    ctx.beginPath();
    ctx.roundRect(
      basket.x,
      basket.y,
      basket.width,
      basket.height,
      [8, 8, 12, 12],
    );
    ctx.fill();
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Nhãn giỏ
    ctx.font = "bold 10px 'Montserrat'";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("YÊU TRÂM", basket.x + basket.width / 2, basket.y + 15);

    // Cập nhật và kiểm tra va chạm
    fallingItems.forEach((item) => {
      item.update();
      item.draw();

      // Kiểm tra chạm vào giỏ
      if (
        item.y + item.size / 2 >= basket.y &&
        item.y - item.size / 2 <= basket.y + basket.height &&
        item.x >= basket.x - 5 &&
        item.x <= basket.x + basket.width + 5
      ) {
        score++;
        if (scoreEl) scoreEl.textContent = score;
        if (window.playChimeSound) window.playChimeSound("pop");
        item.reset();

        // Hiệu ứng ăn mừng khi hứng đủ
        if (score >= targetScore) {
          endGame(true);
        }
      }
    });

    if (gameRunning) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  }

  function endGame(isWin) {
    gameRunning = false;
    clearInterval(timerInterval);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    if (isWin) {
      if (window.playChimeSound) window.playChimeSound("win");
      if (typeof confetti === "function") {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
      showToast("🎉 Giỏi quá! Bích Trâm đã hứng trọn tình yêu của Anh!");

      setTimeout(() => {
        nextQuest(); // Sang Vòng 3 (Vòng quay may mắn)
      }, 1000);
    } else {
      overlay.classList.remove("hidden");
      btnStart.innerHTML = `<i class="fa-solid fa-rotate-right"></i> Thử lại nhé Bích Trâm`;
      showToast("Hết giờ mất rồi, thử lại một xíu là qua ngay nè!");
    }
  }
}

// ==========================================================
// 8. GAME 3: VÒNG QUAY MAY MẮN (LUCKY WHEEL)
// ==========================================================
function initLuckyWheel() {
  const canvas = document.getElementById("wheelCanvas");
  const btnSpin = document.getElementById("btnSpinWheel");
  const wheelHint = document.getElementById("wheelHint");
  const stepQuest = document.getElementById("stepQuest");
  const stepReward = document.getElementById("stepReward");

  if (!canvas || !btnSpin) return;
  const ctx = canvas.getContext("2d");

  const segments = [
    { text: "Lì xì 50k 20/10", color: "#d61849", icon: "🧧" },
    { text: "Cưng chiều 1 năm", color: "#3d1028", icon: "👑" },
    { text: "Bao ăn món thích", color: "#8a1036", icon: "🍲" },
    { text: "Phiếu hết giận", color: "#29081e", icon: "📜" },
    { text: "Hẹn hò lãng mạn", color: "#b51442", icon: "🎬" },
    { text: "Yêu Trâm suốt đời", color: "#4f0e31", icon: "💖" },
  ];

  const totalSegments = segments.length;
  const arc = (2 * Math.PI) / totalSegments;
  const center = canvas.width / 2;
  const radius = center - 8;

  let currentRotation = 0;
  let isSpinning = false;

  function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < totalSegments; i++) {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = segments[i].color;
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + arc);
      ctx.lineTo(center, center);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vẽ chữ và icon
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'Montserrat'";
      ctx.fillText(`${segments[i].icon} ${segments[i].text}`, radius - 15, 4);
      ctx.restore();
    }

    // Viền kim loại vàng gold ngoài cùng
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  drawWheel();

  btnSpin.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    if (wheelHint)
      wheelHint.textContent = "Vòng quay đang xoay vèo vèo... Hồi hộp quá!";

    // Tính toán góc quay để kim dừng trúng ngay ô "Lì xì 50k 20/10" (Ô số 0)
    // Kim ở đỉnh (270 độ = 1.5 * PI)
    const extraRotations = 5 * 360; // 5 vòng quay
    // Ô 0 trải dài từ 0 đến 60 độ. Để kim ở đỉnh chỉ vào ô 0:
    const targetAngle = extraRotations + (270 - 30);

    canvas.style.transform = `rotate(${targetAngle}deg)`;

    // Sau khi quay xong (4.5s)
    setTimeout(() => {
      isSpinning = false;
      if (window.playChimeSound) window.playChimeSound("win");
      launchVictoryConfetti();

      showToast("🎁 TRÚNG RỒI! Phần thưởng: Lì Xì 50.000đ + Tình Yêu Của Anh!");

      setTimeout(() => {
        switchScreen(stepQuest, stepReward);
        updateVietQRDisplay();
      }, 1500);
    }, 4600);
  });
}

function launchVictoryConfetti() {
  if (typeof confetti !== "function") return;
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 45 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }),
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 250);
}

// ==========================================================
// 9. MÃ VIETQR CHUẨN NAPAS247 (QUÉT ĐƯỢC 100%)
// ==========================================================
// Chuỗi mã QR ZaloPay chính thức của Phạm Thị Bích Trâm (được trích xuất trực tiếp từ ảnh gốc)
const EXACT_ZALOPAY_QR_STRING =
  "00020101021126400010vn.zalopay0115ghEsu2IXKnIlZza020300238620010A00000072701320006970454011899ZP26286M801958080208QRIBFTTA5204739953037045802VN63048462";

function initVietQR() {
  const tabNapasQR = document.getElementById("tabNapasQR");
  const tabZaloQR = document.getElementById("tabZaloQR");
  const qrScanGuide = document.getElementById("qrScanGuide");
  const btnCustomAccount = document.getElementById("btnCustomAccount");
  const customBankForm = document.getElementById("customBankForm");
  const btnGenerateCustomQR = document.getElementById("btnGenerateCustomQR");

  // Tab chuyển đổi quét bằng MoMo/Ngân Hàng (Napas) hoặc ZaloPay
  if (tabNapasQR && tabZaloQR) {
    tabNapasQR.addEventListener("click", () => {
      tabNapasQR.classList.add("active");
      tabZaloQR.classList.remove("active");
      currentQrMode = "napas";
      if (qrScanGuide) {
        qrScanGuide.innerHTML =
          "✨ <i>Mở <b>MoMo</b> hoặc bất kỳ <b>App Ngân hàng nào (BIDV, VCB, MB, TCB...)</b> quét mã này là nhận diện ngay Bản Việt - 50.000đ!</i>";
      }
      updateVietQRDisplay();
    });

    tabZaloQR.addEventListener("click", () => {
      tabZaloQR.classList.add("active");
      tabNapasQR.classList.remove("active");
      currentQrMode = "zalopay";
      if (qrScanGuide) {
        qrScanGuide.innerHTML =
          "✨ <i>Mở <b>App ZaloPay</b> hoặc ứng dụng <b>Zalo</b> quét mã này để chuyển thẳng vào ví Bích Trâm!</i>";
      }
      updateVietQRDisplay();
    });
  }

  // Sao chép STK
  const displayAccountNo = document.getElementById("displayAccountNo");
  if (displayAccountNo) {
    displayAccountNo.addEventListener("click", () => {
      const textToCopy = CONFIG.recipient.accountNo;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showToast("Đã sao chép số tài khoản của Bích Trâm!");
        })
        .catch(() => {
          showToast(`Số tài khoản: ${textToCopy}`);
        });
    });
  }

  // Đổi STK khác nếu muốn
  if (btnCustomAccount && customBankForm) {
    btnCustomAccount.addEventListener("click", () => {
      customBankForm.classList.toggle("open");
    });
  }

  if (btnGenerateCustomQR) {
    btnGenerateCustomQR.addEventListener("click", () => {
      const bankSelect = document.getElementById("bankSelect");
      const accountInput = document.getElementById("accountInput");
      const nameInput = document.getElementById("nameInput");

      if (!accountInput.value.trim()) {
        showToast("Vui lòng nhập số tài khoản hoặc SĐT!");
        return;
      }

      CONFIG.recipient.bankId = bankSelect.value;
      CONFIG.recipient.bankName =
        bankSelect.options[bankSelect.selectedIndex].text;
      CONFIG.recipient.accountNo = accountInput.value.trim();
      CONFIG.recipient.accountName = (
        nameInput.value.trim() || "ZALOPAY_PHAM THI BICH TRAM"
      ).toUpperCase();

      currentQrMode = "napas";
      updateVietQRDisplay();
      customBankForm.classList.remove("open");
      showToast("Đã cập nhật mã VietQR theo số tài khoản mới!");
    });
  }

  // Nút đòi ting ting qua Zalo
  const btnClaimZalo = document.getElementById("btnClaimZalo");
  if (btnClaimZalo) {
    btnClaimZalo.addEventListener("click", () => {
      const message = `Anh yêu ơi! Em vừa vượt qua thử thách 20/10 trên web rồi nè ❤️ Mau ting ting lì xì ${CONFIG.recipient.amount.toLocaleString()}đ vào ví ZaloPay cho Bích Trâm nhé! Yêu anh nhiều 💕`;

      navigator.clipboard
        .writeText(message)
        .then(() => {
          showToast("Đã sao chép lời nhắn đòi quà! Mở Zalo gửi cho Anh nhé!");
        })
        .catch(() => {});

      setTimeout(() => {
        window.open(`https://zalo.me`, "_blank");
      }, 700);
    });
  }

  // Gọi cập nhật hiển thị mã QR ngay khi khởi tạo
  updateVietQRDisplay();
}

function updateVietQRDisplay() {
  const vietQrImg = document.getElementById("vietQrImg");
  const zalopayQrBox = document.getElementById("zalopayQrBox");
  const qrLoading = document.getElementById("qrLoading");
  const displayBankName = document.getElementById("displayBankName");
  const displayAccountNo = document.getElementById("displayAccountNo");
  const displayAccountName = document.getElementById("displayAccountName");
  const displayMemo = document.getElementById("displayMemo");
  const moneyAmount = document.getElementById("moneyAmount");

  if (displayBankName) displayBankName.textContent = CONFIG.recipient.bankName;
  if (displayAccountNo)
    displayAccountNo.innerHTML = `${CONFIG.recipient.accountNo} <i class="fa-regular fa-copy"></i>`;
  if (displayAccountName)
    displayAccountName.textContent = CONFIG.recipient.accountName;
  if (displayMemo) displayMemo.textContent = CONFIG.recipient.memo;
  if (moneyAmount)
    moneyAmount.textContent = `${CONFIG.recipient.amount.toLocaleString("vi-VN")} VNĐ`;

  if (currentQrMode === "zalopay") {
    // Vẽ mã QR ZaloPay chính thức bằng QRCode.js
    if (vietQrImg) vietQrImg.style.display = "none";
    if (zalopayQrBox) {
      zalopayQrBox.style.display = "block";
      zalopayQrBox.innerHTML = "";
      if (typeof QRCode !== "undefined") {
        new QRCode(zalopayQrBox, {
          text: EXACT_ZALOPAY_QR_STRING,
          width: 195,
          height: 195,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M,
        });
      }
    }
    if (qrLoading) qrLoading.classList.add("hidden");
  } else {
    // Chế độ Napas: Quét bằng MoMo / Mọi App Ngân Hàng (BIDV, VCB, MB, TCB...)
    if (zalopayQrBox) zalopayQrBox.style.display = "none";
    if (vietQrImg) {
      vietQrImg.style.display = "block";
      vietQrImg.src = "./qr-bvb.png";
      if (qrLoading) qrLoading.classList.add("hidden");
    }
  }
}

// ==========================================================
// 10. MODAL MÃ QR WEB CHO BẠN TRAI
// ==========================================================
function initShareModal() {
  const btnShareQR = document.getElementById("btnShareQR");
  const qrShareModal = document.getElementById("qrShareModal");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const websiteQrBox = document.getElementById("websiteQrBox");
  const webUrlInput = document.getElementById("webUrlInput");
  const btnCopyUrl = document.getElementById("btnCopyUrl");

  let qrCodeInstance = null;

  function openModal() {
    const currentUrl = window.location.href;
    if (webUrlInput) webUrlInput.value = currentUrl;

    if (websiteQrBox && !qrCodeInstance && typeof QRCode !== "undefined") {
      websiteQrBox.innerHTML = "";
      qrCodeInstance = new QRCode(websiteQrBox, {
        text: currentUrl,
        width: 175,
        height: 175,
        colorDark: "#200819",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }

    if (qrShareModal) qrShareModal.classList.add("open");
  }

  function closeModal() {
    if (qrShareModal) qrShareModal.classList.remove("open");
  }

  if (btnShareQR) btnShareQR.addEventListener("click", openModal);
  if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
  if (qrShareModal) {
    qrShareModal.addEventListener("click", (e) => {
      if (e.target === qrShareModal) closeModal();
    });
  }

  if (btnCopyUrl && webUrlInput) {
    btnCopyUrl.addEventListener("click", () => {
      navigator.clipboard.writeText(webUrlInput.value).then(() => {
        showToast("Đã chép link website vào bộ nhớ tạm!");
      });
    });
  }
}

// ==========================================================
// THÔNG BÁO TOAST TIỆN ÍCH
// ==========================================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toastFeedback");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}
