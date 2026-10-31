// Generated ink-wash landscapes, used as placeholders until a real photo exists.
"use strict";
// Landscape type for each night, from what the place is like.
const SCENE = {
  "2026-11-06": "city", "2026-11-07": "city", "2026-11-08": "peaks",
  "2026-11-09": "village", "2026-11-10": "plateau", "2026-11-11": "plateau",
  "2026-11-12": "plateau", "2026-11-13": "peaks", "2026-11-14": "peaks",
  "2026-11-15": "plateau", "2026-11-16": "peaks", "2026-11-17": "peaks",
  "2026-11-18": "village", "2026-11-19": "lake", "2026-11-20": "city",
};
// Tibetan cultural landscape days get prayer flags.
const FLAGS_DAYS = new Set(["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13", "2026-11-14", "2026-11-15"]);

function rng(seed) { // mulberry32
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hashStr = (s) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);

// Smooth 1-D noise from random control points (cosine interpolation), several octaves.
function noise1d(r, n, octaves, freq = 3) {
  const out = new Array(n).fill(0); let amp = 1, total = 0;
  for (let o = 0; o < octaves; o++) {
    const step = Math.max(2, Math.round(n / (freq * 2 ** o)));
    const ctrl = Array.from({ length: Math.ceil(n / step) + 2 }, r);
    for (let i = 0; i < n; i++) {
      const k = Math.floor(i / step), f = (i % step) / step, t = (1 - Math.cos(f * Math.PI)) / 2;
      out[i] += amp * (ctrl[k] * (1 - t) + ctrl[k + 1] * t);
    }
    total += amp; amp *= 0.45;
  }
  return out.map((v) => v / total);
}

// A wide panorama: phones see the middle, desktops see more of the range.
const W = 1200, H = 300, X0 = -90, X1 = 1290, N = 340;
const xs = Array.from({ length: N }, (_, i) => X0 + (i * (X1 - X0)) / (N - 1));
const pathFrom = (ys) => `M${X0} ${H + 2} ` + ys.map((y, i) => `L${xs[i].toFixed(1)} ${y.toFixed(1)}`).join(" ") + ` L${X1} ${H + 2} Z`;

