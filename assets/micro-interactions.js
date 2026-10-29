(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let effectsEnabled = root.dataset.effects !== "off";
  let scrollFrame = 0;

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const glowTargets = [...document.querySelectorAll(
    ".consultancy__services article, .skill-card, .credential--linked, .social-profile, .network-link, .profile-card"
  )];
  const magneticTargets = [...document.querySelectorAll(".button")];
  const profileVisual = document.querySelector(".profile-card__visual");

  glowTargets.forEach((element) => {
    element.classList.add("interactive-glow");
    element.addEventListener("pointermove", (event) => {
      if (!effectsEnabled || event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    }, { passive: true });
  });

  magneticTargets.forEach((button) => {
    button.classList.add("micro-magnetic");
    button.addEventListener("pointermove", (event) => {
      if (!effectsEnabled || reduceMotion.matches || event.pointerType === "touch") return;
      const rect = button.getBoundingClientRect();
      const x = Math.max(-5, Math.min(5, (event.clientX - rect.left - rect.width / 2) * .09));
      const y = Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) * .1));
      button.style.translate = `${x}px ${y}px`;
    }, { passive: true });
    button.addEventListener("pointerleave", () => { button.style.translate = ""; });
    button.addEventListener("pointerdown", (event) => {
      if (!effectsEnabled || reduceMotion.matches) return;
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "micro-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });

  if (profileVisual) {
    profileVisual.addEventListener("pointermove", (event) => {
      if (!effectsEnabled || reduceMotion.matches || event.pointerType === "touch") return;
      const rect = profileVisual.getBoundingClientRect();
      profileVisual.style.setProperty("--profile-x", `${event.clientX - rect.left}px`);
      profileVisual.style.setProperty("--profile-y", `${event.clientY - rect.top}px`);
    }, { passive: true });
    profileVisual.addEventListener("pointerleave", () => {
      profileVisual.style.removeProperty("--profile-x");
      profileVisual.style.removeProperty("--profile-y");
    });
  }

  const updateProgress = () => {
    scrollFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = `scaleX(${value})`;
  };

  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  window.addEventListener("portfolio-effects-change", (event) => {
    effectsEnabled = Boolean(event.detail?.enabled);
    if (!effectsEnabled) {
      magneticTargets.forEach((button) => { button.style.translate = ""; });
      profileVisual?.style.removeProperty("--profile-x");
      profileVisual?.style.removeProperty("--profile-y");
    }
    updateProgress();
  });

  updateProgress();
})();
