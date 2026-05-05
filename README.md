# NetVolt — Interactive Tech Education Website

An interactive, beginner-friendly educational website covering IT fundamentals,
Wi-Fi & wireless networking, computer networks, and electrical systems.

---

## How to Run Locally

No installs needed. Just open a terminal in this folder and run:

**macOS (Python 3):**
```bash
python3 -m http.server 8080
```

**Windows / older systems (Python 2):**
```bash
python -m http.server 8080
```

Then open your browser and go to:

```
http://localhost:8080
```

> **Why not just double-click index.html?**
> You can, but some browsers block links between local files. The Python server
> avoids that problem and makes everything work exactly like a real website.

To stop the server press `Ctrl + C` in the terminal.

---

## Pages

| Page | File | Topic |
|---|---|---|
| Home | `index.html` | Landing page — links to all topics |
| IT Basics | `pages/it-basics.html` | Hardware, software, storage, operating systems |
| Wi-Fi | `pages/wifi-networking.html` | Wireless networking basics |
| Networks | `pages/computer-networks.html` | LAN, WAN, TCP/IP |
| Electrical | `pages/electrical-systems.html` | Circuits, AC/DC, components |

---

## Project Structure

```
NetVolt/
│
├── index.html                   ← Home / landing page
│
├── pages/
│   ├── it-basics.html           ← Topic 1
│   ├── wifi-networking.html     ← Topic 2
│   ├── computer-networks.html   ← Topic 3
│   └── electrical-systems.html  ← Topic 4
│
├── css/
│   ├── global.css               ← CSS variables, reset, typography
│   ├── layout.css               ← Nav, header, footer, page grid
│   ├── components.css           ← Cards, quizzes, badges, buttons
│   └── hardware-explorer.css    ← 3D hardware explorer styles
│
├── js/
│   ├── nav.js                   ← Mobile hamburger menu
│   ├── interactions.js          ← Quizzes, flip cards, accordion
│   └── hardware-explorer.js     ← Orbital 3D component explorer
│
└── assets/
    ├── icons/                   ← SVG icons
    └── images/                  ← Diagrams and illustrations
```

---

## Tech Stack

| Technology | Why |
|---|---|
| HTML5 | Semantic elements, accessibility |
| CSS3 (Grid + Flexbox + custom properties) | Responsive layout, no dependencies |
| Vanilla JavaScript (ES6+) | No build tools, no framework |
| Google Fonts (CDN) | Better readability |

No npm. No bundler. No framework. Open any file and it just works.

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Stable / production code |
| `it-basics` | Active development branch |

---

## Deploy Without GitHub Pages

**Netlify Drop (instant, no account needed)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `NetVolt` folder onto the page
3. Get a live public URL immediately

**Vercel (auto-deploys on every push)**
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import the `NetVolt` repo and set branch to `it-basics`
3. Deploy — Vercel handles everything automatically

---

## Design Decisions

- **Dark mode first** — dark navy/charcoal background with bright accent colours
- **Mobile responsive** — works on all screen sizes
- **Accessible** — WCAG 2.1 AA (ARIA labels, keyboard navigation, contrast ratios)
- **No backend** — all interactive features (quizzes, flip cards, 3D explorer) run in the browser
