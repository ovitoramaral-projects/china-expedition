# China Expedition

Interactive itinerary for the 6–20 November 2026 Western Sichuan & Yunnan trip. Plain HTML, CSS and JS: no build step and no external fonts or CDNs, so it works in mainland China and offline once loaded.

## Run it

Open `index.html` in a browser. Add `?date=2026-11-12` to the URL to preview how the page looks on a given trip day.

## Files

| File | What it holds |
|---|---|
| `data.js` | All trip content: days, stays, map links, elevations, notes, gear. Edit this file to change what the page shows. |
| `places.js` | Place guide for every stop (from `knowledge/location_field_guide_v1.4.md`) and which day each belongs to |
| `app.js` | Rendering and interaction |
| `styles.css` | Look and feel (light + dark) |
| `knowledge/` | Source material from the planning handoff (itinerary, field guide, master guide, camera list) |
| `.claude/skills/` | Claude Code skills used on this project (design, accessibility, storyboard, …) |

## What it does now

Four views, switched from the tab bar:

- **Journey** (default): one full-screen page per day that you swipe through like stories. Each day has its own generated landscape (snow peaks, plateau with prayer flags, villages, Erhai lake, city skyline) with gentle parallax, then the plan, places (tap for the guide sheet), tonight's hotel and a "Next day" button. Opens on today during the trip. A cover page has the altitude profile.
- **Timeline**: the whole trip as a list, with the date strip, filters (Sichuan / Yunnan / To confirm) and expandable day cards.
- **Stays**: every hotel, with nights and an Amap link.
- **Guide**: documentary arc, practical notes, on-the-ground protocols, and the camera-kit checklist (saved on this device).

Direct links: `#journey`, `#timeline`, `#stays`, `#guide`.
