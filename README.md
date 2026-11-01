# China Expedition

Interactive itinerary for the 6–20 November 2026 Western Sichuan & Yunnan trip. Plain HTML, CSS and JS: no build step and no external fonts or CDNs, so it works in mainland China and offline once loaded.

## Run it

Open `index.html` in a browser. Add `?date=2026-11-12` to the URL to preview how the page looks on a given trip day.

## Files

| File | What it holds |
|---|---|
| `data.js` | Days, stays, elevations, practical notes, gear, crew |
| `places.js` | Place guide for every stop (from `knowledge/location_field_guide_v1.4.md`) |
| `food.js` | **Your restaurant picks** per stop (name, Chinese name, note, link). They show first under Food |
| `geo.js` | Approximate coordinates for rough walking/driving distances from each stay |
| `photos.js` | Photo slots: drop a JPG in `assets/photos/` and register it with its credit |
| `icons.js` | Lucide icons (ISC), inlined |
| `app.js` | Views, cards, detail pages, time-based progress |
| `styles.css` | Look and feel (light + dark) |
| `knowledge/` | Source material from the planning handoff |
| `.claude/skills/` | Claude Code skills used on this project |

## What it does now

Four tabs: **Today** (where you probably are, estimated from the date and time in China; today's places; tonight's stay; the crew), **Route** (the itinerary with progress and a live marker on today's row, plus the altitude chart), **Places** (photo cards for every stop and stay, with filters), **Guide** (crew, documentary arc, practical notes, camera kit).

Tap any card to expand it into a full page: place guide, hotel details, or the whole day. Direct links: `#today`, `#route`, `#places`, `#guide`, `#place-pearl`, `#stay-lijiang`, `#day-2026-11-13`.

Preview any moment with `?date=2026-11-13&time=14:30`.
