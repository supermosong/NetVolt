# LAN vs WAN Interactive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static LAN vs WAN diagram and flip cards in Section 2 of `pages/computer-networks.html` with a tab-switched interactive SVG diagram, clickable node tooltips, animated packet flow, and a live attribute panel.

**Architecture:** Three-file change — HTML provides the markup skeleton (SVG diagram, tab bar, attribute panel, button), CSS handles all visual states (tab active/inactive, node dim/highlight, tooltip, packet glow), and JS wires up behaviour (tab switching, tooltip show/hide, requestAnimationFrame packet animation). All logic is scoped to `initLanWanDiagram()` called once on DOM load.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, transitions), Vanilla JavaScript (ES6+, requestAnimationFrame)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `css/components.css` | Modify | Add: tab bar, tooltip popup, attribute panel stat grid, packet dot glow, send button |
| `pages/computer-networks.html` | Modify | Replace Section 2 content: tab bar, interactive SVG, attribute panel, send button |
| `js/interactions.js` | Modify | Add `initLanWanDiagram()`: tab switching, tooltip, packet animation |

---

### Task 1: CSS — All new component styles

**Files:**
- Modify: `css/components.css`

- [ ] **Step 1: Append the following block at the very end of `css/components.css`**

```css
/* ============================================================
   LAN vs WAN Interactive Diagram
   ============================================================ */

/* Tab bar */
.lan-wan-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.lan-wan-tab {
  padding: var(--space-2) var(--space-5);
  border-radius: 999px;
  border: 2px solid var(--color-border);
  background: transparent;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  color: var(--color-text-secondary);
}

.lan-wan-tab[aria-selected="true"] {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

/* Diagram SVG wrapper — relative so tooltip can be absolute */
.lan-wan-diagram-wrap {
  position: relative;
  margin-bottom: var(--space-4);
}

.lan-wan-diagram-wrap svg {
  width: 100%;
  max-width: 720px;
  display: block;
  overflow: visible;
}

/* Tab-driven opacity transitions on SVG groups */
#lan-wan-svg .lan-device,
#lan-wan-svg .lan-device-link,
#lan-wan-svg .lan-boundary,
#lan-wan-svg .wan-node,
#lan-wan-svg .wan-link {
  transition: opacity 0.35s ease;
}

#lan-wan-svg.tab-wan .lan-device,
#lan-wan-svg.tab-wan .lan-device-link,
#lan-wan-svg.tab-wan .lan-boundary {
  opacity: 0.18;
}

#lan-wan-svg.tab-lan .wan-node,
#lan-wan-svg.tab-lan .wan-link {
  opacity: 0.18;
}

/* Tooltip popup */
.lan-wan-tooltip {
  position: absolute;
  z-index: 10;
  background: var(--color-bg-secondary, #161b22);
  border: 1px solid var(--color-border, #30363d);
  border-radius: var(--radius-md, 8px);
  padding: var(--space-3) var(--space-4);
  max-width: 220px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transform: translate(-50%, -100%) translateY(-10px);
  pointer-events: auto;
}

.lan-wan-tooltip[hidden] {
  display: none;
}

.lan-wan-tooltip__title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary, #e6edf3);
  margin: 0 0 var(--space-1) 0;
}

.lan-wan-tooltip__body {
  font-size: var(--text-xs);
  color: var(--color-text-secondary, #8b949e);
  margin: 0;
  line-height: 1.5;
}

.lan-wan-tooltip__close {
  position: absolute;
  top: var(--space-1);
  right: var(--space-2);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

/* Attribute panel */
.lan-wan-panel {
  border-left: 4px solid var(--color-accent);
  background: var(--color-bg-secondary, #161b22);
  border-radius: var(--radius-md, 8px);
  padding: var(--space-5);
  margin-bottom: var(--space-6);
  transition: border-color 0.3s;
}

.lan-wan-panel.tab-wan {
  border-color: #bc8cff;
}

.lan-wan-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

@media (min-width: 600px) {
  .lan-wan-panel__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.lan-wan-stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.lan-wan-stat__icon {
  font-size: var(--text-lg);
  line-height: 1;
}

.lan-wan-stat__label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.lan-wan-stat__value {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Send Packet button */
.send-packet-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-md, 8px);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.send-packet-btn:hover:not(:disabled) {
  opacity: 0.88;
}

.send-packet-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Screen-reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 2: Browser verification**

Open `pages/computer-networks.html`. The page should look identical to before — new CSS classes are not yet used in the HTML. No console errors.

- [ ] **Step 3: Commit**

```bash
git add css/components.css
git commit -m "style: add LAN vs WAN interactive diagram component styles"
```

---

### Task 2: HTML — Replace Section 2 with interactive markup

**Files:**
- Modify: `pages/computer-networks.html`

- [ ] **Step 1: Locate Section 2**

Find the comment `<!-- SECTION 2 — LAN vs WAN -->` (around line 312). The section contains an outer `<section class="content-section" aria-labelledby="sec2-title">` and a `<div class="container">` inside it. **Keep both outer wrapper tags.** Replace only everything inside `<div class="container">`.

- [ ] **Step 2: Replace the entire contents inside `<div class="container">` of Section 2 with:**

```html
<h2 class="section-title" id="sec2-title">LAN vs WAN — Up Close</h2>
<p class="section-subtitle">
  Understanding the difference between local and wide-area networks is
  the foundation of all networking knowledge.
