/* =============================================================
   hardware-explorer.js
   Purpose: Interactive orbital hardware explorer for it-basics.html
   Features:
     - Six components orbit a central hub via rAF animation
     - Clicking a component pauses the orbit and opens a detail panel
     - Detail panel shows a CSS 3D model + animated function demo
     - Fully keyboard-accessible (Tab / Enter / Escape)
     - No external dependencies — vanilla JS only
   ============================================================= */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     COMPONENT DATA
     ------------------------------------------------------------------ */
  var COMPONENTS = [
    {
      id: 'cpu',
      name: 'CPU',
      fullName: 'Central Processing Unit',
      color: '#58a6ff',
      colorRgb: '88,166,255',
      tagline: 'The brain. It executes billions of instructions per second — calculations, logic, and decisions for every program.',
      demoLabel: 'Processing Instructions',
      relatedIds: ['ram', 'gpu', 'printer'],
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

  /* ------------------------------------------------------------------
     STATE
     ------------------------------------------------------------------ */
  var rafId            = null;   // requestAnimationFrame handle
  var startTime        = null;   // timestamp of first frame
  var paused           = false;  // true while detail panel is open
  var frozenBaseAngle  = 0;      // baseAngle captured at pause time
  var activeTimers     = [];     // interval / timeout IDs cleared on close

  /* Snap-rotate state */
  var angleOffset  = 0;      // added to baseAngle every frame
  var snapTarget   = null;   // lerp target for angleOffset; null = idle
  var currentAngle = 0;      // last computed total angle, read by openDetail

  /* DOM references (set in init) */
  var scene, orbitItems, detailPanel, detailContent, closeBtn;

  /* Responsive orbit radius: updated on resize */
  var ORBIT_RADIUS = 160;

  /* Orbit speed in radians per millisecond (~20s per revolution) */
  var ORBIT_SPEED = (2 * Math.PI) / 20000;

  /* ------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------ */
  function init() {
    scene         = document.getElementById('hwOrbitScene');
    if (!scene) return;  /* not on this page */

    orbitItems    = document.getElementById('hwOrbitItems');
    detailPanel   = document.getElementById('hwDetailPanel');
    detailContent = document.getElementById('hwDetailContent');
    closeBtn      = document.getElementById('hwCloseBtn');

    buildOrbitItems();
    recalcRadius();

    /* Start the orbit animation */
    rafId = requestAnimationFrame(tick);

    /* Close-panel controls */
    closeBtn.addEventListener('click', closeDetail);
    closeBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeDetail();
      }
    });

    /* Escape key closes the panel from anywhere inside the scene */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !detailPanel.hidden) closeDetail();
    });

    /* Recompute radius on window resize */
    window.addEventListener('resize', recalcRadius);
  }

  /* ------------------------------------------------------------------
     BUILD ORBIT ITEMS
     ------------------------------------------------------------------ */
  function buildOrbitItems() {
    COMPONENTS.forEach(function (comp, idx) {
      var item = document.createElement('div');
      item.className    = 'hw-orbit-item';
      item.tabIndex     = 0;
      item.setAttribute('role', 'listitem');
      item.setAttribute('aria-label', 'Explore ' + comp.fullName + '. Press Enter to open.');
      item.dataset.idx    = idx;
      item.dataset.compId = comp.id;
      item.style.setProperty('--hw-color',   comp.color);
      item.style.setProperty('--hw-color-t', 'rgba(' + comp.colorRgb + ',0.18)');

      var bubble = document.createElement('div');
      bubble.className = 'hw-orbit-bubble';
      bubble.innerHTML = comp.icon;

      var label = document.createElement('div');
      label.className = 'hw-orbit-label';
      label.textContent = comp.name;

      item.appendChild(bubble);
      item.appendChild(label);

      item.addEventListener('click', function () { openDetail(comp); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail(comp);
        }
      });

      orbitItems.appendChild(item);
    });
  }

  /* ------------------------------------------------------------------
     ANIMATION LOOP
     ------------------------------------------------------------------ */
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

  function recalcRadius() {
    ORBIT_RADIUS = scene.offsetWidth * 0.36;
  }

  /* ------------------------------------------------------------------
     OPEN DETAIL
     ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------
     CLOSE DETAIL
     ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------
     RENDER DETAIL PANEL CONTENT
     ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------
     3D MODELS  (pure CSS + HTML, no images)
     ------------------------------------------------------------------ */
  function get3DModel(id) {
    switch (id) {
      case 'cpu':      return getCPUModel();
      case 'ram':      return getRAMModel();
      case 'hdd':      return getHDDModel();
      case 'keyboard': return getKeyboardModel();
      case 'mouse':    return getMouseModel();
      case 'printer':  return getPrinterModel();
      case 'gpu':      return getGPUModel();
      default:         return '';
    }
  }

  function repeat(n, fn) {
    var out = '';
    for (var i = 0; i < n; i++) out += fn(i);
    return out;
  }

  function getCPUModel() {
    var pins5v = repeat(5, function () { return '<div class="cpu-pin-v"></div>'; });
    var pins4h = repeat(4, function () { return '<div class="cpu-pin-h"></div>'; });
    var cells  = repeat(9, function (i) {
      return '<div class="cpu-core-cell" style="--ci:' + i + '"></div>';
    });
    return (
      '<div class="cpu-model">' +
        '<div class="cpu-body">' +
          '<div class="cpu-pins-tb top">'    + pins5v + '</div>' +
          '<div class="cpu-pins-tb bottom">' + pins5v + '</div>' +
          '<div class="cpu-pins-lr left">'   + pins4h + '</div>' +
          '<div class="cpu-pins-lr right">'  + pins4h + '</div>' +
          '<div class="cpu-core">'           + cells  + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function getRAMModel() {
    var chips = repeat(6, function () { return '<div class="ram-chip"></div>'; });
    return (
      '<div class="ram-model">' +
        '<div class="ram-pcb">' +
          chips +
          '<div class="ram-connector"></div>' +
          '<div class="ram-notch"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function getHDDModel() {
    return (
      '<div class="hdd-model">' +
        '<div class="hdd-outer">' +
          '<div class="hdd-platter"></div>' +
          '<div class="hdd-hub"></div>' +
          '<div class="hdd-arm"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function getKeyboardModel() {
    var keys = repeat(33, function (i) {
      return '<div class="kb-key" data-ki="' + i + '"></div>';
    });
    return (
      '<div class="keyboard-model">' +
        '<div class="keyboard-body" id="hw-kb-body">' + keys + '</div>' +
      '</div>'
    );
  }

  function getMouseModel() {
    return (
      '<div class="mouse-model">' +
        '<div class="mouse-body">' +
          '<div class="mouse-seam"></div>' +
          '<div class="mouse-btn left" id="hw-mouse-left"></div>' +
          '<div class="mouse-btn right"></div>' +
          '<div class="mouse-scroll"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function getPrinterModel() {
    return (
      '<div class="printer-model">' +
        '<div class="printer-body">' +
          '<div class="printer-slot"></div>' +
          '<div class="printer-led"></div>' +
          '<div class="printer-paper"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function getGPUModel() {
    var fins = repeat(5, function () { return '<div class="gpu-fin"></div>'; });
    return (
      '<div class="gpu-model">' +
        '<div class="gpu-pcb">' +
          '<div class="gpu-fan">' +
            '<div class="gpu-fan-hub"></div>' +
          '</div>' +
          '<div class="gpu-heatsink">' + fins + '</div>' +
          '<div class="gpu-connector"></div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ------------------------------------------------------------------
     FUNCTION DEMOS  (HTML for demo area, animated by CSS + JS)
     ------------------------------------------------------------------ */
  function getFunctionDemo(id) {
    switch (id) {
      case 'cpu': {
        /* Eight data blocks that pulse in sequence */
        var colors = [
          '#58a6ff','#3fb950','#bc8cff','#d29922',
          '#f0883e','#58a6ff','#f85149','#3fb950'
        ];
        var blocks = colors.map(function (c, i) {
          var rgb = hexToRgb(c);
          return (
            '<div class="demo-cpu-block" style="' +
              '--i:' + i + ';' +
              'background:rgba(' + rgb + ',0.18);' +
              'border:1px solid ' + c + ';' +
              'box-shadow:0 0 6px rgba(' + rgb + ',0.3)' +
            '"></div>' +
            (i < colors.length - 1 ? '<div class="demo-cpu-arrow">›</div>' : '')
          );
        }).join('');
        return '<div class="demo-cpu">' + blocks + '</div>';
      }

      case 'ram': {
        var slots = repeat(4, function (i) {
          return (
            '<div class="demo-ram-slot">' +
              '<div class="demo-ram-fill" style="--i:' + i + '"></div>' +
            '</div>'
          );
        });
        return '<div class="demo-ram">' + slots + '</div>';
      }

      case 'hdd': {
        return (
          '<div class="demo-hdd">' +
            '<span class="demo-hdd-speed">7200</span>' +
            '<span class="demo-hdd-label">RPM</span>' +
            '<div class="demo-hdd-bar">' +
              '<div class="demo-hdd-head"></div>' +
            '</div>' +
          '</div>'
        );
      }

      case 'keyboard': {
        return '<div class="demo-keyboard" id="hw-typewriter"></div>';
      }

      case 'mouse': {
        return (
          '<div class="demo-mouse-wrap">' +
            '<span class="demo-cursor-icon">🖱️</span>' +
            '<div style="position:relative;display:flex;align-items:center;justify-content:center;">' +
              '<div class="demo-click-ring"></div>' +
              '<div class="demo-click-ring"></div>' +
              '<div class="demo-click-ring"></div>' +
            '</div>' +
            '<span style="color:var(--color-text-secondary);font-size:var(--text-xs)">Click events</span>' +
          '</div>'
        );
      }

      case 'printer': {
        var lines = repeat(4, function (i) {
          return (
            '<div class="demo-print-line">' +
              '<div class="demo-print-fill" style="--i:' + i + '"></div>' +
            '</div>'
          );
        });
        return '<div class="demo-printer-lines">' + lines + '</div>';
      }

      case 'gpu': {
        var pixels = repeat(25, function (i) {
          return '<div class="demo-gpu-pixel" style="--i:' + i + '"></div>';
        });
        return (
          '<div class="demo-gpu">' +
            '<div class="demo-gpu-grid">' + pixels + '</div>' +
            '<div class="demo-gpu-info">' +
              '<span class="demo-gpu-fps">60</span>' +
              '<span class="demo-gpu-fps-label">FPS</span>' +
            '</div>' +
          '</div>'
        );
      }

      default: return '';
    }
  }

  /* ------------------------------------------------------------------
     START DEMO ANIMATIONS  (JS-driven parts: typewriter, key lights)
     ------------------------------------------------------------------ */
  function startDemoAnimations(id) {
    if (id === 'keyboard') {
      startTypewriter();
      startKeyLights();
    }
    if (id === 'mouse') {
      startMouseClick();
    }
  }

  function startTypewriter() {
    var el = detailContent.querySelector('#hw-typewriter');
    if (!el) return;

    var text = 'Hello, World!';
    var pos  = 0;
    var loopDelay = 1200; /* ms pause before restarting */

    function typeNext() {
      if (pos >= text.length) {
        /* Pause then clear and restart */
        var t = setTimeout(function () {
          el.textContent = '';
          pos = 0;
          step();
        }, loopDelay);
        activeTimers.push(t);
        return;
      }
      el.textContent += text[pos];
      pos++;
      step();
    }

    function step() {
      var t = setTimeout(typeNext, 130);
      activeTimers.push(t);
    }

    step();
  }

  function startKeyLights() {
    var body = detailContent.querySelector('#hw-kb-body');
    if (!body) return;

    var keys     = body.querySelectorAll('.kb-key');
    var current  = 0;
    var id = setInterval(function () {
      keys.forEach(function (k) { k.classList.remove('lit'); });
      keys[current % keys.length].classList.add('lit');
      current++;
    }, 90);
    activeTimers.push(id);
  }

  function startMouseClick() {
    var leftBtn = detailContent.querySelector('#hw-mouse-left');
    if (!leftBtn) return;

    var id = setInterval(function () {
      leftBtn.classList.add('active');
      var t = setTimeout(function () {
        leftBtn.classList.remove('active');
      }, 200);
      activeTimers.push(t);
    }, 1600);
    activeTimers.push(id);
  }

  /* ------------------------------------------------------------------
     UTILITY
     ------------------------------------------------------------------ */
  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return r + ',' + g + ',' + b;
  }

  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
