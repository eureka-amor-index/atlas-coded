(() => {
  const canvas = document.querySelector("#atlasField");
  const poster = document.querySelector(".poster");
  const shuffleButton = document.querySelector("#shuffleButton");
  const headline = document.querySelector("#headline");

  if (!poster) return;

  /*
    Ancient textbox injected by JS only.
    No index.html edit.
    No style.css edit.
  */
  function createAncientBox() {
    if (document.querySelector("#ancientBox")) return;

    const box = document.createElement("section");
    box.id = "ancientBox";
    box.innerHTML = `
      <label for="ancientText">ANCIENT ATLAS TRANSMISSION</label>
      <textarea id="ancientText" placeholder="write the cursed little signal here..."></textarea>
    `;

    Object.assign(box.style, {
      position: "absolute",
      left: "50%",
      bottom: "104px",
      zIndex: "20",
      width: "min(82%, 460px)",
      transform: "translateX(-50%) rotate(-1deg)",
      padding: "14px",
      border: "3px double #1b1208",
      borderRadius: "14px",
      background:
        "linear-gradient(135deg, rgba(244,214,127,.96), rgba(174,116,43,.94))",
      boxShadow:
        "0 0 0 4px rgba(0,0,0,.72), 10px 10px 0 rgba(0,0,0,.72), inset 0 0 34px rgba(65,31,0,.35)",
      fontFamily: "Georgia, 'Times New Roman', serif"
    });

    const label = box.querySelector("label");
    Object.assign(label.style, {
      display: "block",
      marginBottom: "8px",
      color: "#1b1208",
      fontSize: "11px",
      fontWeight: "900",
      letterSpacing: ".18em",
      textShadow: "1px 1px 0 rgba(255,255,255,.25)"
    });

    const textarea = box.querySelector("textarea");
    Object.assign(textarea.style, {
      width: "100%",
      minHeight: "112px",
      resize: "vertical",
      border: "2px solid #1b1208",
      borderRadius: "9px",
      outline: "none",
      padding: "12px",
      color: "#1b1208",
      background: "rgba(255,241,178,.72)",
      font: "18px/1.45 Georgia, 'Times New Roman', serif",
      boxShadow: "inset 0 0 18px rgba(68,31,0,.25)"
    });

    poster.appendChild(box);
  }

  createAncientBox();

  const lines = [
    ["CHAOS", "HAS NO", "GENDER"],
    ["SOFT", "STATIC", "RIOT"],
    ["ATLAS", "EATS THE", "MAP"],
    ["NOISE", "IS A", "SIGNAL"],
    ["VIBRA", "SIN", "PERMISO"],
    ["ANCIENT", "TEXT", "SIGNAL"]
  ];

  const prompts = [
    "the map is not the territory...",
    "write what the atlas refuses to remember...",
    "a signal from the little static gods...",
    "type the prophecy, bb...",
    "leave one sentence for the archive..."
  ];

  let activePalette = 0;

  const palettes = [
    ["#251f3e", "#7a33ff", "#ffd000", "#263f3f", "#b344ff"],
    ["#182a2d", "#9051ff", "#f9c916", "#473561", "#d8a82a"],
    ["#2b204d", "#6141e8", "#efcf42", "#233c34", "#a238ff"],
    ["#12131f", "#8f4cff", "#f5bd13", "#38504b", "#c479ff"]
  ];

  function setHeadline(words) {
    if (!headline) return;
    headline.innerHTML = words.map((word) => `<span>${word}</span>`).join("");
  }

  function shuffleVibe() {
    const ancientText = document.querySelector("#ancientText");

    const nextLine = lines[Math.floor(Math.random() * lines.length)];
    setHeadline(nextLine);

    activePalette = (activePalette + 1) % palettes.length;

    poster.style.setProperty(
      "--tilt",
      `${(Math.random() * 2.2 - 1.1).toFixed(2)}deg`
    );

    poster.classList.add("is-pulsing");
    shuffleButton?.classList.add("is-spinning");

    if (ancientText) {
      ancientText.placeholder =
        prompts[Math.floor(Math.random() * prompts.length)];
      ancientText.focus();
    }

    window.setTimeout(() => {
      poster.classList.remove("is-pulsing");
      shuffleButton?.classList.remove("is-spinning");
    }, 540);
  }

  shuffleButton?.addEventListener("click", shuffleVibe);

  /*
    Canvas background.
    Safe version: if canvas fails, the rest still works.
  */
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let t = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();

    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function withAlpha(hex, alpha) {
    const safeAlpha = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");

    return `${hex}${safeAlpha}`;
  }

  function blob(x, y, radius, color, alpha = 1) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, withAlpha(color, alpha));
    gradient.addColorStop(0.48, `${color}d9`);
    gradient.addColorStop(1, `${color}00`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function paint() {
    const palette = palettes[activePalette];

    t += 0.006;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 14; i++) {
      const phase = t + i * 0.72;
      const x = w * (0.5 + 0.48 * Math.sin(phase * 0.9 + i));
      const y = h * (0.5 + 0.47 * Math.cos(phase * 1.1 + i * 1.7));
      const r = Math.min(w, h) * (0.18 + 0.08 * Math.sin(phase * 1.6));
      const color = palette[(i % (palette.length - 1)) + 1];

      blob(x, y, r, color, 0.92);
    }

    ctx.globalCompositeOperation = "multiply";

    for (let i = 0; i < 9; i++) {
      const phase = t * 0.8 + i * 1.13;
      const x = w * (0.5 + 0.54 * Math.cos(phase));
      const y = h * (0.5 + 0.54 * Math.sin(phase * 1.2));

      blob(x, y, Math.min(w, h) * 0.2, "#192625", 0.52);
    }

    requestAnimationFrame(paint);
  }

  window.addEventListener("resize", resize);

  resize();
  paint();
})();


// ─────────────────────────────
// ATLAS.EXE // MINIMIZE MODULE
// lets the orb collapse into a tiny floating node
// while preserving the whole atmosphere behind it
// ─────────────────────────────

const voiceUI = document.querySelector('.copy');

// create button
const miniBtn = document.createElement('button');
miniBtn.innerHTML = '—';
miniBtn.className = 'atlas-minimize';

// create restore button
const restoreBtn = document.createElement('button');
restoreBtn.innerHTML = '◉';
restoreBtn.className = 'atlas-restore';

document.body.appendChild(miniBtn);
document.body.appendChild(restoreBtn);

// state
let minimized = false;

// minimize
miniBtn.addEventListener('click', () => {
  minimized = true;

  voiceUI.classList.add('atlas-hidden');

  restoreBtn.classList.add('active');
});

// restore
restoreBtn.addEventListener('click', () => {
  minimized = false;

  voiceUI.classList.remove('atlas-hidden');

  restoreBtn.classList.remove('active');
});
