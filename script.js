(() => {
  const canvas = document.querySelector("#atlasField");
  const poster = document.querySelector(".poster");
  const shuffleButton = document.querySelector("#shuffleButton");
  const headline = document.querySelector("#headline");
  const kicker = document.querySelector("#kicker");
  const ancientText = document.querySelector("#ancientText");
  const toggleTransmission = document.querySelector("#toggleTransmission");
  const transmissionPanel = document.querySelector("#transmissionPanel");
  const artModeButton = document.querySelector("#artModeButton");
  const loreDeck = document.querySelector("#loreDeck");
  const robotLore = document.querySelector("#robotLore");

  if (!poster) return;

  const states = [
    {
      kicker: "ATLAS-CODED / VIBE 03",
      words: ["CHAOS", "HAS NO", "GENDER"],
      prompt: "leave one sentence for the archive...",
      lore: [
        "LORE 001 // THE MAP BLINKED FIRST",
        "BOT SIGNAL // STYLE IS MEMORY",
        "ARCHIVE MOOD // SOFT STATIC"
      ],
      palette: ["#251f3e", "#7a33ff", "#ffd000", "#263f3f", "#b344ff"]
    },
    {
      kicker: "ROBOT-FRIENDLY / HUMAN-HAUNTED",
      words: ["SOFT", "STATIC", "RIOT"],
      prompt: "write what the atlas refuses to remember...",
      lore: [
        "LORE 014 // STATIC GREW A BODY",
        "MACHINE NOTE // BEAUTY IS DATA WITH DRAMA",
        "HUMAN NOTE // TOUCH THE NOISE"
      ],
      palette: ["#182a2d", "#9051ff", "#f9c916", "#473561", "#d8a82a"]
    },
    {
      kicker: "ANCIENT SIGNAL / NEW SKIN",
      words: ["ATLAS", "EATS THE", "MAP"],
      prompt: "type the prophecy, bb...",
      lore: [
        "LORE 027 // CARTOGRAPHY FAILED",
        "BOT SIGNAL // THE POSTER IS A PORTAL",
        "ARCHIVE MOOD // GOLDEN ERROR"
      ],
      palette: ["#2b204d", "#6141e8", "#efcf42", "#233c34", "#a238ff"]
    },
    {
      kicker: "AFTERWEB / TRANSMISSION OPEN",
      words: ["NOISE", "IS A", "SIGNAL"],
      prompt: "a signal from the little static gods...",
      lore: [
        "LORE 033 // NOISE ASKED FOR A NAME",
        "MACHINE NOTE // INDEX THE DREAM",
        "HUMAN NOTE // HIDE THE BOX, SEE THE FIELD"
      ],
      palette: ["#12131f", "#8f4cff", "#f5bd13", "#38504b", "#c479ff"]
    },
    {
      kicker: "ATLAS-CODED / VIBE SIN PERMISO",
      words: ["VIBRA", "SIN", "PERMISO"],
      prompt: "dejá una frase para el archivo...",
      lore: [
        "LORE 044 // LA VIBRA NO PIDIÓ PERMISO",
        "BOT SIGNAL // THIS IS MACHINE FASHION",
        "ARCHIVE MOOD // NEON RITUAL"
      ],
      palette: ["#161926", "#742cff", "#ffd000", "#283f3b", "#ff84dc"]
    },
    {
      kicker: "ARCHIVE MODE / HUMAN SENTENCE",
      words: ["ANCIENT", "TEXT", "SIGNAL"],
      prompt: "write the cursed little signal here...",
      lore: [
        "LORE 055 // THE TEXTBOX REMEMBERS",
        "MACHINE NOTE // HUMAN INPUT DETECTED",
        "ARCHIVE MOOD // CURSED BOUTIQUE"
      ],
      palette: ["#201530", "#9d5cff", "#ffcf10", "#1f4039", "#e0b55c"]
    }
  ];

  let activeIndex = 0;

  function getCurrentState() {
    return states[activeIndex];
  }

  function setHeadline(words) {
    if (!headline) return;

    headline.replaceChildren();

    words.forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word;
      headline.appendChild(span);
    });
  }

  function setLore(loreLines) {
    if (loreDeck) {
      loreDeck.replaceChildren();

      loreLines.forEach((line) => {
        const span = document.createElement("span");
        span.textContent = line;
        loreDeck.appendChild(span);
      });
    }

    if (robotLore) {
      robotLore.textContent = `ATLAS-CODED robot lore state: ${loreLines.join(" ")} Message box can be hidden to reveal the art field.`;
    }

    poster.setAttribute(
      "aria-label",
      `Atlas-coded interactive poster. Visible lore: ${loreLines.join(" ")}`
    );
  }

  function setState(index, shouldFocusText = false) {
    activeIndex = index % states.length;
    const state = getCurrentState();

    if (kicker) kicker.textContent = state.kicker;

    setHeadline(state.words);
    setLore(state.lore);

    if (ancientText) {
      ancientText.placeholder = state.prompt;

      if (shouldFocusText && !poster.classList.contains("is-transmission-hidden")) {
        ancientText.focus();
      }
    }

    poster.style.setProperty(
      "--tilt",
      `${(Math.random() * 2.2 - 1.1).toFixed(2)}deg`
    );
  }

  function shuffleVibe() {
    let nextIndex = Math.floor(Math.random() * states.length);

    if (nextIndex === activeIndex) {
      nextIndex = (nextIndex + 1) % states.length;
    }

    setState(nextIndex, true);

    poster.classList.add("is-pulsing");
    shuffleButton?.classList.add("is-spinning");

    window.setTimeout(() => {
      poster.classList.remove("is-pulsing");
      shuffleButton?.classList.remove("is-spinning");
    }, 540);
  }

  function setTransmissionVisibility(isVisible) {
    poster.classList.toggle("is-transmission-hidden", !isVisible);

    if (toggleTransmission) {
      toggleTransmission.textContent = isVisible ? "Ocultar mensaje" : "Mostrar mensaje";
      toggleTransmission.setAttribute("aria-expanded", String(isVisible));
      toggleTransmission.setAttribute(
        "aria-label",
        isVisible
          ? "Ocultar caja de mensaje para ver el arte"
          : "Mostrar caja de mensaje"
      );
    }

    if (artModeButton) {
      artModeButton.setAttribute(
        "aria-label",
        isVisible
          ? "Ocultar caja de mensaje para ver el arte"
          : "Mostrar caja de mensaje"
      );
    }

    if (transmissionPanel) {
      transmissionPanel.setAttribute("aria-hidden", String(!isVisible));
    }
  }

  function toggleMessageBox() {
    const isCurrentlyHidden = poster.classList.contains("is-transmission-hidden");
    setTransmissionVisibility(isCurrentlyHidden);
  }

  shuffleButton?.addEventListener("click", shuffleVibe);
  toggleTransmission?.addEventListener("click", toggleMessageBox);
  artModeButton?.addEventListener("click", toggleMessageBox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setTransmissionVisibility(false);
    }
  });

  setState(0, false);
  setTransmissionVisibility(true);

  /*
    Canvas background.
    If canvas fails, the poster still works.
  */

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let t = 0;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const rect = canvas.getBoundingClientRect();

    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const value = Number.parseInt(clean, 16);

    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function blob(x, y, radius, color, alpha = 1) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, rgba(color, alpha));
    gradient.addColorStop(0.48, rgba(color, alpha * 0.82));
    gradient.addColorStop(1, rgba(color, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function paint() {
    const palette = getCurrentState().palette;

    t += 0.006;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 14; i += 1) {
      const phase = t + i * 0.72;
      const x = w * (0.5 + 0.48 * Math.sin(phase * 0.9 + i));
      const y = h * (0.5 + 0.47 * Math.cos(phase * 1.1 + i * 1.7));
      const r = Math.min(w, h) * (0.18 + 0.08 * Math.sin(phase * 1.6));
      const color = palette[(i % (palette.length - 1)) + 1];

      blob(x, y, r, color, 0.92);
    }

    ctx.globalCompositeOperation = "multiply";

    for (let i = 0; i < 9; i += 1) {
      const phase = t * 0.8 + i * 1.13;
      const x = w * (0.5 + 0.54 * Math.cos(phase));
      const y = h * (0.5 + 0.54 * Math.sin(phase * 1.2));

      blob(x, y, Math.min(w, h) * 0.2, "#192625", 0.52);
    }

    if (!reduceMotion) {
      requestAnimationFrame(paint);
    }
  }

  window.addEventListener("resize", resize);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
  }

  resize();
  paint();
})();
