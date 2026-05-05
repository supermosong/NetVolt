# Wi-Fi Connection Animation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static SVG diagram in Section 1 of `pages/wifi-networking.html` with a 7-step interactive animation showing a glowing packet traveling from device to internet and back, with auto-advance, pause/play, and clickable nodes.

**Architecture:** Single file modification only — all HTML, inline `<style>`, and an IIFE `<script>` are injected into `pages/wifi-networking.html` following the exact same pattern as the existing Wall Penetration Simulator (lines 499–978). The SVG diagram is `viewBox="0 0 680 140"`, nodes are `<g>` groups, connecting lines have a dim base layer and a color glow layer. A pulsing `<circle>` packet is repositioned each `requestAnimationFrame` via quadratic ease-in/out interpolation.

**Tech Stack:** HTML5, inline SVG, Vanilla JS (`var`/`function` ES5-compatible style matching the rest of the codebase), no external libraries.

---

## File Structure

**Only one file is modified:**

| File | What changes |
|------|-------------|
| `pages/wifi-networking.html` | Remove lines 252–329 (static SVG div). Insert animation HTML at line 252. Insert `<style>` block after line 332 (`</section>`). Insert `<script>` IIFE after the `<style>` block. |

---

## Task 1: Replace static SVG with animation HTML scaffold

**Files:**
- Modify: `pages/wifi-networking.html:252-329`

- [ ] **Step 1: Remove lines 252–329 and insert the animation HTML**

In `pages/wifi-networking.html`, find and replace the entire block from line 252 (`<div style="margin-top: var(--space-6); overflow-x: auto;">`) through line 329 (`</div>`) inclusive, with the following HTML:

