// Shared app bootstrap
// - Detect current language (EN/PT)
// - Keep language toggle state in sync
// - Make the language toggle link to the equivalent page
// - Set the footer year

(function () {
  function normPath(p) {
    return (p || "").replace(/\\/g, "/");
  }

  function splitByLangSegment(pathname) {
    const p = normPath(pathname);
    const m = p.match(/^(.*)\/(en|pt)\/(.*)$/i);
    if (!m) return null;
    return {
      prefix: m[1] || "",
      lang: (m[2] || "en").toLowerCase(),
      suffix: m[3] || "",
    };
  }

  function langFromHtml() {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("pt")) return "pt";
    if (htmlLang.startsWith("en")) return "en";
    return "en";
  }

  function getSitePrefixAndLang() {
    const split = splitByLangSegment(window.location.pathname);
    const lang = split ? split.lang : langFromHtml();
    const prefix = split ? split.prefix : "";
    return { prefix, lang, suffix: split ? split.suffix : "" };
  }

  function joinUrl(prefix, lang, rel) {
    const pfx = prefix || "";
    const base = `${pfx}/${lang}`.replace(/\/+/g, "/");
    const path = rel ? `/${rel}` : "";
    return `${base}${path}`.replace(/\/+/g, "/");
  }

  function mapSuffixToOtherLang(suffix, targetLang) {
    // Foundations mapping:
    // EN: pages/graphs/foundations/part-<n>.html
    // PT: pages/grafos/fundamentos/parte-<n>.html
    const enRe = /^pages\/graphs\/foundations\/part-(\d+)\.html$/i;
    const ptRe = /^pages\/grafos\/fundamentos\/parte-(\d+)\.html$/i;

    if (!suffix || suffix === "" || suffix === "index.html") return "index.html";

    let m = suffix.match(enRe);
    if (m) {
      const n = m[1];
      return targetLang === "pt"
        ? `pages/grafos/fundamentos/parte-${n}.html`
        : suffix;
    }

    m = suffix.match(ptRe);
    if (m) {
      const n = m[1];
      return targetLang === "en"
        ? `pages/graphs/foundations/part-${n}.html`
        : suffix;
    }

    return "index.html";
  }

  function setActiveLang(lang) {
    document.querySelectorAll("[data-lang]").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("data-lang") === lang);
    });
  }

  function applyLangToggleLinks() {
    const { prefix, suffix } = getSitePrefixAndLang();

    const enBtn = document.querySelector("[data-lang='en']");
    const ptBtn = document.querySelector("[data-lang='pt']");

    if (enBtn) enBtn.setAttribute("href", joinUrl(prefix, "en", mapSuffixToOtherLang(suffix, "en")));
    if (ptBtn) ptBtn.setAttribute("href", joinUrl(prefix, "pt", mapSuffixToOtherLang(suffix, "pt")));
  }

  function init() {
    const { lang } = getSitePrefixAndLang();
    setActiveLang(lang);
    applyLangToggleLinks();

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
