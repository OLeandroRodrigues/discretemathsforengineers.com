console.log("[accordion] script loaded", location.pathname);

(function () {
  const KEY = "nav.activeMenu";
  const INSTALLED = "__navAccordionInstalled";

  function normPath(p) {
    return (p || "").replace(/\/$/, "");
  }

  function getMenus() {
    return Array.from(document.querySelectorAll('details.menu[data-menu]'));
  }

  function closeOthers(menus, openMenu) {
    for (const m of menus) {
      if (m !== openMenu && m.open) m.open = false;
    }
  }

  function restoreOpenState() {
    const MENUS = getMenus();

    if (!MENUS.length) {
      document.documentElement.classList.remove("nav-preload");
      return;
    }

    const currentPath = normPath(location.pathname);
    let matched = null;

    for (const menu of MENUS) {
      const links = menu.querySelectorAll(".submenu a[href]");
      for (const a of links) {
        const url = new URL(a.getAttribute("href"), location.origin);
        if (normPath(url.pathname) === currentPath) {
          matched = menu;
          break;
        }
      }
      if (matched) break;
    }

    const saved = localStorage.getItem(KEY);
    const fallback = saved
      ? document.querySelector(`details.menu[data-menu="${CSS.escape(saved)}"]`)
      : null;

    const toOpen = matched || fallback;

    if (toOpen) {
      toOpen.open = true;
      closeOthers(MENUS, toOpen);
    }
  }

  function installOnce() {
    if (window[INSTALLED]) return;
    window[INSTALLED] = true;

    document.addEventListener(
      "toggle",
      (e) => {
        const menu = e.target && e.target.matches
          ? (e.target.matches('details.menu[data-menu]') ? e.target : null)
          : null;

        if (!menu || !menu.open) return;

        const MENUS = getMenus();
        closeOthers(MENUS, menu);
        localStorage.setItem(KEY, menu.dataset.menu);
      },
      true 
    );

    document.addEventListener(
      "pointerdown",
      (e) => {
        const link = e.target.closest('details.menu[data-menu] .submenu a[href]');
        if (!link) return;

        const menu = link.closest('details.menu[data-menu]');
        if (menu) localStorage.setItem(KEY, menu.dataset.menu);
      },
      { capture: true, passive: true }
    );

    document.addEventListener(
      "pointerdown",
      (e) => {
        const a = e.target.closest('a[href]:not([aria-disabled="true"])');
        if (!a) return;

        if (a.target === "_blank") return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
          return;

        const url = new URL(href, location.origin);
        if (url.origin !== location.origin) return;

        const linkPath = normPath(url.pathname);
        const currentPath = normPath(location.pathname);

        if (linkPath === currentPath && url.search === location.search) {
          if (url.hash && url.hash !== location.hash) return;

          e.preventDefault();
        }
      },
      { capture: true }
    );

    document.addEventListener(
      "click",
      (e) => {
        const a = e.target.closest('a[href]:not([aria-disabled="true"])');
        if (!a) return;

        if (a.target === "_blank") return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
          return;

        const url = new URL(href, location.origin);
        if (url.origin !== location.origin) return;

        const linkPath = normPath(url.pathname);
        const currentPath = normPath(location.pathname);

        if (linkPath === currentPath && url.search === location.search) {
          if (url.hash && url.hash !== location.hash) return;
          e.preventDefault();
        }
      },
      { capture: true }
    );
  }

  installOnce();

  document.addEventListener("DOMContentLoaded", () => {
    console.log("[accordion] init", getMenus().length);
    restoreOpenState();
  });

  window.addEventListener("pageshow", restoreOpenState);
})();
