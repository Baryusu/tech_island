const details = ["Gate closed", "Gate opening", "Gate secured"];
      const names = ["Closed", "Arrival", "Secured"];
      const b = [...document.querySelectorAll(".tabs button")],
        st = [...document.querySelectorAll(".device span")];
      b.forEach(
        (x, i) =>
          (x.onclick = () => {
            b.forEach((q, j) => q.classList.toggle("active", i === j));
            document.querySelector(".visual").dataset.state = String(i);
            document.querySelector(".visual").dataset.state = String(i);
            document.getElementById("sceneTitle").textContent = names[i];
            document.getElementById("panelTitle").textContent = names[i];
            document.getElementById("sceneText").textContent = details[i];
            document.getElementById("panelText").textContent = details[i];
            st.forEach(
              (q, j) => (q.textContent = j <= i + 1 ? "ACTIVE" : "STANDBY"),
            );
          }),
      );





(() => {
        const $ = (id) => document.getElementById(id),
          v = document.querySelector(".gate-visual");
        let opened = false,
          remaining = 0,
          timer = null,
          transitionTimer = null;
        const stop = () => {
          if (timer) clearInterval(timer);
          timer = null;
          if (transitionTimer) clearTimeout(transitionTimer);
          transitionTimer = null;
        };
        function setState(state, msg) {
          $("gate-status").textContent = state;
          $("gate-svg-status").textContent = "GATE " + state;
          $("gate-feedback").textContent = msg;
          $("gate-motor").textContent =
            state === "OPENING" || state === "CLOSING" ? "RUNNING" : "OFF";
        }
        function close(source = "Automatic schedule") {
          stop();
          $("gate-auto").textContent = "CLOSING";
          setState(
            "CLOSING",
            source + " — gate closing. Safety clearance required.",
          );
          v.dataset.open = "false";
          $("gate-seconds").textContent = "—";
          $("gate-progress").style.width = "0%";
          transitionTimer = setTimeout(() => {
            opened = false;
            setState("CLOSED", "Gate is closed and secure.");
            $("gate-auto").textContent = "READY";
          }, 2100);
        }
        function open(source) {
          stop();
          opened = true;
          v.dataset.open = "true";
          $("gate-auto").textContent = "WAITING";
          setState("OPENING", source + " command accepted — opening gate.");
          $("gate-seconds").textContent = "—";
          transitionTimer = setTimeout(() => {
            setState("OPEN", "Gate open. Automatic closing countdown started.");
            remaining = 8;
            $("gate-auto").textContent = "COUNTDOWN";
            tick();
            timer = setInterval(() => {
              remaining--;
              if (remaining <= 0) {
                close("Automatic schedule");
              } else tick();
            }, 1000);
          }, 2100);
        }
        function tick() {
          $("gate-seconds").textContent = remaining + "s";
          $("gate-progress").style.width = (remaining / 8) * 100 + "%";
        }
        $("gate-phone-open").addEventListener("click", () =>
          open("LifeSmart app"),
        );
        $("gate-phone-close").addEventListener("click", () =>
          close("LifeSmart app"),
        );
        $("gate-watch-open").addEventListener("click", () =>
          open("Apple Watch voice"),
        );
        $("gate-watch-close").addEventListener("click", () =>
          close("Apple Watch voice"),
        );
        setState(
          "CLOSED",
          "Choose Open or Close on either device to control the gate.",
        );
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
