/**
 * ==========================================================
 * CẤU HÌNH THÔNG TIN 20/10 (BẠN CÓ THỂ CHỈNH SỬA Ở ĐÂY)
 * ==========================================================
 */
const CONFIG = {
  // Ngày bắt đầu yêu nhau (Định dạng: YYYY-MM-DD hoặc YYYY-MM-DDTHH:mm:ss)
  // Bạn có thể đổi lại ngày chính xác của 2 bạn nhé:
  startDate: "2024-02-14T00:00:00",

  // Thông tin nhận lì xì 20/10 mặc định:
  recipient: {
    bankId: "MB",               // Mã ngân hàng: MB, VCB, TCB, ACB, VPB, TPB, BIDV, CTG,...
    bankName: "MB Bank",        // Tên hiển thị
    accountNo: "0388888888",    // Số tài khoản của bạn gái (hoặc của bạn để quét)
    accountName: "EM BE DANG YEU", // Tên chủ tài khoản (viết hoa không dấu)
    amount: 201020,             // Số tiền lì xì ý nghĩa: 201.020đ (hoặc đổi thành 2010200 = 2.010.200đ)
    memo: "Chuc mung 20-10 em yeu" // Nội dung chuyển khoản
  },

  // Link nhạc nền tình yêu lãng mạn (mp3 trực tuyến nhẹ nhàng)
  bgmUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_evening_crickets.ogg" 
};

// ==========================================================
// TRẠNG THÁI ỨNG DỤNG & CÁC PHẦN TỬ DOM
// ==========================================================
let currentQuest = 1;
const totalQuests = 3;
let audioContext = null;
let isMusicPlaying = false;
let bgMusicAudio = null;

document.addEventListener("DOMContentLoaded", () => {
  initPetalAnimation();
  initCountdownTimer();
  initAudio();
  initEnvelopeInteraction();
  initQuestFlow();
  initRunawayButton();
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

  const petalsCount = Math.min(35, Math.floor(width / 20));
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 1.5 + 0.8;
      this.speedX = Math.sin(Math.random() * Math.PI) * 1.2;
      this.angle = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 1.8;
      this.opacity = Math.random() * 0.5 + 0.4;
      this.color = Math.random() > 0.4 ? "#ff4d79" : "#ff80a6";
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.015) + this.speedX * 0.3;
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
      ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
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
// 2. ĐẾM NGÀY YÊU NHAU (LOVE COUNTDOWN)
// ==========================================================
function initCountdownTimer() {
  const daysEl = document.getElementById("daysCount");
  const hoursEl = document.getElementById("hoursCount");
  const minutesEl = document.getElementById("minutesCount");
  const secondsEl = document.getElementById("secondsCount");

  const start = new Date(CONFIG.startDate).getTime();

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
// 3. ÂM THANH & HIỆU ỨNG TƯƠNG TÁC
// ==========================================================
function initAudio() {
  const btnMusic = document.getElementById("btnMusic");
  const icon = btnMusic ? btnMusic.querySelector(".spin-record") : null;

  // Sử dụng Web Audio API để phát âm thanh chuông mừng vui tai
  window.playChimeSound = function (type = "success") {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "win") {
        // Hợp âm chiến thắng bùng nổ
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
    } catch (e) {
      // Bỏ qua nếu trình duyệt chặn audio context
    }
  };

  // Tạo thẻ audio cho nhạc nền
  bgMusicAudio = new Audio();
  bgMusicAudio.src = "https://cdn.pixabay.com/download/audio/2022/05/16/audio_c976939433.mp3?filename=romantic-love-story-112196.mp3";
  bgMusicAudio.loop = true;
  bgMusicAudio.volume = 0.5;

  if (btnMusic) {
    btnMusic.addEventListener("click", () => {
      if (isMusicPlaying) {
        bgMusicAudio.pause();
        isMusicPlaying = false;
        icon?.classList.add("paused");
      } else {
        bgMusicAudio.play().then(() => {
          isMusicPlaying = true;
          icon?.classList.remove("paused");
        }).catch(() => {
          showToast("Chạm vào màn hình để bắt đầu nghe nhạc nhé!");
        });
      }
    });
  }

  // Tự động phát nhạc khi chạm lần đầu trên điện thoại
  const startMusicOnFirstTouch = () => {
    if (!isMusicPlaying && bgMusicAudio) {
      bgMusicAudio.play().then(() => {
        isMusicPlaying = true;
        icon?.classList.remove("paused");
      }).catch(() => {});
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

      // Bắn chút pháo hoa giấy nhỏ
      if (typeof confetti === "function") {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
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
    }, 400);
  }
}

// ==========================================================
// 5. NÚT TROLL CHẠY TRỐN (KHI CHỌN ĐÁP ÁN SAI)
// ==========================================================
function initRunawayButton() {
  const runawayBtn = document.getElementById("runawayBtn");
  if (!runawayBtn) return;

  function moveButton(e) {
    e.preventDefault();
    const container = runawayBtn.parentElement;
    const rect = container.getBoundingClientRect();

    const maxX = rect.width - runawayBtn.offsetWidth - 20;
    const maxY = 180;

    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));

    runawayBtn.style.position = "absolute";
    runawayBtn.style.left = `${randomX}px`;
    runawayBtn.style.top = `${randomY}px`;
    runawayBtn.style.zIndex = "10";

    showToast("Ối dồi ôi! Nút này biết chạy trốn rồi, đừng bấm nha 😜");
  }

  runawayBtn.addEventListener("mouseover", moveButton);
  runawayBtn.addEventListener("touchstart", moveButton);
  runawayBtn.addEventListener("click", moveButton);
}