function sceneArt(key, kind, opts = {}) {
  const r = rng(hashStr(key));
  const id = "a" + (hashStr(key) >>> 0).toString(36);
  let defs = "", sky = "", body = "";

  // Stars (shown in dark mode) and a pale sun / moon.
  for (let i = 0; i < 130; i++) sky += `<circle class="star" cx="${(r() * W).toFixed(1)}" cy="${(r() * H * 0.45).toFixed(1)}" r="${(r() * 0.9 + 0.3).toFixed(2)}" opacity="${(r() * 0.6 + 0.3).toFixed(2)}"/>`;
  sky += `<circle class="orb" cx="${(500 + r() * 200).toFixed(0)}" cy="${(46 + r() * 40).toFixed(0)}" r="13"/>`;
  // A few soft clouds that drift slowly.
  for (let c = 0; c < 4; c++) {
    const cx = 380 + c * 140 + r() * 80, cy = 30 + r() * 70, s = 0.7 + r() * 0.8;
    sky += `<g class="cloud c${c}" transform="translate(${cx.toFixed(0)} ${cy.toFixed(0)}) scale(${s.toFixed(2)})">
      <ellipse cx="0" cy="0" rx="34" ry="7"/><ellipse cx="-12" cy="-4" rx="16" ry="7"/><ellipse cx="10" cy="-6" rx="18" ry="8"/></g>`;
  }

  // Ridge layers back → front: [base y, amplitude, octaves, sharpness]
  const L = {
    peaks:   [[0.42, 0.30, 4, 2.0], [0.55, 0.20, 4, 1.6], [0.68, 0.11, 3, 1.2], [0.90, 0.05, 3, 1]],
    plateau: [[0.46, 0.12, 4, 1.8], [0.60, 0.07, 3, 1], [0.68, 0.05, 2, 1], [0.90, 0.03, 2, 1]],
    village: [[0.42, 0.20, 4, 1.4], [0.54, 0.16, 3, 1.2], [0.64, 0.10, 3, 1], [0.90, 0.04, 2, 1]],
    lake:    [[0.44, 0.20, 4, 1.5], [0.55, 0.10, 3, 1.1], [0.64, 0.05, 2, 1], [0.93, 0.015, 2, 1]],
    city:    [[0.52, 0.10, 3, 1], [0.60, 0.07, 3, 1], [0.68, 0.04, 2, 1], [0.90, 0.02, 2, 1]],
  }[kind];

  // Peaks use "ridged" noise (sharp crests); softer land uses plain noise.
  const ridges = L.map(([base, amp, oct, sharp], li) => {
    const ridged = kind === "peaks" || (kind === "village" && li < 2) || ((kind === "lake" || kind === "plateau") && li === 0);
    const nz = noise1d(r, N, oct, (ridged ? 5 - li : 3) * 3);
    return nz.map((v) => {
      const h = ridged ? Math.pow(1 - Math.abs(2 * v - 1), sharp) : Math.pow(v, sharp);
      return Math.max(H * 0.12, H * base - H * amp * h * 1.15);
    });
  });

  ridges.forEach((ys, li) => {
    const d = pathFrom(ys);
    let extra = "";
    // Snow caps: everything above a snowline inside the mountain shape.
    // Snowcaps that follow the terrain: thick on the highest crests, tapering to nothing.
    if ((kind === "peaks" && li < 2) || ((kind === "lake" || kind === "plateau") && li === 0)) {
      const top = Math.min(...ys), snowY = top + (li === 0 ? 46 : 26);
      const depth = ys.map((y) => Math.max(0, Math.min(34, (snowY - y) * 0.75)));
      if (depth.some((v) => v > 0)) {
        const fwd = ys.map((y, i) => `${i ? "L" : "M"}${xs[i].toFixed(1)} ${y.toFixed(1)}`).join(" ");
        const back = ys.map((y, i) => [xs[i], y + depth[i]]).reverse().map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
        extra += `<path class="snow" d="${fwd} ${back} Z"/>`;
      }
    }
    // City skyline on the middle layer.
    if (kind === "city" && li === 1) {
      let x = -60; while (x < 1260) { const w = 8 + r() * 18, h = 8 + r() * 38; const yb = ys[Math.round(((x - X0) / (X1 - X0)) * (N - 1))];
        extra += `<rect class="bld" x="${x.toFixed(1)}" y="${(yb - h).toFixed(1)}" width="${w.toFixed(1)}" height="${(h + 4).toFixed(1)}"/>`; x += w + r() * 6; }
    }
    // Whitewashed hillside houses.
    if (kind === "village" && li === 2) {
      for (let k = 0; k < 34; k++) { const x = 30 + r() * 1140, i = Math.round(((x - X0) / (X1 - X0)) * (N - 1)), y = ys[i] + 6 + r() * 14;
        extra += `<g class="house"><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="7" height="6"/><rect class="roof" x="${(x - 1).toFixed(1)}" y="${(y - 1.6).toFixed(1)}" width="9" height="1.8"/></g>`; }
    }
    body += `<g class="pl pl${li}"><path class="ly ly${li}" d="${d}"/>${extra}</g>`;
  });

  // Lake: a flat water plane with light streaks.
  if (kind === "lake") {
    const y0 = H * 0.70;
    let streaks = ""; for (let k = 0; k < 40; k++) { const y = y0 + 6 + r() * (H * 0.10), x = r() * W;
      streaks += `<line x1="${x.toFixed(1)}" x2="${(x + 14 + r() * 50).toFixed(1)}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }
    body = body.replace(`<g class="pl pl3">`, `<g class="water"><rect x="${X0}" y="${y0}" width="${X1 - X0}" height="${H}"/>${streaks}</g><g class="pl pl3">`);
  }

  // Prayer flags strung across the middle distance.
  if (opts.flags) {
    const y1 = H * 0.50 + r() * 20, y2 = H * 0.46 + r() * 20, x1 = 420 + r() * 40, x2 = 740 + r() * 40;
    const sag = 26; const cols = ["fb", "fw", "fr", "fg", "fy"];
    let flags = `<path class="string" d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag * 2} ${x2} ${y2}"/>`;
    for (let k = 1; k < 18; k++) { const t = k / 18, x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * ((x1 + x2) / 2) + t * t * x2,
      y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * ((y1 + y2) / 2 + sag * 2) + t * t * y2;
      flags += `<rect class="${cols[(k - 1) % 5]}" x="${(x - 3).toFixed(1)}" y="${y.toFixed(1)}" width="6" height="7.5" transform="rotate(${(r() * 10 - 5).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }
    body = body.replace(`<g class="pl pl2">`, `<g class="pl pl2 flags">${flags}</g><g class="pl pl2">`);
  }

  return `<svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>${defs}</defs><g class="sky">${sky}</g>${body}</svg>`;
}

