/**
 * ==========================================================
 * CẤU HÌNH THÔNG TIN 20/10 - YÊU PHẠM THỊ BÍCH TRÂM
 * ==========================================================
 */
const CONFIG = {
  // Ngày bắt đầu yêu nhau (Định dạng: YYYY-MM-DD)
  startDate: import.meta.env.VITE_START_DATE || "2026-08-30",

  // Link phong bao Lì Xì MoMo chính thức
  momoLixiUrl:
    import.meta.env.VITE_MOMO_LIXI_URL ||
    "https://lixi.momo.vn/lixi/lzvzyEeN5QbMpBG",

  // Link bài hát: "Ngày Còn Đôi Mươi - Tiểu Mỹ"
  bgmUrl:
    import.meta.env.VITE_BGM_URL ||
    "https://youtu.be/2B8y347pwCg?si=Dbg8QwKEV0wGbWNc",
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

document.addEventListener("DOMContentLoaded", () => {
  initPetalAnimation();
  initCountdownTimer();
  initPhotoSlider();
  initAudio();
  initEnvelopeInteraction();
  initQuestFlow();
  initRunawayButton();
  initLoveCatcherGame();
  initBlockBlastGame();
  restoreAppState();
});

// ==========================================================
// 1. HIỆU ỨNG CÁNH HOA HỒNG RƠI LÃNG MẠN
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

  // Hiệu ứng bụi sao lấp lánh lung linh (Sparkles)
  const sparklesCount = Math.min(22, Math.floor(width / 24));
  const sparkles = [];

  class Sparkle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 1;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.alphaSpeed =
        (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1);
      this.color = Math.random() > 0.45 ? "#ffd700" : "#ffb3d9";
    }

    update() {
      this.y -= this.speedY;
      this.alpha += this.alphaSpeed;
      if (this.alpha <= 0.1 || this.alpha >= 0.85) {
        this.alphaSpeed = -this.alphaSpeed;
      }
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < sparklesCount; i++) {
    sparkles.push(new Sparkle());
  }

  // Hiệu ứng bụi sao lấp lánh & trái tim mini lượn theo ngón tay chạm/vuốt trên điện thoại
  const touchParticles = [];
  class TouchFairyParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.vx = (Math.random() - 0.5) * 1.6;
      this.vy = (Math.random() - 0.5) * 1.6 - 0.7;
      this.alpha = 1;
      this.decay = Math.random() * 0.025 + 0.02;
      this.isHeart = Math.random() > 0.68;
      this.color = Math.random() > 0.45 ? "#ff4d79" : "#ffd700";
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      if (this.isHeart) {
        ctx.fillStyle = "#ff4d79";
        ctx.shadowColor = "#ff3366";
        ctx.shadowBlur = 6;
        const s = this.size * 0.45;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + s);
        ctx.bezierCurveTo(
          this.x - s * 2,
          this.y - s * 1.5,
          this.x - s * 3,
          this.y + s * 0.8,
          this.x,
          this.y + s * 2.8,
        );
        ctx.bezierCurveTo(
          this.x + s * 3,
          this.y + s * 0.8,
          this.x + s * 2,
          this.y - s * 1.5,
          this.x,
          this.y + s,
        );
        ctx.fill();
      } else {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function addTouchFairy(x, y) {
    if (touchParticles.length < 50) {
      touchParticles.push(new TouchFairyParticle(x, y));
    }
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      addTouchFairy(e.clientX, e.clientY);
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches.length > 0) {
        addTouchFairy(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true },
  );

  function render() {
    ctx.clearRect(0, 0, width, height);
    sparkles.forEach((s) => {
      s.update();
      s.draw();
    });
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    for (let i = touchParticles.length - 1; i >= 0; i--) {
      const tp = touchParticles[i];
      tp.update();
      tp.draw();
      if (tp.alpha <= 0) {
        touchParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

// Rung phản hồi haptic cho điện thoại di động
function triggerHaptic(pattern = 20) {
  try {
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
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
// 2.1 ALBUM ẢNH BÍCH TRÂM LUNG LINH (POLAROID PHOTO REEL)
// ==========================================================
function initPhotoSlider() {
  const photos = [
    {
      src: "./assets/images/1792431446395_2078646892542367163_3178667924915315071_aea18f6956ba1d0c6b859973c59a2b20.jpg",
      caption: "Công chúa Bích Trâm dịu dàng",
    },
    {
      src: "./assets/images/1790513189521_2078646892542367163_3178667924915315071_8e2ef02b8e0a4f96ac6a4a8c0af57d69.jpg",
      caption: "Em bé đáng yêu số 1 của anh",
    },
    {
      src: "./assets/images/1792431730082_2078646892542367163_3178667924915315071_ba26d17fe2f93686af4e311cc649b944.jpg",
      caption: "Khoảnh khắc nháy mắt siêu cute",
    },
    {
      src: "./assets/images/1792431446430_2078646892542367163_3178667924915315071_ce085e318d031ca2dfd66379b449d8de.jpg",
      caption: "Trâm ngầu xỉu và cá tính",
    },
    {
      src: "./assets/images/1792431446408_2078646892542367163_3178667924915315071_3eac6196af109660cd0104d6b867536d.jpg",
      caption: "Mặt chu môi cưng hết nấc",
    },
    {
      src: "./assets/images/1790513189115_2078646892542367163_3178667924915315071_ea50b007793f2f817e5d640d30b320a0.jpg",
      caption: "Hài hước tinh nghịch nhưng anh thương nhất",
    },
  ];

  let currentIndex = 0;
  const imgEl = document.getElementById("polaroidImg");
  const captionEl = document.getElementById("polaroidCaption");
  const dotsContainer = document.getElementById("photoDotsNav");
  const btnPrev = document.getElementById("btnPrevPhoto");
  const btnNext = document.getElementById("btnNextPhoto");

  if (!imgEl || !dotsContainer) return;

  dotsContainer.innerHTML = "";
  photos.forEach((_, idx) => {
    const dot = document.createElement("span");
    dot.className = `photo-dot ${idx === 0 ? "active" : ""}`;
    dot.addEventListener("click", () => showPhoto(idx));
    dotsContainer.appendChild(dot);
  });

  function showPhoto(idx) {
    if (idx < 0) idx = photos.length - 1;
    if (idx >= photos.length) idx = 0;
    currentIndex = idx;

    imgEl.classList.add("fade-out");
    setTimeout(() => {
      imgEl.src = photos[currentIndex].src;
      if (captionEl) captionEl.textContent = photos[currentIndex].caption;
      imgEl.classList.remove("fade-out");

      const allDots = dotsContainer.querySelectorAll(".photo-dot");
      allDots.forEach((d, i) => {
        d.classList.toggle("active", i === currentIndex);
      });
    }, 180);
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      showPhoto(currentIndex - 1);
      resetAutoPlay();
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      showPhoto(currentIndex + 1);
      resetAutoPlay();
    });
  }

  let slideInterval = setInterval(() => {
    showPhoto(currentIndex + 1);
  }, 3600);

  function resetAutoPlay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      showPhoto(currentIndex + 1);
    }, 3600);
  }
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

function setupYouTubePlayer() {
  const ytId = extractYouTubeId(CONFIG.bgmUrl);
  if (!ytId || ytPlayer) return;

  try {
    ytPlayer = new YT.Player("ytPlayerContainer", {
      height: "200",
      width: "200",
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
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          ytReady = true;
          try {
            event.target.unMute();
            event.target.setVolume(85);
          } catch (e) {}
          const iframe = document.querySelector("#ytPlayerContainer iframe");
          if (iframe) {
            iframe.setAttribute("allow", "autoplay; encrypted-media");
          }
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
          } else if (event.data === YT.PlayerState.BUFFERING) {
            icon?.classList.remove("paused");
          }
        },
        onError: (event) => {
          console.warn("YouTube player error:", event.data);
        },
      },
    });
  } catch (err) {
    console.warn("YouTube Player error:", err);
  }
}

