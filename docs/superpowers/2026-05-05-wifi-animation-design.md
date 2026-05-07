omm# Design Spec: Wi-Fi Connection Animation

**Date:** 2026-05-05
**Status:** Approved

---

## Overview

Replace the static SVG diagram under the h3 "How a Wi-Fi Connection Works" in `pages/wifi-networking.html` (Section 1, lines ~248–329) with an interactive animated diagram. The animation shows a glowing packet traveling from the user's device to the internet and back, teaching the full request/response cycle.

---

## Goals

- Replace the existing static SVG with a self-contained interactive animation
- Show both the outgoing request (Device → Internet) and the response (Internet → Device)
- Explain each step in plain beginner-friendly language
- Match the existing page's dark neon aesthetic (dark navy, lime `#c8ff00`, cyan `#00e5ff`, purple `#bc8cff`)
- Zero external dependencies — vanilla JS only

---

## Interaction Model

**Option C (chosen): Auto-Advance with Pause/Play**

The animation auto-plays through each step in sequence. The user can:
- **Pause / Play** — freeze the packet mid-segment or resume
- **Restart** — send the packet back to the Device
- **Speed** — cycle through 1× / 2× / 0.5×
- **Click any node** — jump directly to that step
- **Click any progress dot** — jump directly to that step

---

## Implementation Approach

**Option B (chosen): Inline SVG + `requestAnimationFrame` JS**

- The diagram is a single `<svg viewBox="0 0 680 140">` embedded directly in the HTML
- Four nodes (Device, Router, Modem, Internet) are SVG `<g>` groups with `<rect>` / `<ellipse>` shapes
- Three connecting lines per direction, drawn as `<line>` elements — a dim base layer and a color glow layer (toggled by opacity)
- The packet is a pulsing `<circle>` whose `cx` attribute is updated each frame via `requestAnimationFrame`
- Position is interpolated with a quadratic ease-in/out function (`lerp` + easing)
- All controls and step text are standard HTML/DOM below the SVG
- No canvas, no external libraries

---

## Steps (7 total)

| Step | Label | From → To | Line color | Description |
|------|-------|-----------|------------|-------------|
| 1 | Outgoing request | Device (idle) | — | Device prepares request, converts to radio waves |
| 2 | Radio waves to router | Device → Router | Cyan `#00e5ff` | Radio waves travel through air, picked up by router antenna |
| 3 | Router routes request | Router (idle) | — | Router acts as traffic controller, forwards packets to modem |
| 4 | Router → Modem (cable) | Router → Modem | Lime `#c8ff00` | Travels down physical cable; modem translates signal for ISP |
| 5 | Modem → Internet (fibre) | Modem → Internet | Purple `#bc8cff` | Fibre/cable line, out of home, reaches destination server |
| 6 | Response travels back | Internet → Modem | Purple `#bc8cff` | Server sends response back down fibre line to modem |
| 7 | Data arrives at device | Modem → Device | Cyan `#00e5ff` | Modem → Router → Device via Wi-Fi; browser assembles page |

After step 7, the animation loops back to step 1 after a short 1.8s pause.

---

## Visual Structure

```
┌─────────────────────────────────────────────────────────┐
│  [SVG diagram — 680×140 viewBox]                         │
│   [Device]──────[Router]──────[Modem]──────[Internet]    │
│       •← glowing packet travels along line              │
├─────────────────────────────────────────────────────────┤
│  STEP N OF 7 — LABEL                                     │
│  Description text (1–2 sentences, beginner-friendly)     │
├─────────────────────────────────────────────────────────┤
│  ●──○──○──○──○──○──○  (7 progress dots, clickable)      │
├─────────────────────────────────────────────────────────┤
│  [↺ Restart]  [⏸ Pause]  Speed [1×]                     │
└─────────────────────────────────────────────────────────┘
```

### Color scheme (matches existing page)

| Element | Color |
|---------|-------|
| Background | `#0d1117` (matches `.content-section`) |
| Node borders (idle) | `rgba(color, 0.3)` |
| Node borders (active) | `rgba(color, 0.9)` |
| Radio wave segment | Cyan `#00e5ff` |
| Cable segment | Lime `#c8ff00` |
| Fibre segment | Purple `#bc8cff` |
| Packet dot | Matches active segment color |
| Label text | `'Fira Code', monospace` |
| Controls | Lime ghost buttons, matching `.wp-btn` style from Wall Penetration Simulator |

---

## File Changes

Only one file is modified:

**`pages/wifi-networking.html`**

1. **Remove** the existing static `<svg class="hw-diagram">` block (lines ~252–329)
2. **Insert** the new animation in its place — all HTML, inline `<style>`, and `<script>` are self-contained within the section, following the same pattern as the Wall Penetration Simulator

No new files are created. No new CSS files. No JS files added.

---

## Accessibility

- The `<svg>` has `role="img"` and `aria-label` describing the overall diagram
- Each node `<g>` has an `aria-label`
- The step description `<div>` has `role="status"` and `aria-live="polite"` so screen readers announce step changes
- Pause/Play/Restart buttons have descriptive `aria-label` attributes
- Progress dots have `title` and `aria-label` attributes
- All interactive elements are keyboard-focusable with `tabindex`

---

## Constraints

- Must work without a backend (all logic in-browser)
- No external libraries
- Mobile-responsive: `viewBox` on the SVG scales down automatically; controls wrap on small screens
- WCAG 2.1 AA contrast ratios maintained for all text

---

## Out of Scope

- Sound effects
- Tooltip popups on hover over nodes
- Showing actual packet data / IP addresses
- Multiple concurrent packets
