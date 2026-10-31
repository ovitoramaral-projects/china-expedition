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

- Altitude profile of every night's stay. Tap a night to jump to that day.
- Sticky date strip that follows your scroll and highlights today (China time).
- Day cards that expand to show the summary, focus, route options, conflicts to confirm, and tonight's hotel with copy-address, call, and Amap search links.
- Filters for Sichuan / Yunnan / "To confirm" days.
- Places for each day: tap one to open a guide sheet with what it is, history, what to look for, photography, food, restaurant leads, cautions, sources and Amap search.
- List of hotels, documentary arc, practical notes, on-the-ground protocols.
- Camera kit checklist that remembers what's packed on this device.
