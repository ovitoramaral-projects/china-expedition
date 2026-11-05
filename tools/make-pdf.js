// Plan B: a phone-sized PDF of the essentials (crew & flights, day by day, stays,
// tickets, every stop with places & food, practical notes, and the local vouchers).
// The PDF holds the vouchers, so it is written OUTSIDE the repo and never committed.
// Usage: serve the repo (python3 -m http.server 8765), then
//        node tools/make-pdf.js /path/to/china-expedition.pdf
const { chromium } = require("playwright");
const out = process.argv[2];
const base = process.argv[3] || "http://localhost:8765/";

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(base + "#guide");
  await p.waitForTimeout(800);
  await p.evaluate((base) => {
    const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const fmt = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
    const DAY = Object.fromEntries(DAYS.map((d) => [d.date, d]));
    const link = (href, text) => href ? `<a href="${esc(href)}">${esc(text)}</a>` : "";
    const list = (xs) => xs && xs.length ? `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
    const flags = (xs) => (xs || []).map((f) => `<p class="flag">To confirm: ${esc(f)}</p>`).join("");
    const stayBox = (k) => {
      const s = STAYS[k]; if (!s) return "";
      return `<div class="stay"><b>${esc(s.name)}</b>${s.sub ? ` <span class="m">· ${esc(s.sub)}</span>` : ""}
        <div class="addr">${esc(s.address)}</div>
        <div class="m">${esc([s.dates, s.checkin && "Check-in " + s.checkin, s.checkout && "Check-out " + s.checkout, s.meals].filter(Boolean).join(" · "))}</div>
        ${s.phone ? `<div class="m">Phone ${esc(s.phone)}</div>` : ""}
        ${s.note ? `<div class="m">${esc(s.note)}</div>` : ""}
        <div class="m">${link(s.map, "Amap keyword search")} (not a verified pin)</div></div>`;
    };

    const crew = CREW.map((c) => `<tr><td><b>${esc(c.name)}</b>${c.role ? `<br><span class="m">${esc(c.role)}</span>` : ""}</td>
      <td>${c.out ? `${fmt(c.out.date)} ${esc(c.out.time)}${c.out.note ? ` <span class="m">(${esc(c.out.note)})</span>` : ""}` : esc(c.note || "")}</td>
      <td>${c.back ? `${fmt(c.back.date)} ${esc(c.back.time)}${c.back.from || c.back.note ? ` <span class="m">(${esc([c.back.from, c.back.note].filter(Boolean).join(", "))})</span>` : ""}` : ""}</td></tr>`).join("");

    const days = DAYS.map((d) => `<div class="day"><h3>${fmt(d.date)} · ${esc(d.label)}</h3>
      <div class="t">${esc(d.title)}</div>
      ${d.route.length > 1 ? `<div class="m">${esc(d.route.join(" → "))}</div>` : ""}
      <p>${esc(d.summary)}</p>
      ${d.altitude ? `<p class="m">${esc(d.altitude)}</p>` : ""}
      ${(d.notes || []).map((n) => `<p class="m">${esc(n)}</p>`).join("")}
      ${flags(d.flags)}
      <p class="m">Sleep: ${d.stay && STAYS[d.stay] ? esc(STAYS[d.stay].name) : "not booked"}</p></div>`).join("");

    const tk = (kind) => Object.entries(TICKETS).filter(([, t]) => t.book === kind).map(([id, t]) =>
      `<li><b>${esc(PLACES[id]?.name || id)}</b> ${esc(t.text)}</li>`).join("");

    const stops = DESTS.map((d, i) => {
      const places = d.places.map((id) => PLACES[id]).filter(Boolean);
      const food = FOOD[d.id] || [];
      return `<section class="stop"><div class="lbl">${String(i + 1).padStart(2, "0")} / ${DESTS.length} · ${d.region === "sichuan" ? "Sichuan" : "Yunnan"}</div>
        ${(() => { const ph = PHOTOS["dest-" + d.id] || PHOTOS[d.lead] || PHOTOS[d.places.find((x) => PHOTOS[x])]; return ph ? `<figure class="cov"><img src="${base}${esc(ph.src)}"><figcaption>${esc(ph.credit)}</figcaption></figure>` : ""; })()}
        <h2>${esc(d.name)} <span class="zh">${esc(d.zh)}</span></h2>
        <div class="m">${d.days.map(fmt).join(", ")}</div>
        ${d.intro ? `<p>${esc(d.intro)}</p>` : d.lead && PLACES[d.lead] ? `<p>${esc(PLACES[d.lead].about)}</p>` : ""}
        ${d.stay ? `<h4>Stay</h4>${stayBox(d.stay)}` : ""}
        ${places.length ? `<h4>Places</h4>${places.map((pl) => `<div class="pl">${(() => { const id = d.places.find((x) => PLACES[x] === pl), ph = PHOTOS[id]; return ph ? `<figure class="pph"><img src="${base}${esc(ph.small || ph.src)}"><figcaption>${esc(ph.credit)}</figcaption></figure>` : ""; })()}<b>${esc(pl.name)}</b> <span class="zh">${esc(pl.zh || "")}</span> <span class="m">· ${esc(pl.kind || "")}</span>
          <p>${esc(pl.about || "")}</p>${pl.todo ? `<div class="m">To do</div>${list(pl.todo)}` : ""}${pl.care ? `<div class="m">Careful</div>${list(pl.care)}` : ""}
          ${TICKETS[pl.id] || TICKETS[d.places.find((x) => PLACES[x] === pl)] ? `<p class="m">Ticket: ${esc((TICKETS[d.places.find((x) => PLACES[x] === pl)]).book === "ahead" ? "book ahead" : "pay on site")}</p>` : ""}</div>`).join("")}` : ""}
        ${food.length ? `<h4>Food</h4><ul>${food.map((f) => `<li><b>${esc(f.name)}</b>${f.zh ? ` <span class="zh">${esc(f.zh)}</span>` : ""}. ${esc(f.note || "")}</li>`).join("")}</ul>` : ""}
      </section>`;
    }).join("");

    const vouchers = DESTS.filter((d) => d.voucher).map((d) => Array.from({ length: d.voucher }, (_, k) =>
      `<div class="v"><div class="lbl">Voucher · ${esc(d.name)} · page ${k + 1}${d.voucherLabels?.[k] ? " · " + esc(d.voucherLabels[k]) : ""}</div><img src="${base}vouchers/${d.stay}-${k + 1}.jpg"></div>`).join("")).join("");

    document.documentElement.innerHTML = `<head><meta charset="utf-8"><style>
      @page { size: 110mm 200mm; margin: 9mm 8mm; }
      body { font: 9.5pt/1.45 -apple-system, "Helvetica Neue", "WenQuanYi Zen Hei", sans-serif; color: #1b1a18; margin: 0; }
      h1 { font: 400 24pt/1.05 Georgia, serif; margin: 0 0 2mm; } h2 { font: 400 16pt/1.15 Georgia, serif; margin: 1mm 0; }
      h3 { font-size: 10pt; margin: 0; } h4 { font-size: 8pt; letter-spacing: .08em; text-transform: uppercase; color: #9a3a2c; margin: 4mm 0 1.5mm; }
      .lbl { font-size: 7.5pt; letter-spacing: .08em; text-transform: uppercase; color: #75706a; }
      .m { color: #6a655e; font-size: 8.5pt; } .zh { color: #c8352a; font-weight: 400; } p { margin: 1.2mm 0; }
      ul { margin: 1mm 0 2mm; padding-left: 4.5mm; } li { margin: .6mm 0; }
      .flag { color: #9a5c0b; background: #f8efe0; padding: 1.2mm 2mm; border-radius: 1.5mm; font-size: 8.5pt; }
      .day, .stay, .pl { break-inside: avoid; border-top: .3mm solid #e5e0d8; padding: 2.2mm 0; }
      .stay { background: #f7f4ef; border: 0; border-radius: 2mm; padding: 2.5mm 3mm; } .addr { margin: .8mm 0; }
      .t { font-weight: 600; } table { width: 100%; border-collapse: collapse; font-size: 8.5pt; } td { border-top: .3mm solid #e5e0d8; padding: 1.5mm 1mm 1.5mm 0; vertical-align: top; }
      .stop, .part { break-before: page; } .cover { text-align: center; padding-top: 40mm; } .cover .big { font-size: 40pt; color: #c8352a; }
      a { color: #1b1a18; } .v { break-before: page; } .v img { width: 100%; display: block; margin-top: 2mm; }
      .toc li { list-style: none; } .toc { padding: 0; }
      figure { margin: 0; } figcaption { font-size: 6pt; color: #9a948c; margin-top: .6mm; }
      .cov img { width: 100%; height: 58mm; object-fit: cover; border-radius: 2mm; display: block; margin-bottom: 2.5mm; }
      .cov figcaption { margin: -1.8mm 0 2mm; }
      .pph img { width: 100%; height: 40mm; object-fit: cover; border-radius: 1.5mm; display: block; }
      .pph { margin-bottom: 1.5mm; }
    </style></head><body>
      <div class="cover"><div class="big">川滇</div><h1>China Expedition</h1><div class="m">Western Sichuan & Yunnan · 6–20 Nov 2026</div><p style="margin-top:8mm">一路平安</p>
        <p class="m" style="margin-top:30mm">Offline copy (Plan B), made ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}. Altitudes and distances are general references; Amap links are keyword searches, not verified pins; ticket advice was researched online on 2 Nov 2026.</p></div>
      <section class="part"><h2>Crew & flights</h2><table><tr><td class="m">Who</td><td class="m">Out (local time at home)</td><td class="m">Home</td></tr>${crew}</table>
        <p class="m">As given on 3 Nov, not checked against tickets.</p></section>
      <section class="part"><h2>Day by day</h2>${days}</section>
      <section class="part"><h2>Tickets</h2><h4>Book in advance</h4><ul>${tk("ahead")}</ul><h4>Pay on site</h4><ul>${tk("gate")}</ul>
        <p class="m">Prices are approximate, from guides and booking sites (checked 2 Nov 2026). Confirm on the day.</p></section>
      ${stops}
      <section class="part"><h2>Practical</h2>${PRACTICAL.map(([t, d]) => `<p><b>${esc(t)}.</b> ${esc(d)}</p>`).join("")}
        ${FIELD.map(([t, items]) => `<h4>${esc(t)}</h4>${list(items)}`).join("")}</section>
      ${vouchers}
    </body>`;
  }, base);
  await p.waitForLoadState("networkidle");
  await p.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
  await p.pdf({ path: out, width: "110mm", height: "200mm", printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log("wrote", out);
})();
