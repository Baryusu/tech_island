(() => {
        const $ = (id) => document.getElementById(id);
        if (!$("dw54-window")) return;
        let hot = false,
          rain = false,
          ac = false,
          manual = null;
        function render() {
          const open =
            !rain && !ac && (manual === "open" || (manual === null && hot));
          $("dw54-window").textContent = open ? "OPEN" : "CLOSED";
          $("dw54-ac").textContent = ac ? "ON" : "OFF";
          $("dw54-sensor").textContent = rain ? "RAIN DETECTED" : "DRY";
          $("dw54-vent").textContent = open
            ? "VENTILATING"
            : rain
              ? "RAIN OVERRIDE"
              : ac
                ? "AC COOLING"
                : "STANDBY";
          $("dw-scene").classList.toggle("open", open);
          $("dw-scene").classList.toggle("raining", rain);
          $("dw-scene").classList.toggle("cooling", ac);
          $("dw54-hot").classList.toggle("selected", hot);
          $("dw54-rain-btn").classList.toggle("selected", rain);
          $("dw54-ac-btn").classList.toggle("selected", ac);
          const title = rain
            ? "Rain detected — window closes"
            : ac
              ? "Air conditioner ON — window closes"
              : open
                ? "High windows OPEN"
                : "High windows CLOSED";
          const sub = rain
            ? "Rain sensor protects the interior."
            : ac
              ? "Cooling is more efficient with windows shut."
              : open
                ? "Warm air escapes through upper windows."
                : "Ready for automatic ventilation.";
          $("dw54-scene-title").textContent = title;
          $("dw54-scene-sub").textContent = sub;
          $("dw54-explanation").textContent = rain
            ? "Rain detected outdoors. The window closes automatically, overriding manual or hot-air opening."
            : ac
              ? "Air conditioning is ON. The high window closes automatically to reduce conditioned-air loss."
              : open
                ? "Warm air rises and the upper window opens to release it."
                : "The high window is closed. Use the controls to explore the automation.";
        }
        $("dw54-hot").onclick = () => {
          hot = !hot;
          manual = null;
          render();
        };
        $("dw54-rain-btn").onclick = () => {
          rain = !rain;
          render();
        };
        $("dw54-ac-btn").onclick = () => {
          ac = !ac;
          render();
        };
        $("dw54-clear").onclick = () => {
          hot = false;
          rain = false;
          ac = false;
          manual = null;
          render();
        };
        $("dw54-open").onclick = () => {
          manual = "open";
          render();
        };
        $("dw54-close").onclick = () => {
          manual = "close";
          render();
        };
        render();
      })();

(() => {
        const modal = document.getElementById("ti-lead-modal"),
          form = document.getElementById("ti-lead-form"),
          open = document.querySelector("[data-ti-want]");
        if (!modal || !form || !open) return;
        const solution =
          document.body.dataset.tiSolution ||
          document.title.split("|")[0].trim();
        document.getElementById("ti-lead-solution").textContent = solution;
        const close = () => {
          modal.hidden = true;
          open.focus();
        };
        open.addEventListener("click", () => {
          modal.hidden = false;
          modal.querySelector("input").focus();
        });
        modal.querySelector(".ti-close").addEventListener("click", close);
        modal.addEventListener("click", (e) => {
          if (e.target === modal) close();
        });
        document.addEventListener("keydown", (e) => {
          if (modal.hidden) return;
          if (e.key === "Escape") close();
          if (e.key === "Tab") {
            const nodes = [
              ...modal.querySelectorAll("button,input,textarea,select"),
            ].filter((n) => !n.hidden);
            if (e.shiftKey && document.activeElement === nodes[0]) {
              e.preventDefault();
              nodes.at(-1).focus();
            } else if (!e.shiftKey && document.activeElement === nodes.at(-1)) {
              e.preventDefault();
              nodes[0].focus();
            }
          }
        });
        let inquiry = "";
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (!form.reportValidity()) return;
          const d = new FormData(form);
          const clean = (k) => String(d.get(k) || "").trim();
          inquiry = [
            "TECHISLAND SPECIAL SOLUTION INQUIRY",
            "Solution: " + solution,
            "Name: " + clean("fullName"),
            "Mobile: " + clean("phone"),
            "Email: " + clean("email"),
            "Location: " + clean("location"),
            "Project type: " + clean("projectType"),
            "Notes: " + clean("message"),
          ].join("\n");
          const subject = "Techisland inquiry — " + solution;
          const uri =
            "mailto:info@lifesmartph.com?subject=" +
            encodeURIComponent(subject) +
            "&body=" +
            encodeURIComponent(inquiry);
          document.getElementById("ti-lead-copy").hidden = false;
          document.getElementById("ti-lead-feedback").textContent =
            "Your email app should open a draft. Review it and press Send to contact Techisland.";
          window.location.href = uri;
        });
        document
          .getElementById("ti-lead-copy")
          .addEventListener("click", async () => {
            if (!inquiry) return;
            try {
              await navigator.clipboard.writeText(inquiry);
              document.getElementById("ti-lead-feedback").textContent =
                "Inquiry copied. Paste into an email to info@lifesmartph.com.";
            } catch {
              document.getElementById("ti-lead-feedback").textContent =
                "Copy unavailable. Please use the prepared email draft.";
            }
          });
      })();
