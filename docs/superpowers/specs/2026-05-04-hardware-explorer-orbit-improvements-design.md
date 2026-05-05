# Hardware Explorer — Orbit Improvements Design
**Date:** 2026-05-04
**Branch:** UI
**Files affected:** `js/hardware-explorer.js`, `css/hardware-explorer.css`

---

## Goal

Enhance the existing "Explore Hardware in 3D" orbital explorer with three visual behaviours
inspired by the RadialOrbitalTimeline pattern, while keeping the existing structure intact:
orbit scene on the left, detail panel on the right, same 3D CSS models, same function demos.

---

## Features

### 1. Depth opacity + scale

Items at the front of the orbit (bottom — sin θ = +1) appear at full opacity and full size.
Items at the back (top — sin θ = −1) appear dimmer and slightly smaller, creating a perceived
3D depth without any actual CSS `perspective` or `transform-style` changes on the orbit layer.

```
depth   = (1 + sin(θ_item)) / 2   → 0.0 (back) … 1.0 (front)
opacity = 0.35 + 0.65 × depth      → 0.35 … 1.0
scale   = 0.82 + 0.18 × depth      → 0.82 … 1.0
z-index = Math.round(depth × 10)   → 0 … 10
```

Scale is folded into the existing `transform: translate(…) scale(…)` line in `placeItems()`.
The selected item is forced to `opacity:1, scale:1, z-index:20` while its panel is open.

### 2. Snap-rotate

Clicking a component smoothly rotates the orbit so that component arrives at the front
position (bottom of the orbit ring). The snap and the panel entry animation run **in
parallel** — the panel opens immediately on click; the snap lerp (~200 ms at 60 fps)
completes before the 420 ms panel animation finishes, so both feel simultaneous.

**New state variables (module-level):**

| Variable | Initial | Purpose |
|---|---|---|
| `angleOffset` | `0` | Added to `baseAngle` each frame |
| `snapTarget` | `null` | Lerp target; `null` = not snapping |
| `currentAngle` | `0` | Written each tick; read by click handler |

**Tick changes:**

```
baseAngle = elapsed × ORBIT_SPEED
if snapTarget !== null:
    angleOffset += (snapTarget − angleOffset) × 0.10
    if |snapTarget − angleOffset| < 0.001 → angleOffset = snapTarget; snapTarget = null
placeItems(baseAngle + angleOffset)
currentAngle = baseAngle + angleOffset
```

**Snap calculation on click (index `idx`, total `n`):**

```
itemAngle  = idx × (2π / n)
raw        = π/2 − currentAngle − itemAngle
// Normalise raw to shortest path from current angleOffset:
while (raw - angleOffset >  Math.PI) raw -= 2 * Math.PI;
while (raw - angleOffset < -Math.PI) raw += 2 * Math.PI;
snapTarget = raw
```

The orbit continues auto-rotating after snap completes. Closing the panel does not snap back.

### 3. Related-item glow

Each component in the `COMPONENTS` array gains a `relatedIds` string array.

**Relationships:**

| Component | relatedIds |
|---|---|
| CPU | `['ram', 'gpu']` |
| RAM | `['cpu', 'hdd']` |
| HDD | `['ram']` |
| Keyboard | `['mouse']` |
| Mouse | `['keyboard']` |
| Printer | `['cpu']` |
| GPU | `['cpu']` |

**JS behaviour:**
- `openDetail(comp)` — adds class `hw-orbit-item--related` to each related DOM item
- `closeDetail()` — removes `hw-orbit-item--related` from all items

**CSS behaviour (new rules in `hardware-explorer.css`):**

```css
.hw-orbit-item--related .hw-orbit-bubble {
  animation: related-pulse 1.4s ease-in-out infinite;
}
/* keyframes: glow expands on var(--hw-color) of that item */

.hw-orbit-item--related .hw-orbit-label {
  opacity: 1;
  text-shadow: 0 0 14px var(--hw-color);
}
```

**"Connected to:" row in detail panel:**
- `renderDetail()` appends a flex row of small tinted badge-buttons at the panel bottom
- Each badge shows the related component name in its accent colour
- Clicking a badge calls `openDetail()` for that component (triggers snap + new related glow)
- Row is omitted if `relatedIds` is empty

---

## Files Changed

| File | Change type |
|---|---|
| `js/hardware-explorer.js` | Add `relatedIds` data · Add 3 state vars · Update `tick()` · Update `placeItems()` · Update `openDetail()` / `closeDetail()` · Add `renderConnected()` helper |
| `css/hardware-explorer.css` | Add `.hw-orbit-item--related` rules + `@keyframes related-pulse` |

---

## What Is NOT Changing

- HTML structure in `it-basics.html` — zero changes
- The 3D CSS models (CPU, RAM, HDD, Keyboard, Mouse, Printer, GPU)
- The function demos and their JS timers
- The keyboard / Escape accessibility behaviour
- The mobile responsive layout

---

## Success Criteria

1. Items visually dim and shrink as they rotate to the back of the orbit
2. Clicking a component rotates it smoothly to the front; snap and panel entry run in parallel
3. Related items glow/pulse while a component's panel is open
4. "Connected to:" badges in the panel correctly navigate to related components
5. All existing tests pass (keyboard nav, Escape, mobile layout)
