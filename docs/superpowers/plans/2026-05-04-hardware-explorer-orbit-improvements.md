# Hardware Explorer — Orbit Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add depth-based opacity/scale, snap-rotate-to-front on click, and related-item glow to the existing orbital hardware explorer in `it-basics.html`, without changing the page HTML structure.

**Architecture:** All changes are additive to `js/hardware-explorer.js` (data enhancements + animation loop refactor) and `css/hardware-explorer.css` (new class + keyframes). The rAF loop is refactored so `angleOffset` (a new var) lerps independently from `frozenBaseAngle` (the frozen orbit base), letting the snap animate while the orbit is paused. `placeItems()` is always called every frame so depth and snap work even when the detail panel is open.

**Tech Stack:** Vanilla JS (ES5-style `var`/`function`, no bundler), CSS3 custom properties + keyframe animations, `requestAnimationFrame`

**Spec:** `docs/superpowers/specs/2026-05-04-hardware-explorer-orbit-improvements-design.md`

---

### Task 1: Add `relatedIds` to component data and `data-comp-id` to orbit DOM items

**Files:**
- Modify: `js/hardware-explorer.js` lines 18–89 (COMPONENTS array), lines 148–179 (buildOrbitItems)

- [ ] **Step 1: Replace COMPONENTS array (lines 18–89) with relatedIds added**

In `js/hardware-explorer.js`, replace the entire `var COMPONENTS = [...]` block with:

```js
  var COMPONENTS = [
    {
      id: 'cpu',
      name: 'CPU',
      fullName: 'Central Processing Unit',
      color: '#58a6ff',
      colorRgb: '88,166,255',
      tagline: 'The brain. It executes billions of instructions per second — calculations, logic, and decisions for every program.',
      demoLabel: 'Processing Instructions',
      relatedIds: ['ram', 'gpu'],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>'
    },
    {
      id: 'ram',
      name: 'RAM',
      fullName: 'Random Access Memory',
      color: '#d29922',
      colorRgb: '210,153,34',
      tagline: 'Short-term memory. Holds programs currently in use for instant access — everything clears when the power goes off.',
      demoLabel: 'Storing Active Data',
      relatedIds: ['cpu', 'hdd'],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="10" y1="10" x2="10" y2="14"/><line x1="14" y1="10" x2="14" y2="14"/><line x1="18" y1="10" x2="18" y2="14"/></svg>'
    },
    {
      id: 'hdd',
      name: 'Hard Disk',
      fullName: 'Hard Disk Drive (HDD)',
      color: '#f0883e',
      colorRgb: '240,136,62',
      tagline: 'Long-term storage. Spinning magnetic platters store all your files, photos, and programs — even with the power off.',
      demoLabel: 'Seeking Data at 7200 RPM',
      relatedIds: ['ram'],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="4"/></svg>'
    },
    {
      id: 'keyboard',
      name: 'Keyboard',
      fullName: 'Keyboard (Input Device)',
      color: '#3fb950',
      colorRgb: '63,185,80',
      tagline: 'Primary input device. Each key press sends an electrical signal the computer converts into a character or command.',
      demoLabel: 'Typing Input',
      relatedIds: ['mouse'],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>'
    },
    {
      id: 'mouse',
      name: 'Mouse',
      fullName: 'Computer Mouse (Input Device)',
      color: '#bc8cff',
      colorRgb: '188,140,255',
      tagline: 'Pointing device. Physical movement is translated into cursor position on screen — each click sends a digital event.',
      demoLabel: 'Moving & Clicking',
      relatedIds: ['keyboard'],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 2v8"/><path d="M5 10h14"/></svg>'
    },
    {
      id: 'printer',
      name: 'Printer',
      fullName: 'Laser / Inkjet Printer',
      color: '#f85149',
      colorRgb: '248,81,73',
      tagline: 'Output device. Converts a digital document into a physical paper copy by spraying ink or fusing toner onto the page.',
      demoLabel: 'Printing a Document',
      relatedIds: ['cpu'],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'
    },
    {
      id: 'gpu',
      name: 'GPU',
      fullName: 'Graphics Processing Unit',
      color: '#39d0d8',
      colorRgb: '57,208,216',
      tagline: 'Handles all graphics rendering. Thousands of tiny parallel cores draw every pixel on screen — from a simple desktop to complex 3D games and AI workloads.',
      demoLabel: 'Rendering Pixels',
      relatedIds: ['cpu'],
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="17" height="13" rx="2"/><circle cx="9" cy="12" r="3"/><line x1="14" y1="9" x2="14" y2="15"/><line x1="16" y1="9" x2="16" y2="15"/><line x1="19" y1="9" x2="22" y2="9"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="19" y1="15" x2="22" y2="15"/></svg>'
    }
  ];
```

