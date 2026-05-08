# LAN vs WAN Interactive Redesign — Design Spec

**Date:** 2026-05-08
**Page:** `pages/computer-networks.html` — Section 2 "LAN vs WAN — Up Close"
**Status:** Approved

---

## Overview

Replace the existing static SVG diagram and flip cards in Section 2 with a fully interactive, animated LAN vs WAN diagram. The new section teaches the difference between local and wide-area networks through hands-on exploration: clickable nodes, a tab-switched comparison view, an animated packet journey, and a live attribute panel.

---

## What Gets Removed

- The existing static inline SVG (Home LAN → Internet → Office LAN)
- The four flip cards (LAN, WAN, Bandwidth, Latency)
- The "Try it!" callout box above the flip cards

The section heading, subtitle, and village analogy paragraph are kept.

---

## Layout (Top to Bottom)

1. Section heading + subtitle (unchanged)
2. Village analogy paragraph (unchanged)
3. **Tab bar** — `[LAN]` and `[WAN]` pill buttons
4. **Interactive SVG diagram** — morphs based on active tab
5. **Tooltip popups** — appear near clicked nodes
6. **Attribute panel** — stat card below diagram, updates on tab switch
7. **"Send Packet →" button** — triggers packet animation

---

## Tab Bar

- Two pill-style buttons: `LAN` and `WAN`
- Active tab: accent-colored background, white text
- Inactive tab: ghost style (border only)
- ARIA: `role="tablist"`, each button `role="tab"` with `aria-selected` and `aria-controls` pointing to the diagram+panel wrapper

---

## SVG Diagram

Single inline SVG. JS adds/removes CSS classes to show, dim, or hide node groups based on the active tab. No SVG is swapped out — only visibility states change.

**viewBox:** `0 0 700 320`

### LAN Tab View
- Dashed boundary ellipse labeled "LAN" in accent blue (`#58a6ff`)
- Inside: Laptop, Phone, Smart TV, Router — lines connect devices to Router
- Outside: Internet cloud and Remote Server rendered at 20% opacity (dimmed)

### WAN Tab View
- LAN boundary ellipse fades to 20% opacity
- LAN devices remain visible but dimmed (20% opacity)
- WAN path highlighted: Router → ISP → Internet Cloud → Remote Server
- WAN path color: purple (`#bc8cff`), matching site's existing WAN color

### Nodes

| Node | Both Views | Position |
|---|---|---|
| Laptop | Clickable, tabindex="0" | LAN left |
| Phone | Clickable, tabindex="0" | LAN bottom-left |
| Smart TV | Clickable, tabindex="0" | LAN bottom-right |
| Router | Clickable, tabindex="0" | LAN center |
| ISP | Clickable, tabindex="0" | Mid-right |
| Internet Cloud | Clickable, tabindex="0" | Far right center |
| Remote Server | Clickable, tabindex="0" | Far right |

---

## Tooltip Popups

- Triggered by click (or Enter/Space via keyboard) on any node `<g>` element
- Positioned absolutely near the clicked node (above or below depending on available space)
- Content: bold title + 1–2 sentence description
- Dismissed by: clicking elsewhere, pressing Escape, or clicking the same node again
- ARIA: `role="tooltip"`, node `<g>` has `aria-describedby` pointing to the tooltip

### Tooltip Content

| Node | Title | Description |
|---|---|---|
| Laptop | Your Device | Sends requests and receives data within the LAN. |
| Phone | Mobile Device | Connects to the LAN wirelessly via Wi-Fi. |
| Smart TV | Smart TV | A LAN device that streams from the internet through the router. |
| Router | Router | The gateway between your LAN and the internet. Assigns local IP addresses via DHCP. |
| ISP | ISP | Internet Service Provider. Carries your data from your home router to the wider internet. |
| Internet Cloud | The Internet (WAN) | The WAN — millions of interconnected routers spanning the globe. |
| Remote Server | Remote Server | A computer somewhere in the world hosting the website or service you requested. |

---

## Attribute Panel

A stat card directly below the SVG. Updates instantly on tab switch.

**4 stats displayed in a responsive 2×2 / 4-column grid:**

| Stat | Icon | LAN | WAN |
|---|---|---|---|
| Speed | Lightning bolt | Up to 1 Gbps | 10 Mbps – 1 Gbps (varies) |
| Range | Ruler | Single building | City, country, or globe |
| Ownership | Person | You own it | Managed by ISPs |
| Cost | Tag | Low (one-time hardware) | Monthly subscription |

- Panel border color: blue (`#58a6ff`) when LAN tab active, purple (`#bc8cff`) when WAN tab active
- CSS transition on border-color for smooth switch

---

## Packet Animation

Triggered by the **"Send Packet →"** button below the attribute panel.

### Behavior

1. Button label changes to `"Sending…"` and is set to `disabled`
2. A glowing circle (radius 6px, fill `#58a6ff`, CSS box-shadow glow) spawns at the Laptop node
3. It travels linearly along the connection path in sequence:
   - Laptop → Router (LAN hop — label fades in briefly)
   - Router → ISP (WAN hop — label fades in briefly)
   - ISP → Internet Cloud
   - Internet Cloud → Remote Server
4. Total duration: ~2000ms using `requestAnimationFrame`
5. At the Server: dot pulses once (scale up + fade out) then disappears
6. Button re-enables, label resets to `"Send Packet →"`
7. An `aria-live="polite"` region announces `"Packet delivered!"` when complete

### Tab interaction
- Animation works in both tab views
- In LAN tab view: dot travels Laptop → Router then fades out (WAN portion is dimmed, packet "leaves" LAN)
- In WAN tab view: full path plays

---

## Files to Change

| File | Change |
|---|---|
| `pages/computer-networks.html` | Replace Section 2 content (remove static SVG + flip cards, add tab bar, new SVG, attribute panel, button) |
| `css/components.css` | Add styles for: tab bar, tooltip popup, attribute panel stat grid, packet dot + glow, send button |
| `js/interactions.js` | Add: tab switching logic, node click tooltip logic, packet animation with `requestAnimationFrame` |

No new files are created. No other sections of the page are touched.

---

## Accessibility (WCAG 2.1 AA)

- Tab buttons: `role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls`
- SVG nodes: `<g tabindex="0" role="button" aria-label="...">`
- Tooltips: `role="tooltip"`, linked via `aria-describedby`
- Keyboard: Tab to focus nodes, Enter/Space to open tooltip, Escape to close
- Packet button: `aria-live="polite"` region announces completion
- Color is never the sole indicator — labels always accompany color changes
- Contrast: all text meets 4.5:1 ratio against dark backgrounds
