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

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("click", (event) => {
      if (header && !event.composedPath().includes(header)) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 900 && menu.classList.contains("is-open")) {
          setMenu(false);
        }
      },
      { passive: true }
    );
  }

  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Universal modal dialog scroll lock & state synchronization
  const syncDialogLock = () => {
    const isAnyNativeOpen = Array.from(document.querySelectorAll("dialog")).some(
      (d) => d.open
    );
    const isAnyTiOpen = Array.from(document.querySelectorAll(".ti-modal")).some(
      (m) => !m.hidden
    );
    document.body.classList.toggle("dialog-open", isAnyNativeOpen || isAnyTiOpen);
  };

  const tiModals = document.querySelectorAll(".ti-modal");
  if (tiModals.length > 0) {
    const observer = new MutationObserver(syncDialogLock);
    tiModals.forEach((m) =>
      observer.observe(m, { attributes: true, attributeFilter: ["hidden"] })
    );
  }

  document.querySelectorAll("dialog").forEach((d) => {
    d.addEventListener("close", syncDialogLock);
    const origShow = d.showModal;
    if (origShow) {
      d.showModal = function () {
        origShow.apply(this, arguments);
        syncDialogLock();
      };
    }
  });
});