- [ ] **Step 2: Add `data-comp-id` attribute in `buildOrbitItems`**

In `js/hardware-explorer.js` inside `buildOrbitItems`, add one line after `item.dataset.idx = idx;` (around line 155):

```js
      item.dataset.idx    = idx;
      item.dataset.compId = comp.id;   // ← add this line
      item.style.setProperty('--hw-color',   comp.color);
```

- [ ] **Step 3: Verify in browser — no regressions**

Open `http://localhost:8080/pages/it-basics.html`.
Check browser console — zero errors. Orbit spins, clicking a component opens the detail panel. No visual change expected yet.

- [ ] **Step 4: Commit**

```bash
git add js/hardware-explorer.js
git commit -m "feat: add relatedIds to COMPONENTS and data-comp-id to orbit items"
```

---

### Task 2: Refactor animation state — depth opacity/scale + snap-rotate foundation

**Files:**
- Modify: `js/hardware-explorer.js` — state vars (lines 93–98), `tick()` (lines 185–193), `placeItems()` (lines 195–208)

- [ ] **Step 1: Replace state variable block (lines 93–98)**

Replace:
```js
  var rafId         = null;   // requestAnimationFrame handle
  var startTime     = null;   // timestamp of first frame
  var paused        = false;  // true while detail panel is open
  var frozenAngle   = 0;      // orbit angle captured when pausing
  var activeTimers  = [];     // interval / timeout IDs cleared on close
```

With:
```js
  var rafId            = null;   // requestAnimationFrame handle
  var startTime        = null;   // timestamp of first frame
  var paused           = false;  // true while detail panel is open
  var frozenBaseAngle  = 0;      // baseAngle captured at pause time
  var activeTimers     = [];     // interval / timeout IDs cleared on close

  /* Snap-rotate state */
  var angleOffset  = 0;      // added to baseAngle every frame
  var snapTarget   = null;   // lerp target for angleOffset; null = idle
  var currentAngle = 0;      // last computed total angle, read by openDetail
```

- [ ] **Step 2: Replace `tick()` (lines 185–193)**

Replace:
```js
  function tick(ts) {
    if (!startTime) startTime = ts;

    if (!paused) {
      var elapsed = ts - startTime;
      placeItems(elapsed * ORBIT_SPEED);
    }
    rafId = requestAnimationFrame(tick);
  }
```

With:
```js
  function tick(ts) {
    if (!startTime) startTime = ts;

    /* Always lerp snap every frame, even while paused */
    if (snapTarget !== null) {
      angleOffset += (snapTarget - angleOffset) * 0.10;
      if (Math.abs(snapTarget - angleOffset) < 0.001) {
        angleOffset = snapTarget;
        snapTarget  = null;
      }
    }

    var baseAngle = paused
      ? frozenBaseAngle
      : (ts - startTime) * ORBIT_SPEED;

    currentAngle = baseAngle + angleOffset;
    placeItems(currentAngle);

    rafId = requestAnimationFrame(tick);
  }
```

- [ ] **Step 3: Replace `placeItems()` (lines 195–208)**

Replace:
```js
  function placeItems(angle) {
    var items = orbitItems.querySelectorAll('.hw-orbit-item');
    var cx    = scene.offsetWidth  / 2;
    var cy    = scene.offsetHeight / 2;
    var n     = items.length;

    items.forEach(function (item, i) {
      var theta = angle + (i * (2 * Math.PI / n));
      var x     = cx + Math.cos(theta) * ORBIT_RADIUS;
      var y     = cy + Math.sin(theta) * ORBIT_RADIUS;
      /* Position the item so the centre of the 68×68 bubble sits on (x, y) */
      item.style.transform = 'translate(' + (x - 34) + 'px, ' + (y - 34) + 'px)';
    });
  }
```