window.onYouTubeIframeAPIReady = function () {
  setupYouTubePlayer();
};

if (window.YT && window.YT.Player) {
  setupYouTubePlayer();
}

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

  function playBgm() {
    if (ytId && ytPlayer && typeof ytPlayer.playVideo === "function") {
      try {
        if (typeof ytPlayer.unMute === "function") ytPlayer.unMute();
        if (typeof ytPlayer.setVolume === "function") ytPlayer.setVolume(85);
        ytPlayer.playVideo();
        isMusicPlaying = true;
        icon?.classList.remove("paused");
        showToast("Đang phát: Ngày Còn Đôi Mươi ❤️");
      } catch (err) {
        console.warn("playVideo error:", err);
      }
    } else if (bgMusicAudio) {
      bgMusicAudio
        .play()
        .then(() => {
          isMusicPlaying = true;
          icon?.classList.remove("paused");
          showToast("Đang phát nhạc 20/10 ❤️");
        })
        .catch(() => {
          showToast("Chạm vào màn hình để bắt đầu nghe nhạc nhé!");
        });
    }
  }

  function pauseBgm() {
    if (ytId && ytPlayer && typeof ytPlayer.pauseVideo === "function") {
      try {
        ytPlayer.pauseVideo();
      } catch (err) {}
    } else if (bgMusicAudio) {
      bgMusicAudio.pause();
    }
    isMusicPlaying = false;
    icon?.classList.add("paused");
    showToast("Đã tạm dừng bài hát");
  }

  function toggleAudio(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    triggerHaptic(15);

    let isPlaying = isMusicPlaying;
    if (ytId && ytPlayer && typeof ytPlayer.getPlayerState === "function") {
      try {
        const state = ytPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) isPlaying = true;
        if (state === YT.PlayerState.PAUSED) isPlaying = false;
      } catch (err) {}
    }

    if (isPlaying) {
      pauseBgm();
    } else {
      playBgm();
    }
  }

  if (btnMusic) {
    btnMusic.addEventListener("click", toggleAudio);
  }

  const startMusicOnFirstTouch = (e) => {
    // Không can thiệp nếu người dùng chủ động bấm vào nút đĩa nhạc
    if (e && e.target && e.target.closest && e.target.closest("#btnMusic")) {
      return;
    }

    if (!isMusicPlaying) {
      playBgm();
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
      triggerHaptic([35, 50, 35]);
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
        saveAppState(
          toEl.id,
          toEl.id === "stepQuest" ? currentQuest : undefined,
        );
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

    showToast("Ối! Nút này biết trốn rồi, Trâm chọn câu khác nha 😜");
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

  // Vòng 1: Chọn đáp án đúng
  const correctButtons = document.querySelectorAll(".correct-opt");
  correctButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const feedback = btn.getAttribute("data-feedback") || "Chính xác luôn!";
      showToast(feedback);
      triggerHaptic(25);
      if (window.playChimeSound) window.playChimeSound("success");
      if (typeof confetti === "function") {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });
      }

      // Hiện popup xác nhận trước khi chuyển sang thử thách 2
      showQuestConfirmModal({
        icon: "fa-crown",
        title: "Vượt qua thử thách 1 xuất sắc!",
        desc: "Phạm Thị Bích Trâm chính là công chúa duy nhất của anh! Em đã sẵn sàng gom tim và hoa ở thử thách tiếp theo chưa?",
        btnText: "Bắt đầu thử thách 2 ngay",
        onConfirm: () => {
          nextQuest();
        },
      });
    });
  });

  const btnReplay = document.getElementById("btnReplay");
  if (btnReplay) {
    btnReplay.addEventListener("click", () => {
      clearAppState();
      window.location.reload();
    });
  }
}

