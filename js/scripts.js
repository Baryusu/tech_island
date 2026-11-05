/** Public configuration. Never put API keys, access codes or private project data here. */
      window.TECHISLAND_CONFIG = Object.freeze({
        inquiryEmail: "info@lifesmartph.com",
        inquirySubject: "Techisland smart-home design consultation",
        brandName: "Techisland",
        // The public Tech Island Project page routes inquiries through LifeSmart PH.
        // Confirm the intended inbox with the business owner before public launch.
      });

"use strict";
      /* Small, accessible interactions. No framework, analytics, cookies or server submission. */
      (() => {
        const config = window.TECHISLAND_CONFIG || {};
        const recipient = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          config.inquiryEmail || "",
        )
          ? config.inquiryEmail
          : "info@lifesmartph.com";
        const $ = (selector, root = document) => root.querySelector(selector);
        const $$ = (selector, root = document) =>
          Array.from(root.querySelectorAll(selector));
        const svgIcon = (name) =>
          `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

        // All inserted SVG names and marketing content below are trusted static constants.
        // Visitor-provided values are handled only with textContent or URL encoding.
        const header = $(".site-header");
        const menu = $("#main-nav");
        const menuToggle = $(".menu-toggle");
        const setMenu = (open) => {
          menu.classList.toggle("is-open", open);
          menuToggle.setAttribute("aria-expanded", String(open));
          menuToggle.setAttribute(
            "aria-label",
            open ? "Close navigation" : "Open navigation",
          );
          menuToggle.innerHTML = svgIcon(open ? "close" : "menu");
        };
        menuToggle.addEventListener("click", () =>
          setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
        );
        $$("a", menu).forEach((link) =>
          link.addEventListener("click", () => setMenu(false)),
        );
        document.addEventListener("click", (event) => {
          if (!event.composedPath().includes(header)) setMenu(false);
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
          { passive: true },
        );
        const updateHeader = () =>
          header.classList.toggle("scrolled", window.scrollY > 8);
        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();

        // Layered room visualization. All values and delays below are illustrative UI
        // animation choices; none are installation settings, telemetry or device commands.
        const scenes = {
          morning: {
            name: "Morning",
            time: "07:00",
            moment: "01 / A FRESH START",
            title: "Wake up to a home that feels ready.",
            description:
              "Daylight and brighter white lighting prepare the room for a fresh start.",
            caption: "A gentler start.",
            benefit: "A gentler start, with fewer little things to do.",
            points: [
              [
                "curtains",
                "Welcome the daylight",
                "Curtains open. The window is shown opening separately.",
              ],
              [
                "bulb",
                "A fresh, brighter atmosphere",
                "Dimmable lights shift to a crisp white tone.",
              ],
              [
                "leaf",
                "Only what the moment needs",
                "The television and aircon remain off in this morning example.",
              ],
            ],
            visual: {
              main: 1,
              dim: 1,
              warmth: 0,
              curtains: 1,
              window: 1,
              tv: 0,
              ac: 0,
              hood: 0,
              dusk: 0,
              night: 0,
              party: 0,
            },
          },
          away: {
            name: "Away",
            time: "08:30",
            moment: "02 / LEAVE WITH LESS ON YOUR MIND",
            title: "Your home settles down as you head out.",
            description:
              "Lights fade, selected devices switch off, and the room settles into a quieter, energy-conscious away state.",
            caption: "A little less on your mind.",
            benefit: "Less avoidable energy use. More peace of mind.",
            points: [
              [
                "leaf",
                "Nonessential devices switch off",
                "The picture and each device label change together.",
              ],
              [
                "curtains",
                "Your space settles into privacy",
                "Curtains or shades draw; the window is shown closed.",
              ],
              [
                "shield",
                "Protection remains a priority",
                "An away scene does not mean switching off essential safety functions.",
              ],
            ],
            visual: {
              main: 0,
              dim: 0,
              warmth: 0,
              curtains: 0,
              window: 0,
              tv: 0,
              ac: 0,
              hood: 0,
              dusk: 0,
              night: 0,
              party: 0,
            },
          },
          welcome: {
            name: "Arrival",
            time: "18:30",
            moment: "03 / A WARM WELCOME",
            title: "Come home to your kind of welcome.",
            description:
              "Lighting warms, comfort returns and selected devices come to life for your arrival.",
            caption: "Home, just how you like it.",
            benefit: "The little things, already taken care of.",
            points: [
              [
                "bulb",
                "A gradual, warmer welcome",
                "Light levels rise smoothly instead of changing the picture all at once.",
              ],
              [
                "thermometer",
                "Comfort joins the scene",
                "Aircon, television and lighting respond as separate visual elements.",
              ],
              [
                "heart",
                "Your preferences, not a preset lifestyle",
                "The devices included in your arrival scene are your choice.",
              ],
            ],
            visual: {
              main: 1,
              dim: 0.75,
              warmth: 1,
              curtains: 1,
              window: 0,
              tv: 1,
              ac: 1,
              hood: 0,
              dusk: 1,
              night: 0,
              party: 0,
            },
          },
          night: {
            name: "Night",
            time: "22:00",
            moment: "04 / TIME TO UNWIND",
            title: "Let your home settle in with you.",
            description:
              "Bright lighting gives way to a low warm glow as the room settles into its night setting.",
            caption: "Room to unwind.",
            benefit: "A softer ending to a full day.",
            points: [
              [
                "moon",
                "A softer level of light",
                "A low, warm glow replaces bright overhead lighting.",
              ],
              [
                "curtains",
                "Privacy for the evening",
                "Curtains close and the window remains closed.",
              ],
              [
                "house",
                "Each room has its own needs",
                "Bedroom aircon stays on in this example; the living-room aircon does not.",
              ],
            ],
            visual: {
              main: 0,
              dim: 0.15,
              warmth: 1,
              curtains: 0,
              window: 0,
              tv: 0,
              ac: 0,
              hood: 0,
              dusk: 1,
              night: 1,
              party: 0,
            },
          },
          party: {
            name: "Party",
            time: "20:30",
            moment: "05 / SET THE MOOD",
            title: "One scene. A completely different mood.",
            description:
              "A room-specific mood scene creates a warmer, more expressive atmosphere for the evening.",
            caption: "Tonight feels different.",
            benefit:
              "Atmosphere changes without turning technology into the center of attention.",
            points: [
              [
                "heart",
                "A room-specific mood",
                "Each room responds differently instead of applying one generic scene.",
              ],
              [
                "bulb",
                "Warm, low lighting",
                "Bright task lighting gives way to a softer evening atmosphere.",
              ],
              [
                "sliders",
                "Designed around the occasion",
                "The exact devices and effects depend on the approved home design.",
              ],
            ],
            visual: {
              main: 0,
              dim: 0.28,
              warmth: 1,
              curtains: 0,
              window: 0,
              tv: 1,
              ac: 1,
              hood: 0,
              dusk: 1,
              night: 0.8,
              party: 1,
            },
          },
        };
        const rooms = {
          living: {
            name: "Living room",
            devices: [
              ["tv", "tv", "Television"],
              ["main", "bulb", "Lights"],
              ["dim", "sliders", "Dimmable lights"],
              ["curtains", "curtains", "Curtains"],
              ["window", "window", "Window"],
              ["ac", "aircon", "Aircon"],
            ],
          },
          bedroom: {
            name: "Bedroom",
            devices: [
              ["tv", "tv", "Television"],
              ["main", "bulb", "Lights"],
              ["dim", "sliders", "Dimmable lights"],
              ["curtains", "curtains", "Curtains"],
              ["window", "window", "Window"],
              ["ac", "aircon", "Aircon"],
            ],
          },
          kitchen: {
            name: "Kitchen",
            devices: [
              ["main", "bulb", "Lights"],
              ["dim", "sliders", "Dimmable lights"],
              ["curtains", "curtains", "Window shade"],
              ["window", "window", "Window"],
              ["hood", "fan", "Extractor"],
            ],
          },
        };
        const stage = $("#room-stage");
        const roomConsole = $("#room-console");
        const tabs = $$('.scene-tabs [role="tab"]');
        const roomButtons = $$(".room-tabs button");
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );
        const propertyKeys = Object.keys(scenes.morning.visual);
        const deviceNodes = new Map();
        let roomKey = "living";
        let sceneKey = "welcome";
        let state = { ...scenes.welcome.visual };
        let target = { ...state };
        let frameRequest = 0;
        let currentRun = 0;
        let lastStatusAt = 0;
        const clamp01 = (value) => Math.max(0, Math.min(1, value));
        const blend = (from, to, p) =>
          from.map((value, index) =>
            Math.round(value + (to[index] - value) * p),
          );
        const rgb = (values) => `rgb(${values.join(",")})`;
        const easing = (value) =>
          value < 0.5
            ? 4 * value * value * value
            : 1 - Math.pow(-2 * value + 2, 3) / 2;

        function sceneTarget(key, room) {
          const next = { ...scenes[key].visual };
          if (room === "living") {
            if (key === "welcome") {
              next.main = 1;
              next.dim = 0.75;
              next.warmth = 0;
              next.party = 0;
            }
            if (key === "party") {
              next.main = 0.32;
              next.dim = 0.28;
              next.warmth = 1;
              next.party = 1;
            }
            if (key === "night") {
              next.main = 0.16;
              next.dim = 0.12;
              next.warmth = 0;
              next.party = 0;
            }
          }
          if (room === "bedroom") {
            if (key === "party") {
              next.main = 0;
              next.dim = 0.18;
              next.tv = 0;
              next.ac = 1;
              next.curtains = 0;
              next.window = 0;
              next.warmth = 1;
              next.party = 1;
            }
            if (key === "morning") next.dim = 0.65;
            if (key === "welcome") next.dim = 0.65;
            if (key === "night") {
              next.dim = 0.12;
              next.ac = 1;
            }
          }
          if (room === "kitchen") {
            next.tv = 0;
            next.ac = 0;
            if (key === "party") {
              next.main = 0;
              next.dim = 0.22;
              next.warmth = 1;
              next.hood = 0;
              next.curtains = 0;
              next.window = 0;
              next.party = 1;
            }
            if (key === "welcome") {
              next.dim = 0.85;
              next.warmth = 0.65;
              next.hood = 1;
            }
            if (key === "night") next.dim = 0.1;
          }
          return next;
        }

        function buildDeviceCards() {
          const container = $("#scene-states");
          container.replaceChildren();
          deviceNodes.clear();
          rooms[roomKey].devices.forEach(([key, icon, label]) => {
            const card = document.createElement("div");
            card.className = "device-card";
            card.dataset.device = key;
            const top = document.createElement("div");
            top.className = "device-card-top";
            top.innerHTML = svgIcon(icon);
            const name = document.createElement("span");
            name.className = "device-name";
            name.textContent = label;
            top.append(name);
            const value = document.createElement("b");
            value.className = "device-value";
            const detail = document.createElement("span");
            detail.className = "device-detail";
            const rail = document.createElement("span");
            rail.className = "device-level";
            rail.setAttribute("aria-hidden", "true");
            const fill = document.createElement("span");
            rail.append(fill);
            card.append(top, value, detail, rail);
            container.append(card);
            deviceNodes.set(key, { card, value, detail, fill, label });
          });
        }

        function renderIllustration() {
          const s = state;
          const daylight =
            (1 - s.night) * (0.13 + 0.87 * s.curtains) * (1 - 0.77 * s.dusk);
          // Surface illumination and independent emitters are separate, so an off TV
          // cannot become lit merely because the room's lights have brightened.
          const exposure = Math.min(
            1.08,
            0.11 + 0.25 * daylight + 0.43 * s.main + 0.24 * s.dim + 0.03 * s.tv,
          );
          const mainColor = rgb(
            blend([227, 240, 255], [255, 216, 161], s.warmth),
          );
          const dimColor = rgb(
            blend([237, 245, 255], [255, 202, 125], s.warmth),
          );
          const variables = {
            "--rr-exposure": exposure.toFixed(4),
            "--rr-saturation": (0.72 + (0.2 * (s.main + s.dim)) / 2).toFixed(3),
            "--rr-main": s.main.toFixed(4),
            "--rr-dim": s.dim.toFixed(4),
            "--rr-tv": s.tv.toFixed(4),
            "--rr-ac": s.ac.toFixed(4),
            "--rr-hood": s.hood.toFixed(4),
            "--rr-dusk": s.dusk.toFixed(4),
            "--rr-night": s.night.toFixed(4),
            "--rr-party": s.party.toFixed(4),
            "--rr-fire": (roomKey === "living" && sceneKey === "party"
              ? 1
              : roomKey === "living" && sceneKey === "welcome"
                ? 0.82
                : 0
            ).toFixed(3),
            "--rr-daylight": daylight.toFixed(4),
            "--rr-outside": (1 - 0.4 * s.dusk - 0.3 * s.night).toFixed(4),
            "--rr-light-color": mainColor,
            "--rr-dim-color": dimColor,
          };
          Object.entries(variables).forEach(([name, value]) =>
            stage.style.setProperty(name, value),
          );
          const curtainScale = 1 - 0.82 * s.curtains;
          $("#rr-curtain-left").setAttribute(
            "transform",
            `translate(782 0) scale(${curtainScale.toFixed(4)} 1) translate(-782 0)`,
          );
          $("#rr-curtain-right").setAttribute(
            "transform",
            `translate(1074 0) scale(${curtainScale.toFixed(4)} 1) translate(-1074 0)`,
          );
          const rollerScale = 1 - 0.95 * s.curtains;
          $("#rr-roller").setAttribute(
            "transform",
            `translate(0 132) scale(1 ${rollerScale.toFixed(4)}) translate(0 -132)`,
          );
          $("#rr-window-sash").setAttribute(
            "transform",
            `translate(${(-119 * s.window).toFixed(2)} 0)`,
          );
          $("#rr-tv-indicator").setAttribute(
            "fill",
            s.tv > 0.1 ? "#a6d8af" : "#61715b",
          );
        }

        function deviceStatus(key, moving) {
          const amount = state[key];
          const changing = moving && Math.abs(amount - target[key]) > 0.006;
          const percent = Math.round(amount * 100);
          const warmth = state.warmth;
          const kelvin = Math.round((5000 - 2300 * warmth) / 100) * 100;
          const tone =
            warmth < 0.28 ? "White" : warmth < 0.77 ? "Neutral" : "Warm";
          const lightColor = rgb(
            blend(
              blend([73, 107, 124], [147, 111, 64], warmth),
              blend([38, 88, 130], [138, 81, 18], warmth),
              amount,
            ),
          );
          const colorOff = "#70766b";
          const response = {
            value: "Off",
            detail: "",
            status: "off",
            color: colorOff,
            level: amount,
            moving: changing,
          };
          if (key === "main" || key === "dim") {
            const lightMoving =
              changing ||
              (moving &&
                Math.abs(state.warmth - target.warmth) > 0.018 &&
                amount > 0.01);
            response.moving = lightMoving;
            if (amount < 0.008 && !lightMoving) {
              response.detail =
                key === "main" ? "Ceiling lights" : "0% brightness";
            } else {
              response.color = lightColor;
              response.status = warmth > 0.76 ? "warm" : "white";
              if (lightMoving && changing) {
                response.value = `${target[key] > amount ? "Brightening" : "Dimming"} · ${percent}%`;
              } else {
                response.value =
                  key === "main"
                    ? "On"
                    : `${percent < 99 ? "Dimmed" : "Bright"} · ${percent}%`;
              }
              response.detail =
                key === "main"
                  ? `${tone} light · ${kelvin} K`
                  : `${tone} · ${kelvin} K${roomKey === "bedroom" ? " · Bedside" : roomKey === "kitchen" ? " · Pendants" : ""}`;
            }
            return response;
          }
          if (key === "curtains" || key === "window") {
            response.status =
              amount > 0.99 ? "open" : amount < 0.01 ? "closed" : "moving";
            response.color = amount > 0.01 ? "#396d4c" : colorOff;
            response.value = changing
              ? `${target[key] > amount ? "Opening" : "Closing"} · ${percent}%`
              : amount > 0.99
                ? "Open"
                : amount < 0.01
                  ? "Closed"
                  : `${percent}% open`;
            response.detail =
              key === "curtains"
                ? roomKey === "kitchen"
                  ? "Motorized shade"
                  : "Curtain position"
                : "Window position";
            return response;
          }
          if (key === "tv") {
            response.value = changing
              ? target.tv > amount
                ? "Turning on"
                : "Turning off"
              : amount > 0.5
                ? "On"
                : "Off";
            response.status = amount > 0.05 ? "on" : "off";
            response.color = amount > 0.05 ? "#396d4c" : colorOff;
            response.detail = amount > 0.5 ? "Screen active" : "Screen dark";
          }
          if (key === "ac") {
            response.value = changing
              ? target.ac > amount
                ? "Starting"
                : "Stopping"
              : amount > 0.5
                ? "On · 24°C"
                : "Off";
            response.status = amount > 0.05 ? "cooling" : "off";
            response.color = amount > 0.05 ? "#365f83" : colorOff;
            response.detail =
              amount > 0.5
                ? state.window > 0.01
                  ? "Adjusting comfort"
                  : sceneKey === "night"
                    ? "Bedroom comfort"
                    : "Cooling · Window closed"
                : "No cooling";
          }
          if (key === "hood") {
            response.value = changing
              ? target.hood > amount
                ? "Starting"
                : "Stopping"
              : amount > 0.5
                ? "On"
                : "Off";
            response.status = amount > 0.05 ? "on" : "off";
            response.color = amount > 0.05 ? "#396d4c" : colorOff;
            response.detail =
              amount > 0.5 ? "Extraction active" : "Extraction off";
          }
          return response;
        }

        function renderDeviceStatuses(moving) {
          deviceNodes.forEach((nodes, key) => {
            const data = deviceStatus(key, moving);
            nodes.card.dataset.state = data.status;
            nodes.card.dataset.moving = String(data.moving);
            nodes.card.style.setProperty("--device-color", data.color);
            nodes.value.textContent = data.value;
            nodes.detail.textContent = data.detail;
            nodes.fill.style.transform = `scaleX(${clamp01(data.level).toFixed(3)})`;
          });
        }

        function renderSceneCopy() {
          const scene = scenes[sceneKey];
          $("#scene-panel").setAttribute(
            "aria-labelledby",
            `scene-tab-${sceneKey}`,
          );
          $("#scene-title").textContent = scene.title;
          $("#scene-description").textContent = scene.description;
          $("#scene-image-caption").textContent = scene.caption;
          $("#scene-moment").textContent = scene.moment;
          $("#scene-benefit").textContent = scene.benefit;
          $("#room-name").textContent = rooms[roomKey].name;
          const time = $("#room-scene-time");
          time.replaceChildren(document.createTextNode(scene.time + " "));
          const label = document.createElement("span");
          label.textContent = `· ${scene.name}`;
          time.append(label);
          const points = scene.points.map((point) => [...point]);
          // Visible text follows room equipment; no television or aircon appears in kitchen statuses.
          if (sceneKey === "welcome" && roomKey === "living") {
            $("#scene-title").textContent =
              "A bright welcome, with the fireplace already glowing.";
            $("#scene-description").textContent =
              "White ceiling lighting comes on for a clear arrival scene while the animated digital fireplace starts beneath the television. Dimmable lighting and Kelvin data show how the room can shift from functional white light to warmer evening moods.";
          }
          if (sceneKey === "party") {
            if (roomKey === "living") {
              $("#scene-title").textContent =
                "Turn the living room into a warmer, more romantic space.";
              $("#scene-description").textContent =
                "Ceiling lights settle into a low warm tone, dimmable lighting softens, curtains close, and the animated digital fireplace becomes part of the atmosphere. The television can remain available without dominating the room.";
            } else if (roomKey === "bedroom") {
              $("#scene-title").textContent =
                "A romantic bedroom mood, with stars overhead.";
              $("#scene-description").textContent =
                "Bright lighting gives way to a very soft warm bedside glow. Curtains close, the television stays dark, aircon maintains comfort, and a star projection appears across the ceiling in this concept scene.";
            } else {
              $("#scene-title").textContent =
                "Warm kitchen lighting with a playful party accent.";
              $("#scene-description").textContent =
                "Task lighting dims down, pendants shift warm, the shade closes, and subtle disco-light accents animate the room for entertaining.";
            }
          }
          if (roomKey === "kitchen") {
            if (sceneKey === "morning") {
              $("#scene-description").textContent =
                "The window shade rises, fresh daylight enters, and white lighting brightens the kitchen. The extractor stays off until the scene calls for it.";
              points[2] = [
                "leaf",
                "Only what the kitchen needs",
                "Lighting and shade settings are shown separately from extraction.",
              ];
            }
            if (sceneKey === "away")
              $("#scene-description").textContent =
                "Ceiling and pendant lights fade out, the extractor stops, the shade lowers and the window closes. The kitchen settles into its own away setting.";
            if (sceneKey === "welcome") {
              $("#scene-description").textContent =
                "The kitchen brightens with a welcoming glow. Pendant lighting rises, the shade opens and extraction starts in this illustrative kitchen scene. Cooking appliances stay outside this demonstration.";
              points[1] = [
                "fan",
                "A kitchen-specific welcome",
                "Lighting, the window shade and extraction each have their own visual state.",
              ];
            }
            if (sceneKey === "night") {
              $("#scene-description").textContent =
                "The ceiling lights and extractor turn off. Pendant lighting settles to a low, warm glow, while the shade and window close for the night.";
              points[2] = [
                "house",
                "Every room is considered",
                "The kitchen shows its own lighting and ventilation devices—not bedroom equipment.",
              ];
            }
          } else if (roomKey === "bedroom" && sceneKey === "night") {
            $("#scene-description").textContent =
              "The television and ceiling lights switch off. Bedside lighting softens to 12% in a warm tone, the curtains close, and aircon remains on with the window closed in this bedroom example.";
          }
          const container = $("#scene-story-points");
          container.replaceChildren();
          points.forEach(([icon, title, text]) => {
            const row = document.createElement("div");
            row.innerHTML = svgIcon(icon);
            const copy = document.createElement("p");
            const strong = document.createElement("b");
            strong.textContent = title;
            copy.append(strong, document.createTextNode(text));
            row.append(copy);
            container.append(row);
          });
          stage.dataset.room = roomKey;
          stage.dataset.scene = sceneKey;
          $(".smart-room-svg", stage).setAttribute(
            "aria-label",
            `${rooms[roomKey].name} illustration, ${scene.name.toLowerCase()} scene. Device statuses are shown below the illustration.`,
          );
        }

        function updateTransitionLabel(moving) {
          const label = $("#room-transition-label");
          label.replaceChildren();
          const dot = document.createElement("i");
          dot.setAttribute("aria-hidden", "true");
          label.append(
            dot,
            document.createTextNode(
              moving
                ? `${scenes[sceneKey].name} · Setting the scene…`
                : `${scenes[sceneKey].name} scene ready`,
            ),
          );
          stage.dataset.transitioning = String(moving);
          roomConsole.setAttribute("aria-busy", String(moving));
        }

        function finishScene() {
          state = { ...target };
          renderIllustration();
          renderDeviceStatuses(false);
          updateTransitionLabel(false);
          $("#room-transition-progress").style.transform = "scaleX(1)";
          const statuses = [...deviceNodes]
            .map(
              ([key, nodes]) =>
                `${nodes.label}: ${deviceStatus(key, false).value}`,
            )
            .join("; ");
          $("#room-live-summary").textContent =
            `${scenes[sceneKey].name} scene ready. ${rooms[roomKey].name}. ${statuses}.`;
        }

        function cancelSceneAnimation() {
          currentRun += 1;
          if (frameRequest) window.cancelAnimationFrame(frameRequest);
          frameRequest = 0;
        }

        function animateScene() {
          cancelSceneAnimation();
          if (
            reducedMotion.matches ||
            propertyKeys.every(
              (key) => Math.abs(state[key] - target[key]) < 0.001,
            )
          ) {
            finishScene();
            return;
          }
          const run = currentRun;
          const initial = { ...state };
          const arriving = sceneKey === "welcome";
          // Presentation choreography only. Window movement is complete before the
          // cooling illustration starts; no physical control commands are generated.
          const timings = {
            main: [arriving ? 120 : 230, arriving ? 2700 : 2150],
            dim: [arriving ? 520 : 330, arriving ? 3100 : 2600],
            warmth: [0, 2300],
            curtains: [0, 2900],
            window: [0, 1200],
            tv: [arriving ? 1250 : 0, arriving ? 950 : 550],
            ac: [target.ac > initial.ac ? 1350 : 0, 750],
            hood: [arriving ? 1200 : 0, 650],
            dusk: [0, 2200],
            night: [0, 2200],
            party: [0, 1600],
          };
          const total = Math.max(
            ...propertyKeys
              .filter((key) => Math.abs(initial[key] - target[key]) > 0.001)
              .map((key) => timings[key][0] + timings[key][1]),
          );
          const started = performance.now();
          lastStatusAt = -Infinity;
          updateTransitionLabel(true);
          $("#room-transition-progress").style.transform = "scaleX(0)";
          const tick = (now) => {
            if (run !== currentRun) return;
            const elapsed = now - started;
            propertyKeys.forEach((key) => {
              const [delay, duration] = timings[key];
              const progress = easing(clamp01((elapsed - delay) / duration));
              state[key] =
                initial[key] + (target[key] - initial[key]) * progress;
            });
            renderIllustration();
            if (now - lastStatusAt > 85) {
              renderDeviceStatuses(true);
              lastStatusAt = now;
            }
            $("#room-transition-progress").style.transform =
              `scaleX(${clamp01(elapsed / total).toFixed(4)})`;
            if (elapsed < total)
              frameRequest = window.requestAnimationFrame(tick);
            else {
              frameRequest = 0;
              finishScene();
            }
          };
          frameRequest = window.requestAnimationFrame(tick);
        }

        const setScene = (key) => {
          if (!scenes[key]) return;
          sceneKey = key;
          tabs.forEach((tab) => {
            const selected = tab.dataset.scene === key;
            tab.setAttribute("aria-selected", String(selected));
            tab.tabIndex = selected ? 0 : -1;
          });
          target = sceneTarget(sceneKey, roomKey);
          renderSceneCopy();
          animateScene();
        };
        const setRoom = (key) => {
          if (!rooms[key]) return;
          cancelSceneAnimation();
          roomKey = key;
          roomButtons.forEach((button) =>
            button.setAttribute(
              "aria-pressed",
              String(button.dataset.room === key),
            ),
          );
          target = sceneTarget(sceneKey, roomKey);
          buildDeviceCards();
          renderSceneCopy();
          finishScene();
        };
        tabs.forEach((tab, index) => {
          tab.addEventListener("click", () => setScene(tab.dataset.scene));
          tab.addEventListener("keydown", (event) => {
            let next;
            if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
            if (event.key === "ArrowLeft")
              next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = tabs.length - 1;
            if (next !== undefined) {
              event.preventDefault();
              setScene(tabs[next].dataset.scene);
              tabs[next].focus();
            }
          });
        });
        roomButtons.forEach((button) =>
          button.addEventListener("click", () => setRoom(button.dataset.room)),
        );
        const motionPreferenceChanged = () => {
          if (reducedMotion.matches) {
            cancelSceneAnimation();
            finishScene();
          }
        };
        if (reducedMotion.addEventListener)
          reducedMotion.addEventListener("change", motionPreferenceChanged);
        else if (reducedMotion.addListener)
          reducedMotion.addListener(motionPreferenceChanged);
        buildDeviceCards();
        renderSceneCopy();
        finishScene();

        // Illustrative internet outage; never claims to read or control real equipment.
        const internetToggle = $("#internet-toggle");
        internetToggle.addEventListener("click", () => {
          const online = internetToggle.getAttribute("aria-checked") !== "true";
          internetToggle.setAttribute("aria-checked", String(online));
          $("#system-demo").dataset.online = String(online);
          $("#internet-state").textContent = online
            ? "Connected"
            : "Disconnected";
          $("#remote-state").textContent = online
            ? "Internet connection available"
            : "Remote access & cloud features unavailable";
          $("#demo-response").textContent = online
            ? "Try switching off the internet above. The supported local-control path stays available."
            : "Internet off. Supported local routines remain available with power; remote access and cloud features need a connection. Local app access also needs a working local network and configured local login.";
        });

        // Native dialogs provide focus trapping, Escape support and focus restoration.
        const showDialog = (dialog) => {
          if (!dialog || dialog.open) return;
          dialog.showModal();
          document.body.classList.add("dialog-open");
        };
        $$(".site-dialog").forEach((dialog) => {
          $(".dialog-close", dialog).addEventListener("click", () =>
            dialog.close(),
          );
          dialog.addEventListener("close", () => {
            if (!$$(".site-dialog").some((item) => item.open))
              document.body.classList.remove("dialog-open");
          });
          // Backdrop activation only when both press and release are outside the dialog.
          let pressedOutside = false;
          const outside = (e) => {
            const rect = dialog.getBoundingClientRect();
            return (
              e.clientX < rect.left ||
              e.clientX > rect.right ||
              e.clientY < rect.top ||
              e.clientY > rect.bottom
            );
          };
          dialog.addEventListener("pointerdown", (e) => {
            pressedOutside = e.target === dialog && outside(e);
          });
          dialog.addEventListener("click", (e) => {
            if (pressedOutside && e.target === dialog && outside(e))
              dialog.close();
            pressedOutside = false;
          });
        });
        $$("[data-open-privacy]").forEach((button) =>
          button.addEventListener("click", () =>
            showDialog($("#privacy-dialog")),
          ),
        );

        const services = {
          design: {
            title: "Design first. Smart by intention.",
            intro:
              "We start with how you want to live, then create a coordinated technology scope for your home.",
            details: [
              [
                "Consultation & design",
                "Lifestyle discovery, priorities, room-by-room requirements and a coordinated smart-home scope.",
              ],
              [
                "Project coordination",
                "Alignment with architects, interior designers, lighting designers, electricians and specialist suppliers.",
              ],
              [
                "Integration & commissioning",
                "Device integration, scene configuration, testing and a guided handover—not simply boxes on a wall.",
              ],
              [
                "Life after installation",
                "Practical user training and a support arrangement defined with your project.",
              ],
            ],
            note: "Detailed engineering, product selection and support deliverables are confirmed in the project proposal.",
            interest: "Complete smart home",
            demoUrl: "pages/smart-spaces.html",
            demoLabel: "Explore Smart Spaces Concept Catalog →",
          },
          network: {
            title: "A connected home starts here.",
            intro:
              "A smart home is only as good as its connection. We design the network around the property so coverage feels seamless throughout the home.",
            details: [
              [
                "Zero Dead Spot Wi-Fi",
                "Professionally planned coverage designed to reach the spaces where you actually use your connected home.",
              ],
              [
                "Whole-home Wi-Fi planning",
                "Access-point placement and coverage planning for rooms, common areas and agreed outdoor spaces.",
              ],
              [
                "Network management",
                "Appropriate access separation for residents, guests and connected systems.",
              ],
              [
                "Reliable connected living",
                "A professionally engineered network foundation designed for dependable everyday performance.",
              ],
            ],
            note: "Coverage and performance are checked against the site conditions and agreed design. No internet provider or wireless system can promise universal uninterrupted service.",
            interest: "Networking & Wi-Fi",
            demoUrl: "pages/special-solutions.html",
            demoLabel: "Explore Special Solutions Portfolio →",
          },
          comfort: {
            title: "Comfort that belongs in the background.",
            intro:
              "Lighting, climate and shading are designed together to make your everyday spaces feel right.",
            details: [
              [
                "Lighting & atmosphere",
                "Compatible dimmable and tunable lighting, scene control and coordination with the lighting and interior design.",
              ],
              [
                "Climate & humidity",
                "Supported air-conditioning control, humidity monitoring and suitable equipment integration.",
              ],
              [
                "Curtains, blinds & smart glass",
                "Convenient privacy and daylight control where the selected motors and products support integration.",
              ],
              [
                "Audio & personal spaces",
                "Supported home-theater, audio, appliance and specialist-area integration.",
              ],
            ],
            note: "Fixture, appliance and controller compatibility is verified before implementation. Air-quality capabilities depend on the actual detectors specified.",
            interest: "Lighting & comfort",
            demoUrl: "pages/doors-windows.html",
            demoLabel: "Explore Doors, Windows & Curtains Simulation →",
          },
          protection: {
            title: "Protect what matters. Respond sooner.",
            intro:
              "Connected awareness helps your household recognize risks and take action—with safeguards planned into the design.",
            details: [
              [
                "Security & access",
                "Supported door and window sensors, motion detection, smart access, cameras and gate coordination.",
              ],
              [
                "Hazard awareness",
                "Suitable smoke, leak and other specified hazard sensing, with supported local alerts and notifications.",
              ],
              [
                "Family care",
                "Accessible controls and supported panic-button solutions designed around the household’s needs.",
              ],
              [
                "Specialist integration",
                "Assessment of compatible alarm-panel, valve, water-system and other third-party interfaces.",
              ],
            ],
            note: "Automation supplements, not replaces, certified life-safety systems and emergency procedures. Off-site alerts depend on communications, and no system guarantees prevention or an emergency response.",
            interest: "Security & safety",
          },
          energy: {
            title: "Less waste. A more considered energy plan.",
            intro:
              "We connect efficiency and monitoring with your solar goals—without treating solar as a substitute for a well-designed home.",
            details: [
              [
                "Consumption visibility",
                "Energy monitoring for the agreed appliances, circuits or areas where metering is included.",
              ],
              [
                "Energy-conscious operation",
                "Suitable automation that helps reduce avoidable use while respecting comfort and essential equipment.",
              ],
              [
                "Solar-provider coordination",
                "Integration planning around your selected or existing inverter, metering and supported interfaces.",
              ],
              [
                "Backup priorities",
                "Coordination with qualified specialists on which critical smart-home and network systems need backup power.",
              ],
            ],
            note: "Techisland provides planning and smart integration; solar panel supply and installation remain with the chosen solar specialist. Actual savings vary and are not guaranteed.",
            interest: "Energy & solar integration",
            demoUrl: "pages/energy.html",
            demoLabel: "Explore Solar & Energy Simulation →",
          },
          ev: {
            title: "Your next car belongs in today’s plan.",
            intro:
              "Make EV charging part of the overall home design, with the infrastructure and compatibility checked before installation.",
            details: [
              [
                "Charging location & readiness",
                "Coordinate the charging location and infrastructure requirements with the project team.",
              ],
              [
                "Power & specialist coordination",
                "Work with qualified electrical and charging specialists on the available supply and charging requirements.",
              ],
              [
                "Metering & compatible control",
                "Plan visibility and supported charging control around the selected charger and home system.",
              ],
              [
                "Energy integration",
                "Assess possible coordination with solar, storage and load-management equipment where supported.",
              ],
            ],
            note: "Charging and solar-aware functions depend on the specific vehicle, charger, inverter and electrical design. Electrical protections and installation remain subject to specialist approval.",
            interest: "EV charging integration",
            demoUrl: "pages/electric-gate.html",
            demoLabel: "Explore Smart Gate & Access Simulation →",
          },
        };
        let selectedService;
        $$("[data-service]").forEach((button) =>
          button.addEventListener("click", () => {
            selectedService = services[button.dataset.service];
            if (!selectedService) return;
            $("#service-dialog-title").textContent = selectedService.title;
            $("#service-dialog-intro").textContent = selectedService.intro;
            $("#service-dialog-note").textContent = selectedService.note;
            const target = $("#service-dialog-details");
            target.replaceChildren();
            selectedService.details.forEach(([title, copy]) => {
              const article = document.createElement("article");
              article.className = "dialog-detail-item";
              const heading = document.createElement("h3");
              heading.textContent = title;
              const text = document.createElement("p");
              text.textContent = copy;
              article.append(heading, text);
              target.append(article);
            });
                        const demoLink = $("#service-dialog-demo");
            if (demoLink) {
              if (selectedService.demoUrl) {
                demoLink.href = selectedService.demoUrl;
                const span = demoLink.querySelector("span");
                if (span) span.textContent = selectedService.demoLabel || "Explore Live Simulation";
                demoLink.style.display = "inline-flex";
              } else {
                demoLink.style.display = "none";
              }
            }
            showDialog($("#service-dialog"));
          }),
        );
        $("#service-dialog-cta").addEventListener("click", () => {
          const interest = $$('input[name="interest"]').find(
            (input) => input.value === selectedService?.interest,
          );
          if (interest) interest.checked = true;
          $("#service-dialog").close();
          setTimeout(() => $("#name").focus({ preventScroll: true }), 500);
        });

        // Prepare a consultation brief locally. No backend, fake success state, or automatic sending.
        let currentBrief = "";
        const form = $("#consultation-form");
        const clean = (value) =>
          String(value || "")
            .trim()
            .replace(/\u0000/g, "");
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          if (!form.reportValidity()) return;
          const data = new FormData(form);
          const name = clean(data.get("name"));
          const email = clean(data.get("email"));
          const location = clean(data.get("location"));
          if (!name || !location) {
            const empty = !name ? $("#name") : $("#location");
            empty.setCustomValidity("Please enter a value, not just spaces.");
            empty.reportValidity();
            return;
          }
          const interests = data.getAll("interest").map(clean);
          currentBrief = [
            "TECHISLAND — SMART-HOME CONSULTATION BRIEF",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Project: ${clean(data.get("project"))}`,
            `Location: ${location}`,
            `Stage: ${clean(data.get("stage"))}`,
            "",
            "INTERESTS",
            interests.length
              ? interests.map((value) => `• ${value}`).join("\n")
              : "Open to recommendations",
            "",
            "WHAT WOULD MAKE LIFE BETTER",
            clean(data.get("notes")) || "To be discussed during consultation.",
            "",
            "Please contact me to discuss the project scope, next steps and consultation arrangements.",
          ].join("\n");
          $("#brief-summary").textContent = currentBrief;
          const subject = `${config.inquirySubject || "Techisland design consultation"} — ${name}`;
          $("#brief-email").href =
            `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(currentBrief)}`;
          $("#brief-status").textContent =
            "Your email app will open a draft. You review and send it yourself.";
          $("#form-status").textContent =
            "Your consultation brief is ready for review. It has not been sent.";
          showDialog($("#brief-dialog"));
        });
        // Fail closed when scripts are unavailable: the HTML submit control starts disabled.
        $(".form-submit").disabled = false;
        ["name", "location"].forEach((id) =>
          $(`#${id}`).addEventListener("input", () =>
            $(`#${id}`).setCustomValidity(""),
          ),
        );
        $("#brief-copy").addEventListener("click", async () => {
          try {
            if (!navigator.clipboard?.writeText)
              throw new Error("Clipboard unavailable");
            await navigator.clipboard.writeText(currentBrief);
            $("#brief-status").textContent =
              "Brief copied. Nothing has been sent.";
          } catch (_) {
            const range = document.createRange();
            range.selectNodeContents($("#brief-summary"));
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            $("#brief-status").textContent =
              "Automatic copying is unavailable here. The brief is selected; use your device’s Copy command, or save a copy.";
          }
        });
        $("#brief-download").addEventListener("click", () => {
          if (!currentBrief) return;
          const blob = new Blob(["\uFEFF", currentBrief], {
            type: "text/plain;charset=utf-8",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "Techisland-consultation-brief.txt";
          document.body.append(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 30000);
          $("#brief-status").textContent =
            "A text-file download was requested. Check your device’s downloads or save prompt. Nothing has been sent.";
        });
        $$(".inquiry-email").forEach((link) => {
          link.textContent = recipient;
          link.href = `mailto:${recipient}`;
        });
        $$(".inquiry-email-text").forEach((element) => {
          element.textContent = recipient;
        });
        $("#year").textContent = String(new Date().getFullYear());
      })();
