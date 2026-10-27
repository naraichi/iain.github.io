/**
 * CYBERPUNK HUD INTERACTION SUITE
 * Developer: Indra Gunawan (@naraichi)
 * Institution: IAIN Kerinci - FTIK / MTK
 */

document.addEventListener("DOMContentLoaded", () => {
  initMatrixCanvas();
  initTerminalCLI();
  initThemeSwitcher();
  initSnakeFallback();
  initAudioFeedback();
  initSystemClock();
  initCopyButtons();
});

/* --------------------------------------------------------------------------
   1. Matrix Digital Rain Canvas
   -------------------------------------------------------------------------- */
let matrixAnimationId = null;
let isMatrixEnabled = true;

function initMatrixCanvas() {
  const canvas = document.getElementById("matrix-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initDrops();
  });

  const chars = "0101010101ABCDEFINDRAIAINKERINCIMTKFTIKAGENTOMP";
  const charArray = chars.split("");
  const fontSize = 14;
  let columns = Math.floor(width / fontSize);
  let drops = [];

  function initDrops() {
    columns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
  }
  initDrops();

  function draw() {
    if (!isMatrixEnabled) return;

    ctx.fillStyle = "rgba(7, 10, 15, 0.08)";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px "Fira Code", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Glow effect for lead character
      if (Math.random() > 0.85) {
        ctx.fillStyle = "#00f0ff";
      } else {
        ctx.fillStyle = "#00ff66";
      }

      ctx.fillText(text, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    matrixAnimationId = requestAnimationFrame(draw);
  }

  draw();

  // Matrix toggle button
  const toggleBtn = document.getElementById("toggle-matrix");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isMatrixEnabled = !isMatrixEnabled;
      toggleBtn.classList.toggle("active", isMatrixEnabled);
      toggleBtn.innerHTML = isMatrixEnabled
        ? `<span>⚡</span> Matrix: ON`
        : `<span>⚡</span> Matrix: OFF`;
      if (isMatrixEnabled) {
        draw();
        showToast("Matrix visual stream: ENABLED");
      } else {
        ctx.clearRect(0, 0, width, height);
        cancelAnimationFrame(matrixAnimationId);
        showToast("Matrix visual stream: PAUSED");
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. Interactive Terminal CLI
   -------------------------------------------------------------------------- */
function initTerminalCLI() {
  const cliForm = document.getElementById("cli-form");
  const cliInput = document.getElementById("cli-input");
  const cliHistory = document.getElementById("cli-history");
  const chips = document.querySelectorAll(".cli-chip");

  if (!cliForm || !cliInput) return;

  const commands = {
    help: `[SYSTEM AVAILABLE DIRECTIVES]
  whoami       - Display identity specification
  profile      - Render full JSON profile data
  skills       - Display tech stack competencies
  projects     - List flagship applications (E-Office, E-Shopping, AI)
  stats        - Jump to GitHub activity analytics
  contact      - Display transmission coordinates
  clear        - Flush terminal buffer
  date         - Print synchronized WIB system timestamp
  matrix       - Toggle background matrix stream`,

    whoami: `INDRA GUNAWAN [@naraichi]
Role      : Software Developer & Computational Researcher
Affiliation: IAIN Kerinci (FTIK / Tadris Matematika)
Status    : Actively architecting AI Agent workflows & web platforms`,

    profile: `{
  "developer": "Indra Gunawan",
  "username": "naraichi",
  "institution": "IAIN Kerinci",
  "faculty": "FTIK",
  "department": "Tadris Matematika (MTK)",
  "research_focus": ["AI Agent", "Antigravity", "OMP", "Fullstack Systems"],
  "flagship_projects": ["E-Office", "E-Shopping"],
  "terminal_state": "CONNECTED"
}`,

    skills: `[PRIMARY TECH STACK]
- Languages : Python, JavaScript, TypeScript, PHP, SQL, Bash
- Frameworks: React, Next.js, Node.js, Express, Laravel, Tailwind CSS
- Data & Ops: MySQL, PostgreSQL, Git, GitHub Actions, Docker, Linux
- AI & Next : AI Agent, Antigravity, OMP, Autonomous Reasoning Systems`,

    projects: `[FLAGSHIP INITIATIVES]
1. E-Office    : Campus Document Workflow & Digital Disposition Management
2. E-Shopping  : High-Performance E-Commerce & Inventory Logistics Engine
3. AI Agent    : Multi-Agent Task Orchestration & Antigravity Exploration`,

    contact: `[COMMUNICATION FREQUENCIES]
GitHub   : https://github.com/naraichi
Email    : indra.gunawan@example.com (or via contact form below)
LinkedIn : https://linkedin.com/in/naraichi
Telegram : https://t.me/naraichi`,

    stats: () => {
      const statsSection = document.getElementById("stats");
      if (statsSection) statsSection.scrollIntoView({ behavior: "smooth" });
      return "Navigating to GitHub Analytics Matrix...";
    },

    date: () => {
      const now = new Date();
      return `Current System Time: ${now.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      })} WIB`;
    },

    matrix: () => {
      const toggleBtn = document.getElementById("toggle-matrix");
      if (toggleBtn) toggleBtn.click();
      return `Toggled matrix stream state.`;
    },

    clear: () => {
      if (cliHistory) cliHistory.innerHTML = "";
      return "";
    },
  };

  function executeCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    playTerminalBeep();

    // Append user input line
    const userLine = document.createElement("div");
    userLine.innerHTML = `<span class="terminal-prompt">naraichi@iain-kerinci:~$</span> <span class="terminal-command">${escapeHtml(
      cmdRaw
    )}</span>`;
    cliHistory.appendChild(userLine);

    // Resolve output
    let result = "";
    if (commands[cmd]) {
      result =
        typeof commands[cmd] === "function" ? commands[cmd]() : commands[cmd];
    } else {
      result = `bash: command not found: ${escapeHtml(
        cmd
      )}. Type 'help' for directory directives.`;
    }

    if (result) {
      const outBlock = document.createElement("pre");
      outBlock.className = "terminal-output";
      outBlock.textContent = result;
      cliHistory.appendChild(outBlock);
    }

    cliInput.value = "";
    cliInput.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  cliForm.addEventListener("submit", (e) => {
    e.preventDefault();
    executeCommand(cliInput.value);
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const cmd = chip.getAttribute("data-cmd");
      cliInput.value = cmd;
      executeCommand(cmd);
    });
  });
}

