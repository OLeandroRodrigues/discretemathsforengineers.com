// assets/js/accordion.js
document.addEventListener("DOMContentLoaded", () => {
  const menus = Array.from(document.querySelectorAll("details.menu"));

  menus.forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (!menu.open) return;
      menus.forEach((other) => {
        if (other !== menu) other.removeAttribute("open");
      });
    });
  });
});