</p>

<p>
  Imagine your home as a small village. Every house (device) in the
  village can talk to every other house easily — that's your
  <strong>LAN</strong>. The road connecting your village to the rest of
  the country — that's the <strong>WAN</strong> (the internet). Your
  router is the village gate: it controls traffic in and out.
</p>

<!-- Tab bar -->
<div class="lan-wan-tabs" role="tablist" aria-label="Network type view"
     style="margin-top: var(--space-8);">
  <button class="lan-wan-tab"
          role="tab"
          id="tab-lan"
          aria-selected="true"
          aria-controls="lan-wan-diagram-region">
    LAN
  </button>
  <button class="lan-wan-tab"
          role="tab"
          id="tab-wan"
          aria-selected="false"
          aria-controls="lan-wan-diagram-region">
    WAN
  </button>
</div>

<!-- Diagram + attribute panel region -->
<div id="lan-wan-diagram-region"
     role="tabpanel"
     aria-labelledby="tab-lan">

  <div class="lan-wan-diagram-wrap">

    <svg id="lan-wan-svg"
         class="tab-lan"
         viewBox="0 0 720 300"
         role="img"
         aria-label="Interactive LAN and WAN network diagram. Click any node for details."
         style="width:100%; max-width:720px; display:block; overflow:visible;">

      <!-- Background -->
      <rect x="0" y="0" width="720" height="300" rx="12"
            fill="#161b22" stroke="#30363d" stroke-width="2"/>

      <!-- ── LAN BOUNDARY ──────────────────────────────── -->
      <g class="lan-boundary">
        <ellipse cx="170" cy="155" rx="148" ry="122"
                 fill="rgba(88,166,255,0.05)"
                 stroke="#58a6ff" stroke-width="1.5" stroke-dasharray="6,3"/>
        <text x="170" y="24" text-anchor="middle"
              fill="#58a6ff" font-size="12"
              font-family="Inter,sans-serif" font-weight="700">LAN</text>
      </g>

      <!-- ── LAN DEVICE LINKS ───────────────────────────── -->
      <line class="lan-device-link" x1="55" y1="88" x2="170" y2="153"
            stroke="#30363d" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line class="lan-device-link" x1="55" y1="223" x2="170" y2="153"
            stroke="#30363d" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line class="lan-device-link" x1="250" y1="238" x2="170" y2="153"
            stroke="#30363d" stroke-width="1.5" stroke-dasharray="4,3"/>

      <!-- ── LAN DEVICE NODES ───────────────────────────── -->

      <!-- Laptop -->
      <g class="lan-device" id="node-laptop"
         tabindex="0" role="button"
         aria-label="Laptop — click for details"
         aria-describedby="lan-wan-tooltip"
         style="cursor:pointer;">
        <rect x="20" y="65" width="70" height="46" rx="6"
              fill="#21262d" stroke="#30363d" stroke-width="1.5"/>
        <text x="55" y="85" text-anchor="middle"
              fill="#e6edf3" font-size="9"
              font-family="Inter,sans-serif" font-weight="600">Laptop</text>
        <text x="55" y="100" text-anchor="middle"
              fill="#8b949e" font-size="8"
              font-family="Inter,sans-serif">.101</text>
      </g>

      <!-- Phone -->
      <g class="lan-device" id="node-phone"
         tabindex="0" role="button"
         aria-label="Phone — click for details"
         aria-describedby="lan-wan-tooltip"
         style="cursor:pointer;">
        <rect x="20" y="200" width="70" height="46" rx="6"
              fill="#21262d" stroke="#30363d" stroke-width="1.5"/>
        <text x="55" y="220" text-anchor="middle"
              fill="#e6edf3" font-size="9"
              font-family="Inter,sans-serif" font-weight="600">Phone</text>
        <text x="55" y="235" text-anchor="middle"
              fill="#8b949e" font-size="8"
              font-family="Inter,sans-serif">.102</text>
      </g>

      <!-- Smart TV -->
      <g class="lan-device" id="node-smarttv"
         tabindex="0" role="button"
         aria-label="Smart TV — click for details"
         aria-describedby="lan-wan-tooltip"
         style="cursor:pointer;">
        <rect x="215" y="215" width="70" height="46" rx="6"
              fill="#21262d" stroke="#30363d" stroke-width="1.5"/>
        <text x="250" y="235" text-anchor="middle"
              fill="#e6edf3" font-size="9"
              font-family="Inter,sans-serif" font-weight="600">Smart TV</text>
        <text x="250" y="250" text-anchor="middle"
              fill="#8b949e" font-size="8"
              font-family="Inter,sans-serif">.103</text>
      </g>

      <!-- ── ROUTER (shared — always visible) ──────────── -->
      <g id="node-router"
         tabindex="0" role="button"
         aria-label="Router — click for details"
         aria-describedby="lan-wan-tooltip"
         style="cursor:pointer;">
        <rect x="135" y="130" width="70" height="46" rx="6"
              fill="#21262d" stroke="#58a6ff" stroke-width="2"/>
        <text x="170" y="150" text-anchor="middle"
              fill="#58a6ff" font-size="9"
              font-family="Inter,sans-serif" font-weight="700">Router</text>
        <text x="170" y="165" text-anchor="middle"
              fill="#8b949e" font-size="8"
              font-family="Inter,sans-serif">192.168.1.1</text>
      </g>

      <!-- ── WAN LINKS ──────────────────────────────────── -->
      <line class="wan-link" x1="205" y1="153" x2="365" y2="153"
            stroke="#bc8cff" stroke-width="2"/>
      <polygon class="wan-link" points="360,149 370,153 360,157" fill="#bc8cff"/>

      <line class="wan-link" x1="435" y1="153" x2="455" y2="153"
            stroke="#bc8cff" stroke-width="2"/>
      <polygon class="wan-link" points="450,149 460,153 450,157" fill="#bc8cff"/>

      <line class="wan-link" x1="585" y1="153" x2="630" y2="153"
            stroke="#bc8cff" stroke-width="2"/>
      <polygon class="wan-link" points="625,149 635,153 625,157" fill="#bc8cff"/>

      <!-- ── WAN NODES ───────────────────────────────────── -->

      <!-- ISP -->
      <g class="wan-node" id="node-isp"
         tabindex="0" role="button"
         aria-label="ISP — click for details"
         aria-describedby="lan-wan-tooltip"
         style="cursor:pointer;">
        <rect x="365" y="130" width="70" height="46" rx="6"
              fill="#21262d" stroke="#bc8cff" stroke-width="1.5"/>
        <text x="400" y="150" text-anchor="middle"
              fill="#bc8cff" font-size="9"
              font-family="Inter,sans-serif" font-weight="700">ISP</text>
        <text x="400" y="165" text-anchor="middle"
              fill="#8b949e" font-size="8"
              font-family="Inter,sans-serif">Gateway</text>
      </g>

      <!-- Internet cloud -->
      <g class="wan-node" id="node-internet"
         tabindex="0" role="button"
         aria-label="Internet (WAN) — click for details"
         aria-describedby="lan-wan-tooltip"
         style="cursor:pointer;">
        <ellipse cx="520" cy="153" rx="65" ry="44"
                 fill="rgba(188,140,255,0.08)"
                 stroke="#bc8cff" stroke-width="1.5"/>
        <text x="520" y="148" text-anchor="middle"
              fill="#bc8cff" font-size="11"
              font-family="Inter,sans-serif" font-weight="700">Internet</text>
        <text x="520" y="163" text-anchor="middle"
              fill="#8b949e" font-size="9"
              font-family="Inter,sans-serif">(WAN)</text>
      </g>

      <!-- Remote Server -->
      <g class="wan-node" id="node-server"
         tabindex="0" role="button"
         aria-label="Remote Server — click for details"
         aria-describedby="lan-wan-tooltip"
         style="cursor:pointer;">
        <rect x="630" y="130" width="75" height="46" rx="6"
              fill="#21262d" stroke="#bc8cff" stroke-width="1.5"/>
        <text x="667" y="150" text-anchor="middle"
              fill="#bc8cff" font-size="9"
              font-family="Inter,sans-serif" font-weight="700">Server</text>
        <text x="667" y="165" text-anchor="middle"
              fill="#8b949e" font-size="8"
              font-family="Inter,sans-serif">google.com</text>
      </g>

      <!-- ── HOP LABEL (updated by JS during animation) ── -->
      <text id="hop-label" x="300" y="22" text-anchor="middle"
            fill="#3fb950" font-size="10"
            font-family="Inter,sans-serif" font-weight="600"
            opacity="0"></text>

      <!-- ── PACKET DOT (animated by JS) ──────────────── -->
      <circle id="packet-dot" cx="55" cy="88" r="6"
              fill="#58a6ff" opacity="0"
              style="filter:drop-shadow(0 0 6px #58a6ff);"></circle>

    </svg>

    <!-- Tooltip popup (absolutely positioned over the SVG) -->
    <div id="lan-wan-tooltip"
         class="lan-wan-tooltip"
         role="tooltip"
         hidden>
      <button class="lan-wan-tooltip__close"
              id="tooltip-close"
              aria-label="Close tooltip">&#215;</button>
      <p class="lan-wan-tooltip__title" id="tooltip-title"></p>
      <p class="lan-wan-tooltip__body"  id="tooltip-body"></p>
    </div>

  </div><!-- /.lan-wan-diagram-wrap -->

  <!-- Attribute panel -->
  <div class="lan-wan-panel" id="lan-wan-panel">

    <div id="panel-lan">
      <div class="lan-wan-panel__grid">
        <div class="lan-wan-stat">
          <span class="lan-wan-stat__icon">&#9889;</span>
          <span class="lan-wan-stat__label">Speed</span>
          <span class="lan-wan-stat__value">Up to 1 Gbps</span>
        </div>
        <div class="lan-wan-stat">
          <span class="lan-wan-stat__icon">&#128207;</span>
          <span class="lan-wan-stat__label">Range</span>
          <span class="lan-wan-stat__value">Single building</span>
        </div>
        <div class="lan-wan-stat">
          <span class="lan-wan-stat__icon">&#127968;</span>
          <span class="lan-wan-stat__label">Ownership</span>
          <span class="lan-wan-stat__value">You own it</span>
        </div>
        <div class="lan-wan-stat">
          <span class="lan-wan-stat__icon">&#128176;</span>
          <span class="lan-wan-stat__label">Cost</span>
          <span class="lan-wan-stat__value">Low (hardware only)</span>
        </div>
      </div>
    </div>

    <div id="panel-wan" hidden>
      <div class="lan-wan-panel__grid">
        <div class="lan-wan-stat">
          <span class="lan-wan-stat__icon">&#9889;</span>
          <span class="lan-wan-stat__label">Speed</span>
          <span class="lan-wan-stat__value">10 Mbps &ndash; 1 Gbps</span>
        </div>
        <div class="lan-wan-stat">
          <span class="lan-wan-stat__icon">&#128207;</span>
          <span class="lan-wan-stat__label">Range</span>
          <span class="lan-wan-stat__value">City, country, globe</span>
        </div>
        <div class="lan-wan-stat">
          <span class="lan-wan-stat__icon">&#127970;</span>
          <span class="lan-wan-stat__label">Ownership</span>
          <span class="lan-wan-stat__value">Managed by ISPs</span>
        </div>
        <div class="lan-wan-stat">
          <span class="lan-wan-stat__icon">&#128179;</span>
          <span class="lan-wan-stat__label">Cost</span>
          <span class="lan-wan-stat__value">Monthly subscription</span>
        </div>
      </div>
    </div>

  </div><!-- /.lan-wan-panel -->

  <!-- Send Packet button -->
  <div style="margin-bottom: var(--space-8);">
    <button class="send-packet-btn" id="send-packet-btn">
      Send Packet &#8594;
    </button>
    <div class="sr-only" id="packet-status" aria-live="polite"></div>
  </div>