function showQuestConfirmModal({
  icon = "fa-trophy",
  title = "Vượt qua thử thách!",
  desc = "Em giỏi quá! Sẵn sàng cho thử thách tiếp theo chưa?",
  btnText = "Tiếp tục thử thách tiếp theo",
  onConfirm = null,
}) {
  const modal = document.getElementById("questConfirmModal");
  const iconEl = document.getElementById("confirmBadgeIcon");
  const titleEl = document.getElementById("confirmModalTitle");
  const descEl = document.getElementById("confirmModalDesc");
  const btnEl = document.getElementById("btnConfirmNextQuest");
  const btnTextEl = document.getElementById("confirmBtnText");

  if (!modal) {
    if (typeof onConfirm === "function") onConfirm();
    return;
  }

  if (iconEl) iconEl.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  if (btnTextEl) btnTextEl.textContent = btnText;

  modal.classList.add("open");

  // Reset event listener trên nút xác nhận
  const newBtn = btnEl.cloneNode(true);
  btnEl.parentNode.replaceChild(newBtn, btnEl);

  newBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    triggerHaptic(20);
    if (typeof onConfirm === "function") {
      onConfirm();
    }
  });
}

function nextQuest() {
  const progressFill = document.getElementById("progressFill");
  const questIndicator = document.getElementById("questIndicator");
  const currentPanel = document.getElementById(`quest${currentQuest}`);
  currentQuest++;
  saveAppState("stepQuest", currentQuest);

  const titles = [
    "Thử thách 1 / 3: Câu đố tình yêu",
    "Thử thách 2 / 3: Hứng tim & hoa yêu thương",
    "Thử thách 3 / 3: Mảnh ghép tình yêu",
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
// CÁC HÀM VẼ VECTOR CANVAS THAY THẾ CHO ICON TEXT EMOJI
// ==========================================================
function drawVectorHeart(ctx, x, y, size = 20) {
  ctx.save();
  ctx.translate(x, y);
  const s = size / 26;
  ctx.scale(s, s);

  const grad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 16);
  grad.addColorStop(0, "#ff6b8b");
  grad.addColorStop(0.7, "#ff3366");
  grad.addColorStop(1, "#c71040");

  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(255, 51, 102, 0.6)";
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(-14, -14, -20, 6, 0, 18);
  ctx.bezierCurveTo(20, 6, 14, -14, 0, 4);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.beginPath();
  ctx.ellipse(-5, -2, 4, 2, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawVectorRose(ctx, x, y, size = 20) {
  ctx.save();
  ctx.translate(x, y);
  const s = size / 26;
  ctx.scale(s, s);

  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.ellipse(8, 8, 6, 2.5, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  const roseGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 14);
  roseGrad.addColorStop(0, "#ffa3ba");
  roseGrad.addColorStop(0.5, "#f43f5e");
  roseGrad.addColorStop(1, "#9f1239");

  ctx.fillStyle = roseGrad;
  ctx.shadowColor = "rgba(244, 63, 94, 0.5)";
  ctx.shadowBlur = 6;

  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * 5, Math.sin(angle) * 5, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#ffe4e6";
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ==========================================================
// ==========================================================
// 7. GAME 2: BẮT TRÁI TIM YÊU THƯƠNG (CANVAS INTERACTIVE)
// TỐI ƯU SIÊU MƯỢT 60/120FPS VỚI HARDWARE SPRITES VÀ DELTA TIME
// ==========================================================
let cachedHeartSprite = null;
let cachedRoseSprite = null;

function getHeartSprite() {
  if (cachedHeartSprite) return cachedHeartSprite;
  cachedHeartSprite = document.createElement("canvas");
  cachedHeartSprite.width = 64;
  cachedHeartSprite.height = 64;
  const sCtx = cachedHeartSprite.getContext("2d");
  drawVectorHeart(sCtx, 32, 30, 42);
  return cachedHeartSprite;
}

function getRoseSprite() {
  if (cachedRoseSprite) return cachedRoseSprite;
  cachedRoseSprite = document.createElement("canvas");
  cachedRoseSprite.width = 64;
  cachedRoseSprite.height = 64;
  const sCtx = cachedRoseSprite.getContext("2d");
  drawVectorRose(sCtx, 32, 32, 42);
  return cachedRoseSprite;
}

function initLoveCatcherGame() {
  const canvas = document.getElementById("catcherCanvas");
  const overlay = document.getElementById("gameOverlay");
  const btnStart = document.getElementById("btnStartCatcher");
  const heartsEl = document.getElementById("heartsCount");
  const rosesEl = document.getElementById("rosesCount");
  const timerEl = document.getElementById("catcherTimer");

  if (!canvas || !btnStart) return;
  const ctx = canvas.getContext("2d");

  let gameRunning = false;
  let heartsCount = 0;
  let rosesCount = 0;
  const targetHearts = 10;
  const targetRoses = 20;
  let timeLeft = 45;
  let timerInterval = null;
  let animationFrameId = null;
  let lastTime = 0;

  // Giỏ hứng tim & hoa ở đáy - mở rộng bề ngang (96px)
  const basket = {
    x: canvas.width / 2 - 48,
    targetX: canvas.width / 2 - 48,
    y: canvas.height - 35,
    width: 96,
    height: 24,
    color: "#ff3366",
  };

  // Cache bounding client rect để tránh synchronous layout reflow trên touchmove
  let cachedRect = null;
  function updateRect() {
    cachedRect = canvas.getBoundingClientRect();
  }
  window.addEventListener("resize", updateRect);
  window.addEventListener("scroll", updateRect, { passive: true });

  // Mảng các vật phẩm đang rơi
  let fallingItems = [];

  class FallingItem {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.baseX = Math.random() * (canvas.width - 36) + 18;
      this.x = this.baseX;
      this.y = initial ? -(Math.random() * 80 + 10) : -20;
      // Tốc độ rơi êm dịu, chuẩn theo frame rate
      this.speed = Math.random() * 0.45 + 0.85;
      this.size = Math.random() * 5 + 18;
      // Tỉ lệ: ~67% hoa hồng, ~33% trái tim
      this.type = Math.random() < 0.67 ? "rose" : "heart";
      // Chuyển động đung đưa nhẹ nhàng như cánh hoa rơi
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.04 + 0.02;
      this.swayRadius = Math.random() * 5 + 2;
    }

    update(dt) {
      this.y += this.speed * dt;
      this.swayAngle += this.swaySpeed * dt;
      this.x = this.baseX + Math.sin(this.swayAngle) * this.swayRadius;
      if (this.y > canvas.height + 25) {
        this.reset();
      }
    }

    draw(ctx) {
      const sprite = this.type === "heart" ? getHeartSprite() : getRoseSprite();
      if (sprite) {
        ctx.drawImage(
          sprite,
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size,
        );
      }
    }
  }

  function handleMove(clientX) {
    if (!cachedRect) updateRect();
    const scaleX = canvas.width / cachedRect.width;
    const canvasX = (clientX - cachedRect.left) * scaleX;
    basket.targetX = Math.max(
      0,
      Math.min(canvas.width - basket.width, canvasX - basket.width / 2),
    );
  }

  // Sự kiện chạm di chuyển trên điện thoại & chuột trên máy tính
  canvas.addEventListener("mousemove", (e) => {
    if (gameRunning) handleMove(e.clientX);
  });
  canvas.addEventListener(
    "touchstart",
    (e) => {
      updateRect();
      if (gameRunning && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    },
    { passive: true },
  );
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
    updateRect();
    overlay.classList.add("hidden");
    gameRunning = true;
    heartsCount = 0;
    rosesCount = 0;
    timeLeft = 45;
    lastTime = 0;
    if (heartsEl) heartsEl.textContent = heartsCount;
    if (rosesEl) rosesEl.textContent = rosesCount;
    if (timerEl) timerEl.textContent = timeLeft;

    fallingItems = [
      new FallingItem(),
      new FallingItem(),
      new FallingItem(),
      new FallingItem(),
      new FallingItem(),
    ];

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = timeLeft;

      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function gameLoop(currentTime) {
    if (!gameRunning) return;

    if (!lastTime) lastTime = currentTime;
    const elapsed = Math.min(currentTime - lastTime, 40);
    const dt = elapsed / 16.67;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chuyển động bệ hứng siêu mượt (lerp)
    basket.x += (basket.targetX - basket.x) * 0.45;

    // Vẽ bệ hứng tình yêu xinh xắn
    ctx.fillStyle = basket.color;
    ctx.beginPath();
    ctx.roundRect(
      basket.x,
      basket.y,
      basket.width,
      basket.height,
      [10, 10, 14, 14],
    );
    ctx.fill();
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Nhãn bệ hứng
    ctx.font = "bold 11px 'Montserrat'";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Yêu Bích Trâm", basket.x + basket.width / 2, basket.y + 15);

    // Cập nhật và kiểm tra va chạm
    fallingItems.forEach((item) => {
      item.update(dt);
      item.draw(ctx);

      // Kiểm tra chạm vào bệ hứng
      if (
        item.y + item.size / 2 >= basket.y &&
        item.y - item.size / 2 <= basket.y + basket.height &&
        item.x >= basket.x - 6 &&
        item.x <= basket.x + basket.width + 6
      ) {
        if (item.type === "heart") {
          if (heartsCount < targetHearts) {
            heartsCount++;
            if (heartsEl) heartsEl.textContent = heartsCount;
          }
          triggerHaptic(20);
          if (window.playChimeSound) window.playChimeSound("pop");
        } else {
          if (rosesCount < targetRoses) {
            rosesCount++;
            if (rosesEl) rosesEl.textContent = rosesCount;
          }
          triggerHaptic(15);
          if (window.playChimeSound) window.playChimeSound("pop");
        }
        item.reset();

        // Kiểm tra đủ 10 tim và 20 hoa
        if (heartsCount >= targetHearts && rosesCount >= targetRoses) {
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
      triggerHaptic([40, 60, 40]);
      if (window.playChimeSound) window.playChimeSound("win");
      if (typeof confetti === "function") {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }

      // Hiện modal xác nhận trước khi sang Thử thách 3
      showQuestConfirmModal({
        icon: "fa-shapes",
        title: "Tuyệt vời! Hoàn thành thử thách 2!",
        desc: "Bích Trâm nhanh tay lẹ mắt quá, gom đủ 10 tim và 20 hoa hồng luôn nè! Phía trước là mini-game Mảnh Ghép Tình Yêu đang chờ em chinh phục!",
        btnText: "Bắt đầu thử thách 3 ngay",
        onConfirm: () => {
          nextQuest();
        },
      });
    } else {
      overlay.classList.remove("hidden");
      btnStart.innerHTML = `<i class="fa-solid fa-rotate-right"></i> Thử lại nhé Bích Trâm`;
      showToast("Chưa gom đủ hoa và tim rồi, thử lại xíu là qua ngay nè!");
    }
  }

  btnStart.addEventListener("click", startGame);
}

// ==========================================================
// 8. THỬ THÁCH 3: MẢNH GHÉP TÌNH YÊU - GHÉP TRANH CÔNG CHÚA
// ==========================================================
function initBlockBlastGame() {
  const boardEl = document.getElementById("blockBoard");
  const trayEl = document.getElementById("pieceTray");
  const filledCountEl = document.getElementById("boardFilledCount");
  const filledPercentEl = document.getElementById("boardFilledPercent");
  const blocksPlacedEl = document.getElementById("blocksPlacedCount");
  const fullPhotoReveal = document.getElementById("fullPhotoReveal");
  const giftRevealCard = document.getElementById("giftRevealCard");
  const btnProceedToReward = document.getElementById("btnProceedToReward");
  const stepQuest = document.getElementById("stepQuest");

  if (!boardEl || !trayEl) return;

  const ROWS = 4;
  const COLS = 3;
  const TOTAL_CELLS = ROWS * COLS;
  let boardState = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  let totalBlocksPlaced = 0;
  let selectedPieceIndex = null;
  let currentTrayPieces = [];

  // Bộ khối gạch kẹo ngọt lung linh phong cách xếp hình
  const SHAPES = [
    {
      id: "square",
      color: "linear-gradient(135deg, #f59e0b, #d97706)",
      matrix: [
        [1, 1],
        [1, 1],
      ],
    },
    {
      id: "line3h",
      color: "linear-gradient(135deg, #ec4899, #be185d)",
      matrix: [[1, 1, 1]],
    },
    {
      id: "line3v",
      color: "linear-gradient(135deg, #06b6d4, #0e7490)",
      matrix: [[1], [1], [1]],
    },
    {
      id: "l_left",
      color: "linear-gradient(135deg, #a855f7, #7e22ce)",
      matrix: [
        [1, 0],
        [1, 1],
      ],
    },
    {
      id: "l_right",
      color: "linear-gradient(135deg, #10b981, #047857)",
      matrix: [
        [0, 1],
        [1, 1],
      ],
    },
    {
      id: "domino_h",
      color: "linear-gradient(135deg, #f43f5e, #be123c)",
      matrix: [[1, 1]],
    },
    {
      id: "domino_v",
      color: "linear-gradient(135deg, #f97316, #c2410c)",
      matrix: [[1], [1]],
    },
    {
      id: "single",
      color: "linear-gradient(135deg, #ffd700, #ff8da1)",
      matrix: [[1]],
    },
  ];

  // Khởi tạo 16 ô trên bảng (chỉ hiển thị ô trống, giữ bí mật tấm hình cho tới khi ghép đủ 100%)
  boardEl.innerHTML = "";
  const cellElements = [];

  for (let r = 0; r < ROWS; r++) {
    cellElements[r] = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "bb-cell";
      cell.setAttribute("data-row", r);
      cell.setAttribute("data-col", c);

      cell.addEventListener("mouseenter", () => handleCellHover(r, c));
      cell.addEventListener("mouseleave", clearHoverPreview);
      cell.addEventListener("click", () => handleCellClick(r, c));

      boardEl.appendChild(cell);
      cellElements[r][c] = cell;
    }
  }

  // Thuật toán kiểm tra khối có thể đặt được ở bất kỳ vị trí nào trên bảng
  function canFitSomewhere(shape) {
    if (!shape) return false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (canPlace(shape, r, c)) return true;
      }
    }
    return false;
  }

  function getFittingShapes() {
    return SHAPES.filter((shape) => canFitSomewhere(shape));
  }

  // Thuật toán thông minh: Cố tình tính toán xuất hiện khối hỗ trợ để Bích Trâm không bao giờ bị bí!
  function refillTray() {
    selectedPieceIndex = null;
    currentTrayPieces = [];
    const emptyCount = getEmptyCellsCount();
    if (emptyCount === 0) return;

    const fitting = getFittingShapes();
    const singleShape =
      SHAPES.find((s) => s.id === "single") || SHAPES[SHAPES.length - 1];
    const available = fitting.length > 0 ? fitting : [singleShape];

    const smallShapes = available.filter(
      (s) => s.id === "single" || s.id.startsWith("domino"),
    );

    const countToSpawn = Math.min(3, Math.max(1, emptyCount));

    for (let i = 0; i < countToSpawn; i++) {
      let shape;
      // Khi bảng còn ít ô (<= 4 ô) hoặc ô cuối cùng: ưu tiên tạo khối 1x1 hoặc domino để ghép dễ dàng
      if (emptyCount <= 4 && smallShapes.length > 0) {
        shape = smallShapes[Math.floor(Math.random() * smallShapes.length)];
      } else if (i === 0) {
        // Khối đầu tiên 100% đặt được ngay
        shape = available[Math.floor(Math.random() * available.length)];
      } else {
        // Các khối còn lại cũng ưu tiên lấy trong danh sách đặt vừa
        shape = available[Math.floor(Math.random() * available.length)];
      }
      currentTrayPieces.push(JSON.parse(JSON.stringify(shape)));
    }

    renderTray();
  }

  refillTray();

  function createDragAvatar(piece) {
    const avatar = document.createElement("div");
    avatar.className = "bb-drag-avatar";
    const rows = piece.matrix.length;
    const cols = piece.matrix[0].length;
    avatar.style.gridTemplateRows = `repeat(${rows}, 48px)`;
    avatar.style.gridTemplateColumns = `repeat(${cols}, 48px)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const mini = document.createElement("div");
        if (piece.matrix[r][c] === 1) {
          mini.className = "bb-mini-cell";
          mini.style.background = piece.color;
        } else {
          mini.className = "bb-mini-cell empty";
        }
        avatar.appendChild(mini);
      }
    }
    document.body.appendChild(avatar);
    return avatar;
  }

  function getGridPosFromCoords(x, y, piece) {
    if (!piece || !boardEl) return null;
    const boardRect = boardEl.getBoundingClientRect();
    const margin = 26;
    if (
      x < boardRect.left - margin ||
      x > boardRect.right + margin ||
      y < boardRect.top - margin ||
      y > boardRect.bottom + margin
    ) {
      return null;
    }

    const cellW = boardRect.width / COLS;
    const cellH = boardRect.height / ROWS;
    const pieceRows = piece.matrix.length;
    const pieceCols = piece.matrix[0].length;

    // Căn chuẩn tọa độ đặt dựa theo tâm của khối
    const targetC = Math.round(
      (x - boardRect.left - (pieceCols * cellW) / 2) / cellW,
    );
    const targetR = Math.round(
      (y - boardRect.top - (pieceRows * cellH) / 2) / cellH,
    );

    if (
      targetR >= 0 &&
      targetR <= ROWS - pieceRows &&
      targetC >= 0 &&
      targetC <= COLS - pieceCols
    ) {
      return { r: targetR, c: targetC };
    }

    return null;
  }

  function renderTray() {
    trayEl.innerHTML = "";
    currentTrayPieces.forEach((piece, index) => {
      if (!piece) return;

      const pieceEl = document.createElement("div");
      pieceEl.className = "bb-piece";
      if (selectedPieceIndex === index) pieceEl.classList.add("selected");
      pieceEl.setAttribute("data-index", index);

      const rows = piece.matrix.length;
      const cols = piece.matrix[0].length;
      pieceEl.style.gridTemplateRows = `repeat(${rows}, 18px)`;
      pieceEl.style.gridTemplateColumns = `repeat(${cols}, 18px)`;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const mini = document.createElement("div");
          if (piece.matrix[r][c] === 1) {
            mini.className = "bb-mini-cell";
            mini.style.background = piece.color;
          } else {
            mini.className = "bb-mini-cell empty";
          }
          pieceEl.appendChild(mini);
        }
      }

      // Xử lý kéo thả (Drag & Drop) mượt mà bằng Pointer Events cho cả chuột & cảm ứng điện thoại
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let dragAvatar = null;
      let currentHover = null;

      pieceEl.addEventListener("pointerdown", (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        e.preventDefault();

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        currentHover = null;

        try {
          pieceEl.setPointerCapture(e.pointerId);
        } catch (err) {}

        pieceEl.classList.add("is-being-dragged");
        dragAvatar = createDragAvatar(piece);

        const isTouch = e.pointerType === "touch";
        const offsetY = isTouch ? -65 : -15;
        dragAvatar.style.left = `${e.clientX}px`;
        dragAvatar.style.top = `${e.clientY + offsetY}px`;

        triggerHaptic(15);
      });

      pieceEl.addEventListener("pointermove", (e) => {
        if (!isDragging || !dragAvatar) return;
        e.preventDefault();

        const isTouch = e.pointerType === "touch";
        const offsetY = isTouch ? -65 : -15;
        const targetX = e.clientX;
        const targetY = e.clientY + offsetY;

        dragAvatar.style.left = `${targetX}px`;
        dragAvatar.style.top = `${targetY}px`;

        const gridPos = getGridPosFromCoords(targetX, targetY, piece);
        if (gridPos) {
          currentHover = gridPos;
          handleCellHover(gridPos.r, gridPos.c, piece);
        } else {
          currentHover = null;
          clearHoverPreview();
        }
      });

      const finishDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;

        try {
          pieceEl.releasePointerCapture(e.pointerId);
        } catch (err) {}

        pieceEl.classList.remove("is-being-dragged");

        if (dragAvatar) {
          dragAvatar.remove();
          dragAvatar = null;
        }

        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);

        // Nếu di chuyển rất ngắn (< 10px): xem như chạm để chọn (Tap-to-select)
        if (dist < 10) {
          triggerHaptic(15);
          if (selectedPieceIndex === index) {
            selectedPieceIndex = null;
          } else {
            selectedPieceIndex = index;
            if (window.playChimeSound) window.playChimeSound("pop");
          }
          clearHoverPreview();
          renderTray();
          return;
        }

        // Nếu là thao tác kéo thả hoàn chỉnh (Drag & Drop)
        if (currentHover && canPlace(piece, currentHover.r, currentHover.c)) {
          placePiece(index, currentHover.r, currentHover.c);
        } else {
          clearHoverPreview();
          if (currentHover) {
            triggerHaptic([30, 30]);
            showToast(
              "Khối này không vừa vị trí đó rồi, Trâm thử đặt chỗ khác nhé!",
            );
          }
        }
        currentHover = null;
      };

      pieceEl.addEventListener("pointerup", finishDrag);
      pieceEl.addEventListener("pointercancel", finishDrag);

      trayEl.appendChild(pieceEl);
    });
  }

  function handleCellHover(startR, startC, pieceOverride = null) {
    clearHoverPreview();
    const piece =
      pieceOverride ||
      (selectedPieceIndex !== null
        ? currentTrayPieces[selectedPieceIndex]
        : null);
    if (!piece) return;

    const valid = canPlace(piece, startR, startC);

    for (let r = 0; r < piece.matrix.length; r++) {
      for (let c = 0; c < piece.matrix[r].length; c++) {
        if (piece.matrix[r][c] === 1) {
          const tr = startR + r;
          const tc = startC + c;
          if (
            tr >= 0 &&
            tr < ROWS &&
            tc >= 0 &&
            tc < COLS &&
            cellElements[tr] &&
            cellElements[tr][tc]
          ) {
            cellElements[tr][tc].classList.add(
              valid ? "hover-valid" : "hover-invalid",
            );
          }
        }
      }
    }
  }

  function clearHoverPreview() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (cellElements[r] && cellElements[r][c]) {
          cellElements[r][c].classList.remove("hover-valid", "hover-invalid");
        }
      }
    }
  }

  function canPlace(piece, startR, startC) {
    if (!piece) return false;
    for (let r = 0; r < piece.matrix.length; r++) {
      for (let c = 0; c < piece.matrix[r].length; c++) {
        if (piece.matrix[r][c] === 1) {
          const tr = startR + r;
          const tc = startC + c;
          if (tr < 0 || tr >= ROWS || tc < 0 || tc >= COLS) return false;
          if (boardState[tr][tc]) return false;
        }
      }
    }
    return true;
  }

  function placePiece(pIndex, startR, startC) {
    const piece = currentTrayPieces[pIndex];
    if (!piece || !canPlace(piece, startR, startC)) return false;

    // Đặt khối thành công vào bảng: tô màu kẹo ngọt và giữ bí mật bức ảnh
    for (let r = 0; r < piece.matrix.length; r++) {
      for (let c = 0; c < piece.matrix[r].length; c++) {
        if (piece.matrix[r][c] === 1) {
          const tr = startR + r;
          const tc = startC + c;
          boardState[tr][tc] = true;
          const cell = cellElements[tr][tc];
          cell.classList.add("filled");
          cell.style.background = piece.color;
        }
      }
    }

    clearHoverPreview();
    totalBlocksPlaced++;
    if (blocksPlacedEl) blocksPlacedEl.textContent = totalBlocksPlaced;

    triggerHaptic(30);
    if (window.playChimeSound) window.playChimeSound("pop");

    currentTrayPieces[pIndex] = null;
    selectedPieceIndex = null;

    const filledCount = getFilledCellsCount();
    if (filledCountEl) filledCountEl.textContent = filledCount;
    if (filledPercentEl) {
      filledPercentEl.textContent = `${Math.round((filledCount / TOTAL_CELLS) * 100)}%`;
    }

    if (currentTrayPieces.every((p) => p === null)) {
      if (filledCount < TOTAL_CELLS) {
        refillTray();
      }
    } else {
      // Tự động kiểm tra: Nếu các khối còn lại trên khay không có khối nào đặt vừa nữa
      // -> Hệ thống chủ động đổi ngay các khối mới vừa vặn để Bích Trâm không bao giờ bị bí!
      const anyRemainingPlayable = currentTrayPieces.some(
        (p) => p !== null && canFitSomewhere(p),
      );
      if (!anyRemainingPlayable && filledCount < TOTAL_CELLS) {
        refillTray();
      } else {
        renderTray();
      }
    }

    // CHỈ KHI LẮP FULL VỪA VẶN 12/12 Ô CHUẨN TỈ LỆ 3:4 ➜ BỨC ẢNH CÔNG CHÚA MỚI HOÀN THIỆN VÀ BỪNG SÁNG!
    if (filledCount === TOTAL_CELLS) {
      const boardFrame = document.getElementById("boardFrame");
      if (boardFrame) boardFrame.classList.add("puzzle-completed");

      setTimeout(() => {
        triggerHaptic([60, 100, 60, 100, 140]);
        if (window.playChimeSound) window.playChimeSound("win");
        launchVictoryConfetti();

        if (fullPhotoReveal) {
          fullPhotoReveal.classList.remove("hidden");
        }

        if (btnProceedToReward) {
          btnProceedToReward.classList.remove("hidden");
          btnProceedToReward.href = CONFIG.momoLixiUrl;
        }

        const btnReplayQuest = document.getElementById("btnReplayQuest");
        if (btnReplayQuest) {
          btnReplayQuest.classList.remove("hidden");
        }

        const questFinalWish = document.getElementById("questFinalWish");
        if (questFinalWish) {
          questFinalWish.classList.remove("hidden");
        }

        const dragHint = document.getElementById("dragHint");
        if (dragHint) dragHint.style.display = "none";

        const pieceTrayWrapper = document.getElementById("pieceTrayWrapper");
        if (pieceTrayWrapper) pieceTrayWrapper.style.display = "none";

        showToast(
          "Tadaaa! Bích Trâm đã ghép trọn vẹn bức tranh công chúa xinh đẹp nhất!",
        );

        // Hiện popup chúc mừng hoàn thành và dẫn thẳng qua hệ thống MoMo
        setTimeout(() => {
          showQuestConfirmModal({
            icon: "fa-gift",
            title: "Tuyệt đỉnh! Hoàn thành 3 thử thách! 👑",
            desc: "Phạm Thị Bích Trâm đã xuất sắc mở khóa toàn bộ bức tranh công chúa xinh đẹp nhất! Bấm mở phong bao Lì Xì MoMo và nhập mật mã bí mật của hai đứa mình nhận 50.000đ từ Anh yêu nhé! 💕",
            btnText: "Mở Bao Lì Xì MoMo Ngay",
            onConfirm: () => {
              triggerHaptic(30);
              if (typeof confetti === "function") {
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              }
              showToast("Đang mở phong bao Lì Xì MoMo của Bích Trâm...");
              window.open(CONFIG.momoLixiUrl, "_blank");
            },
          });
        }, 1200);
      }, 400);
    }

    return true;
  }

  function handleCellClick(startR, startC) {
    if (selectedPieceIndex === null || !currentTrayPieces[selectedPieceIndex]) {
      showToast("Nắm kéo hoặc chạm chọn một khối màu bên dưới trước nhé!");
      return;
    }

    const piece = currentTrayPieces[selectedPieceIndex];
    if (!canPlace(piece, startR, startC)) {
      triggerHaptic([30, 30]);
      showToast("Khối này không vừa vị trí đó rồi, Trâm thử đặt chỗ khác nhé!");
      return;
    }

    placePiece(selectedPieceIndex, startR, startC);
  }

  function getFilledCellsCount() {
    return boardState.flat().filter(Boolean).length;
  }

  function getEmptyCellsCount() {
    return TOTAL_CELLS - getFilledCellsCount();
  }

  if (btnProceedToReward) {
    btnProceedToReward.addEventListener("click", () => {
      triggerHaptic(30);
      if (typeof confetti === "function") {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      }
      showToast("Đang mở phong bao Lì Xì MoMo của Bích Trâm...");
    });
  }

  const btnReplayQuest = document.getElementById("btnReplayQuest");
  if (btnReplayQuest) {
    btnReplayQuest.addEventListener("click", () => {
      triggerHaptic(20);
      try {
        localStorage.removeItem("tram_2010_screen");
        localStorage.removeItem("tram_2010_quest");
      } catch (e) {}

      currentQuest = 1;
      document.querySelectorAll(".screen-section").forEach((s) => {
        s.classList.remove("active");
        s.style.display = "none";
      });

      const stepIntro = document.getElementById("stepIntro");
      if (stepIntro) {
        stepIntro.style.display = "block";
        setTimeout(() => stepIntro.classList.add("active"), 30);
      }

      showToast("Cùng xem lại hành trình tình yêu nhé!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// ==========================================================
// HỆ THỐNG GHI NHỚ VỊ TRÍ TRẠNG THÁI KHI TẢI LẠI TRANG
// ==========================================================
function saveAppState(screenId, questNum) {
  try {
    if (screenId) localStorage.setItem("tram_2010_screen", screenId);
    if (questNum !== undefined) {
      localStorage.setItem("tram_2010_quest", questNum.toString());
    }
  } catch (e) {
    console.warn("Storage not available", e);
  }
}

function clearAppState() {
  try {
    localStorage.removeItem("tram_2010_screen");
    localStorage.removeItem("tram_2010_quest");
  } catch (e) {
    console.warn("Storage not available", e);
  }
}

function restoreAppState() {
  try {
    const savedScreen = localStorage.getItem("tram_2010_screen");
    const savedQuestStr = localStorage.getItem("tram_2010_quest");
    const savedQuest = savedQuestStr ? parseInt(savedQuestStr, 10) : 1;

    if (!savedScreen || savedScreen === "stepIntro") {
      return;
    }

    const stepIntro = document.getElementById("stepIntro");
    const stepLetter = document.getElementById("stepLetter");
    const stepQuest = document.getElementById("stepQuest");

    [stepIntro, stepLetter, stepQuest].forEach((el) => {
      if (el) {
        el.classList.remove("active");
        el.style.display = "none";
      }
    });

    if (savedScreen === "stepLetter") {
      if (stepLetter) {
        stepLetter.style.display = "block";
        stepLetter.classList.add("active");
      }
    } else if (savedScreen === "stepQuest" || savedScreen === "stepReward") {
      if (stepQuest) {
        stepQuest.style.display = "block";
        stepQuest.classList.add("active");
      }
      currentQuest = savedQuest;
      for (let i = 1; i <= 3; i++) {
        const panel = document.getElementById(`quest${i}`);
        if (panel) {
          if (i === savedQuest) {
            panel.classList.add("active");
            panel.style.display = "block";
          } else {
            panel.classList.remove("active");
            panel.style.display = "none";
          }
        }
      }
      const progressFill = document.getElementById("progressFill");
      const questIndicator = document.getElementById("questIndicator");
      const titles = [
        "Thử thách 1 / 3: Câu đố tình yêu",
        "Thử thách 2 / 3: Hứng tim & hoa yêu thương",
        "Thử thách 3 / 3: Mảnh ghép tình yêu",
      ];
      if (progressFill) progressFill.style.width = `${(savedQuest / 3) * 100}%`;
      if (questIndicator) questIndicator.textContent = titles[savedQuest - 1];
    }
  } catch (e) {
    console.warn("Could not restore app state", e);
  }
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
