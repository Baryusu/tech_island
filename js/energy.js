(() => {
        const $ = (id) => document.getElementById(id),
          v = $("ev-diagram");
        if (!v) return;
        let outage = false,
          source = "ev",
          active = false;
        function draw() {
          if (!outage) active = false;
          const mode = !outage ? "solar" : active ? source : "outage";
          v.setAttribute("class", mode);
          $("ev-normal").classList.toggle("active", !outage);
          $("ev-outage").classList.toggle("active", outage);
          $("ev-activate").classList.toggle("active", active);
          $("ev-choose-car").classList.toggle("active", source === "ev");
          $("ev-choose-gen").classList.toggle("active", source === "generator");
          $("ev-grid-status").textContent = outage ? "GRID DOWN" : "AVAILABLE";
          $("ev-grid-text").textContent = outage
            ? "GRID OUTAGE"
            : "GRID AVAILABLE";
          $("ev-grid-dot").setAttribute("fill", outage ? "#d47b56" : "#56a875");
          const label = source === "ev" ? "EV V2L" : "GENERATOR";
          $("ev-power-status").textContent = outage ? "HOME BATTERY" : "SOLAR";
          $("ev-house-status").textContent = outage ? "HOME BATTERY" : "SOLAR";
          $("ev-car-status").textContent = outage
            ? source === "ev" && active
              ? "V2L SUPPLYING"
              : "NOT CHARGING"
            : "SOLAR CHARGING";
          $("ev-input-status").textContent = active ? label : "STANDBY";
          $("ev-selector-text").textContent = active ? label : "STANDBY";
          $("ev-battery-status").textContent = active
            ? "BACKUP RECHARGING"
            : outage
              ? "SUPPLYING HOME"
              : "SOLAR CHARGING";
          $("ev-battery-fill").setAttribute(
            "width",
            active ? "94" : outage ? "25" : "55",
          );
          const descriptions = {
            solar: [
              "Normal solar operation",
              "Solar → hybrid inverter → home, stationary batteries and EV charging.",
              "Solar panels supply the home, recharge the stationary battery and charge the EV through a compatible EV charging system when surplus generation is available. Animated paths show all three destinations.",
            ],
            outage: [
              "Grid outage — battery powers the house",
              "Home battery → hybrid inverter → essential household loads.",
              "With the utility grid down, the home battery supplies the backed-up household circuits. Solar may still contribute when available; emergency EV or generator input is optional.",
            ],
            ev: [
              "Grid outage — EV recharges home battery",
              "Home battery powers house · EV V2L → inverter → home battery.",
              "The stationary battery continues to support the house while a compatible EV V2L source supplies the inverter's approved emergency input for battery charging, subject to the inverter's energy-management capability.",
            ],
            generator: [
              "Grid outage — generator recharges home battery",
              "Home battery → house · GENERATOR → hybrid inverter → home battery (orange flow; smoke visible).",
              "The stationary battery supplies the house while the generator provides the selected emergency input to recharge it. The EV source is isolated; only one emergency source is selected.",
            ],
          };
          const d = descriptions[mode];
          $("ev-title").textContent = d[0];
          $("ev-subtitle").textContent = d[1];
          $("ev-description").textContent = d[2];
          $("ev69-flow-label").textContent =
            mode === "solar"
              ? "SOLAR → BATTERY + EV"
              : mode === "outage"
                ? "BATTERY → HOUSE"
                : mode === "ev"
                  ? "EV → HOME BATTERY"
                  : "GENERATOR → BATTERY";
          $("ev69-home-label").textContent = outage
            ? "BATTERY → HOUSE"
            : "SOLAR → HOUSE";
          $("ev-activate").textContent = active
            ? "Stop Backup"
            : "Activate Backup";
          $("ev-activate").setAttribute("aria-pressed", String(active));
          $("ev-choose-car").setAttribute(
            "aria-pressed",
            String(source === "ev"),
          );
          $("ev-choose-gen").setAttribute(
            "aria-pressed",
            String(source === "generator"),
          );
        }
        $("ev-normal").onclick = () => {
          outage = false;
          active = false;
          draw();
        };
        $("ev-outage").onclick = () => {
          outage = true;
          source = "ev";
          active = true;
          draw();
        };
        $("ev-activate").onclick = () => {
          if (!outage) {
            outage = true;
            source = "ev";
            active = true;
          } else {
            active = !active;
          }
          draw();
        };
        $("ev-restore").onclick = () => {
          outage = false;
          active = false;
          draw();
        };
        $("ev-choose-car").onclick = () => {
          source = "ev";
          outage = true;
          active = true;
          draw();
        };
        $("ev-choose-gen").onclick = () => {
          source = "generator";
          outage = true;
          active = true;
          draw();
        };
        draw();
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
