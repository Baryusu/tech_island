(() => {
  const d = document.getElementById("inquiry");
  document.querySelectorAll("[data-space]").forEach((b) =>
    b.addEventListener("click", () => {
      const spaceName = b.dataset.space || "Smart Spaces";
      document.getElementById("space").value = spaceName;
      d.setAttribute("aria-label", "Inquiry for " + spaceName);
      d.showModal();
    }),
  );
  d.querySelector(".close").addEventListener("click", () => d.close());
  d.addEventListener("click", (e) => {
    if (e.target === d) d.close();
  });
  document.getElementById("lead").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [...f.entries()].map(([k, v]) => k + ": " + v).join("\n");
    window.location.href =
      "mailto:info@lifesmartph.com?subject=" +
      encodeURIComponent("Techisland Smart Spaces Inquiry: " + f.get("space")) +
      "&body=" +
      encodeURIComponent(body);
  });
})();