```html
        <div class="wf-wrap" style="margin-top: var(--space-6);">

          <svg class="wf-svg" viewBox="0 0 680 140" xmlns="http://www.w3.org/2000/svg"
               role="img"
               aria-label="Animated diagram: data travels from your device to the internet and back">

            <!-- Base dim lines (always visible) -->
            <line x1="114" y1="65" x2="208" y2="65"
                  stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round"/>
            <line x1="276" y1="65" x2="388" y2="65"
                  stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round"/>
            <line x1="456" y1="65" x2="564" y2="65"
                  stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round"/>

            <!-- Glow lines (opacity toggled by JS to highlight active segment) -->
            <line id="wf-glow-dr" x1="114" y1="65" x2="208" y2="65"
                  stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" opacity="0"/>
            <line id="wf-glow-rm" x1="276" y1="65" x2="388" y2="65"
                  stroke="#c8ff00" stroke-width="2.5" stroke-linecap="round" opacity="0"/>
            <line id="wf-glow-mi" x1="456" y1="65" x2="564" y2="65"
                  stroke="#bc8cff" stroke-width="2.5" stroke-linecap="round" opacity="0"/>

            <!-- Connection type labels -->
            <text x="161" y="50" text-anchor="middle"
                  fill="rgba(255,255,255,0.2)" font-size="9"
                  font-family="'Fira Code','Courier New',monospace">radio waves</text>
            <text x="332" y="50" text-anchor="middle"
                  fill="rgba(255,255,255,0.2)" font-size="9"
                  font-family="'Fira Code','Courier New',monospace">cable</text>
            <text x="510" y="50" text-anchor="middle"
                  fill="rgba(255,255,255,0.2)" font-size="9"
                  font-family="'Fira Code','Courier New',monospace">fibre / cable</text>

            <!-- NODE: Device (center x=66) -->
            <g id="wf-node-device" tabindex="0" role="button"
               aria-label="Your device — click to jump to step 1">
              <rect id="wf-nr-device" x="18" y="35" width="96" height="60" rx="7"
                    fill="#111820" stroke="rgba(0,229,255,0.25)" stroke-width="1.5"/>
              <!-- laptop screen -->
              <rect x="28" y="43" width="76" height="30" rx="3" fill="#0a0e16"/>
              <!-- laptop base -->
              <rect x="43" y="75" width="46" height="5" rx="2" fill="#1e2a3a"/>
              <text x="66" y="100" text-anchor="middle"
                    fill="rgba(0,229,255,0.65)" font-size="9"
                    font-family="'Fira Code','Courier New',monospace" font-weight="700">YOUR DEVICE</text>
              <text x="66" y="111" text-anchor="middle"
                    fill="#3d4a60" font-size="8"
                    font-family="'Fira Code','Courier New',monospace">phone / laptop</text>
            </g>

            <!-- NODE: Router (center x=242) -->
            <g id="wf-node-router" tabindex="0" role="button"
               aria-label="Router — click to jump to step 3">
              <rect id="wf-nr-router" x="208" y="35" width="68" height="60" rx="7"
                    fill="#111820" stroke="rgba(200,255,0,0.25)" stroke-width="1.5"/>
              <!-- antennas -->
              <line x1="224" y1="35" x2="222" y2="20"
                    stroke="rgba(200,255,0,0.5)" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="242" y1="35" x2="242" y2="16"
                    stroke="rgba(200,255,0,0.5)" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="260" y1="35" x2="262" y2="20"
                    stroke="rgba(200,255,0,0.5)" stroke-width="1.5" stroke-linecap="round"/>
              <!-- Wi-Fi arcs -->
              <path d="M226 58 Q242 47 258 58"
                    fill="none" stroke="rgba(200,255,0,0.5)" stroke-width="1.5"/>
              <path d="M232 64 Q242 57 252 64"
                    fill="none" stroke="rgba(200,255,0,0.5)" stroke-width="1.5"/>
              <circle cx="242" cy="69" r="2.5" fill="rgba(200,255,0,0.7)"/>
              <text x="242" y="100" text-anchor="middle"
                    fill="rgba(200,255,0,0.65)" font-size="9"
                    font-family="'Fira Code','Courier New',monospace" font-weight="700">ROUTER</text>
              <text x="242" y="111" text-anchor="middle"
                    fill="#3d4a60" font-size="8"
                    font-family="'Fira Code','Courier New',monospace">home hub</text>
            </g>

            <!-- NODE: Modem (center x=422) -->
            <g id="wf-node-modem" tabindex="0" role="button"
               aria-label="Modem — click to jump to step 5">
              <rect id="wf-nr-modem" x="388" y="35" width="68" height="60" rx="7"
                    fill="#111820" stroke="rgba(255,184,0,0.25)" stroke-width="1.5"/>
              <!-- modem indicator bars -->
              <rect x="400" y="48" width="44" height="6" rx="2" fill="#1a2030"/>
              <rect x="400" y="60" width="44" height="6" rx="2" fill="#1a2030"/>
              <!-- LEDs -->
              <circle cx="403" cy="51" r="2" fill="rgba(255,184,0,0.6)"/>
              <circle cx="403" cy="63" r="2" fill="rgba(0,214,143,0.6)"/>
              <text x="422" y="100" text-anchor="middle"
                    fill="rgba(255,184,0,0.65)" font-size="9"
                    font-family="'Fira Code','Courier New',monospace" font-weight="700">MODEM</text>
              <text x="422" y="111" text-anchor="middle"
                    fill="#3d4a60" font-size="8"
                    font-family="'Fira Code','Courier New',monospace">ISP gateway</text>
            </g>

            <!-- NODE: Internet cloud (center x=610) -->
            <g id="wf-node-internet" tabindex="0" role="button"
               aria-label="Internet — click to jump to step 6">
              <ellipse id="wf-nr-internet" cx="610" cy="65" rx="44" ry="32"
                       fill="#111820" stroke="rgba(188,140,255,0.25)" stroke-width="1.5"/>
              <!-- globe lines -->
              <ellipse cx="610" cy="65" rx="16" ry="30"
                       fill="none" stroke="rgba(188,140,255,0.25)" stroke-width="1"/>
              <line x1="566" y1="65" x2="654" y2="65"
                    stroke="rgba(188,140,255,0.25)" stroke-width="1"/>
              <ellipse cx="610" cy="65" rx="44" ry="14"
                       fill="none" stroke="rgba(188,140,255,0.25)" stroke-width="1"/>
              <text x="610" y="95" text-anchor="middle"
                    fill="rgba(188,140,255,0.65)" font-size="9"
                    font-family="'Fira Code','Courier New',monospace" font-weight="700">INTERNET</text>
              <text x="610" y="106" text-anchor="middle"
                    fill="#3d4a60" font-size="8"
                    font-family="'Fira Code','Courier New',monospace">the web</text>
            </g>

            <!-- Packet glow halo (behind dot) -->
            <circle id="wf-packet-glow" cx="66" cy="65" r="11"
                    fill="rgba(0,229,255,0.18)"/>
            <!-- Packet dot -->
            <circle id="wf-packet" cx="66" cy="65" r="5" fill="#00e5ff"/>

          </svg>

          <!-- Step description — role="status" so screen readers announce changes -->
          <div class="wf-step-box" role="status" aria-live="polite">
            <div class="wf-step-label" id="wf-step-label">STEP 1 OF 7 — OUTGOING REQUEST</div>
            <div class="wf-step-text" id="wf-step-text">
              Your device (phone or laptop) prepares a <strong>request</strong> — for example,
              "load this webpage." It converts the request into radio waves and broadcasts
              them into the air.
            </div>
          </div>

          <!-- Progress dots — one per step, clickable -->
          <div class="wf-dots" role="group" aria-label="Animation progress — click a dot to jump to that step">
            <button class="wf-dot wf-dot--active" data-step="0" aria-label="Step 1: Outgoing request"></button>
            <button class="wf-dot" data-step="1" aria-label="Step 2: Radio waves to router"></button>
            <button class="wf-dot" data-step="2" aria-label="Step 3: Router routes request"></button>
            <button class="wf-dot" data-step="3" aria-label="Step 4: Router to modem via cable"></button>
            <button class="wf-dot" data-step="4" aria-label="Step 5: Modem to internet via fibre"></button>
            <button class="wf-dot" data-step="5" aria-label="Step 6: Response travels back"></button>
            <button class="wf-dot" data-step="6" aria-label="Step 7: Data arrives at your device"></button>
          </div>

          <!-- Controls -->
          <div class="wf-controls">
            <button class="wf-btn wf-btn--ghost" id="wf-restart"
                    aria-label="Restart animation from the beginning">&#8635; Restart</button>
            <button class="wf-btn" id="wf-playpause"
                    aria-label="Pause animation">&#9208; Pause</button>
            <span class="wf-speed-label">Speed</span>
            <button class="wf-btn wf-btn--ghost" id="wf-speed"
                    aria-label="Change animation speed">1&times;</button>
          </div>

        </div>
```