With:
```js
  function placeItems(angle) {
    var items = orbitItems.querySelectorAll('.hw-orbit-item');
    var cx    = scene.offsetWidth  / 2;
    var cy    = scene.offsetHeight / 2;
    var n     = items.length;

    items.forEach(function (item, i) {
      var theta   = angle + (i * (2 * Math.PI / n));
      var x       = cx + Math.cos(theta) * ORBIT_RADIUS;
      var y       = cy + Math.sin(theta) * ORBIT_RADIUS;

      /* Depth: sin(θ)=+1 at bottom (front), −1 at top (back) */
      var depth   = (1 + Math.sin(theta)) / 2;
      var opacity = (0.35 + 0.65 * depth).toFixed(3);
      var scale   = (0.82 + 0.18 * depth).toFixed(3);

      item.style.transform = 'translate(' + (x - 34) + 'px, ' + (y - 34) + 'px) scale(' + scale + ')';
      item.style.opacity   = opacity;
      item.style.zIndex    = Math.round(depth * 10);
    });
  }
```

- [ ] **Step 4: Verify depth in browser**

Open `http://localhost:8080/pages/it-basics.html`.
Watch the orbit: items at the bottom of the ring should appear full-size and fully opaque. Items at the top should appear ~82% size and ~35% opacity. The transition should be smooth and continuous as the orbit rotates.

- [ ] **Step 5: Commit**

```bash
git add js/hardware-explorer.js
git commit -m "feat: depth opacity/scale in placeItems + refactor tick for snap foundation"
```

---

### Task 3: Wire snap-rotate in `openDetail()` and clean up in `closeDetail()`

**Files:**
- Modify: `js/hardware-explorer.js` — `openDetail()` (lines 217–235), `closeDetail()` (lines 240–252)

- [ ] **Step 1: Replace `openDetail()` (lines 217–235)**

Replace:
```js
  function openDetail(comp) {
    /* Capture angle so the orbit stays frozen at the right position */
    paused = true;
    scene.classList.add('dim');

    detailPanel.hidden = false;
    detailPanel.style.setProperty('--hw-panel-color', comp.color);

    /* Re-trigger the entry animation by cloning (simple approach) */
    detailPanel.style.animation = 'none';
    /* Force reflow */
    void detailPanel.offsetWidth; /* jshint ignore:line */
    detailPanel.style.animation = '';

    renderDetail(comp);

    /* Move focus to the close button after animation completes */
    setTimeout(function () { closeBtn.focus(); }, 430);
  }
```

With:
```js
  function openDetail(comp) {
    /* Clear any running demo timers from a prior open (badge navigation) */
    activeTimers.forEach(function (id) {
      clearInterval(id);
      clearTimeout(id);
    });
    activeTimers = [];

    /* Freeze the base angle so snap can animate while orbit is paused */
    frozenBaseAngle = currentAngle - angleOffset;
    paused = true;

    /* Snap: rotate this item to the front (bottom of orbit, θ = π/2) */
    var idx = COMPONENTS.findIndex(function (c) { return c.id === comp.id; });
    if (idx >= 0) {
      var n         = COMPONENTS.length;
      var itemAngle = idx * (2 * Math.PI / n);
      var raw       = Math.PI / 2 - frozenBaseAngle - itemAngle;
      /* Normalise to shortest angular path from current angleOffset */
      while (raw - angleOffset >  Math.PI) { raw -= 2 * Math.PI; }
      while (raw - angleOffset < -Math.PI) { raw += 2 * Math.PI; }
      snapTarget = raw;
    }

    /* Clear previous related highlights, add new ones */
    orbitItems.querySelectorAll('.hw-orbit-item--related').forEach(function (el) {
      el.classList.remove('hw-orbit-item--related');
    });
    comp.relatedIds.forEach(function (relId) {
      var el = orbitItems.querySelector('[data-comp-id="' + relId + '"]');
      if (el) { el.classList.add('hw-orbit-item--related'); }
    });

    scene.classList.add('dim');

    detailPanel.hidden = false;
    detailPanel.style.setProperty('--hw-panel-color', comp.color);

    detailPanel.style.animation = 'none';
    void detailPanel.offsetWidth; /* jshint ignore:line */
    detailPanel.style.animation = '';

    renderDetail(comp);

    /* Wire "Connected to:" badge clicks */
    detailContent.querySelectorAll('.hw-connected-badge').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var relId = btn.dataset.relatedId;
        var rel   = COMPONENTS.find(function (c) { return c.id === relId; });
        if (rel) { openDetail(rel); }
      });
    });

    setTimeout(function () { closeBtn.focus(); }, 430);
  }
```