// ==========================================================
// 6. TIẾN TRÌNH MINIGAME THỬ THÁCH (STAGE 3)
// ==========================================================
function initQuestFlow() {
  const stepQuest = document.getElementById("stepQuest");
  const stepReward = document.getElementById("stepReward");
  const progressFill = document.getElementById("progressFill");
  const questIndicator = document.getElementById("questIndicator");

  // Vòng 1 & 2: Chọn đáp án đúng
  const correctButtons = document.querySelectorAll(".correct-opt");
  correctButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const feedback = btn.getAttribute("data-feedback") || "Chính xác luôn!";
      showToast(feedback);
      if (window.playChimeSound) window.playChimeSound("success");

      // Chuyển sang câu hỏi kế tiếp
      nextQuest();
    });
  });

  const wrongButtons = document.querySelectorAll(".wrong-opt");
  wrongButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const feedback = btn.getAttribute("data-feedback") || "Sai rồi nha!";
      showToast(feedback);
      btn.style.transform = "translateX(6px)";
      setTimeout(() => (btn.style.transform = "translateX(-6px)"), 100);
      setTimeout(() => (btn.style.transform = "translateX(0)"), 200);
    });
  });

  // Vòng 3: Mở hộp quà bí mật
  const giftBoxes = document.querySelectorAll(".gift-box-item");
  giftBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      box.style.transform = "scale(1.2) rotate(8deg)";
      if (window.playChimeSound) window.playChimeSound("win");

      // Bắn pháo hoa rực rỡ ăn mừng!
      launchVictoryConfetti();

      showToast("🎁 Bùm! Chúc mừng em đã nhận được Bao Lì Xì 20/10!");

      setTimeout(() => {
        switchScreen(stepQuest, stepReward);
        updateVietQRDisplay();
      }, 1200);
    });
  });

  function nextQuest() {
    const currentPanel = document.getElementById(`quest${currentQuest}`);
    currentQuest++;

    if (currentQuest <= totalQuests) {
      const nextPanel = document.getElementById(`quest${currentQuest}`);
      if (progressFill) {
        progressFill.style.width = `${(currentQuest / totalQuests) * 100}%`;
      }
      if (questIndicator) {
        questIndicator.textContent = `Thử thách ${currentQuest} / ${totalQuests}`;
      }

      if (currentPanel) currentPanel.classList.remove("active");
      setTimeout(() => {
        if (nextPanel) nextPanel.classList.add("active");
      }, 250);
    }
  }

  // Nút xem lại từ đầu
  const btnReplay = document.getElementById("btnReplay");
  if (btnReplay) {
    btnReplay.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

// Bắn pháo hoa hoành tráng khi chiến thắng
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

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
}

