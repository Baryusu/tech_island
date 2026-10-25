"use strict";

(() => {
  // --- Header Navigation ---
  const header = document.querySelector(".site-header");
  const menu = document.getElementById("main-nav");
  const menuToggle = document.querySelector(".menu-toggle");

  if (menu && menuToggle) {
    const svgIcon = (name) =>
      `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

    const setMenu = (open) => {
      menu.classList.toggle("is-open", open);
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

    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setMenu(false))
    );

    document.addEventListener("click", (event) => {
      if (header && !event.composedPath().includes(header)) setMenu(false);
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
        if (window.innerWidth > 720) setMenu(false);
      },
      { passive: true }
    );
  }

  if (header) {
    const updateHeader = () =>
      header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  // --- Image Fallbacks ---
  const createPendingPlaceholder = () => {
    const pending = document.createElement("div");
    pending.className = "image-pending";
    pending.innerHTML = '<span class="line-icon">◇</span><small>Image coming soon</small>';
    return pending;
  };

  document.querySelectorAll(".product-art img").forEach((img) => {
    const handleErr = () => {
      if (img.parentNode) {
        img.replaceWith(createPendingPlaceholder());
      }
    };
    if (img.complete && img.naturalWidth === 0) {
      handleErr();
    } else {
      img.addEventListener("error", handleErr);
    }
  });

  const heroImg = document.querySelector(".hero-device");
  if (heroImg) {
    const handleHeroErr = () => {
      heroImg.style.display = "none";
    };
    if (heroImg.complete && heroImg.naturalWidth === 0) {
      handleHeroErr();
    } else {
      heroImg.addEventListener("error", handleHeroErr);
    }
  }

  // --- Filtering & Search ---
  const cards = Array.from(document.querySelectorAll(".product-card"));
  const chips = Array.from(document.querySelectorAll(".filter-chip"));
  const search = document.getElementById("product-search");
  const resultCount = document.getElementById("result-count");
  const listingTitle = document.getElementById("listing-title");
  const noResults = document.getElementById("no-results");
  let selectedCategory = "";

  function update() {
    const q = (search ? search.value : "").trim().toLowerCase();
    let count = 0;

    for (const card of cards) {
      const matchesCategory =
        !selectedCategory || card.dataset.category === selectedCategory;
      const matchesSearch = !q || (card.dataset.name || "").includes(q);
      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;
      if (visible) count++;
    }

    if (resultCount) {
      resultCount.textContent = `${count} ${count === 1 ? "product" : "products"}`;
    }
    if (listingTitle) {
      listingTitle.textContent = selectedCategory || "All products";
    }
    if (noResults) {
      noResults.hidden = count !== 0;
    }
  }

  chips.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category || "";
      chips.forEach((c) => c.classList.toggle("active", c === btn));
      update();
    });
  });

  if (search) {
    search.addEventListener("input", update);
  }

  // --- Details Modal ---
  const modal = document.getElementById("product-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalCat = document.getElementById("modal-cat");
  const modalDesc = document.getElementById("modal-description");
  const modalImgContainer = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");

  if (modal) {
    document.querySelectorAll(".details-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".product-card");
        if (!card) return;

        if (modalTitle) {
          const h3 = card.querySelector("h3");
          modalTitle.textContent = h3 ? h3.textContent : "";
        }
        if (modalCat) {
          modalCat.textContent = card.dataset.category || "";
        }
        if (modalDesc) {
          const p = card.querySelector(".product-info p");
          modalDesc.textContent = p ? p.textContent : "";
        }
        if (modalImgContainer) {
          const pic = card.querySelector(".product-art img");
          if (pic && (pic.naturalWidth > 0 || pic.getAttribute("src"))) {
            modalImgContainer.innerHTML = `<img class="modal-photo" src="${pic.getAttribute("src")}" alt="${pic.getAttribute("alt") || ""}">`;
          } else {
            modalImgContainer.innerHTML = `
              <div class="image-pending" style="padding: 30px 0;">
                <span class="line-icon" style="font-size: 48px;">◇</span>
                <small>Image coming soon</small>
              </div>`;
          }
        }

        modal.showModal();
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", () => modal.close());
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.close();
    });
  }
})();