</div><!-- /#lan-wan-diagram-region -->
```

- [ ] **Step 3: Browser verification**

Open `pages/computer-networks.html`. Section 2 should show:
- Heading, subtitle, and village paragraph (unchanged)
- Two pill buttons: "LAN" (accent-colored, active) and "WAN" (ghost)
- The SVG: LAN nodes (Laptop, Phone, Smart TV, Router) visible; WAN nodes (ISP, Internet, Server) dimmed at ~18% opacity
- Attribute panel with 4 LAN stats: Speed, Range, Ownership, Cost
- "Send Packet →" button
- Clicking tabs/nodes/button does nothing yet — JS not wired up

- [ ] **Step 4: Commit**

```bash
git add pages/computer-networks.html
git commit -m "feat: add LAN vs WAN interactive diagram HTML markup"
```

---

### Task 3: JS — Tab switching

**Files:**
- Modify: `js/interactions.js`

- [ ] **Step 1: Append the following at the very end of `js/interactions.js`**

```js
/* ============================================================
   LAN vs WAN Interactive Diagram
   ============================================================ */
function initLanWanDiagram() {
  const svg      = document.getElementById('lan-wan-svg');
  const tabLan   = document.getElementById('tab-lan');
  const tabWan   = document.getElementById('tab-wan');
  const panel    = document.getElementById('lan-wan-panel');
  const panelLan = document.getElementById('panel-lan');
  const panelWan = document.getElementById('panel-wan');
  const region   = document.getElementById('lan-wan-diagram-region');

  if (!svg) return; /* not on this page */

  function switchTab(active) {
    /* active: 'lan' | 'wan' */
    const isLan = active === 'lan';

    tabLan.setAttribute('aria-selected', isLan ? 'true' : 'false');
    tabWan.setAttribute('aria-selected', isLan ? 'false' : 'true');

    svg.classList.toggle('tab-lan',  isLan);
    svg.classList.toggle('tab-wan', !isLan);

    panelLan.hidden = !isLan;
    panelWan.hidden =  isLan;
    panel.classList.toggle('tab-wan', !isLan);

    region.setAttribute('aria-labelledby', isLan ? 'tab-lan' : 'tab-wan');
  }

  tabLan.addEventListener('click', () => switchTab('lan'));
  tabWan.addEventListener('click', () => switchTab('wan'));

  /* Arrow-key navigation between tabs */
  [tabLan, tabWan].forEach((btn, i, arr) => {
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') arr[(i + 1) % arr.length].focus();
      if (e.key === 'ArrowLeft')  arr[(i - 1 + arr.length) % arr.length].focus();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanWanDiagram);
} else {
  initLanWanDiagram();
}
```

- [ ] **Step 2: Browser verification**

Open `pages/computer-networks.html`.
- Click "WAN": WAN nodes become fully visible, LAN devices + boundary dim to ~18%. Panel shows WAN stats. Panel border turns purple.
- Click "LAN": reverts to full LAN view, blue border.
- Press ArrowRight/Left while focused on a tab: focus moves to the other tab.

- [ ] **Step 3: Commit**

```bash
git add js/interactions.js
git commit -m "feat: add LAN vs WAN tab switching logic"
```

---

### Task 4: JS — Node tooltip

**Files:**
- Modify: `js/interactions.js`

- [ ] **Step 1: Inside `initLanWanDiagram`, add the tooltip block just before the closing `}` of the function**

Find the closing `}` of `initLanWanDiagram` (the one just before the `if (document.readyState …)` block). Insert this code immediately before that `}`:

```js
  /* ── Tooltip ─────────────────────────────────────── */
  const TOOLTIP_DATA = {
    'node-laptop':   { title: 'Laptop',               body: 'Your device. Sends requests and receives data within the LAN.' },
    'node-phone':    { title: 'Phone',                 body: 'Connects to the LAN wirelessly via Wi-Fi.' },
    'node-smarttv':  { title: 'Smart TV',              body: 'A LAN device that streams from the internet through the router.' },
    'node-router':   { title: 'Router',                body: 'The gateway between your LAN and the internet. Assigns local IP addresses via DHCP.' },
    'node-isp':      { title: 'ISP',                   body: 'Internet Service Provider. Carries your data from your home router to the wider internet.' },
    'node-internet': { title: 'The Internet (WAN)',    body: 'The WAN — millions of interconnected routers spanning the globe.' },
    'node-server':   { title: 'Remote Server',         body: 'A computer somewhere in the world hosting the website or service you requested.' },
  };

  const tooltip      = document.getElementById('lan-wan-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipBody  = document.getElementById('tooltip-body');
  const tooltipClose = document.getElementById('tooltip-close');
  const diagramWrap  = document.querySelector('.lan-wan-diagram-wrap');
  let activeNode = null;

  function showTooltip(nodeEl) {
    const data = TOOLTIP_DATA[nodeEl.id];
    if (!data) return;

    tooltipTitle.textContent = data.title;
    tooltipBody.textContent  = data.body;

    /* Position tooltip centred horizontally above the node */
    const nodeRect = nodeEl.getBoundingClientRect();
    const wrapRect = diagramWrap.getBoundingClientRect();
    tooltip.style.left = (nodeRect.left - wrapRect.left + nodeRect.width / 2) + 'px';
    tooltip.style.top  = (nodeRect.top  - wrapRect.top) + 'px';
    tooltip.removeAttribute('hidden');
    activeNode = nodeEl;
  }

  function hideTooltip() {
    tooltip.setAttribute('hidden', '');
    activeNode = null;
  }

  Object.keys(TOOLTIP_DATA).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('click', e => {
      e.stopPropagation();
      if (activeNode === el) { hideTooltip(); return; }
      showTooltip(el);
    });

    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (activeNode === el) { hideTooltip(); return; }
        showTooltip(el);
      }
      if (e.key === 'Escape') hideTooltip();
    });
  });

  tooltipClose.addEventListener('click', hideTooltip);

  /* Click outside to dismiss */
  document.addEventListener('click', e => {
    if (!tooltip.hasAttribute('hidden') && !tooltip.contains(e.target)) {
      hideTooltip();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideTooltip();
  });
```

- [ ] **Step 2: Browser verification**

Open `pages/computer-networks.html`.
- Click "Laptop": tooltip appears above it with title "Laptop" and its description.
- Click "Router": first tooltip closes, new one appears.
- Click anywhere outside the diagram: tooltip closes.
- Tab to a node, press Enter: tooltip appears. Press Escape: tooltip closes.
- Click ×: tooltip closes.
- Click same node twice: second click closes the tooltip.

- [ ] **Step 3: Commit**

```bash
git add js/interactions.js
git commit -m "feat: add LAN vs WAN node tooltip logic"
```

---

### Task 5: JS — Packet animation

**Files:**
- Modify: `js/interactions.js`

- [ ] **Step 1: Inside `initLanWanDiagram`, add the packet animation block immediately after the tooltip block (still before the closing `}` of the function)**

```js
  /* ── Packet Animation ─────────────────────────────── */

  /* SVG coordinate waypoints matching node centres */
  const FULL_PATH = [
    { x: 55,  y: 88  }, /* Laptop  */
    { x: 170, y: 153 }, /* Router  */
    { x: 400, y: 153 }, /* ISP     */
    { x: 520, y: 153 }, /* Internet*/
    { x: 667, y: 153 }, /* Server  */
  ];

  const LAN_PATH = [
    { x: 55,  y: 88  }, /* Laptop  */
    { x: 170, y: 153 }, /* Router  */
  ];

  /* Label shown above packet during each hop */
  const HOP_LABELS = [
    'LAN',          /* Laptop  → Router   */
    'Entering WAN', /* Router  → ISP      */
    'WAN',          /* ISP     → Internet */
    'WAN',          /* Internet→ Server   */
  ];

  const sendBtn      = document.getElementById('send-packet-btn');
  const packetDot    = document.getElementById('packet-dot');
  const hopLabel     = document.getElementById('hop-label');
  const packetStatus = document.getElementById('packet-status');

  const SEG_MS = 500; /* milliseconds per hop */

  function updateHopLabel(segIndex, waypoints) {
    const from = waypoints[segIndex];
    const to   = waypoints[segIndex + 1];
    hopLabel.setAttribute('x', (from.x + to.x) / 2);
    hopLabel.textContent = HOP_LABELS[segIndex] || '';
    hopLabel.setAttribute('opacity', '1');
  }

  function animatePacket(waypoints, onComplete) {
    let segment   = 0;
    let startTime = null;

    packetDot.setAttribute('cx', waypoints[0].x);
    packetDot.setAttribute('cy', waypoints[0].y);
    packetDot.setAttribute('opacity', '1');
    updateHopLabel(0, waypoints);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed    = timestamp - startTime;
      const segElapsed = elapsed - segment * SEG_MS;
      const t          = Math.min(segElapsed / SEG_MS, 1);

      const from = waypoints[segment];
      const to   = waypoints[segment + 1];

      packetDot.setAttribute('cx', from.x + (to.x - from.x) * t);
      packetDot.setAttribute('cy', from.y + (to.y - from.y) * t);

      if (t >= 1) {
        segment++;
        if (segment >= waypoints.length - 1) {
          /* Animation complete */
          packetDot.setAttribute('opacity', '0');
          hopLabel.setAttribute('opacity', '0');
          onComplete();
          return;
        }
        updateHopLabel(segment, waypoints);
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  sendBtn.addEventListener('click', () => {
    sendBtn.disabled        = true;
    sendBtn.textContent     = 'Sending…';

    /* Full path on WAN tab, LAN-only path on LAN tab */
    const path = svg.classList.contains('tab-wan') ? FULL_PATH : LAN_PATH;

    animatePacket(path, () => {
      sendBtn.disabled    = false;
      sendBtn.textContent = 'Send Packet →';
      packetStatus.textContent = 'Packet delivered!';
      setTimeout(() => { packetStatus.textContent = ''; }, 3000);
    });
  });
```

- [ ] **Step 2: Browser verification**

Open `pages/computer-networks.html`.
- **LAN tab:** Click "Send Packet →". Glowing blue dot travels Laptop → Router. "LAN" label appears above the path midpoint. Button shows "Sending…" then re-enables to "Send Packet →".
- **WAN tab:** Click "Send Packet →". Dot travels the full 4-hop path: Laptop → Router → ISP → Internet → Server. Labels "LAN", "Entering WAN", "WAN", "WAN" appear at each hop. Dot disappears at Server.
- Clicking button during animation does nothing (disabled).
- Inspect DevTools → Elements → `#packet-status`: "Packet delivered!" appears then clears after 3 s.

- [ ] **Step 3: Commit**

```bash
git add js/interactions.js
git commit -m "feat: add LAN vs WAN packet animation with requestAnimationFrame"
```

---

## Self-Review

| Spec requirement | Task |
|---|---|
| Replace static SVG + flip cards | Task 2 |
| Tab bar — LAN/WAN pill buttons | Task 2 (HTML) + Task 3 (JS) |
| SVG — LAN view: WAN nodes dimmed | Task 2 (HTML) + Task 1 (CSS `tab-lan` rule) |
| SVG — WAN view: LAN devices dimmed, router stays visible | Task 3 (`switchTab`) + Task 1 (CSS `tab-wan` rule; router has no `lan-device` class) |
| Clickable nodes → tooltip popup | Task 2 (nodes + tooltip div) + Task 4 (JS) |
| All 7 tooltips with correct text | Task 4 (`TOOLTIP_DATA`) |
| Tooltip dismiss: click-away, Escape, × | Task 4 |
| Attribute panel — 4 stats, updates on tab switch | Task 2 (panel-lan/panel-wan HTML) + Task 3 (JS toggle) |
| Panel border: blue (LAN) / purple (WAN) | Task 1 (CSS `.lan-wan-panel.tab-wan`) + Task 3 (`panel.classList.toggle`) |
| "Send Packet →" button | Task 2 (HTML) + Task 5 (JS) |
| Button disables during animation | Task 5 (`sendBtn.disabled`) |
| Full path (WAN tab) vs LAN-only path (LAN tab) | Task 5 (`svg.classList.contains('tab-wan')` check) |
| Hop labels at each segment | Task 5 (`updateHopLabel` + `HOP_LABELS`) |
| aria-live announcement on completion | Task 5 (`packetStatus`) |
| Tab ARIA: tablist/tab/aria-selected/aria-controls | Task 2 (HTML attrs) + Task 3 (`setAttribute`) |
| Node keyboard: Enter/Space/Escape | Task 4 |
| Tab arrow-key navigation | Task 3 |
| No color-only indicators (stats have icon + label + value) | Task 2 |
| Mobile responsive 2-col → 4-col stat grid | Task 1 (CSS media query) |
| No new files created | All tasks modify existing files |