/* --------------------------------------------------------------------------
   3. GitHub Stats Theme Switcher (tokyonight, radical, dracula, cyberpunk)
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll(".theme-btn");
  const statsImg = document.getElementById("github-stats-img");
  const langsImg = document.getElementById("github-langs-img");
  const streakImg = document.getElementById("github-streak-img");

  if (!themeBtns.length || !statsImg) return;

  const themes = {
    tokyonight: {
      stats:
        "https://github-readme-stats.vercel.app/api?username=naraichi&show_icons=true&theme=tokyonight&hide_border=false&border_color=00f0ff&bg_color=0c1017&title_color=00f0ff&text_color=e6edf3&icon_color=00ff66",
      langs:
        "https://github-readme-stats.vercel.app/api/top-langs/?username=naraichi&layout=compact&theme=tokyonight&hide_border=false&border_color=00f0ff&bg_color=0c1017&title_color=00f0ff&text_color=e6edf3",
      streak:
        "https://github-readme-streak-stats.herokuapp.com/?user=naraichi&theme=tokyonight&border=00f0ff&background=0c1017&ring=00f0ff&fire=00ff66&currStreakLabel=00ff66",
    },
    radical: {
      stats:
        "https://github-readme-stats.vercel.app/api?username=naraichi&show_icons=true&theme=radical&hide_border=false&border_color=fe428e&bg_color=141321&title_color=fe428e&text_color=a9fef7&icon_color=f8d847",
      langs:
        "https://github-readme-stats.vercel.app/api/top-langs/?username=naraichi&layout=compact&theme=radical&hide_border=false&border_color=fe428e&bg_color=141321&title_color=fe428e&text_color=a9fef7",
      streak:
        "https://github-readme-streak-stats.herokuapp.com/?user=naraichi&theme=radical&border=fe428e&background=141321&ring=fe428e&fire=f8d847&currStreakLabel=f8d847",
    },
    dracula: {
      stats:
        "https://github-readme-stats.vercel.app/api?username=naraichi&show_icons=true&theme=dracula&hide_border=false&border_color=bd93f9&bg_color=282a36&title_color=ff79c6&text_color=f8f8f2&icon_color=50fa7b",
      langs:
        "https://github-readme-stats.vercel.app/api/top-langs/?username=naraichi&layout=compact&theme=dracula&hide_border=false&border_color=bd93f9&bg_color=282a36&title_color=ff79c6&text_color=f8f8f2",
      streak:
        "https://github-readme-streak-stats.herokuapp.com/?user=naraichi&theme=dracula&border=bd93f9&background=282a36&ring=ff79c6&fire=50fa7b&currStreakLabel=50fa7b",
    },
    cyberpunk: {
      stats:
        "https://github-readme-stats.vercel.app/api?username=naraichi&show_icons=true&theme=dark&hide_border=false&border_color=00ff66&bg_color=05070a&title_color=00ff66&text_color=00f0ff&icon_color=00f0ff",
      langs:
        "https://github-readme-stats.vercel.app/api/top-langs/?username=naraichi&layout=compact&theme=dark&hide_border=false&border_color=00ff66&bg_color=05070a&title_color=00ff66&text_color=00f0ff",
      streak:
        "https://github-readme-streak-stats.herokuapp.com/?user=naraichi&theme=dark&border=00ff66&background=05070a&ring=00ff66&fire=00f0ff&currStreakLabel=00f0ff",
    },
  };

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const themeKey = btn.getAttribute("data-theme");
      if (!themes[themeKey]) return;

      playTerminalBeep();
      themeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Apply new URLs
      if (statsImg) statsImg.src = themes[themeKey].stats;
      if (langsImg) langsImg.src = themes[themeKey].langs;
      if (streakImg) streakImg.src = themes[themeKey].streak;

      showToast(`Stats HUD theme synchronized: [${themeKey.toUpperCase()}]`);
    });
  });
}

/* --------------------------------------------------------------------------
   4. Snake Contribution Fallback Canvas
   -------------------------------------------------------------------------- */