// ==========================================================
// 7. TỰ ĐỘNG TẠO MÃ VIETQR CHUẨN NAPAS247
// ==========================================================
function initVietQR() {
  const vietQrImg = document.getElementById("vietQrImg");
  const qrLoading = document.getElementById("qrLoading");
  const btnCustomAccount = document.getElementById("btnCustomAccount");
  const customBankForm = document.getElementById("customBankForm");
  const btnGenerateCustomQR = document.getElementById("btnGenerateCustomQR");

  // Nút sao chép STK
  const displayAccountNo = document.getElementById("displayAccountNo");
  if (displayAccountNo) {
    displayAccountNo.addEventListener("click", () => {
      const textToCopy = CONFIG.recipient.accountNo;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Đã sao chép số tài khoản vào bộ nhớ tạm!");
      }).catch(() => {
        showToast(`Số tài khoản: ${textToCopy}`);
      });
    });
  }

  // Nút bật/tắt form nhập STK khác
  if (btnCustomAccount && customBankForm) {
    btnCustomAccount.addEventListener("click", () => {
      customBankForm.classList.toggle("open");
    });
  }

  // Cập nhật khi bạn gái nhập STK mới
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
      CONFIG.recipient.bankName = bankSelect.options[bankSelect.selectedIndex].text;
      CONFIG.recipient.accountNo = accountInput.value.trim();
      CONFIG.recipient.accountName = (nameInput.value.trim() || "EM BE").toUpperCase();

      updateVietQRDisplay();
      customBankForm.classList.remove("open");
      showToast("Đã cập nhật mã VietQR theo số tài khoản mới!");
    });
  }

  // Nút gửi tin nhắn Zalo đòi quà
  const btnClaimZalo = document.getElementById("btnClaimZalo");
  if (btnClaimZalo) {
    btnClaimZalo.addEventListener("click", () => {
      const message = `Anh yêu ơi! Em vừa vượt qua thử thách 20/10 trên website rồi nè ❤️ Mau ting ting lì xì ${CONFIG.recipient.amount.toLocaleString()}đ vào STK ${CONFIG.recipient.accountNo} (${CONFIG.recipient.bankName}) cho em nhé! Yêu anh nhiều 💕`;
      
      navigator.clipboard.writeText(message).then(() => {
        showToast("Đã chép lời nhắn đòi quà! Mở Zalo/Messenger gửi cho Anh nhé!");
      }).catch(() => {});

      // Mở ứng dụng Zalo hoặc chia sẻ
      setTimeout(() => {
        window.open(`https://zalo.me`, "_blank");
      }, 700);
    });
  }
}

function updateVietQRDisplay() {
  const vietQrImg = document.getElementById("vietQrImg");
  const qrLoading = document.getElementById("qrLoading");
  const displayBankName = document.getElementById("displayBankName");
  const displayAccountNo = document.getElementById("displayAccountNo");
  const displayAccountName = document.getElementById("displayAccountName");
  const displayMemo = document.getElementById("displayMemo");
  const moneyAmount = document.getElementById("moneyAmount");

  if (displayBankName) displayBankName.textContent = CONFIG.recipient.bankName;
  if (displayAccountNo) displayAccountNo.innerHTML = `${CONFIG.recipient.accountNo} <i class="fa-regular fa-copy"></i>`;
  if (displayAccountName) displayAccountName.textContent = CONFIG.recipient.accountName;
  if (displayMemo) displayMemo.textContent = CONFIG.recipient.memo;
  if (moneyAmount) moneyAmount.textContent = `${CONFIG.recipient.amount.toLocaleString("vi-VN")} VNĐ`;

  if (qrLoading) qrLoading.classList.remove("hidden");

  // Tạo URL QuickLink VietQR chuẩn theo ngân hàng, STK, số tiền và nội dung
  const encodedMemo = encodeURIComponent(CONFIG.recipient.memo);
  const encodedName = encodeURIComponent(CONFIG.recipient.accountName);
  const qrUrl = `https://img.vietqr.io/image/${CONFIG.recipient.bankId}-${CONFIG.recipient.accountNo}-compact2.jpg?amount=${CONFIG.recipient.amount}&addInfo=${encodedMemo}&accountName=${encodedName}`;

  if (vietQrImg) {
    vietQrImg.onload = () => {
      if (qrLoading) qrLoading.classList.add("hidden");
    };
    vietQrImg.onerror = () => {
      if (qrLoading) qrLoading.innerHTML = "<span>Mã QR sẵn sàng! Vui lòng kiểm tra lại STK.</span>";
    };
    vietQrImg.src = qrUrl;
  }
}

// ==========================================================
// 8. POPUP LẤY MÃ QR CỦA WEBSITE ĐỂ IN LÊN THIỆP GỬI BẠN GÁI
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
        width: 180,
        height: 180,
        colorDark: "#2c0e22",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
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
