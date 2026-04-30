# CLAUDE.md — Project Context for Claude Code

## Project

Build an interactive educational website covering: IT fundamentals, Wi-Fi & wireless networking,
computer networks (LAN/WAN/TCP-IP), electrical systems (circuits, AC/DC, components), and related
technologies. The site must be beginner-friendly, visually engaging, and interactive.

## Decisions Made

| Question | Answer |
|---|---|
| First topic to build | IT Basics (hardware, software, operating systems) |
| Target audience | Total beginners — no prior technical knowledge assumed |
| Site architecture | Multi-page site with a persistent navigation menu |
| Google Fonts (CDN) | Approved — load via CDN `<link>` tag |
| Color scheme | Dark mode first — dark navy/charcoal background, bright accent color |

## Technology Stack

| Technology | Justification |
|---|---|
| HTML5 | Semantic elements improve accessibility and SEO |
| CSS3 (custom properties + Grid + Flexbox) | Native responsive layout, zero dependencies |
| Vanilla JavaScript (ES6+) | No build tools, no framework — beginner-maintainable |
| Google Fonts (CDN) | One `<link>` tag; improves readability (approved) |
| Inline SVGs for icons | No icon-font dependency, accessible, scales perfectly |

No npm, no bundler, no framework.

## Rules (Must Follow — No Exceptions)

1. NEVER start coding immediately
2. ALWAYS analyze requirements fully before any implementation
3. ALWAYS plan which files need to be created or modified before touching code
4. Break every task into small, numbered steps — complete one before starting the next
5. Before editing any file, state exactly which file will be changed and why
6. After each edit, summarize in 2–3 sentences what changed and why
7. NEVER delete existing code unless you explicitly explain why it must be removed
8. Write code that is readable and understandable by beginners — add inline comments for non-obvious logic
9. Every decision MUST consider security, maintainability, and web best practices

## Constraints

- No external frameworks unless proposed and approved first
- Mobile-responsive layout is required on all pages
- All interactive elements must work without a backend
- Accessibility: WCAG 2.1 AA minimum (ARIA labels, keyboard nav, contrast ratios)
