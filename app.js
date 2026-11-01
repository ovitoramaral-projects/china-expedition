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
  const dayRange = (d) => { const ls = [...new Set(d.days.map((x) => DAY[x].label))]; const n = (l) => l.replace("Day ", "");
    return ls.length === 1 ? ls[0] : ls[0] === "Arrival" ? `Arrival – Day ${n(ls.at(-1))}` : `Days ${n(ls[0])} – ${n(ls.at(-1))}`; };
  const dateRange = (dates) => !dates.length ? "" : dates.length === 1 ? short(dates[0]) : `${dayNum(dates[0])}–${dayNum(dates.at(-1))} Nov`;

  /* =====================================================================
     Images: real photo if registered, otherwise a quiet typographic cover
     ===================================================================== */
  function cover(key, zh, region, small = false) {
    const ph = PHOTOS[key];
    if (ph) return `<img src="${esc(small ? ph.small : ph.src)}" alt="" loading="lazy" decoding="async">`;
    return `<span class="cover ${region}" aria-hidden="true"><span class="cover-zh" lang="zh">${esc(clean(zh || "").replace(/\s*·\s*/g, " "))}</span></span>`;
  }

  /* =====================================================================
     Destination card (the main card)
     ===================================================================== */
  function destCard(d, opts = {}) {
    const nights = destNights(d), first = DAY[d.days[0]], cur = currentDest();
    const isNow = phase === "during" && cur === d;
    const isDone = phase === "after" || (phase === "during" && DESTS.indexOf(d) < DESTS.indexOf(cur));
    const alt = ELEV[nights[0] || d.days[0]];
    return `<a class="card ${d.region} ${isDone ? "is-done" : ""} ${isNow ? "is-now" : ""}" href="#dest-${d.id}" data-key="dest-${d.id}">
      <span class="card-media">${cover("dest-" + d.id, d.zh, d.region)}</span>
      <span class="pills"><span class="pill">${DESTS.indexOf(d) === 0 ? "First stop" : DESTS.indexOf(d) === DESTS.length - 1 ? "Last stop" : `Stop ${DESTS.indexOf(d) + 1}`}</span>${isNow ? `<span class="pill now">${icon("locate-fixed")}You are here</span>` : ""}${isDone ? `<span class="pill done">${icon("circle-check")}Visited</span>` : ""}</span>
      <span class="card-panel">
        <span class="eyebrow">${regionName(d.region)}</span>
        <span class="card-title">${esc(d.name)}</span>
        <span class="card-zh" lang="zh">${esc(d.zh)}</span>
        <span class="card-line">
          <span>${esc(dateRange(d.days))}</span>
          ${nights.length ? `<span>${nights.length} night${nights.length > 1 ? "s" : ""}</span>` : ""}
          <span>~${alt ? alt.m.toLocaleString() : "–"} m</span>
          ${destHasFlags(d) ? `<span class="warn">${icon("triangle-alert")}</span>` : ""}
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
    return `<a class="progress-card" href="#timeline">
      <span class="pc-top"><span class="eyebrow">${esc(head)}</span>${icon("chevron-right")}</span>
      <span class="pc-where">${esc(big)}</span>
      <span class="bar"><i style="width:${(prog * 100).toFixed(1)}%"></i></span>
      <span class="pc-foot"><span>Chengdu</span><span>${Math.round(prog * 100)}% of the route</span><span>Kunming</span></span>
    </a>${where ? `<p class="fine">${icon("info")}Estimated from the date and time in China, not GPS.</p>` : ""}`;
  }

  function renderItinerary() {
    const el = $("#v-itinerary .content");
    const chips = [["all", "All", null], ...Object.entries(CATS).filter(([k]) => k !== "stops").map(([k, c]) => [k, c.label, c.icon])];
    const cur = currentDest();
    el.innerHTML = `
      <section class="home-hero" aria-label="China Expedition">
        <span class="seal" aria-hidden="true" lang="zh"><span>川</span><span>滇</span></span>
        <p class="blessing" lang="zh" aria-label="Yílù píng'ān, a safe journey"><span>一</span><span>路</span><span>平</span><span>安</span></p>
        <div class="hero-text">
          <p class="hero-kicker">6 – 20 November 2026</p>
          <h1 class="hero-title">China<br>Expedition</h1>
          <p class="hero-sub"><span class="red">Yílù píng'ān</span> · a safe journey, from Chengdu to Kunming through Sichuan and Yunnan.</p>
        </div>
        <div class="hero-bottom">${progressCard()}<span class="scroll-cue">${icon("chevron-down")}Scroll through the stops</span></div>
      </section>
      <div class="desk-intro">
        <h1 class="display">Itinerary</h1>
        <p class="lede">Twelve stops from Chengdu to Kunming, through Sichuan and then Yunnan. Open a stop for its story, the days you spend there, the places to visit and where you sleep.</p>
        ${progressCard()}
      </div>
      <div class="chips" role="radiogroup" aria-label="Filter destinations">
        ${chips.map(([k, l, ic]) => `<button role="radio" aria-checked="${k === "all"}" data-filter="${k}">${ic ? icon(ic) : ""}${esc(l)}</button>`).join("")}
      </div>
      <div id="destList"></div>`;
    $(".chips", el).addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]"); if (!b) return;
      destFilter = b.dataset.filter; drawDests();
    });
    // Phone: the same filters live in a panel behind the floating button.
    const panel = $("#filterPanel"), fab = $("#fabFilter");
    panel.innerHTML = `<p class="fp-title">Show stops with</p>` + chips.map(([k, l, ic], i) =>
      `<button type="button" role="radio" aria-checked="${k === destFilter}" data-filter="${k}" style="--i:${i}">${icon(ic || "map")}<span>${esc(l)}</span>${icon("check", "fp-check")}</button>`).join("");
    const setOpen = (open) => {
      $("#fabs").classList.toggle("open", open);
      fab.setAttribute("aria-expanded", open);
      if (open) requestAnimationFrame(() => $("#filterPanel button[aria-checked=true]")?.focus({ preventScroll: true }));
    };
    fab.addEventListener("click", () => setOpen(!$("#fabs").classList.contains("open")));
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]"); if (!b) return;
      destFilter = b.dataset.filter; drawDests(); setOpen(false);
      const first = $("#v-itinerary .card");
      if (first) first.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
    });
    document.addEventListener("click", (e) => { if ($("#fabs").classList.contains("open") && !e.target.closest("#fabs")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#fabs").classList.contains("open")) { setOpen(false); fab.focus(); } });
    // Filters appear only once you've scrolled past the opening screen.
    const hero = $(".home-hero", el);
    if (hero && "IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => {
        const onHero = en.isIntersecting;
        $("#fabs").classList.toggle("on-hero", onHero);
        if (onHero) setOpen(false);
      }, { threshold: 0.35 }).observe(hero);
    }
    drawDests();
  }
  function drawDests() {
    $$("#v-itinerary .chips button, #filterPanel button").forEach((b) => b.setAttribute("aria-checked", b.dataset.filter === destFilter));
    $("#fabFilter").classList.toggle("has-filter", destFilter !== "all");
    const f = destFilter;
    const match = (d) => f === "all" || d.places.some((p) => catOf(PLACES[p].kind) === f);
    const out = ["sichuan", "yunnan"].map((r) => {
      const list = DESTS.filter((d) => d.region === r && match(d));
      return list.length ? `<h2 class="group-title"><span>${regionName(r)}</span><small>${r === "sichuan" ? "6 – 13 Nov" : "14 – 20 Nov"}</small></h2><div class="cards grid">${list.map((d) => destCard(d)).join("")}</div>` : "";
    }).join("");
    $("#destList").innerHTML = out || `<p class="empty">${icon("search")}Nothing matches this filter.</p>`;
  }

  /* =====================================================================
     TIMELINE — what's done, where you are, what's next
     ===================================================================== */
  function crewLine(date) {
    const on = CREW.filter((c) => (!c.until || c.until >= date) && (!c.from || c.from <= date)), leaving = CREW.filter((c) => c.until === date);
    return `<p class="crew-line">${icon("footprints")}<span><b>Crew</b> ${esc(on.map((c) => c.name).join(", "))}${leaving.length ? ` · ${esc(leaving.map((c) => c.name).join(", "))} flies out today` : ""}</span></p>`;
  }
  function renderTimeline() {
    const el = $("#v-timeline .content"), cur = currentDest(), where = whereNow();
    const ci = DESTS.indexOf(cur);
    const state = (i) => phase === "after" || (phase === "during" && i < ci) ? "done" : phase === "during" && i === ci ? "now" : "next";
    el.innerHTML = `
      <a class="tl-back" href="#itinerary">${icon("chevron-left")}Itinerary</a>
      <h1 class="display">Timeline</h1>
      <p class="lede">${phase === "during" ? `${esc(today.label)}, ${dowLong(today.date)} ${dayNum(today.date)} November. ${where ? esc(where.label) + "." : ""}` : phase === "before" ? "Nothing travelled yet. The journey starts on Friday 6 November in Chengdu." : "The whole route, travelled."}</p>
      ${progressCard()}
      ${crewLine(today ? today.date : FIRST)}
      <ol class="tl">${DESTS.map((d, i) => {
        const st = state(i);
        return `<li class="tl-stop ${st} ${d.region}">
          <span class="tl-node" aria-hidden="true">${st === "done" ? icon("circle-check") : ""}</span>
          <div class="tl-body">
            <a class="tl-head" href="#dest-${d.id}">
              <span class="tl-thumb">${cover("dest-" + d.id, d.zh, d.region, true)}</span>
              <span><span class="eyebrow">${i === 0 ? "First stop" : i === DESTS.length - 1 ? "Last stop" : `Stop ${i + 1}`} · ${esc(dateRange(d.days))}${st === "now" ? ` · <em>You are here</em>` : st === "done" ? " · Done" : ""}</span>
              <span class="tl-name">${esc(d.name)}</span></span>
              ${icon("chevron-right")}
            </a>
            <ol class="tl-days">${d.days.filter((x) => DAY[x].stay === d.stay || !d.stay || x === d.days[0]).map((x) => {
              const dd = DAY[x], past = phase === "after" || (today && x < today.date), isToday = today && x === today.date;
              return `<li class="${past ? "past" : ""} ${isToday ? "today" : ""}"><a href="#dest-${d.id}"><b>${dow(x)} ${dayNum(x)}</b><span>${esc(dd.title)}</span>${dd.flags ? icon("triangle-alert", "warn-i") : ""}</a>
                ${isToday && where ? `<span class="tl-live">${icon("locate-fixed")}${esc(where.label)}</span>` : ""}</li>`;
            }).join("")}</ol>
          </div>
        </li>`;
      }).join("")}</ol>`;
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
      <a class="tl-back" href="#itinerary">${icon("chevron-left")}Itinerary</a>
      <h1 class="display">Guide</h1>
      <p class="lede">The crew, the story you're telling, and how to travel well on this route.</p>
      <h2 class="section-title">Crew</h2>
      <ul class="plist">${CREW.map((c) => `<li>${icon("footprints")}<span><b>${esc(c.name)}</b>${esc([c.from ? "Joins on 7 November" : "", c.leaves || (c.from ? "" : "The whole way, 6 – 20 November")].filter(Boolean).join(". "))}</span></li>`).join("")}</ul>
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
      </footer>
      <details class="credits"><summary>Photo credits (${Object.keys(PHOTOS).length})${icon("chevron-down")}</summary>
        <ul>${Object.entries(PHOTOS).map(([k, ph]) => `<li><b>${esc(k.startsWith("dest-") ? DEST[k.slice(5)].name : PLACES[k]?.name || k)}</b> <a href="${esc(ph.page)}" target="_blank" rel="noopener">${esc(ph.title)}</a><br><span>${esc(ph.credit)}</span></li>`).join("")}</ul>
      </details>`;
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
     Type roles (see styles.css "Detail typography"):
       d-title  page title · h2 section · h3 item · body · meta · label
     ===================================================================== */
  const ul = (a) => a && a.length ? `<ul class="bullets">${a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
  const para = (t) => t ? `<p>${esc(t)}</p>` : "";
  const section = (id, title, body, note = "") => body ? `<section class="dsec" id="${id}"><h2>${title}</h2>${note ? `<p class="meta">${note}</p>` : ""}${body}</section>` : "";
  const extLink = (href, label, ic = "arrow-up-right") => `<a class="tlink" href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}${icon(ic)}</a>`;
  const amapSearch = (q, city) => "https://uri.amap.com/search?keyword=" + encodeURIComponent(q) + "&view=map&src=chinaexpedition&callnative=1" + (city ? "&city=" + encodeURIComponent(city) : "");

  // Straight-line distance (km) between two [lat, lon] points.
  function km(a, b) {
    const R = 6371, r = Math.PI / 180, dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function distanceLabel(placeId, d) {
    if (GEO.enRoute.includes(placeId)) return { short: "On the way here", long: "Passed on the drive in", mode: "route" };
    const s = d.stay && GEO.stays[d.stay], p = GEO.places[placeId];
    if (!s || !p) return null;
    const k = km(s, p);
    if (k < 0.25) return { short: "At your stay", long: "Right by where you sleep", mode: "here" };
    if (k < 2.5) {
      const mins = Math.max(5, Math.round((k * 1.3 * 1000) / 75 / 5) * 5); // ~1.3× straight line, 75 m/min
      return { short: `${k < 1 ? Math.round(k * 10) * 100 + " m" : k.toFixed(1) + " km"} · ~${mins} min walk`, long: "", mode: "walk" };
    }
    return { short: `≈ ${k < 10 ? k.toFixed(1) : Math.round(k)} km · by car`, long: "", mode: "car" };
  }

  function dayBlock(d, opts = {}) {
    const isToday = today && today.date === d.date, where = isToday ? whereNow() : null;
    return `<article class="day ${isToday ? "is-today" : ""}" id="dayblock-${d.date}">
      <p class="label">${esc(d.label)} · ${dowLong(d.date)} ${dayNum(d.date)} Nov${isToday ? " · Today" : ""}${opts.role ? ` · ${opts.role}` : ""}</p>
      <h3>${esc(d.title)}</h3>
      <ol class="stepper">${d.route.map((s, k) => `<li class="${where && k <= Math.floor(where.segment) ? "done" : ""} ${s.endsWith("?") ? "uncertain" : ""}"><span>${esc(clean(s))}</span></li>`).join("")}</ol>
      ${where ? `<p class="live">${icon("locate-fixed")}${esc(where.label)}</p>` : ""}
      ${d.flags ? `<div class="notice">${icon("triangle-alert")}<p><b>Needs confirmation.</b> ${d.flags.map(esc).join(" ")}</p></div>` : ""}
      <p>${esc(d.summary)}</p>
      <p class="meta"><b>Focus</b> ${esc(d.focus)}</p>
      ${d.altitude ? `<p class="meta">${icon("mountain")}${esc(d.altitude)}</p>` : ""}
      ${d.options ? `<dl class="opts">${d.options.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
      ${d.notes ? ul(d.notes) : ""}
    </article>`;
  }

  function placeItem(id, d, open) {
    const P = PLACES[id], dist = distanceLabel(id, d);
    const sub = [P.zh ? `<span lang="zh">${esc(clean(P.zh))}</span>` : "", esc(P.kind)].filter(Boolean).join(" · ");
    const parts = [
      P.history && `<h4>History & context</h4>${para(P.history)}`,
      P.look && `<h4>What to look for</h4>${ul(P.look)}`,
      P.todo && `<h4>What to do</h4>${ul(P.todo)}`,
      P.photo && `<h4>Photography</h4>${ul(P.photo)}`,
      P.care && `<h4>Care</h4>${ul(P.care)}`,
      P.sources && `<h4>Sources</h4><p class="links">${P.sources.map(([n, u]) => extLink(u, n)).join("")}</p>`,
    ].filter(Boolean).join("");
    return `<li class="place st-${P.status}" id="pl-${id}">
      <details ${open ? "open" : ""}>
        <summary>
          <span class="pl-thumb">${cover(id, P.zh || P.name, d.region, true)}</span>
          <span class="pl-text">
            <span class="pl-name">${esc(P.name)}</span>
            <span class="pl-sub">${sub}</span>
            <span class="pl-dist ${dist ? dist.mode : ""}">${dist ? `${icon(dist.mode === "walk" ? "footprints" : dist.mode === "car" ? "navigation" : dist.mode === "route" ? "route" : "map-pin")}${esc(dist.short)}` : ""}${P.status !== "planned" ? `<em>${esc(PLACE_STATUS[P.status])}</em>` : ""}</span>
          </span>
          ${icon("chevron-down", "pl-chev")}
        </summary>
        <div class="pl-body">
          ${PHOTOS[id] ? `<figure class="pl-photo"><img src="${esc(PHOTOS[id].src)}" alt="${esc(P.name)}" loading="lazy" decoding="async"><figcaption>${extLink(PHOTOS[id].page, PHOTOS[id].credit, "external-link")}</figcaption></figure>` : ""}
          <p>${esc(P.about)}</p>
          <p class="links">
            ${P.map ? extLink(P.map, "Open in Amap", "navigation") : ""}
            ${P.zh ? `<button class="tlink" type="button" data-copy="${esc(clean(P.zh).split(" · ")[0])}" data-copy-label="Chinese name copied">Copy 中文 name${icon("copy")}</button>` : ""}
          </p>
          ${parts}
        </div>
      </details>
    </li>`;
  }

  function stayBlock(d) {
    if (!d.stay) return `<p class="empty">${icon("bed-double")}No booking on file for this night. Add the onward plan once it's confirmed.</p>`;
    const s = STAYS[d.stay], nights = destNights(d);
    const rows = [
      ["map-pin", "Address", `${esc(s.address)} <button class="tlink inline" type="button" data-copy="${esc(s.address)}" data-copy-label="Address copied">Copy${icon("copy")}</button>`],
      s.checkin && ["clock", "Check-in", esc(s.checkin)],
      s.checkout && ["clock", "Check-out", esc(s.checkout)],
      s.meals && ["utensils", "Meals", esc(s.meals)],
      s.phone && ["phone", "Phone", `<a class="tlink inline" href="tel:${esc(s.phone.replace(/[^\d+]/g, ""))}">${esc(s.phone)}</a>`],
    ].filter(Boolean);
    return `<div class="stay">
      <p class="label">${nights.length} night${nights.length > 1 ? "s" : ""} · ${esc(dateRange(nights))}</p>
      <h3>${esc(s.name)}</h3>
      ${s.sub ? `<p class="meta">${esc(s.sub)}</p>` : ""}
      <dl class="kv">${rows.map(([ic, k, v]) => `<div>${icon(ic)}<dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      ${s.note ? `<p class="meta note">${icon("info")}${esc(s.note)}</p>` : ""}
      <div class="stay-actions">
        ${d.voucher ? `<a class="btn" href="#voucher-${d.id}">${icon("list-checks")}Booking voucher</a>` : ""}
        ${extLink(s.map, "Open in Amap", "navigation")}
      </div>
      ${s.nearby ? `<h4>Around the stay</h4><p class="links">${s.nearby.map(([n, u, dist]) => extLink(u, n + (dist ? ` · ${dist}` : ""), "navigation")).join("")}</p>` : ""}
    </div>`;
  }

  function foodBlock(d, lead) {
    const picks = FOOD[d.id] || [];
    const leads = d.places.flatMap((p) => PLACES[p].eat || []);
    const city = AMAP_CITY[d.id];
    const row = (r, kind) => {
      const q = r.zh || r.name;
      return `<li>
        <h3>${esc(r.name)}${r.zh && r.zh !== r.name ? ` <span class="zh" lang="zh">${esc(r.zh)}</span>` : ""}</h3>
        ${r.note ? `<p>${esc(r.note)}</p>` : ""}
        <p class="links">${r.link ? extLink(r.link, kind === "lead" ? "Listing" : "Link") : ""}${extLink(r.map || amapSearch(q, city), "Find in Amap", "navigation")}</p>
      </li>`;
    };
    return `${lead?.food ? `<p>${esc(lead.food)}</p>` : ""}
      <h4>Our picks</h4>
      ${picks.length ? `<ul class="eats">${picks.map((r) => row(r, "pick")).join("")}</ul>` : `<p class="meta">None yet. Restaurants you choose will appear here first.</p>`}
      ${leads.length ? `<h4>Leads from the field guide</h4><p class="meta">Not reservations. Check it's open on the day.</p>
        <ul class="eats">${leads.map(([n, t, u]) => { const zh = (n.match(/[一-鿿·]+/g) || []).join(""); return row({ name: n.replace(/\s*[一-鿿·]+.*$/, "").trim() || n, zh, note: t, link: u }, "lead"); }).join("")}</ul>` : ""}`;
  }
  const AMAP_CITY = { chengdu: "成都市", siguniang: "小金县 四川省", danba: "丹巴县 四川省", tagong: "康定市 四川省", yajiang: "雅江县 四川省",
    yading: "稻城县 四川省", meili: "德钦县 云南省", shangrila: "香格里拉市 云南省", lijiang: "丽江市 云南省", shaxi: "剑川县 云南省", dali: "大理市 云南省", kunming: "昆明市 云南省" };

  /* Photography: draft shot list from the field guide's photo plans, in the
     storyboard spec's annotation format, using only the confirmed camera kit. */
  function shotFor(tip) {
    const t = tip.toLowerCase();
    const cam = /pov|action|cycling|osmo/.test(t) ? "DJI Osmo Action 6" : "Fujifilm X-T5";
    const lens = cam !== "Fujifilm X-T5" ? "FOV Boost Lens" :
      /portrait|isolat|craft|doorway|^detail/.test(t) ? "Sirui 55mm T1.2" :
      /compress|layers|long end|tighter/.test(t) ? "Sigma 17–40mm at 40mm" : "Sigma 17–40mm at 17–24mm";
    const size = /^layer|compress/.test(t) ? "Long lens, compressed" : /^detail|texture/.test(t) ? "Close-up" :
      /foreground|wide|establishing|panorama|landscape|context|scale|relationship/.test(t) ? "Wide" :
      /portrait|people|activity|craft|performer/.test(t) ? "Medium" : "Medium wide";
    const move = /sequence|hold position/.test(t) ? "Tripod, short sequence" :
      /tripod|silky|waterfall|\bnd\b/.test(t) ? "Tripod, locked off" : "Handheld";
    const light = /sunrise/.test(t) ? "Sunrise" : /sunset|golden/.test(t) ? "Sunset" : /early or late|late afternoon/.test(t) ? "Early or late light" :
      /early/.test(t) ? "Early light" : /night|evening/.test(t) ? "Evening" : /silky|waterfall/.test(t) ? "ND filter (1–5 stops)" : "As found";
    return { cam, lens, size, move, light };
  }
  function photoBlock(d) {
    const all = d.places.flatMap((p) => (PLACES[p].photo || []).map((tip) => ({ place: PLACES[p].name, tip })));
    const isNote = (t) => /^(don't|do not|check|ask|record|avoid|follow|keep|plan|stay|secure|photograph .* only|stay long)/i.test(t);
    const shots = all.filter((x) => !isNote(x.tip)), notes = all.filter((x) => isNote(x.tip));
    const boards = STORYBOARDS[d.id] || [];
    const kit = GEAR.flatMap(([, items]) => items);
    return `
      <h3>Storyboard</h3>
      ${boards.length ? `<div class="boards">${boards.map((b) => `<figure class="board"><img src="${esc(b.src)}" alt="${esc(b.title || "Storyboard")}" loading="lazy"><figcaption class="meta">${esc(b.title || "")}</figcaption></figure>`).join("")}</div>`
        : `<div class="board-slot"><span class="label">4:3 storyboard</span><p class="meta">No board for this stop yet. The planning files had no China storyboard images; add them to <code>storyboards.js</code> and they'll appear here.</p></div>`}
      ${shots.length ? `<h3 class="shots-title">Draft shot list</h3>
        <p class="meta">From the field guide's photo plans, in the storyboard spec's format. Camera notes use only your confirmed kit and are suggestions.</p>
        <ol class="shots">${shots.map(({ place, tip }, i) => { const s = shotFor(tip); return `<li>
          <p class="label">Shot ${i + 1} · ${esc(place)}</p>
          <p class="shot-action">${esc(tip)}</p>
          <dl class="shot-spec"><div><dt>Cam</dt><dd>${esc(s.cam)}</dd></div><div><dt>Lens</dt><dd>${esc(s.lens)}</dd></div><div><dt>Size</dt><dd>${esc(s.size)}</dd></div><div><dt>Move</dt><dd>${esc(s.move)}</dd></div><div><dt>Light</dt><dd>${esc(s.light)}</dd></div></dl>
        </li>`; }).join("")}</ol>` : `<p class="meta">No photo plan for this stop in the field guide yet.</p>`}
      ${notes.length ? `<h3 class="shots-title">Shooting notes</h3><ul class="bullets">${notes.map(({ place, tip }) => `<li>${esc(tip)} <span class="meta-inline">${esc(place)}</span></li>`).join("")}</ul>` : ""}
      <h3 class="shots-title">On the ground</h3>
      ${ul(FIELD[0][1])}`;
  }

  function destDetail(id, openPlace) {
    const d = DEST[id], lead = d.lead && PLACES[d.lead], nights = destNights(d);
    const idx = DESTS.indexOf(d), prev = DESTS[idx - 1], next = DESTS[idx + 1];
    const arrival = DAY[d.days.find((x) => DAY[x].stay === d.stay) || d.days[0]];
    const alt = ELEV[nights[0] || d.days[0]];
    const sources = [...new Map(d.places.flatMap((p) => PLACES[p].sources || []).map((s) => [s[1], s])).values()];
    const role = (x) => d.stay && DAY[x].stay !== d.stay ? "Leaving" : x === arrival.date && prev ? "Arriving" : "";
    const plateau = ["tagong", "yajiang", "yading", "meili", "shangrila", "siguniang"].includes(d.id);
    const ph = PHOTOS["dest-" + d.id];
    const hasDistances = d.places.some((p) => distanceLabel(p, d)?.mode === "walk" || distanceLabel(p, d)?.mode === "car");
    return `<div class="d-hero">${cover("dest-" + d.id, d.zh, d.region)}
        <a class="d-back" href="${lastView()}" aria-label="Back">${icon("chevron-left")}</a>
        ${ph ? `<a class="d-credit" href="${esc(ph.page)}" target="_blank" rel="noopener">${esc(ph.credit)}</a>` : ""}
      </div>
      <div class="d-sheet">
        <header class="d-head">
          <p class="label">${regionName(d.region)} · ${idx === 0 ? "First stop" : idx === DESTS.length - 1 ? "Last stop" : `Stop ${idx + 1}`}</p>
          <h1 class="d-title">${esc(d.name)}</h1>
          <p class="d-zh" lang="zh">${esc(d.zh)}</p>
          <dl class="facts">
            <div><dt>Dates</dt><dd>${esc(dateRange(d.days))}</dd></div>
            <div><dt>Nights</dt><dd>${nights.length || "–"}</dd></div>
            <div><dt>Altitude</dt><dd>~${alt ? alt.m.toLocaleString() : "–"} m</dd></div>
            <div><dt>Places</dt><dd>${d.places.length || "–"}</dd></div>
          </dl>
        </header>

        <nav class="jump" aria-label="On this page">
          <a href="#j-about">About</a><a href="#j-days">Days</a>${d.places.length ? `<a href="#j-places">Places</a>` : ""}<a href="#j-photo">Photo</a><a href="#j-stay">Stay</a><a href="#j-food">Food</a>
        </nav>

        ${section("j-about", "About", `
          <p class="lead">${esc(d.intro || lead?.about || "")}</p>
          ${lead && d.intro && lead.about !== d.intro ? para(lead.about) : ""}
          ${lead?.history ? `<h4>History & context</h4>${para(lead.history)}` : ""}
          ${lead?.todo ? `<h4>What to do</h4>${ul(lead.todo)}` : ""}`)}

        ${section("j-getting", "Getting here", `
          <p>${prev ? `From ${esc(prev.name)}, ${dowLong(arrival.date)} ${dayNum(arrival.date)} November.` : "Arrival in China."}</p>
          <ol class="stepper">${arrival.route.map((s) => `<li class="${s.endsWith("?") ? "uncertain" : ""}"><span>${esc(clean(s))}</span></li>`).join("")}</ol>
          ${plateau ? `<p class="meta note">${icon("mountain")}${esc(PRACTICAL[0][1])}</p>` : ""}
          <p class="meta note">${icon("clock")}Departure times, stops and detours aren't in the itinerary. Confirm them with the driver or guide.</p>`)}

        ${section("j-days", "The days here", d.days.map((x) => dayBlock(DAY[x], { role: role(x) })).join(""))}

        ${d.places.length ? section("j-places", "Places to visit",
          `<ul class="places">${d.places.map((p) => placeItem(p, d, p === openPlace)).join("")}</ul>`,
          hasDistances ? "Distances are straight-line estimates from where you sleep. Open Amap for the real route." : "") : ""}

        ${section("j-photo", "Photography", photoBlock(d))}

        ${section("j-stay", "Where you sleep", stayBlock(d))}

        ${section("j-food", "Food", foodBlock(d, lead))}

        ${section("j-care", "Care & cautions", ul(lead?.care))}
        ${section("j-sources", "Sources", sources.length ? `<p class="links">${sources.map(([n, u]) => extLink(u, n)).join("")}</p>` : "")}
        <p class="meta foot-note">Place notes from the location field guide v1.4. Dates and hotels from the itinerary and booking vouchers.</p>

        <nav class="d-pager" aria-label="Other stops">
          ${prev ? `<a href="#dest-${prev.id}">${icon("chevron-left")}<span><span class="label">Previous</span>${esc(prev.name)}</span></a>` : "<span></span>"}
          ${next ? `<a class="nx" href="#dest-${next.id}"><span><span class="label">Next</span>${esc(next.name)}</span>${icon("chevron-right")}</a>` : ""}
        </nav>
      </div>`;
  }

  // Highlight the jump-bar link for the section being read.
  function spyJump(det) {
    const links = $$(".jump a", det);
    if (!links.length) return;
    const secs = links.map((l) => $(l.getAttribute("href"), det)).filter(Boolean);
    const set = (id) => links.forEach((l) => l.classList.toggle("on", l.getAttribute("href") === "#" + id));
    const update = () => {
      const line = det.getBoundingClientRect().top + 120;
      let cur = secs[0];
      for (const sec of secs) if (sec.getBoundingClientRect().top <= line) cur = sec;
      if (det.scrollTop + det.clientHeight >= det.scrollHeight - 4) cur = secs.at(-1);
      set(cur.id);
      const on = $(".jump a.on", det), bar = $(".jump", det);
      if (on && bar) { const l = on.offsetLeft - bar.offsetLeft, r = l + on.offsetWidth;
        if (l < bar.scrollLeft + 16) bar.scrollLeft = l - 16; else if (r > bar.scrollLeft + bar.clientWidth - 16) bar.scrollLeft = r - bar.clientWidth + 16; }
    };
    let raf = 0;
    det.onscroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
    update();
  }

  function voucherView(id) {
    const d = DEST[id], s = STAYS[d.stay];
    const pages = Array.from({ length: d.voucher }, (_, k) => `vouchers/${d.stay}-${k + 1}.jpg`);
    return `<div class="v-bar">
        <a class="d-back static" href="#dest-${id}" aria-label="Back">${icon("chevron-left")}</a>
        <span><small>Booking voucher</small><b>${esc(s.name)}</b></span>
      </div>
      <p class="v-note">${icon("shield-alert")}<span>Contains booking numbers and PINs. Show it at check-in; don't share screenshots.</span></p>
      <div class="v-pages">${pages.map((src, k) => `${d.voucherLabels?.[k] ? `<p class="v-label">${esc(d.voucherLabels[k])}</p>` : ""}<img src="${src}" alt="Voucher page ${k + 1}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('p'),{className:'empty',textContent:'Voucher image not available in this copy. Vouchers are kept out of the repository for privacy.'}))">`).join("")}</div>`;
  }

  /* =====================================================================
     Routing
     ===================================================================== */
  const VIEWS = ["itinerary", "timeline", "guide"];
  let view = "itinerary", booted = false, lastCard = null;
  const lastView = () => "#" + view;
  const scrollMemo = {};

  function setView(v) {
    view = v;
    VIEWS.forEach((n) => $(`#v-${n}`).classList.toggle("on", n === v));
    $$(".tabbar a").forEach((a) => a.toggleAttribute("aria-current", a.dataset.view === v));
    document.documentElement.dataset.view = v;
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
        spyJump(det);
      } else {
        const wasDetail = !det.hidden;
        det.hidden = true; det.innerHTML = "";
        document.body.classList.remove("has-detail");
        const v = VIEWS.includes(h) ? h : view, changed = v !== view;
        setView(v);
        window.scrollTo(0, changed ? 0 : wasDetail ? scrollMemo[v] || 0 : window.scrollY);
        if (v === "timeline" && changed) {
          const target = $(".tl-stop.now") || $(".tl-stop.next") || $$(".tl-stop.done").at(-1);
          if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "center", behavior: reduceMotion ? "instant" : "smooth" }));
        }
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
  renderTimeline();
  renderGuide();
  setView(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "itinerary");
  route();
  booted = true;
})();
