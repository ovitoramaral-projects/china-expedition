# China Expedition

Day-by-day companion for the Western Sichuan & Yunnan trip, 6–20 November 2026.
A static site: no build step, no frameworks, nothing loaded from outside the site
(Google Fonts and CDNs are blocked or slow in mainland China).

## Use it on the trip

1. Open the site on your phone **on good wifi before you fly**.
2. Wait a minute: the whole app (about 20 MB) is saved for offline use.
3. iPhone: Share → **Add to Home Screen**. Android: menu → **Install app**.
4. From then on it opens from the Home Screen with no signal at all.

Booking vouchers are not in this repository (they contain PINs) and are not
part of the hosted site.

## Hosting

Any static host works; the site is the repository root. GitHub Pages:
Settings → Pages → "Deploy from a branch" → `main` (or `first-version`) → `/ (root)`.

Foreign hosts (github.io, Vercel, Netlify, Cloudflare) can be slow or blocked in
mainland China, which is why the offline copy matters: install it before you go.

## After changing app files

Regenerate the offline file list so phones pick up the update:

    python3 tools/build-sw.py
