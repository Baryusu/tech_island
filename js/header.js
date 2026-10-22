"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menu = document.getElementById("main-nav");
  const menuToggle = document.querySelector(".menu-toggle");

  if (menu && menuToggle) {
    const svgIcon = (name) =>
      `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

    const setMenu = (open) => {
      menu.classList.toggle("is-open", open);
      menu.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );
      menuToggle.innerHTML = svgIcon(open ? "close" : "menu");
    };

    menuToggle.addEventListener("click", () =>
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true")
    );

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
  }

  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
});