function initSnakeFallback() {
  const snakeImg = document.getElementById("snake-svg-img");
  const fallbackContainer = document.getElementById("snake-fallback-canvas-wrapper");

  if (!snakeImg || !fallbackContainer) return;

  snakeImg.addEventListener("error", () => {
    // If output branch SVG is not yet pushed or rate-limited, switch to animated high-tech canvas
    snakeImg.style.display = "none";
    fallbackContainer.style.display = "block";
    renderAnimatedContributionSnake();
  });
}

function renderAnimatedContributionSnake() {
  const container = document.getElementById("snake-fallback-canvas-wrapper");
  if (!container || container.querySelector("canvas")) return;

  const canvas = document.createElement("canvas");
  canvas.width = 820;
  canvas.height = 160;
  canvas.style.maxWidth = "100%";
  canvas.style.height = "auto";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const cols = 52;
  const rows = 7;
  const cellSize = 12;
  const gap = 3;
  const offsetX = 20;
  const offsetY = 25;

  // Generate deterministic grid
  const grid = [];
  for (let c = 0; c < cols; c++) {
    grid[c] = [];
    for (let r = 0; r < rows; r++) {
      const rand = Math.sin(c * 0.4 + r * 0.7);
      if (rand > 0.6) grid[c][r] = 4;
      else if (rand > 0.2) grid[c][r] = 3;
      else if (rand > -0.2) grid[c][r] = 2;
      else if (rand > -0.6) grid[c][r] = 1;
      else grid[c][r] = 0;
    }
  }

  const dotColors = ["#161b22", "#0d4429", "#006d32", "#26a641", "#00ffcc"];

  // Snake coordinates
  let snake = [
    { x: 10, y: 3 },
    { x: 9, y: 3 },
    { x: 8, y: 3 },
    { x: 7, y: 3 },
  ];
  let dir = { x: 1, y: 0 };
  let tick = 0;

  function loop() {
    tick++;
    if (tick % 7 === 0) {
      // Move snake
      const head = { ...snake[0] };
      // Random direction change sometimes
      if (Math.random() > 0.65) {
        const turns = [
          { x: 1, y: 0 },
          { x: -1, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: -1 },
        ];
        const valid = turns.filter(
          (t) => !(t.x === -dir.x && t.y === -dir.y)
        );
        dir = valid[Math.floor(Math.random() * valid.length)];
      }

      head.x = (head.x + dir.x + cols) % cols;
      head.y = (head.y + dir.y + rows) % rows;

      snake.unshift(head);
      snake.pop();
    }

    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const val = grid[c][r];
        ctx.fillStyle = dotColors[val];
        ctx.beginPath();
        ctx.roundRect(
          offsetX + c * (cellSize + gap),
          offsetY + r * (cellSize + gap),
          cellSize,
          cellSize,
          2
        );
        ctx.fill();
      }
    }

    // Draw snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#00f0ff" : "#00ff66";
      ctx.shadowColor = i === 0 ? "#00f0ff" : "#00ff66";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(
        offsetX + seg.x * (cellSize + gap),
        offsetY + seg.y * (cellSize + gap),
        cellSize,
        cellSize,
        3
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/* --------------------------------------------------------------------------
   5. Audio Feedback Synthesizer (Zero external files, Web Audio API)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let isAudioEnabled = false;

function initAudioFeedback() {
  const audioToggle = document.getElementById("toggle-audio");
  if (!audioToggle) return;

  audioToggle.addEventListener("click", () => {
    isAudioEnabled = !isAudioEnabled;
    audioToggle.classList.toggle("active", isAudioEnabled);
    audioToggle.innerHTML = isAudioEnabled
      ? `<span>🔊</span> Sound: ON`
      : `<span>🔇</span> Sound: OFF`;

    if (isAudioEnabled) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      playTerminalBeep(880, 0.08);
      showToast("Audio feedback protocol: ONLINE");
    } else {
      showToast("Audio feedback protocol: MUTED");
    }
  });
}

function playTerminalBeep(freq = 600, duration = 0.05) {
  if (!isAudioEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + duration
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context safely ignored if blocked by browser policy
  }
}

/* --------------------------------------------------------------------------
   6. System Live Clock & Uptime
   -------------------------------------------------------------------------- */
function initSystemClock() {
  const clockEl = document.getElementById("system-clock");
  const uptimeEl = document.getElementById("system-uptime");

  const startTime = Date.now();

  function update() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = `${now.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour12: false,
      })} WIB`;
    }

    if (uptimeEl) {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const mins = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
      const secs = String(elapsedSec % 60).padStart(2, "0");
      uptimeEl.textContent = `00:${mins}:${secs}`;
    }
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   7. Copy to Clipboard & Toast UI
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        playTerminalBeep(1200, 0.1);
        showToast(`Copied to clipboard: "${text}"`);
      });
    });
  });

  // Transmission form handler
  const form = document.getElementById("transmission-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("transmission-msg");
      if (!input || !input.value.trim()) return;

      const subject = encodeURIComponent("Transmisi dari Profile naraichi");
      const body = encodeURIComponent(input.value.trim());
      playTerminalBeep(990, 0.12);
      showToast("Preparing dispatch via local email client...");
      
      setTimeout(() => {
        window.location.href = `mailto:indra.gunawan@iainkerinci.ac.id?subject=${subject}&body=${body}`;
        input.value = "";
      }, 500);
    });
  }
}

let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById("cyber-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cyber-toast";
    toast.className = "cyber-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = `[!] ${message}`;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