- [ ] **Step 2: Verify the HTML renders without errors**

Open `pages/wifi-networking.html` in a browser (double-click the file or use a local server). Confirm:
- The animation wrapper appears below "Follow the path data takes..." text
- The SVG is visible: four labelled nodes (YOUR DEVICE, ROUTER, MODEM, INTERNET) connected by horizontal lines
- The step description box, seven dot buttons, and four control buttons are all visible below the SVG
- No JavaScript errors in the browser console (the packet won't animate yet — that's fine)

- [ ] **Step 3: Add the inline `<style>` block after `</section>` (end of Section 1)**

After the closing `</section>` tag of Section 1 (the line that reads `</section>` immediately before the `<!-- SECTION 2 — RADIO WAVES -->` comment block), insert:

```html
    <style>
    /* ── Wi-Fi flow animation ── */
    .wf-wrap {
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 20px 16px 16px;
      overflow: hidden;
    }
    .wf-svg {
      width: 100%;
      display: block;
    }
    .wf-step-box {
      margin-top: 16px;
      background: var(--color-bg-primary);
      border: 1px solid rgba(200, 255, 0, 0.15);
      border-radius: 6px;
      padding: 12px 16px;
      min-height: 60px;
    }
    .wf-step-label {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-lime);
      margin-bottom: 4px;
      transition: color 0.3s;
    }
    .wf-step-text {
      font-size: 0.9rem;
      color: var(--color-text-subtle);
      line-height: 1.55;
    }
    .wf-step-text strong { color: var(--color-text-primary); }
    .wf-dots {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 14px;
    }
    .wf-dot {
      width: 28px;
      height: 3px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      cursor: pointer;
      padding: 0;
      transition: background 0.3s, width 0.2s;
    }
    .wf-dot:hover { background: rgba(200, 255, 0, 0.3); }
    .wf-dot--active {
      background: var(--color-lime);
      width: 40px;
    }
    .wf-dot--done { background: rgba(200, 255, 0, 0.35); }
    .wf-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .wf-btn {
      font-family: var(--font-heading);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 5px 16px;
      background: rgba(200, 255, 0, 0.08);
      color: var(--color-lime);
      border: 1px solid rgba(200, 255, 0, 0.3);
      border-radius: 2px;
      cursor: pointer;
      letter-spacing: 0.06em;
      transition: background 0.2s;
      line-height: 1.6;
    }
    .wf-btn:hover { background: rgba(200, 255, 0, 0.16); }
    .wf-btn--ghost {
      background: transparent;
      color: var(--color-text-secondary);
      border-color: var(--color-border);
    }
    .wf-btn--ghost:hover {
      border-color: rgba(200, 255, 0, 0.4);
      color: var(--color-lime);
    }
    .wf-speed-label {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--color-text-secondary);
      letter-spacing: 0.08em;
    }
    </style>
```

