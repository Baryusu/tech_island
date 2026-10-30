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
  const listingDescription = document.getElementById("listing-description");
  const noResults = document.getElementById("no-results");
  const categoryBar = document.querySelector(".category-bar");
  const listHead = document.querySelector(".list-head");
  const productGrid = document.getElementById("product-grid");
  const sublimeSeries = document.getElementById("sublime-series");
  const sublimeProducts = document.querySelectorAll(".sublime-product");
  const sublimeCategory = "Sublime Series";
  let selectedCategory = "";
  const sectionHeadings = new Map();
  const categoryDescriptions = {
    [sublimeCategory]:
      "Architectural switches and controls made to complement refined interiors.",
    "Central Control":
      "The hubs and gateways that bring your smart devices together.",
    Lighting:
      "Connected controls for comfortable, responsive and efficient lighting.",
    Security:
      "Smart protection for entrances, rooms and the people you care about.",
    Sensor:
      "Quietly observe movement, environment and everyday conditions.",
    Shading:
      "Automate curtains and blinds for comfort, privacy and better daylight.",
    HVAC:
      "Connected climate control for a more comfortable and efficient home.",
    "Energy Saving":
      "Monitor and manage energy use with smarter, more sustainable control.",
    Entertainment:
      "Bring your home media and everyday devices together with ease.",
  };

  if (sublimeSeries && listHead) {
    const heading = document.createElement("div");
    heading.className = "product-section-heading";
    heading.innerHTML = `<h2>${sublimeCategory}</h2><p class="category-description">${categoryDescriptions[sublimeCategory]}</p><p class="category-count"></p>`;
    listHead.after(heading);
    heading.after(sublimeSeries);
    sectionHeadings.set(sublimeCategory, {
      element: heading,
      count: heading.querySelector(".category-count"),
    });
  }

  if (productGrid) {
    const categoryOrder = [
      "Central Control",
      "Lighting",
      "Security",
      "Sensor",
      "Shading",
      "HVAC",
      "Energy Saving",
      "Entertainment",
    ];

    categoryOrder.forEach((category) => {
      const categoryCards = cards.filter(
        (card) => card.dataset.category === category
      );
      if (categoryCards.length > 0) {
        const heading = document.createElement("div");
        heading.className = "product-section-heading";
        heading.innerHTML = `<h2>${category}</h2><p class="category-description">${categoryDescriptions[category]}</p><p class="category-count"></p>`;
        productGrid.appendChild(heading);
        sectionHeadings.set(category, {
          element: heading,
          count: heading.querySelector(".category-count"),
        });

        categoryCards.forEach((card) => productGrid.appendChild(card));
      }
    });
  }

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

    if (sublimeSeries) {
      sublimeSeries.hidden =
        selectedCategory !== "" && selectedCategory !== sublimeCategory;
    }

    let visibleSublimeCount = 0;
    sublimeProducts.forEach((product) => {
      const matchesSearch =
        !q || product.textContent.toLowerCase().includes(q);
      const visible =
        (selectedCategory === "" || selectedCategory === sublimeCategory) &&
        matchesSearch;

      product.hidden = !visible;
      if (visible) visibleSublimeCount++;
    });

    const categoryCounts = new Map();
    cards.forEach((card) => {
      if (!card.hidden) {
        const category = card.dataset.category || "";
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
      }
    });

    sectionHeadings.forEach((section, category) => {
      const count =
        category === sublimeCategory
          ? visibleSublimeCount
          : categoryCounts.get(category) || 0;
      const showHeading = selectedCategory === "" && count > 0;

      section.element.hidden = !showHeading;
      section.count.textContent = `${count} ${
        count === 1 ? "product" : "products"
      }`;
    });

    const displayedCount = count + visibleSublimeCount;
    if (resultCount) {
      resultCount.textContent = `${displayedCount} ${
        displayedCount === 1 ? "product" : "products"
      }`;
    }
    if (listingTitle) {
      listingTitle.textContent = selectedCategory || "All products";
    }
    if (listingDescription) {
      listingDescription.textContent =
        categoryDescriptions[selectedCategory] ||
        "Browse the complete LifeSmart collection, organized by how each product supports your home.";
    }
    if (noResults) {
      noResults.hidden = displayedCount !== 0;
    }
  }

  chips.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category || "";
      chips.forEach((c) => c.classList.toggle("active", c === btn));
      update();

      if (categoryBar && listHead) {
        const headerOffset = header ? header.offsetHeight : 0;
        const targetTop =
          listHead.getBoundingClientRect().top +
          window.scrollY -
          headerOffset -
          categoryBar.offsetHeight -
          20;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });
      }
    });
  });

  if (search) {
    search.addEventListener("input", update);
  }

  update();

  // --- Details Modal ---
  const modal = document.getElementById("product-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalCat = document.getElementById("modal-cat");
  const modalDesc = document.getElementById("modal-description");
  const modalSpecifications = document.getElementById("modal-specifications");
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
        if (modalSpecifications) {
          const title = card.querySelector("h3");
          const productName = title ? title.textContent.trim() : "";
          const specificationName =
            productName === "Indoor Camera"
              ? "Indoor Camera (5MP)"
              : productName;
          const specificationData = Array.isArray(
            window.productSpecifications
          )
            ? window.productSpecifications.find(
                (item) => item.title === specificationName
              )
            : window.productSpecifications &&
              window.productSpecifications[specificationName];
          const specifications = specificationData
            ? specificationData.specifications
            : null;
          const specificationList = modalSpecifications.querySelector("dl");

          if (specificationList && specifications) {
            specificationList.replaceChildren();
            Object.entries(specifications).forEach(([label, value]) => {
              const term = document.createElement("dt");
              const description = document.createElement("dd");
              term.textContent = label;
              description.textContent = value;
              specificationList.append(term, description);
            });
            modalSpecifications.hidden = false;
          } else {
            modalSpecifications.hidden = true;
          }
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