- [ ] **Step 2: Replace `closeDetail()` (lines 240–252)**

Replace:
```js
  function closeDetail() {
    paused = false;
    scene.classList.remove('dim');
    detailPanel.hidden = true;
    detailContent.innerHTML = '';

    /* Clear all running timers started by the demo */
    activeTimers.forEach(function (id) {
      clearInterval(id);
      clearTimeout(id);
    });
    activeTimers = [];
  }
```

With:
```js
  function closeDetail() {
    paused = false;
    scene.classList.remove('dim');
    detailPanel.hidden = true;
    detailContent.innerHTML = '';

    /* Remove related-item glow */
    orbitItems.querySelectorAll('.hw-orbit-item--related').forEach(function (el) {
      el.classList.remove('hw-orbit-item--related');
    });

    /* Clear all running timers started by the demo */
    activeTimers.forEach(function (id) {
      clearInterval(id);
      clearTimeout(id);
    });
    activeTimers = [];
  }
```

- [ ] **Step 3: Verify snap-rotate in browser**

Open `http://localhost:8080/pages/it-basics.html`.
Click any orbit item. The orbit should visibly rotate so the clicked item swings to the bottom (front) position while the detail panel slides in — both animations run simultaneously. Click "Back to orbit", then click a different item — it should snap to the front from its new position. Close and reopen several items to confirm the snap always targets the bottom.

- [ ] **Step 4: Commit**

```bash
git add js/hardware-explorer.js
git commit -m "feat: snap-rotate on openDetail and related-item class toggling"
```

---

### Task 4: Related-item glow CSS + "Connected to:" row in detail panel

**Files:**
- Modify: `css/hardware-explorer.css` (append new rules at end of file)
- Modify: `js/hardware-explorer.js` — add `renderConnected()` helper after `getFunctionDemo()`, update `renderDetail()`

- [ ] **Step 1: Append CSS for related glow and Connected-to row to `hardware-explorer.css`**

Add the following at the very end of `css/hardware-explorer.css`:

```css
/* ------------------------------------------------------------------
   RELATED-ITEM GLOW  (orbit items connected to the selected component)
   ------------------------------------------------------------------ */
.hw-orbit-item--related .hw-orbit-bubble {
  animation: related-pulse 1.4s ease-in-out infinite;
}

@keyframes related-pulse {
  0%, 100% {
    box-shadow:
      0 0 10px var(--hw-color),
      0 0 30px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.04);
  }
  50% {
    box-shadow:
      0 0 28px var(--hw-color),
      0 0 60px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.06);
  }
}

.hw-orbit-item--related .hw-orbit-label {
  opacity: 1;
  text-shadow: 0 0 14px var(--hw-color);
}

/* ------------------------------------------------------------------
   CONNECTED-TO ROW  (bottom of detail panel)
   ------------------------------------------------------------------ */
.hw-connected {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.hw-connected-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.hw-connected-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.hw-connected-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: 9999px;
  border: 1px solid var(--hw-related-color, #58a6ff);
  background: transparent;
  color: var(--hw-related-color, #58a6ff);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition:
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.hw-connected-badge:hover,
.hw-connected-badge:focus-visible {
  box-shadow: 0 0 10px var(--hw-related-color, #58a6ff);
  background: rgba(255,255,255,0.05);
  outline: none;
}

.hw-connected-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--hw-related-color, #58a6ff);
}
```