- [ ] **Step 4: Verify styles apply correctly**

Reload the page. Confirm:
- The animation wrapper has a dark secondary background with a subtle border and rounded corners
- The step description box has a lime-tinted border and mono label text
- The seven dot buttons are narrow gray bars, center-aligned
- The first dot is wider and lime-colored (`.wf-dot--active`)
- The four control buttons match the `.wp-btn` style from the Wall Penetration Simulator

- [ ] **Step 5: Commit**

```bash
git add pages/wifi-networking.html
git commit -m "feat: add wifi animation HTML scaffold and styles"
```

---

## Task 2: Add JavaScript animation logic

**Files:**
- Modify: `pages/wifi-networking.html` (insert `<script>` after the `</style>` block added in Task 1)

- [ ] **Step 1: Insert the IIFE `<script>` block immediately after the `</style>` block from Task 1**

```html
    <script>
    (function () {
      'use strict';

      /* ── Node centre X positions — must match SVG viewBox coords ── */
      var NODE_X = { device: 66, router: 242, modem: 422, internet: 610 };
      var NODE_Y = 65;

      /* ── Node border elements and their dim/bright stroke colours ── */
      var NODE_BORDER = {
        device:   { el: null, dim: 'rgba(0,229,255,0.25)',   bright: 'rgba(0,229,255,0.9)'   },
        router:   { el: null, dim: 'rgba(200,255,0,0.25)',   bright: 'rgba(200,255,0,0.9)'   },
        modem:    { el: null, dim: 'rgba(255,184,0,0.25)',   bright: 'rgba(255,184,0,0.9)'   },
        internet: { el: null, dim: 'rgba(188,140,255,0.25)', bright: 'rgba(188,140,255,0.9)' }
      };

      /* ── 7 step definitions ── */
      var STEPS = [
        /* 0 — Device idle */
        {
          from: 'device', to: 'device', segments: [],
          activeNodes: ['device'],
          labelColor: '#00e5ff',
          label: 'STEP 1 OF 7 — OUTGOING REQUEST',
          text: 'Your device (phone or laptop) prepares a <strong>request</strong> — for example, “load this webpage.” It converts the request into radio waves and broadcasts them into the air.',
          packetFill: '#00e5ff', glowFill: 'rgba(0,229,255,0.2)'
        },
        /* 1 — Device → Router */
        {
          from: 'device', to: 'router', segments: ['dr'],
          activeNodes: ['device', 'router'],
          labelColor: '#00e5ff',
          label: 'STEP 2 OF 7 — RADIO WAVES TO ROUTER',
          text: ‘The <strong>radio waves</strong> travel through the air at the speed of light and are picked up by your router\’s antenna — no cable needed.’,
          packetFill: '#00e5ff', glowFill: 'rgba(0,229,255,0.2)'
        },
        /* 2 — Router idle */
        {
          from: 'router', to: 'router', segments: [],
          activeNodes: ['router'],
          labelColor: '#c8ff00',
          label: 'STEP 3 OF 7 — ROUTER ROUTES THE REQUEST',
          text: 'The <strong>router</strong> receives your request and decides where to send it — like a traffic controller. It forwards your packets toward the modem via a physical cable.',
          packetFill: '#c8ff00', glowFill: 'rgba(200,255,0,0.2)'
        },
        /* 3 — Router → Modem */
        {
          from: 'router', to: 'modem', segments: ['rm'],
          activeNodes: ['router', 'modem'],
          labelColor: '#c8ff00',
          label: 'STEP 4 OF 7 — ROUTER → MODEM (CABLE)',
          text: ‘Your request travels down a <strong>cable</strong> from the router to the modem. The modem then translates it into a signal your ISP\’s network can understand.’,
          packetFill: '#c8ff00', glowFill: 'rgba(200,255,0,0.2)'
        },
        /* 4 — Modem → Internet */
        {
          from: 'modem', to: 'internet', segments: ['mi'],
          activeNodes: ['modem', 'internet'],
          labelColor: '#bc8cff',
          label: 'STEP 5 OF 7 — MODEM → INTERNET (FIBRE)',
          text: ‘The modem sends your request through your ISP\’s <strong>fibre or cable</strong> line — out of your home and onto the global internet, reaching the destination server in milliseconds.’,
          packetFill: '#bc8cff', glowFill: 'rgba(188,140,255,0.2)'
        },
        /* 5 — Internet → Modem (response) */
        {
          from: 'internet', to: 'modem', segments: ['mi'],
          activeNodes: ['internet', 'modem'],
          labelColor: '#bc8cff',
          label: 'STEP 6 OF 7 — RESPONSE TRAVELS BACK',
          text: 'The web server sends the <strong>response</strong> (the webpage data) back along the same path — through the internet, down the fibre line, arriving at your modem.',
          packetFill: '#bc8cff', glowFill: 'rgba(188,140,255,0.2)'
        },
        /* 6 — Modem → Device (modem→router→device combined) */
        {
          from: 'modem', to: 'device', segments: ['rm', 'dr'],
          activeNodes: ['modem', 'router', 'device'],
          labelColor: '#00e5ff',
          label: 'STEP 7 OF 7 — DATA ARRIVES AT YOUR DEVICE',
          text: 'The response travels modem → router → back to your device over <strong>Wi‑Fi</strong>. Your browser receives the packets and assembles the page — done, in under a second.',
          packetFill: '#00e5ff', glowFill: 'rgba(0,229,255,0.2)'
        }
      ];

      /* ── Timing constants (milliseconds) ── */
      var HOLD_MS   = 1400; /* pause at idle node before advancing */
      var TRAVEL_MS = 900;  /* time to travel one segment          */
      var LOOP_MS   = 1800; /* pause before looping back to step 1 */

      /* ── Animation state ── */
      var currentStep    = 0;
      var playing        = true;
      var speeds         = [1, 2, 0.5];
      var speedIdx       = 0;
      var traveling      = false;
      var travelProgress = 0;
      var lastRafTime    = null;
      var holdTimer      = null;

      /* ── DOM references ── */
      var packetEl    = document.getElementById('wf-packet');
      var glowEl      = document.getElementById('wf-packet-glow');
      var stepLabelEl = document.getElementById('wf-step-label');
      var stepTextEl  = document.getElementById('wf-step-text');
      var ppBtn       = document.getElementById('wf-playpause');
      var speedBtn    = document.getElementById('wf-speed');
      var dots        = document.querySelectorAll('.wf-dot');
      var glowLines   = {
        dr: document.getElementById('wf-glow-dr'),
        rm: document.getElementById('wf-glow-rm'),
        mi: document.getElementById('wf-glow-mi')
      };

      /* Cache node border elements */
      Object.keys(NODE_BORDER).forEach(function (key) {
        NODE_BORDER[key].el = document.getElementById('wf-nr-' + key);
      });

      /* ── Helpers ── */
      function easeInOut(t) {
        /* Quadratic ease-in/out: slow start, fast middle, slow end */
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      function lerp(a, b, t) { return a + (b - a) * t; }

      function setPacketPos(x, stepIdx) {
        var s = STEPS[stepIdx];
        packetEl.setAttribute('cx', x);
        packetEl.setAttribute('cy', NODE_Y);
        packetEl.setAttribute('fill', s.packetFill);
        glowEl.setAttribute('cx', x);
        glowEl.setAttribute('cy', NODE_Y);
        glowEl.setAttribute('fill', s.glowFill);
      }

      function setGlowLines(segments) {
        /* Light up only the listed segments; dim all others */
        Object.keys(glowLines).forEach(function (key) {
          glowLines[key].setAttribute('opacity',
            segments.indexOf(key) !== -1 ? '1' : '0');
        });
      }

      function updateNodeBorders(stepIdx) {
        var active = STEPS[stepIdx].activeNodes;
        Object.keys(NODE_BORDER).forEach(function (key) {
          var nb     = NODE_BORDER[key];
          var stroke = active.indexOf(key) !== -1 ? nb.bright : nb.dim;
          nb.el.setAttribute('stroke', stroke);
        });
      }

      function updateDots(stepIdx) {
        dots.forEach(function (d, i) {
          d.className = 'wf-dot' +
            (i === stepIdx ? ' wf-dot--active'
              : i < stepIdx ? ' wf-dot--done' : '');
        });
      }

      function updateStepUI(stepIdx) {
        var s = STEPS[stepIdx];
        stepLabelEl.textContent = s.label;
        stepLabelEl.style.color = s.labelColor;
        stepTextEl.innerHTML    = s.text;
        setGlowLines(s.segments);
        updateNodeBorders(stepIdx);
        updateDots(stepIdx);
      }

      /* ── Advance logic ── */
      function startHold(ms) {
        holdTimer = setTimeout(function () {
          if (playing) advanceStep();
        }, ms / speeds[speedIdx]);
      }

      function advanceStep() {
        clearTimeout(holdTimer);
        if (currentStep < STEPS.length - 1) {
          currentStep++;
          applyStep(currentStep);
        } else {
          /* End of sequence — loop after a pause */
          holdTimer = setTimeout(function () {
            if (playing) { currentStep = 0; applyStep(0); }
          }, LOOP_MS / speeds[speedIdx]);
        }
      }

      function applyStep(stepIdx) {
        var s = STEPS[stepIdx];
        updateStepUI(stepIdx);
        if (s.from === s.to) {
          /* Stationary at node: snap packet, clear glow lines, schedule advance */
          setPacketPos(NODE_X[s.to], stepIdx);
          setGlowLines([]);
          traveling = false;
          if (playing) startHold(HOLD_MS);
        } else {
          /* Traveling: start interpolation loop */
          traveling      = true;
          travelProgress = 0;
          lastRafTime    = null;
          setPacketPos(NODE_X[s.from], stepIdx);
        }
      }

      /* ── Jump to step (node click / dot click) ── */
      function jumpTo(stepIdx) {
        clearTimeout(holdTimer);
        traveling  = false;
        currentStep = stepIdx;
        applyStep(currentStep);
      }

      /* ── requestAnimationFrame loop ── */
      function rafLoop(ts) {
        if (traveling && playing) {
          if (!lastRafTime) lastRafTime = ts;
          var dt = (ts - lastRafTime) * speeds[speedIdx];
          lastRafTime = ts;
          travelProgress += dt / TRAVEL_MS;

          if (travelProgress >= 1) {
            /* Arrived at destination */
            travelProgress = 1;
            traveling      = false;
            var s = STEPS[currentStep];
            setPacketPos(NODE_X[s.to], currentStep);
            if (playing) startHold(300);
          } else {
            /* Interpolate packet position */
            var s2   = STEPS[currentStep];
            var fromX = NODE_X[s2.from];
            var toX   = NODE_X[s2.to];
            setPacketPos(lerp(fromX, toX, easeInOut(travelProgress)), currentStep);
          }
        }
        requestAnimationFrame(rafLoop);
      }

      /* ── Control: Pause / Play ── */
      ppBtn.addEventListener('click', function () {
        playing = !playing;
        if (playing) {
          ppBtn.textContent = '⏸ Pause';
          ppBtn.setAttribute('aria-label', 'Pause animation');
          if (traveling) {
            lastRafTime = null; /* resume from current position */
          } else {
            startHold(HOLD_MS);
          }
        } else {
          ppBtn.textContent = '▶ Play';
          ppBtn.setAttribute('aria-label', 'Play animation');
          clearTimeout(holdTimer);
        }
      });

      /* ── Control: Restart ── */
      document.getElementById('wf-restart').addEventListener('click', function () {
        clearTimeout(holdTimer);
        traveling   = false;
        playing     = true;
        currentStep = 0;
        ppBtn.textContent = '⏸ Pause';
        ppBtn.setAttribute('aria-label', 'Pause animation');
        applyStep(0);
      });

      /* ── Control: Speed ── */
      document.getElementById('wf-speed').addEventListener('click', function () {
        speedIdx = (speedIdx + 1) % speeds.length;
        speedBtn.textContent = speeds[speedIdx] + '×';
      });

      /* ── Progress dots ── */
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          jumpTo(parseInt(dot.dataset.step, 10));
        });
      });

      /* ── Node clicks + keyboard activation ── */
      var nodeClickMap = [
        { id: 'wf-node-device',   step: 0 },
        { id: 'wf-node-router',   step: 2 },
        { id: 'wf-node-modem',    step: 4 },
        { id: 'wf-node-internet', step: 5 }
      ];
      nodeClickMap.forEach(function (pair) {
        var el = document.getElementById(pair.id);
        el.addEventListener('click', function () { jumpTo(pair.step); });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            jumpTo(pair.step);
          }
        });
      });

      /* ── Initialise ── */
      applyStep(0);
      requestAnimationFrame(rafLoop);

    }());
    </script>
```

