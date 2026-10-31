# China Expedition — project rules

Static site (index.html + styles.css + app.js + data.js + places.js). No build step, no frameworks, **no external resources** (Google Fonts/CDNs are blocked or slow in mainland China). Mobile-first; it is used on a phone in the field.

## Content rules (from the planning handoff, `knowledge/HANDOFF_README.md`)
1. The current route is `knowledge/itinerary_working.txt`. The older supplier itinerary is historical reference only.
2. Hotel dates/addresses come from the booking vouchers. Where itinerary text and vouchers disagree, **do not silently resolve it**: keep or add a `flags` entry on that day in `data.js`.
   Open conflicts: Chengdu voucher shows 7–8 Nov but itinerary says 6–8 Nov; 12 Nov itinerary says "Shangri-La" but hotel is Daocheng/Yading 12–14 Nov; 14 Nov start point; no Kunming booking for 20 Nov.
3. Amap links are keyword searches, not verified pins. Never present them as exact locations or claim routes or distances are verified.
4. Distinguish sourced facts from outside knowledge (for example, the elevations in `ELEV` are general references, and the page says so).
5. Dali stay is in Dazhuang Village / Xiaguan, not Dali Ancient Town.
6. Storyboards: follow `.claude/skills/cinematic-storyboard` (every frame exactly 4:3).

## Privacy
The repo must never contain the booking PDF, booking/confirmation numbers, PINs, or travellers' names, emails or phone numbers. Hotel public contact numbers are fine.
