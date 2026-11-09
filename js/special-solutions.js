"use strict";

function initSpecialSolutionsCatalog() {
  const cards = Array.from(document.querySelectorAll("#solutions-grid .card"));
  const chips = Array.from(document.querySelectorAll(".category-bar .filter-chip"));
  const searchInput = document.getElementById("solution-search");
  const listingTitle = document.getElementById("listing-title");
  const listingDescription = document.getElementById("listing-description");
  const resultCount = document.getElementById("result-count");
  const noResults = document.getElementById("no-results");
  const resetBtn = document.getElementById("reset-filter-btn");

  if (!cards.length) return;

  let activeFilter = "all";

  const categoryMeta = {
    all: {
      title: "All Specialized Solutions",
      description:
        "Tailored smart automation engineered for private luxury residences, commercial facilities, and estate grounds."
    },
    residential: {
      title: "Residential Living & Villa Automation",
      description:
        "Custom-engineered solutions designed for multi-generational families, private comfort, and serene lifestyle living."
    },
    commercial: {
      title: "Commercial, Hospitality & Enterprise Systems",
      description:
        "High-reliability automation for boutique hotels, medical clinics, corporate offices, and shared commercial facilities."
    },
    "safety-care": {
      title: "Life Safety, Care & Emergency Protection",
      description:
        "Critical safety solutions including senior care alerts, perimeter alarm integration, and automatic emergency pet release."
    },
    "access-automation": {
      title: "Perimeter Access, Entry & Ventilation",
      description:
        "Intelligent barrier gates, high-definition visitor intercoms, and motorized doors and climate-responsive windows."
    },
    "outdoor-living": {
      title: "Outdoor Living, Wellness & Landscape",
      description:
        "Automation for architectural swimming pools, multi-zone landscape irrigation, and whole-home sound systems."
    },
    "energy-power": {
      title: "Energy Resilience, Solar & Micro-Grid Power",
      description:
        "Hybrid solar management, home battery storage, EV bidirectional charging, and automatic emergency generator failover."
    }
  };

  function update() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const sectors = (card.dataset.sectors || "").toLowerCase().split(/\s+/);
      const domains = (card.dataset.domains || "").toLowerCase().split(/\s+/);
      const keywords = (card.dataset.keywords || "").toLowerCase();
      const title = (
        card.querySelector("h3") ? card.querySelector("h3").textContent : ""
      ).toLowerCase();
      const desc = (
        card.querySelector("p") ? card.querySelector("p").textContent : ""
      ).toLowerCase();

      // Check category/filter match
      let matchesFilter = false;
      if (activeFilter === "all") {
        matchesFilter = true;
      } else if (sectors.includes(activeFilter)) {
        matchesFilter = true;
      } else if (domains.includes(activeFilter)) {
        matchesFilter = true;
      }

      // Check search query match
      let matchesSearch = true;
      if (query) {
        matchesSearch =
          title.includes(query) ||
          desc.includes(query) ||
          keywords.includes(query) ||
          sectors.some((s) => s.includes(query)) ||
          domains.some((d) => d.includes(query));
      }

      const isVisible = matchesFilter && matchesSearch;
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount++;
      }
    });

    // Update Result Count
    if (resultCount) {
      resultCount.textContent = `Showing ${visibleCount} of ${cards.length} solutions`;
    }

    // Update Title & Description
    const meta = categoryMeta[activeFilter] || categoryMeta.all;
    if (listingTitle) {
      listingTitle.textContent = query
        ? `Search results for "${query}"`
        : meta.title;
    }
    if (listingDescription) {
      listingDescription.textContent = query
        ? `Showing solutions matching your keyword query across the catalog.`
        : meta.description;
    }

    // Toggle Empty State
    if (noResults) {
      noResults.hidden = visibleCount > 0;
    }
  }

  // Filter Chips Click Event
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter || "all";
      update();
    });
  });

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener("input", update);
  }

  // Reset Filters Event
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      activeFilter = "all";
      chips.forEach((c) => {
        c.classList.toggle("active", (c.dataset.filter || "all") === "all");
      });
      if (searchInput) {
        searchInput.value = "";
      }
      update();
    });
  }

  // Initial Run
  update();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSpecialSolutionsCatalog);
} else {
  initSpecialSolutionsCatalog();
}