- [ ] **Step 2: Verify auto-play — animation walks through all 7 steps**

Reload the page. Confirm:
- The packet dot starts at YOUR DEVICE and auto-travels right toward ROUTER
- The step label updates as the packet reaches each node: "STEP 1 OF 7", "STEP 2 OF 7", ... "STEP 7 OF 7"
- On steps 1, 3, 4, 5, 6 (traveling steps), the correct glow line lights up: cyan for dr, lime for rm, purple for mi
- On steps 1 and 3 (indices 0 and 2 — Device idle and Router idle), the packet holds briefly at the node before auto-advancing
- Active nodes have bright borders; inactive nodes are dimmed
- Progress dots: the active dot is wider (lime), completed dots are faded lime
- After step 7 the animation pauses ~1.8 s then loops from step 1

- [ ] **Step 3: Verify Pause / Play**

Click **⏸ Pause**. Confirm:
- The button label changes to **▶ Play**
- The packet freezes mid-travel (if clicked during a traveling step) or holds at a node
- Clicking **▶ Play** resumes from exactly where it stopped

- [ ] **Step 4: Verify Restart**

Click **↺ Restart**. Confirm:
- The packet immediately snaps back to YOUR DEVICE
- The step label reads "STEP 1 OF 7 — OUTGOING REQUEST"
- If paused, animation resumes automatically after restart

