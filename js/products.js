"use strict";

import { isFirebaseConfigured, getProductsFromDb } from "./firebase-config.js";

(async () => {
  // --- Dynamic Firebase Products Loading (Optional / Non-breaking) ---
  const productGrid = document.getElementById("product-grid");
  const sublimeContainer = document.querySelector(".sublime-products");

  if (isFirebaseConfigured() && productGrid) {
    try {
      const dbProducts = await getProductsFromDb();
      if (dbProducts && dbProducts.length > 0) {
        // Render standard products
        const standardList = dbProducts.filter((p) => !p.isSublime);
        const sublimeList = dbProducts.filter((p) => p.isSublime);

        if (standardList.length > 0) {
          productGrid.innerHTML = standardList
            .map((p) => {
              const src = p.imageUrl || p.image || "";
              const formattedSrc = (src.startsWith("http") || src.startsWith("data:"))
                ? src
                : (src.startsWith("../") ? src : `../${src}`);

              return `
                <article
                  class="product-card"
                  data-category="${escapeAttr(p.category || 'Central Control')}"
                  data-name="${escapeAttr((p.searchName || p.name || '').toLowerCase())}"
                  data-specs="${escapeAttr(JSON.stringify(p.specifications || {}))}"
                >
                  <div class="product-art">
                    <img
                      src="${formattedSrc}"
                      loading="lazy"
                      alt="${escapeAttr(p.name || '')}"
                    />
                  </div>
                  <div class="product-info">
                    <span class="product-category">${escapeHtml(p.category || 'General')}</span>
                    <h3>${escapeHtml(p.name || '')}</h3>
                    <p>${escapeHtml(p.description || '')}</p>
                    <button
                      type="button"
                      class="details-btn"
                      aria-label="View details for ${escapeAttr(p.name || '')}"
                      data-product="${escapeAttr(p.name || '')}"
                    >
                      Explore product <span>↗</span>
                    </button>
                  </div>
                </article>
              `;
            })
            .join("");
        }

        if (sublimeList.length > 0 && sublimeContainer) {
          sublimeContainer.innerHTML = sublimeList
            .map((p) => {
              const src = p.imageUrl || p.image || "";
              const formattedSrc = (src.startsWith("http") || src.startsWith("data:"))
                ? src
                : (src.startsWith("../") ? src : `../${src}`);

              return `
                <article class="sublime-product">
                  <div class="sublime-product-tile sublime-tile-small">
                    <img
                      src="${formattedSrc}"
                      alt="${escapeAttr(p.name || '')}"
                      loading="lazy"
                    />
                  </div>
                  <h3>${escapeHtml(p.name || '')}</h3>
                  <p>${escapeHtml(p.description || '')}</p>
                  <span>LifeSmart Sublime</span>
                </article>
              `;
            })
            .join("");
        }
      }
    } catch (err) {
      console.warn("Could not load dynamic products from Firebase, using static HTML fallback:", err);
    }
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
    const defaultOrder = [
      "Central Control",
      "Lighting",
      "Security",
      "Sensor",
      "Shading",
      "HVAC",
      "Energy Saving",
      "Entertainment",
    ];
    // Include any custom categories added in Admin
    const customCats = [
      ...new Set(cards.map((c) => c.dataset.category).filter(Boolean)),
    ].filter((cat) => !defaultOrder.includes(cat) && cat !== sublimeCategory);

    const categoryOrder = [...defaultOrder, ...customCats];

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

      if (listHead) {
        const siteHeader = document.querySelector(".site-header");
        const headerOffset = siteHeader ? siteHeader.offsetHeight : 70;
        const targetTop =
          listHead.getBoundingClientRect().top +
          window.scrollY -
          headerOffset -
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
          const title = h3 ? h3.textContent.trim() : "";
          modalTitle.textContent = title || "Product Details";
          modal.setAttribute(
            "aria-label",
            title ? `${title} - Product Details` : "Product Details"
          );
        }
        if (modalCat) {
          modalCat.textContent = card.dataset.category || "";
        }
        if (modalDesc) {
          const p = card.querySelector(".product-info p");
          modalDesc.textContent = p ? p.textContent : "";
        }
        if (modalSpecifications) {
          let specifications = null;
          if (card.dataset.specs) {
            try {
              const parsed = JSON.parse(card.dataset.specs);
              if (parsed && Object.keys(parsed).length > 0) {
                specifications = parsed;
              }
            } catch (err) {}
          }
          if (!specifications) {
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
            specifications = specificationData
              ? specificationData.specifications
              : null;
          }
          const specificationList = modalSpecifications.querySelector("dl");

          if (specificationList && specifications && Object.keys(specifications).length > 0) {
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

                const modalDemoLink = document.getElementById("modal-demo-link");
        if (modalDemoLink) {
          const h3 = card.querySelector("h3");
          const titleText = h3 ? h3.textContent.trim() : "";
          const catText = card.dataset.category || "";
          const combined = (titleText + " " + catText).toLowerCase();

          const simulations = [
            { keywords: ["curtain", "shading", "blind", "shade"], url: "doors-windows.html", label: "Doors & Curtains Demo" },
            { keywords: ["gate", "barrier"], url: "electric-gate.html", label: "Smart Gate Demo" },
            { keywords: ["lock", "door", "window"], url: "doors-windows.html", label: "Doors & Windows Demo" },
            { keywords: ["camera", "doorbell", "intercom", "indoor cam"], url: "video-doorbell.html", label: "Video Doorbell Demo" },
            { keywords: ["sprinkler", "water", "irrigation"], url: "sprinklers.html", label: "Smart Sprinklers Demo" },
            { keywords: ["pool"], url: "pool-automation.html", label: "Pool Automation Demo" },
            { keywords: ["audio", "sound", "speaker", "sonos", "entertainment"], url: "sonos.html", label: "Sonos Audio Demo" },
            { keywords: ["elderly", "care", "panic", "health"], url: "elderly-safety.html", label: "Elderly Safety Demo" },
            { keywords: ["energy", "meter", "power", "plug", "energy saving"], url: "energy.html", label: "Energy & Solar Demo" },
            { keywords: ["security", "sensor", "station", "motion", "smoke", "gas", "leak"], url: "security.html", label: "Security & Alarm Demo" },
            { keywords: ["nature", "central control", "panel", "switch", "sublime"], url: "doors-windows.html", label: "Interactive Scene Demo" }
          ];

          const match = simulations.find(item => item.keywords.some(kw => combined.includes(kw)));
          if (match) {
            modalDemoLink.href = match.url;
            const cleanLabel = match.label.replace(/\s*Demo$/i, "");
            modalDemoLink.textContent = "Live Simulation: " + cleanLabel + " ↗";
            modalDemoLink.style.display = "inline-flex";
          } else {
            modalDemoLink.href = "#";
            modalDemoLink.style.display = "none";
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

  // Helper Sanitizers
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
