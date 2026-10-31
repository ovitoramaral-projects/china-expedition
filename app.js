(() => {
  "use strict";

  /* =====================================================================
     Helpers
     ===================================================================== */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DOW_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const parse = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const dayNum = (iso) => parse(iso).getUTCDate();
  const dow = (iso) => DOW[parse(iso).getUTCDay()];
  const dowLong = (iso) => DOW_LONG[parse(iso).getUTCDay()];
  const short = (iso) => `${dow(iso)} ${dayNum(iso)} Nov`;
  const clean = (s) => String(s).replace(/\?$/, "").replace(/[?？]/g, "");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DAY = Object.fromEntries(DAYS.map((d, i) => [d.date, { ...d, i }]));
  const DEST = Object.fromEntries(DESTS.map((d) => [d.id, d]));
  const regionName = (r) => (r === "yunnan" ? "Yunnan" : "Sichuan");

  /* =====================================================================
     Time — China time; position estimated from date and hour, not GPS.
     ?date=2026-11-13&time=14:30 previews any moment.
     ===================================================================== */
  const qs = new URLSearchParams(location.search);
  const now = (() => {
    const f = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
    let date = `${p.year}-${p.month}-${p.day}`, hour = (+p.hour % 24) + +p.minute / 60;
    if (/^\d{4}-\d{2}-\d{2}$/.test(qs.get("date") || "")) date = qs.get("date");
    if (/^\d{1,2}:\d{2}$/.test(qs.get("time") || "")) { const [h, m] = qs.get("time").split(":").map(Number); hour = h + m / 60; }
    return { date, hour };
  })();
  const FIRST = DAYS[0].date, LAST = DAYS[DAYS.length - 1].date;
  const phase = now.date < FIRST ? "before" : now.date > LAST ? "after" : "during";
  const today = phase === "during" ? DAY[now.date] : null;

  function whereNow() {
    if (!today) return null;
    const stops = today.route.map(clean), h = now.hour, n = stops.length;
    if (n === 1 || h >= 19) return { segment: n - 1, label: h >= 19 ? `Evening in ${stops[n - 1]}` : `In ${stops[0]}` };
    if (h < 8) return { segment: 0, label: `Morning in ${stops[0]}` };
    const pos = ((h - 8) / 11) * (n - 1), k = Math.floor(pos), t = pos - k;
    return { segment: pos, label: t < 0.25 ? `Around ${stops[k]}` : t > 0.75 ? `Approaching ${stops[k + 1]}` : `Between ${stops[k]} and ${stops[k + 1]}` };
  }
  function tripProgress() {
    const start = parse(FIRST).getTime() + 14 * 36e5, end = parse(LAST).getTime() + 15 * 36e5;
    const t = parse(now.date).getTime() + now.hour * 36e5;
    return Math.max(0, Math.min(1, (t - start) / (end - start)));
  }
  // Which destination are we in? Before noon: where we slept. After noon: where we sleep tonight.
  function currentDest() {
    if (phase === "before") return DESTS[0];
    if (phase === "after") return DESTS[DESTS.length - 1];
    const prev = DAYS[today.i - 1];
    const key = now.hour < 12 && prev ? prev.stay : today.stay;
    return DESTS.find((d) => key && d.stay === key) || DESTS.find((d) => d.days.includes(now.date));
  }

  /* =====================================================================
     Derived data
     ===================================================================== */
  const destNights = (d) => d.stay ? DAYS.filter((x) => x.stay === d.stay).map((x) => x.date) : [];
  const destOfPlace = (id) => DESTS.find((d) => d.places.includes(id));
  const CATS = {
    mountains: { label: "Mountains & lakes", icon: "mountain-snow" },
    sacred: { label: "Monasteries", icon: "landmark" },
    towns: { label: "Villages & towns", icon: "house" },
    stops: { label: "Route stops", icon: "signpost" },
  };
  const catOf = (k) => /monastery|temple|grotto/i.test(k) ? "sacred" : /route stop|plateau stop/i.test(k) ? "stops" : /village|town|tower/i.test(k) ? "towns" : "mountains";
  const STATUS_ICON = { planned: "circle-check", unconfirmed: "triangle-alert", optional: "signpost" };
  const destHasFlags = (d) => d.days.some((x) => DAY[x].flags);
  const dateRange = (dates) => !dates.length ? "" : dates.length === 1 ? short(dates[0]) : `${dayNum(dates[0])}–${dayNum(dates.at(-1))} Nov`;

  /* =====================================================================
     Images: real photo if registered, otherwise a quiet typographic cover
     ===================================================================== */
  function cover(key, zh, region) {
    const ph = PHOTOS[key];
    if (ph) return `<img src="${esc(ph.src)}" alt="" loading="lazy" decoding="async">`;
    return `<span class="cover ${region}" aria-hidden="true"><span class="cover-zh" lang="zh">${esc(clean(zh || "").replace(/\s*·\s*/g, " "))}</span></span>`;
  }

  /* =====================================================================
     Destination card (the main card)
     ===================================================================== */
  function destCard(d, opts = {}) {
    const nights = destNights(d), first = DAY[d.days[0]], cur = currentDest();
    const isNow = phase === "during" && cur === d;
    const st = d.stay && STAYS[d.stay];
    const alt = ELEV[nights[0] || d.days[0]];
    return `<a class="card ${d.region}" href="#dest-${d.id}" data-key="dest-${d.id}">
      <span class="card-media">${cover(d.id, d.zh, d.region)}</span>
      ${isNow ? `<span class="badge">${icon("locate-fixed")}You are here</span>` : ""}
      <span class="card-panel">
        <span class="eyebrow">${regionName(d.region)} · Stop ${DESTS.indexOf(d) + 1} of ${DESTS.length}</span>
        <span class="card-title">${esc(d.name)}</span>
        <span class="card-zh" lang="zh">${esc(d.zh)}</span>
        <span class="meta">
          <span>${icon("calendar-days")}${esc(dateRange(d.days))}${nights.length ? ` · ${nights.length} night${nights.length > 1 ? "s" : ""}` : ""}</span>
          ${st ? `<span>${icon("bed-double")}${esc(st.name)}</span>` : `<span>${icon("bed-double")}No booking on file</span>`}
        </span>
        <span class="card-foot">
          <span>${icon("map-pin")}${d.places.length ? `${d.places.length} place${d.places.length > 1 ? "s" : ""} to visit` : "Arrival and rest"}</span>
          <span>${icon("mountain")}~${alt ? alt.m.toLocaleString() : "–"} m</span>
          ${destHasFlags(d) ? `<span class="warn">${icon("triangle-alert")}To confirm</span>` : ""}
        </span>
      </span>
    </a>`;
  }

  /* =====================================================================
     ITINERARY (home)
     ===================================================================== */
  let destFilter = "all";
  function progressCard() {
    const prog = tripProgress(), where = whereNow(), cur = currentDest();
    const head = phase === "during" ? `${today.label} · ${short(today.date)}` : phase === "before" ? `Starts ${dowLong(FIRST)} 6 November` : "6 – 20 November 2026";
    const big = where ? where.label : phase === "before" ? `${Math.round((parse(FIRST) - parse(now.date)) / 864e5)} days to go` : "Journey complete";
    return `<a class="progress-card" href="#dest-${cur.id}">
      <span class="pc-top"><span class="eyebrow">${esc(head)}</span>${icon("chevron-right")}</span>
      <span class="pc-where">${esc(big)}</span>
      <span class="bar"><i style="width:${(prog * 100).toFixed(1)}%"></i></span>
      <span class="pc-foot"><span>Chengdu</span><span>${Math.round(prog * 100)}% of the route</span><span>Kunming</span></span>
    </a>${where ? `<p class="fine">${icon("info")}Estimated from the date and time in China, not GPS.</p>` : ""}`;
  }

  function renderItinerary() {
    const el = $("#v-itinerary .content");
    const chips = [["all", "All", null], ["sichuan", "Sichuan", null], ["yunnan", "Yunnan", null],
      ...Object.entries(CATS).filter(([k]) => k !== "stops").map(([k, c]) => [k, c.label, c.icon]), ["flags", "To confirm", "triangle-alert"]];
    el.innerHTML = `
      <h1 class="display">Itinerary</h1>
      <p class="lede">Twelve stops from Chengdu to Kunming. Open one for its story, the days you spend there, every place to visit and where you sleep.</p>
      ${progressCard()}
      <div class="chips" role="radiogroup" aria-label="Filter destinations">
        ${chips.map(([k, l, ic]) => `<button role="radio" aria-checked="${k === "all"}" data-filter="${k}">${ic ? icon(ic) : ""}${esc(l)}</button>`).join("")}
      </div>
      <div id="destList"></div>`;
    $(".chips", el).addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]"); if (!b) return;
      destFilter = b.dataset.filter; drawDests();
    });
    drawDests();
  }
  function drawDests() {
    $$("#v-itinerary .chips button").forEach((b) => b.setAttribute("aria-checked", b.dataset.filter === destFilter));
    const f = destFilter;
    const match = (d) => f === "all" || d.region === f || (f === "flags" ? destHasFlags(d) : d.places.some((p) => catOf(PLACES[p].kind) === f));
    const out = ["sichuan", "yunnan"].map((r) => {
      const list = DESTS.filter((d) => d.region === r && match(d));
      return list.length ? `<h2 class="group-title"><span>${regionName(r)}</span><small>${r === "sichuan" ? "6 – 13 Nov" : "14 – 20 Nov"}</small></h2><div class="cards grid">${list.map((d) => destCard(d)).join("")}</div>` : "";
    }).join("");
    $("#destList").innerHTML = out || `<p class="empty">${icon("search")}Nothing matches this filter.</p>`;
  }

  /* =====================================================================
     TODAY
     ===================================================================== */
  function crewLine(date) {
    const on = CREW.filter((c) => !c.until || c.until >= date), leaving = CREW.filter((c) => c.until === date);
    return `<p class="crew-line">${icon("footprints")}<span><b>Crew</b> ${esc(on.map((c) => c.name).join(", "))}${leaving.length ? ` · ${esc(leaving.map((c) => c.name).join(", "))} flies out today` : ""}</span></p>`;
  }
  function renderToday() {
    const el = $("#v-today .content");
    const d = today || DAY[phase === "before" ? FIRST : LAST], cur = currentDest();
    const title = phase === "during" ? "Today" : phase === "before" ? "Day one" : "The last day";
    el.innerHTML = `
      <h1 class="display">${title}</h1>
      <p class="lede">${dowLong(d.date)} ${dayNum(d.date)} November · ${esc(d.label)}</p>
      ${progressCard()}
      ${crewLine(d.date)}
      ${dayBlock(d, { open: true })}
      <h2 class="section-title">${phase === "during" ? "You are in" : "Where it starts"}</h2>
      <div class="cards">${destCard(cur)}</div>`;
  }

  /* =====================================================================
     PLACES (all places, by type)
     ===================================================================== */
  let placeFilter = "all";
  function placeCard(id) {
    const P = PLACES[id], dest = destOfPlace(id), day = DAYS.find((x) => (DAY_PLACES[x.date] || []).includes(id));
    return `<a class="card small ${dest.region} st-${P.status}" href="#place-${id}" data-key="place-${id}">
      <span class="card-media">${cover(id, P.zh || P.name, dest.region)}</span>
      <span class="card-panel">
        <span class="eyebrow">${esc(P.kind)}</span>
        <span class="card-title">${esc(P.name)}</span>
        <span class="meta">
          <span>${icon("map-pin")}${esc(dest.name)}</span>
          ${day ? `<span>${icon("calendar-days")}${short(day.date)} · ${esc(day.label)}</span>` : ""}
        </span>
        <span class="card-foot"><span class="st">${icon(STATUS_ICON[P.status])}${esc(PLACE_STATUS[P.status])}</span></span>
      </span>
    </a>`;
  }
  function renderPlaces() {
    const el = $("#v-places .content");
    const all = DESTS.flatMap((d) => d.places);
    const counts = Object.fromEntries(Object.keys(CATS).map((c) => [c, all.filter((id) => catOf(PLACES[id].kind) === c).length]));
    el.innerHTML = `
      <h1 class="display">Places</h1>
      <p class="lede">Every place to visit on the route, by type. Each opens inside its destination.</p>
      <div class="chips" role="radiogroup" aria-label="Filter places">
        <button role="radio" aria-checked="true" data-filter="all">All <span>${all.length}</span></button>
        ${Object.entries(CATS).map(([k, c]) => `<button role="radio" aria-checked="false" data-filter="${k}">${icon(c.icon)}${c.label} <span>${counts[k]}</span></button>`).join("")}
      </div>
      <div class="cards grid" id="placeCards"></div>`;
    $(".chips", el).addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]"); if (!b) return;
      placeFilter = b.dataset.filter; drawPlaces();
    });
    drawPlaces();
  }
  function drawPlaces() {
    $$("#v-places .chips button").forEach((b) => b.setAttribute("aria-checked", b.dataset.filter === placeFilter));
    const ids = DESTS.flatMap((d) => d.places).filter((id) => placeFilter === "all" || catOf(PLACES[id].kind) === placeFilter);
    $("#placeCards").innerHTML = ids.map(placeCard).join("");
  }

  /* =====================================================================
     GUIDE
     ===================================================================== */
  const GEAR_KEY = "ce-gear-v1";
  function renderGuide() {
    const el = $("#v-guide .content");
    let state = {}; try { state = JSON.parse(localStorage.getItem(GEAR_KEY)) || {}; } catch {}
    const total = GEAR.reduce((n, [, items]) => n + items.length, 0);
    const PICON = { "Weather & roads": "mountain", Altitude: "mountain-snow", Photography: "camera", "Amap links": "map", Timings: "clock" };
    el.innerHTML = `
      <h1 class="display">Guide</h1>
      <p class="lede">The crew, the story you're telling, and how to travel well on this route.</p>
      <h2 class="section-title">Crew</h2>
      <ul class="plist">${CREW.map((c) => `<li>${icon("footprints")}<span><b>${esc(c.name)}</b>${esc(c.leaves || "The whole way, 6 – 20 November")}</span></li>`).join("")}</ul>
      <h2 class="section-title">The documentary arc</h2>
      <ol class="arc">${ARC.map(([t, d], i) => `<li><span class="arc-n">${i + 1}</span><span><b>${esc(t)}</b>${esc(d)}</span></li>`).join("")}</ol>
      <h2 class="section-title">Practical</h2>
      <ul class="plist">${PRACTICAL.map(([t, d]) => `<li>${icon(PICON[t] || "info")}<span><b>${esc(t)}</b>${esc(d)}</span></li>`).join("")}</ul>
      <h2 class="section-title">On the ground</h2>
      <div class="accordion">${FIELD.map(([t, items]) => `<details><summary>${esc(t)}${icon("chevron-down")}</summary><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></details>`).join("")}</div>
      <div class="section-head"><h2 class="section-title">Camera kit</h2><span class="muted" id="gearProgress"></span></div>
      ${GEAR.map(([g, items]) => `<p class="eyebrow gear-group">${esc(g)}</p><ul class="checks">${items.map((it) =>
        `<li><label><input type="checkbox" data-item="${esc(it)}" ${state[it] ? "checked" : ""}><span>${esc(it)}</span></label></li>`).join("")}</ul>`).join("")}
      <button class="text-link" id="gearReset" type="button">Reset checklist</button>
      <footer class="foot">
        <p>${icon("triangle-alert")}<span><b>To confirm</b> marks a conflict between the itinerary and the bookings. Ask the organiser or driver; don't guess.</span></p>
        <p>${icon("map")}<span>Map links open <b>Amap 高德地图</b> keyword searches, not exact pins. Check the result before you navigate.</span></p>
        <p>${icon("info")}<span>Icons by Lucide (ISC licence).</span></p>
      </footer>`;
    const update = () => { $("#gearProgress").textContent = `${Object.values(state).filter(Boolean).length} of ${total} packed`; };
    el.addEventListener("change", (e) => {
      const cb = e.target.closest("input[data-item]"); if (!cb) return;
      state[cb.dataset.item] = cb.checked; try { localStorage.setItem(GEAR_KEY, JSON.stringify(state)); } catch {} update();
    });
    $("#gearReset").addEventListener("click", () => { state = {}; try { localStorage.removeItem(GEAR_KEY); } catch {} $$("input[data-item]", el).forEach((c) => (c.checked = false)); update(); });
    update();
  }

  /* =====================================================================
     DESTINATION DETAIL
     ===================================================================== */
  const sec = (title, ic, body, cls = "") => body ? `<section class="dsec ${cls}"><h3>${icon(ic)}${title}</h3>${body}</section>` : "";
  const ul = (a) => a && a.length ? `<ul class="bullets">${a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
  const para = (t) => t ? `<p>${esc(t)}</p>` : "";

  function dayBlock(d, opts = {}) {
    const where = today && today.date === d.date ? whereNow() : null;
    const stops = d.route.map(clean);
    return `<article class="dayblock ${today && today.date === d.date ? "is-today" : ""}" id="dayblock-${d.date}">
      <header>
        <span class="db-date"><b>${dayNum(d.date)}</b><small>${dow(d.date)}</small></span>
        <span><span class="eyebrow">${esc(d.label)}${today && today.date === d.date ? " · Today" : ""}${opts.role ? ` · ${opts.role}` : ""}</span>
        <span class="db-title">${esc(d.title)}</span></span>
      </header>
      <ol class="stepper">${stops.map((s, k) => {
        const done = where && k <= Math.floor(where.segment);
        return `<li class="${done ? "done" : ""} ${d.route[k].endsWith("?") ? "uncertain" : ""}"><span>${esc(s)}</span></li>`; }).join("")}</ol>
      ${where ? `<p class="db-live">${icon("locate-fixed")}${esc(where.label)}</p>` : ""}
      ${d.flags ? `<div class="notice">${icon("triangle-alert")}<span><b>Needs confirmation.</b> ${d.flags.map(esc).join(" ")}</span></div>` : ""}
      <p class="db-summary">${esc(d.summary)}</p>
      <p class="db-focus"><b>Focus</b> ${esc(d.focus)}</p>
      ${d.altitude ? `<p class="db-meta">${icon("mountain")}${esc(d.altitude)}</p>` : ""}
      ${d.options ? `<ul class="opts">${d.options.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("")}</ul>` : ""}
      ${d.notes ? ul(d.notes) : ""}
    </article>`;
  }

  function placeItem(id, open) {
    const P = PLACES[id];
    const body = [
      P.history ? `<h4>History & context</h4><p>${esc(P.history)}</p>` : "",
      P.look ? `<h4>What to look for</h4>${ul(P.look)}` : "",
      P.todo ? `<h4>What to do</h4>${ul(P.todo)}` : "",
      P.photo ? `<h4>Photography</h4>${ul(P.photo)}` : "",
      P.care ? `<h4>Care</h4>${ul(P.care)}` : "",
      P.sources ? `<h4>Sources</h4><ul class="links">${P.sources.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ${icon("external-link")}</a></li>`).join("")}</ul>` : "",
    ].join("");
    return `<li class="place st-${P.status}" id="pl-${id}">
      <details ${open ? "open" : ""}>
        <summary>
          <span class="pl-thumb">${cover(id, P.zh || P.name, destOfPlace(id).region)}</span>
          <span class="pl-text"><span class="pl-name">${esc(P.name)}</span>
            <span class="pl-sub">${P.zh ? `<span lang="zh">${esc(clean(P.zh))}</span> · ` : ""}${esc(P.kind)}${P.status !== "planned" ? ` · <em>${esc(PLACE_STATUS[P.status])}</em>` : ""}</span></span>
          ${icon("chevron-down", "pl-chev")}
        </summary>
        <div class="pl-body">
          <p>${esc(P.about)}</p>
          <div class="d-actions">
            ${P.map ? `<a class="btn primary" href="${esc(P.map)}" target="_blank" rel="noopener">${icon("navigation")}Open in Amap</a>` : ""}
            ${P.zh ? `<button class="btn" type="button" data-copy="${esc(clean(P.zh).split(" · ")[0])}" data-copy-label="Chinese name copied">${icon("copy")}Copy 中文</button>` : ""}
          </div>
          ${body}
        </div>
      </details>
    </li>`;
  }

  function stayBlock(d) {
    if (!d.stay) return `<p class="empty">${icon("bed-double")}No booking on file for the last night. Add the onward plan once it's confirmed.</p>`;
    const s = STAYS[d.stay], nights = destNights(d);
    const facts = [["Check-in", s.checkin], ["Check-out", s.checkout], ["Meals", s.meals]].filter((f) => f[1]);
    return `<div class="stay">
      <div class="stay-head">
        <span class="eyebrow">${nights.length} night${nights.length > 1 ? "s" : ""} · ${esc(dateRange(nights))}</span>
        <h3 class="stay-name">${esc(s.name)}</h3>
        ${s.sub ? `<p class="stay-sub">${esc(s.sub)}</p>` : ""}
      </div>
      <ul class="kv">
        <li>${icon("map-pin")}<span>${esc(s.address)}</span><button class="mini" type="button" data-copy="${esc(s.address)}" data-copy-label="Address copied" aria-label="Copy address">${icon("copy")}</button></li>
        ${facts.length ? `<li>${icon("clock")}<span>${facts.map(([k, v]) => `<b>${k}</b> ${esc(v)}`).join("<br>")}</span></li>` : ""}
        ${s.phone ? `<li>${icon("phone")}<a href="tel:${esc(s.phone.replace(/[^\d+]/g, ""))}">${esc(s.phone)}</a></li>` : ""}
        ${s.note ? `<li>${icon("info")}<span>${esc(s.note)}</span></li>` : ""}
      </ul>
      <div class="d-actions">
        ${d.voucher ? `<a class="btn primary" href="#voucher-${d.id}">${icon("list-checks")}View booking voucher</a>` : ""}
        <a class="btn" href="${esc(s.map)}" target="_blank" rel="noopener">${icon("navigation")}Find in Amap</a>
      </div>
      ${s.nearby ? `<p class="eyebrow nb-title">Around the stay · Amap searches</p><ul class="nearby">${s.nearby.map(([n, u, dist]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}${dist ? ` <small>${esc(dist)}</small>` : ""}</a></li>`).join("")}</ul>` : ""}
    </div>`;
  }

  function destDetail(id, openPlace) {
    const d = DEST[id], lead = d.lead && PLACES[d.lead], nights = destNights(d);
    const idx = DESTS.indexOf(d), prev = DESTS[idx - 1], next = DESTS[idx + 1];
    const arrival = DAY[d.days.find((x) => DAY[x].stay === d.stay) || d.days[0]];
    const alt = ELEV[nights[0] || d.days[0]];
    const eats = d.places.flatMap((p) => PLACES[p].eat || []);
    const sources = [...new Map(d.places.flatMap((p) => PLACES[p].sources || []).map((s) => [s[1], s])).values()];
    const role = (x) => DAY[x].stay !== d.stay && d.stay ? "Leaving" : x === arrival.date && prev ? "Arriving" : "";
    const plateau = ["tagong", "yajiang", "yading", "meili", "shangrila", "siguniang"].includes(d.id);
    return `<div class="d-hero">${cover(d.id, d.zh, d.region)}
        <a class="d-back" href="${lastView()}" aria-label="Back">${icon("chevron-left")}</a>
        ${PHOTOS[d.id] ? `<span class="d-credit">${esc(PHOTOS[d.id].credit)}</span>` : ""}
      </div>
      <div class="d-sheet">
        <p class="eyebrow">${regionName(d.region)} · Stop ${idx + 1} of ${DESTS.length}</p>
        <h1 class="d-title">${esc(d.name)}</h1>
        <p class="d-zh" lang="zh">${esc(d.zh)}</p>

        <dl class="facts">
          <div><dt>${icon("calendar-days")}Dates</dt><dd>${esc(dateRange(d.days))}</dd></div>
          <div><dt>${icon("moon")}Nights</dt><dd>${nights.length || "–"}</dd></div>
          <div><dt>${icon("mountain")}Altitude</dt><dd>~${alt ? alt.m.toLocaleString() : "–"} m</dd></div>
          <div><dt>${icon("map-pin")}Places</dt><dd>${d.places.length || "–"}</dd></div>
        </dl>

        <nav class="jump" aria-label="On this page">
          <a href="#j-about">About</a><a href="#j-days">Days</a>${d.places.length ? `<a href="#j-places">Places</a>` : ""}<a href="#j-stay">Stay</a>${lead && (lead.food || eats.length) ? `<a href="#j-food">Food</a>` : ""}
        </nav>

        <section class="dsec" id="j-about"><h3>${icon("book-open")}About</h3>
          <p class="d-about">${esc(d.intro || lead?.about || "")}</p>
          ${lead && d.intro && lead.about !== d.intro ? `<p>${esc(lead.about)}</p>` : ""}
          ${lead?.history ? `<h4>History & context</h4><p>${esc(lead.history)}</p>` : ""}
          ${lead?.todo ? `<h4>What to do</h4>${ul(lead.todo)}` : ""}
        </section>

        ${sec("Getting here", "route", `
          <p class="muted-p">${prev ? `From ${esc(prev.name)} on ${dowLong(arrival.date)} ${dayNum(arrival.date)} November.` : "Arrival in China."}</p>
          <ol class="stepper">${arrival.route.map((s) => `<li class="${s.endsWith("?") ? "uncertain" : ""}"><span>${esc(clean(s))}</span></li>`).join("")}</ol>
          ${plateau ? `<p class="d-note">${icon("mountain")}<span>${esc(PRACTICAL[0][1])}</span></p>` : ""}
          <p class="d-note">${icon("clock")}<span>Departure times, stop durations and detours aren't in the itinerary. Confirm them with the driver or guide.</span></p>`)}

        <section class="dsec" id="j-days"><h3>${icon("calendar-days")}The days here</h3>
          ${d.days.map((x) => dayBlock(DAY[x], { role: role(x) })).join("")}
        </section>

        ${d.places.length ? `<section class="dsec" id="j-places"><h3>${icon("map-pin")}Places to visit · ${d.places.length}</h3>
          <ul class="places">${d.places.map((p) => placeItem(p, p === openPlace)).join("")}</ul></section>` : ""}

        <section class="dsec" id="j-stay"><h3>${icon("bed-double")}Where you sleep</h3>${stayBlock(d)}</section>

        ${lead && (lead.food || eats.length) ? `<section class="dsec" id="j-food"><h3>${icon("utensils")}Food</h3>
          ${para(lead.food)}
          ${eats.length ? `<h4>Restaurant leads</h4><p class="fine">Leads, not reservations. Check the Chinese name and that it's open on the day.</p><ul class="leads">${eats.map(([n, t, u]) =>
            `<li><b>${esc(n)}</b><span>${esc(t)}</span>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">Listing ${icon("external-link")}</a>` : ""}</li>`).join("")}</ul>` : ""}
        </section>` : ""}

        ${sec("Care & cautions", "shield-alert", ul(lead?.care))}
        ${sec("Sources", "book-open", sources.length ? `<ul class="links">${sources.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ${icon("external-link")}</a></li>`).join("")}</ul>` : "")}
        <p class="fine">Place notes from the location field guide v1.4; dates and hotels from the itinerary and booking vouchers.</p>

        <nav class="d-pager" aria-label="Other destinations">
          ${prev ? `<a href="#dest-${prev.id}">${icon("chevron-left")}<span><small>Previous</small>${esc(prev.name)}</span></a>` : "<span></span>"}
          ${next ? `<a class="nx" href="#dest-${next.id}"><span><small>Next</small>${esc(next.name)}</span>${icon("chevron-right")}</a>` : ""}
        </nav>
      </div>`;
  }

  function voucherView(id) {
    const d = DEST[id], s = STAYS[d.stay];
    const pages = Array.from({ length: d.voucher }, (_, k) => `vouchers/${d.stay}-${k + 1}.jpg`);
    return `<div class="v-bar">
        <a class="d-back static" href="#dest-${id}" aria-label="Back">${icon("chevron-left")}</a>
        <span><small>Booking voucher</small><b>${esc(s.name)}</b></span>
      </div>
      <p class="v-note">${icon("shield-alert")}<span>Contains booking numbers and PINs. Show it at check-in; don't share screenshots.</span></p>
      <div class="v-pages">${pages.map((src, k) => `<img src="${src}" alt="Voucher page ${k + 1}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('p'),{className:'empty',textContent:'Voucher image not available in this copy. Vouchers are kept out of the repository for privacy.'}))">`).join("")}</div>`;
  }

  /* =====================================================================
     Routing
     ===================================================================== */
  const VIEWS = ["itinerary", "today", "places", "guide"];
  let view = "itinerary", booted = false, lastCard = null;
  const lastView = () => "#" + view;
  const scrollMemo = {};

  function setView(v) {
    view = v;
    VIEWS.forEach((n) => $(`#v-${n}`).classList.toggle("on", n === v));
    $$(".tabbar a").forEach((a) => a.toggleAttribute("aria-current", a.dataset.view === v));
  }

  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    const det = $("#detail");
    let html = null, region = "sichuan", focus = null, cls = "";
    if (h.startsWith("dest-") && DEST[h.slice(5)]) { const d = DEST[h.slice(5)]; html = destDetail(d.id); region = d.region; }
    else if (h.startsWith("place-") && PLACES[h.slice(6)] && destOfPlace(h.slice(6))) { const id = h.slice(6), d = destOfPlace(id); html = destDetail(d.id, id); region = d.region; focus = `#pl-${id}`; }
    else if (h.startsWith("voucher-") && DEST[h.slice(8)]?.voucher) { html = voucherView(h.slice(8)); cls = "voucher"; }
    else if (h.startsWith("j-")) { const t = $(`#${h}`); if (t) { t.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" }); history.replaceState(null, "", "#" + det.dataset.key); } return; }

    const apply = () => {
      $$(".vt").forEach((m) => m.classList.remove("vt"));
      if (html) {
        if (det.hidden) scrollMemo[view] = window.scrollY;
        det.innerHTML = html; det.className = `detail ${region} ${cls}`; det.dataset.key = h; det.hidden = false;
        det.scrollTop = 0;
        document.body.classList.add("has-detail");
        if (focus) requestAnimationFrame(() => $(focus)?.scrollIntoView({ block: "start" }));
      } else {
        const wasDetail = !det.hidden;
        det.hidden = true; det.innerHTML = "";
        document.body.classList.remove("has-detail");
        const v = VIEWS.includes(h) ? h : view, changed = v !== view;
        setView(v);
        window.scrollTo(0, changed ? 0 : wasDetail ? scrollMemo[v] || 0 : window.scrollY);
        const back = lastCard && $(`#v-${v} a.card[data-key="${lastCard}"] .card-media`);
        if (back) back.classList.add("vt");
      }
    };
    const toggling = !!html !== !det.hidden;
    if (toggling && booted && document.startViewTransition && !reduceMotion) {
      const t = document.startViewTransition(apply); t.ready.catch(() => {}); t.finished.catch(() => {});
    } else apply();
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.card");
    $$(".vt").forEach((m) => m.classList.remove("vt"));
    if (a) { $(".card-media", a).classList.add("vt"); lastCard = a.dataset.key; }
  }, true);
  window.addEventListener("hashchange", route);

  /* ---------- Copy ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    e.preventDefault();
    try { await navigator.clipboard.writeText(b.dataset.copy); }
    catch { const ta = Object.assign(document.createElement("textarea"), { value: b.dataset.copy }); document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
    toast(b.dataset.copyLabel || "Copied");
  });

  /* ---------- Boot ---------- */
  $$("[data-icon]").forEach((el) => el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)));
  renderItinerary();
  renderToday();
  renderPlaces();
  renderGuide();
  setView(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "itinerary");
  route();
  booted = true;
})();