- [ ] **Step 5: Verify Speed**

Click the **1×** speed button. Confirm it cycles: `1×` → `2×` → `0.5×` → `1×`. At 2× the packet visibly travels faster; at 0.5× it is slower.

- [ ] **Step 6: Verify progress dot clicks**

Click each of the seven dots in order. Confirm each dot jumps the packet to the start of that step and updates the step label, description text, glow lines, and node borders correctly.

- [ ] **Step 7: Verify node clicks**

Click each node label/box:
- **YOUR DEVICE** → jumps to Step 1 (packet at device, label "STEP 1 OF 7")
- **ROUTER** → jumps to Step 3 (packet at router, label "STEP 3 OF 7")
- **MODEM** → jumps to Step 5 (packet starts at modem, travels toward internet)
- **INTERNET** → jumps to Step 6 (packet starts at internet, travels toward modem)

- [ ] **Step 8: Commit**

```bash
git add pages/wifi-networking.html
git commit -m "feat: add wifi connection animation with 7-step packet flow"
```

---

## Task 3: Verify mobile layout and accessibility

**Files:**
- Modify: `pages/wifi-networking.html` (fix only if issues found)

- [ ] **Step 1: Test mobile viewport at 375 px**

Open browser DevTools → toggle device toolbar → set width to 375 px. Reload the page. Confirm:
- The SVG scales down automatically (the `width:100%` on `.wf-svg` handles this)
- Node labels are still readable at small size
- The controls row wraps if needed — `.wf-controls` has `flex-wrap: wrap`
- No horizontal scrollbar on the animation section

- [ ] **Step 2: Test keyboard navigation**

Tab through the page to reach the animation area. Confirm:
- Each of the four SVG node `<g>` elements receives focus (visible focus ring from browser default, or the SVG stroke brightening)
- Pressing **Enter** or **Space** on a node triggers `jumpTo` (same as click)
- Tab continues to the 7 progress dot `<button>` elements — each is individually focusable
- Tab reaches ↺ Restart, ⏸ Pause, and 1× Speed buttons

- [ ] **Step 3: Check screen reader description**

The `<svg>` has `role="img"` and `aria-label="Animated diagram: data travels from your device to the internet and back"`. The step description `<div>` has `role="status"` and `aria-live="polite"`, meaning a screen reader will announce the step label and text each time the step changes.

Verify the `aria-label` values on the four node `<g>` elements match what was written in the HTML in Task 1.

- [ ] **Step 4: Commit any accessibility fixes (skip if none needed)**

```bash
git add pages/wifi-networking.html
git commit -m "fix: wifi animation mobile and accessibility adjustments"
```
