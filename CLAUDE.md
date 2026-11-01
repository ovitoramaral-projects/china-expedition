# China Expedition — project rules

Static site (index.html + styles.css + app.js + data.js + places.js + destinations.js + photos.js + geo.js + food.js + storyboards.js + icons.js; booking vouchers in vouchers/ are gitignored). No build step, no frameworks, **no external resources** (Google Fonts/CDNs are blocked or slow in mainland China). Mobile-first; it is used on a phone in the field.

## Content rules (from the planning handoff, `knowledge/HANDOFF_README.md`)
1. The current route is `knowledge/itinerary_working.txt`. The older supplier itinerary is historical reference only.
2. Hotel dates/addresses come from the booking vouchers. Where itinerary text and vouchers disagree, **do not silently resolve it**: keep or add a `flags` entry on that day in `data.js`.
   Open conflicts (Chengdu resolved: Vitor & Ricardo arrive 6 Nov, Ikho & Anastasia 7 Nov): 12 Nov itinerary says "Shangri-La" but hotel is Daocheng/Yading 12–14 Nov; 14 Nov start point; no Kunming booking for 20 Nov.
3. Amap links are keyword searches, not verified pins. Never present them as exact locations or claim routes or distances are verified.
4. Distinguish sourced facts from outside knowledge (for example, the elevations in `ELEV` are general references, and the page says so).
5. Dali stay is in Dazhuang Village / Xiaguan, not Dali Ancient Town.
6. Storyboards: follow `.claude/skills/cinematic-storyboard` (every frame exactly 4:3).

## Privacy
The repo must never contain the booking PDF, booking/confirmation numbers, PINs, or travellers' surnames, emails or phone numbers. The crew's first names (Vitor, Ricardo, Ikho, Anastasia), given by the user, are fine and live in `CREW` in data.js. Hotel public contact numbers are fine.

## Detail-page typography (keep it this way)
Six roles only: page title (serif), section h2 (serif 1.5rem), item h3 (sans 1.0625rem/600), body (1rem/1.6), meta (.875rem muted), label (.6875rem caps). Links are `.tlink` (underlined text), not buttons; the only button on a stop page is the booking voucher.
Distances in `geo.js` are straight-line estimates from approximate coordinates and must always be labelled as such.
