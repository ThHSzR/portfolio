(() => {
  const button = document.querySelector("[data-effects-toggle]");
  if (!(button instanceof HTMLButtonElement)) return;

  const root = document.documentElement;
  const isEnabled = () => root.dataset.effects !== "off";

  const updateButton = (enabled) => {
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", enabled ? "Desligar animações decorativas" : "Ligar animações decorativas");
    button.dataset.tooltip = enabled ? "Efeitos ligados" : "Efeitos desligados";
  };

  const setEffects = (enabled) => {
    if (enabled) delete root.dataset.effects;
    else root.dataset.effects = "off";

    try {
      localStorage.setItem("portfolio-effects", enabled ? "on" : "off");
    } catch {}

    updateButton(enabled);
    window.dispatchEvent(new CustomEvent("portfolio-effects-change", { detail: { enabled } }));
  };

  updateButton(isEnabled());
  button.addEventListener("click", () => setEffects(!isEnabled()));
})();
