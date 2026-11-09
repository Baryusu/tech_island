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

  // Universal Privacy & Website Notes Dialog Handler
  const openPrivacyDialog = () => {
    let dialog = document.getElementById("privacy-dialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "privacy-dialog";
      dialog.className = "site-dialog";
      dialog.setAttribute("aria-labelledby", "privacy-dialog-title");
      dialog.innerHTML = `
        <button class="dialog-close" aria-label="Close privacy and website notes" type="button">
          <svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg>
        </button>
        <div class="dialog-content">
          <p class="eyebrow">PRIVACY &amp; WEBSITE NOTES</p>
          <h2 id="privacy-dialog-title">You choose what to share.</h2>
          <h3>Your consultation brief</h3>
          <p>
            The brief is assembled in your browser. This version has no form-submission server,
            analytics or tracking cookies, and does not store your form entries in browser storage.
            Choosing “Open email draft” passes the brief to your email application; nothing is
            automatically sent. Choosing “Save a copy” creates a text file on your device.
          </p>
          <h3>Email and external links</h3>
          <p>
            Messages you choose to send are handled by your email provider and the recipient.
            Manufacturer reference links open external sites with their own privacy practices. Do not
            include access codes, passwords, detailed security layouts or other sensitive information
            in an initial inquiry.
          </p>
          <h3>Images and feature examples</h3>
          <p>
            The architectural illustrations are adapted from Techisland’s existing brand materials.
            They are inspiration, not claims of completed installations. Interactive scenes and
            connectivity indicators are demonstrations, not real equipment states. Integration
            capabilities and support arrangements are confirmed in the project scope.
          </p>
          <h3>Contact routing</h3>
          <p>
            Consultation drafts are addressed to Techisland inquiries through LifeSmart PH at
            <span class="inquiry-email-text">info@lifesmartph.com</span>
            , as listed on the public Tech Island Project page.
          </p>
          <p>
            <a
              class="text-link"
              href="https://www.fineupgrades.com/tech-island-project"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the Tech Island Project portfolio on Fine Upgrades ↗
            </a>
          </p>
        </div>
      `;
      document.body.appendChild(dialog);

      const closeBtn = dialog.querySelector(".dialog-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => dialog.close());
      }

      dialog.addEventListener("click", (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX && e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) dialog.close();
      });

      dialog.addEventListener("close", syncDialogLock);
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    syncDialogLock();
  };

  document.querySelectorAll("[data-open-privacy]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openPrivacyDialog();
    });
  });

});
