(function () {
  const dict = {
    en: {
      forEngineers: "for Engineers",
      tagline: "Structures, proofs, and intuition",
      welcomeTitle: "Welcome",
      welcomeSubtitle:
        "Choose a topic from the left menu. This is the base layout for Topic → Series → Posts.",
      nextStepsTitle: "Suggested next steps",
    },
    pt: {
      forEngineers: "para Engenheiros",
      tagline: "Estruturas, provas e intuição",
      welcomeTitle: "Seja bem-vindo",
      welcomeSubtitle:
        "Escolha um tópico no menu à esquerda. Este layout serve como base para organizar o conteúdo em Tópico → Série → Posts.",
      nextStepsTitle: "Próximos passos sugeridos",
    },
  };

  function detectLang(pathname) {
    const m = pathname.match(/\/(en|pt)(\/|$)/i);
    return m ? m[1].toLowerCase() : "en";
  }

  function applyI18n(lang) {
    const t = dict[lang] || dict.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });
  }

  function setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const lang = detectLang(window.location.pathname);
    applyI18n(lang);
    setYear();
  });

  // Handle bfcache (back/forward navigation)
  window.addEventListener("pageshow", () => {
    const lang = detectLang(window.location.pathname);
    applyI18n(lang);
    setYear();
  });
})();