- [ ] **Step 2: Add `renderConnected()` helper in `hardware-explorer.js`**

After the closing `}` of `getFunctionDemo()` (around line 486) and before `startDemoAnimations`, insert:

```js
  /* ------------------------------------------------------------------
     RENDER CONNECTED-TO ROW
     ------------------------------------------------------------------ */
  function renderConnected(comp) {
    if (!comp.relatedIds || comp.relatedIds.length === 0) { return ''; }

    var badges = comp.relatedIds.map(function (relId) {
      var rel = COMPONENTS.find(function (c) { return c.id === relId; });
      if (!rel) { return ''; }
      var iconHtml = rel.icon.replace('<svg ', '<svg class="hw-connected-icon" ');
      return (
        '<button class="hw-connected-badge"' +
                ' style="--hw-related-color:' + rel.color + '"' +
                ' data-related-id="' + rel.id + '"' +
                ' aria-label="Explore ' + rel.fullName + '">' +
          iconHtml +
          rel.name +
        '</button>'
      );
    }).join('');

    return (
      '<div class="hw-connected">' +
        '<p class="hw-connected-label">Connected to</p>' +
        '<div class="hw-connected-badges">' + badges + '</div>' +
      '</div>'
    );
  }
```

- [ ] **Step 3: Update `renderDetail()` to append the connected row**

In `js/hardware-explorer.js`, replace `renderDetail()` (lines 257–272):

```js
  function renderDetail(comp) {
    detailContent.innerHTML =
      '<div class="hw-3d-stage" aria-hidden="true">' +
        get3DModel(comp.id) +
      '</div>' +
      '<p class="hw-detail-name">' + comp.name + '</p>' +
      '<p class="hw-detail-tagline">' +
        '<strong>' + comp.fullName + '</strong> — ' + comp.tagline +
      '</p>' +
      '<div class="hw-function-demo">' +
        '<p class="hw-function-label">' + comp.demoLabel + '</p>' +
        getFunctionDemo(comp.id) +
      '</div>';

    startDemoAnimations(comp.id);
  }
```

With:

```js
  function renderDetail(comp) {
    detailContent.innerHTML =
      '<div class="hw-3d-stage" aria-hidden="true">' +
        get3DModel(comp.id) +
      '</div>' +
      '<p class="hw-detail-name">' + comp.name + '</p>' +
      '<p class="hw-detail-tagline">' +
        '<strong>' + comp.fullName + '</strong> — ' + comp.tagline +
      '</p>' +
      '<div class="hw-function-demo">' +
        '<p class="hw-function-label">' + comp.demoLabel + '</p>' +
        getFunctionDemo(comp.id) +
      '</div>' +
      renderConnected(comp);

    startDemoAnimations(comp.id);
  }
```

- [ ] **Step 4: Verify all three features in browser**

Open `http://localhost:8080/pages/it-basics.html`. Check each feature:

1. **Depth opacity/scale** — watch the orbit spin; items at the bottom appear bright and full-size, items at the top appear dim (~35% opacity) and slightly smaller (~82% scale).

2. **Snap-rotate** — click CPU; the orbit rotates so CPU swings to the bottom as the panel slides in. Click "Back to orbit", click GPU; GPU snaps to the bottom.

3. **Related-item glow** — click CPU; RAM and GPU should pulse with a glowing halo while the CPU panel is open. Close the panel — glow stops.

4. **Connected-to row** — open the CPU panel; at the bottom you should see a "Connected to" row with RAM and GPU as tinted pill badges. Click the RAM badge — CPU panel stays open but transitions to RAM panel; CPU and HDD now glow.

5. **Keyboard nav** — Tab to an orbit item, press Enter; snap and panel open. Press Escape to close. Related items glow correctly.

6. **Mobile** — resize to 375 px wide; orbit and panel still stack vertically, no layout breakage.

- [ ] **Step 5: Commit**

```bash
git add js/hardware-explorer.js css/hardware-explorer.css
git commit -m "feat: related-item glow and Connected-to row in hardware explorer panel"
```
