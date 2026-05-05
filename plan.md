# plan.md — Build Plan

## File/Folder Structure

```
project-root/
│
├── index.html                   ← Landing/home page
│
├── pages/
│   ├── it-basics.html           ← Topic 1 (built first)
│   ├── wifi-networking.html     ← Topic 2
│   ├── computer-networks.html   ← Topic 3
│   └── electrical-systems.html  ← Topic 4
│
├── css/
│   ├── global.css               ← CSS variables, reset, typography
│   ├── layout.css               ← Nav, header, footer, page grid
│   └── components.css           ← Cards, quizzes, badges, buttons
│
├── js/
│   ├── nav.js                   ← Mobile hamburger, active-link highlight
│   └── interactions.js          ← Quizzes, flip cards, accordion, tooltips
│
└── assets/
    ├── icons/                   ← SVG icons (computer, wifi, circuit, etc.)
    └── images/                  ← Diagrams and illustrations
```

---

## Phase 1 — Shared Foundation

> All pages depend on this phase. Complete fully before moving to Phase 2.

- [x] 1. Create the full folder structure above
- [x] 2. Write `css/global.css` — CSS variables (colors, fonts, spacing), minimal reset, base typography
- [x] 3. Write `css/layout.css` — persistent top nav with hamburger menu for mobile, page header, main content area, footer
- [x] 4. Write `css/components.css` — skeleton styles for cards, quiz blocks, and buttons
- [x] 5. Write `js/nav.js` — mobile menu toggle, auto-highlight the active page link
- [x] 6. Write `index.html` — home/landing page: hero section, topic cards linking to each page, "how to use this site" blurb

---

## Phase 2 — IT Basics Page ✅

- [x] 7. Write `pages/it-basics.html` with five content sections:
  - What is a Computer? (hardware overview with labeled diagram)
  - Input & Output Devices
  - Storage — RAM vs SSD vs HDD
  - Software vs Hardware
  - Operating Systems (Windows / macOS / Linux)
- [x] 8. Add flip-card interaction — click a component card to reveal its definition
- [x] 9. Add end-of-page mini quiz (5 questions, instant feedback, no backend)
- [x] 10. Extend `css/components.css` and `js/interactions.js` for the above
- [x] UI refresh on `it-basics.html` — hardware section redesigned (2026-05-01); orbital 3D explorer moved to top of page

---

## Phase 3 — Remaining Topic Pages ✅

- [x] 11. `pages/wifi-networking.html`
- [x] 12. `pages/computer-networks.html`
- [x] 13. `pages/electrical-systems.html`

*Each page follows the same structure as Phase 2, built one at a time.*

---

## Phase 4 — Accessibility & Polish ✅

- [x] 14. ARIA labels, keyboard navigation, focus indicators (WCAG 2.1 AA)
- [x] 15. Full mobile responsiveness pass on all pages
- [x] 16. Contrast ratio audit on all text/background combinations
- [x] 17. Final cross-browser smoke test

---

## Phase 5 — it-basics.html Background Improvements ✅

> Goal: make the it-basics page background feel more polished, immersive, and visually cohesive — without touching layout, fonts, or colors.

- [x] 1. Audit current background layers — identify any visible seams, clashing glow blobs, or flat/empty areas between sections
- [x] 2. Improve section-to-section transitions — ensure adjacent sections flow smoothly without a hard split line
- [x] 3. Refine glow blob placement — reposition any atmospheric radial gradients so they feel intentional (anchored near section edges, not floating in the middle)
- [x] 4. Add subtle depth variation — alternate section backgrounds using existing CSS variables (`--color-bg-primary` / `--color-bg-secondary`) to create rhythm without borders
- [x] 5. Tune glow intensity — lower any glow opacity that feels too heavy or competes with content readability
- [x] 6. Verify noise texture renders correctly on the page and does not create a visible two-layer effect
- [x] 7. Final visual check — scroll full page and confirm background looks like one continuous, cohesive surface

*Files touched: `css/global.css`, `css/layout.css`, `css/components.css`, `css/hardware-explorer.css`.*

---

## Phase 6 — Wi-Fi Page Interactions & Theme Refresh ✅

> Goal: add rich interactive elements to `wifi-networking.html` and apply a sitewide theme refresh.

- [x] 1. Add frequency-band flip cards (2.4 GHz / 5 GHz / 6 GHz) — click to reveal key details
- [x] 2. Add animated radio-wave wall-penetration simulator (Canvas) — toolbar lets user pick wall type and frequency band; signal attenuation shown in real time
- [x] 3. Add animated Wi-Fi flow diagram — shows device → router → modem → internet path with pulsing arrows
- [x] 4. Add accordion FAQ for router section (SSID, IP address, DHCP, WPA/WPA2/WPA3)
- [x] 5. Add scroll-intro video (`assets/scroll-intro.mp4`) on the home page
- [x] 6. Sitewide theme refresh — updated CSS variables in `css/global.css` and `css/layout.css`; new `css/hardware-explorer.css` for the 3D orbital explorer
- [x] 7. Updated `index.html` — new hero layout, topic cards, and video integration

*Files touched: `pages/wifi-networking.html`, `css/global.css`, `css/layout.css`, `css/components.css`, `css/hardware-explorer.css`, `js/interactions.js`, `index.html`, `assets/scroll-intro.mp4`.*

---

## Approved Decisions

| Decision | Choice |
|---|---|
| Google Fonts | Approved — load via CDN |
| Color scheme | B — Dark mode first (dark navy/charcoal background, bright accent) |

All decisions locked. Phase 1 is cleared to begin.
