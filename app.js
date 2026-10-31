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
  const short = (d) => `${dow(d.date)} ${dayNum(d.date)} Nov`;
  const clean = (s) => String(s).replace(/\?$/, "");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================================
     Time — China time, estimated position (no GPS)
     ?date=2026-11-13&time=14:30 previews any moment.
     ===================================================================== */
  const qs = new URLSearchParams(location.search);
  const nowParts = (() => {
    const f = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
    let date = `${p.year}-${p.month}-${p.day}`, hour = (+p.hour % 24) + +p.minute / 60;
    if (/^\d{4}-\d{2}-\d{2}$/.test(qs.get("date") || "")) date = qs.get("date");
    if (/^\d{1,2}:\d{2}$/.test(qs.get("time") || "")) { const [h, m] = qs.get("time").split(":").map(Number); hour = h + m / 60; }
    return { date, hour };
  })();
  const todayIdx = DAYS.findIndex((d) => d.date === nowParts.date);
  const FIRST = DAYS[0].date, LAST = DAYS[DAYS.length - 1].date;
  const phase = nowParts.date < FIRST ? "before" : nowParts.date > LAST ? "after" : "during";

  // Where are we, roughly? Travel spreads evenly over the stops between 08:00 and 19:00.
  function whereNow() {
    if (phase !== "during") return null;
    const d = DAYS[todayIdx], stops = d.route.map(clean), h = nowParts.hour;
    const n = stops.length;
    if (n === 1 || h >= 19) return { day: d, f: 1, segment: n - 1, label: h >= 19 ? `Evening in ${stops[n - 1]}` : `In ${stops[0]}` };
    if (h < 8) return { day: d, f: 0, segment: 0, label: `Morning in ${stops[0]}, about to set off` };
    const f = (h - 8) / 11, pos = f * (n - 1), k = Math.floor(pos), t = pos - k;
    const label = t < 0.25 ? `Around ${stops[k]}` : t > 0.75 ? `Approaching ${stops[k + 1]}` : `Between ${stops[k]} and ${stops[k + 1]}`;
    return { day: d, f, segment: pos, label };
  }

  function tripProgress() {
    const start = parse(FIRST).getTime() + 14 * 36e5, end = parse(LAST).getTime() + 15 * 36e5;
    const now = parse(nowParts.date).getTime() + nowParts.hour * 36e5;
    return Math.max(0, Math.min(1, (now - start) / (end - start)));
  }

  /* =====================================================================
     Cards: places and stays as one catalogue
     ===================================================================== */
  const CATS = {
    mountains: { label: "Mountains & lakes", icon: "mountain-snow" },
    sacred: { label: "Monasteries", icon: "landmark" },
    towns: { label: "Villages & towns", icon: "house" },
    stops: { label: "Route stops", icon: "signpost" },
    stays: { label: "Stays", icon: "bed-double" },
  };
  const KIND_CAT = (k) =>
    /monastery|temple|grotto/i.test(k) ? "sacred" :
    /route stop|plateau stop/i.test(k) ? "stops" :
    /village|town|tower/i.test(k) ? "towns" : "mountains";
  const ART_KIND = { erhai: "lake", pearl: "lake", milkLake: "lake", napa: "lake", blackDragon: "lake", blueMoon: "lake",
    tagongGrass: "plateau", luorong: "plateau", litang: "plateau", dujiangyan: "city", wolong: "village" };
  const AREA = {
    dujiangyan: "Dujiangyan, Sichuan", wolong: "Wenchuan, Sichuan", siguniang: "Xiaojin, Sichuan", shuangqiao: "Xiaojin, Sichuan",
    danba: "Danba, Sichuan", jiaju: "Danba, Sichuan", zhonglu: "Danba, Sichuan", suopo: "Danba, Sichuan",
    tagongGrass: "Kangding, Sichuan", tagongMonastery: "Kangding, Sichuan", gunong: "On the road to Yajiang", muya: "On the road to Yajiang",
    heishicheng: "Yajiang, Sichuan", litang: "Litang, Sichuan", changqing: "Litang, Sichuan",
    yading: "Daocheng, Sichuan", chonggu: "Daocheng, Sichuan", pearl: "Daocheng, Sichuan", luorong: "Daocheng, Sichuan", milkLake: "Daocheng, Sichuan",
    meili: "Deqin, Yunnan", feilai: "Deqin, Yunnan", dukezong: "Shangri-La, Yunnan", songzanlin: "Shangri-La, Yunnan", napa: "Shangri-La, Yunnan",
    jadeDragon: "Lijiang, Yunnan", blackDragon: "Lijiang, Yunnan", wangu: "Lijiang, Yunnan", baisha: "Lijiang, Yunnan", lijiangOld: "Lijiang, Yunnan",
    shuhe: "Lijiang, Yunnan", blueMoon: "Lijiang, Yunnan", shaxi: "Jianchuan, Yunnan", shibaoshan: "Jianchuan, Yunnan",
    erhai: "Dali, Yunnan", xizhou: "Dali, Yunnan", zhoucheng: "Dali, Yunnan", daliOld: "Dali, Yunnan",
  };
  const STATUS_ICON = { planned: "circle-check", unconfirmed: "triangle-alert", optional: "signpost" };

  const ITEMS = [];
  DAYS.forEach((d, di) => (DAY_PLACES[d.date] || []).forEach((id) => {
    const p = PLACES[id];
    ITEMS.push({ type: "place", id, key: `place-${id}`, title: p.name, zh: p.zh, cat: KIND_CAT(p.kind), eyebrow: p.kind,
      area: AREA[id] || "", dayIdx: di, region: d.region, status: p.status, art: ART_KIND[id] || null });
  }));
  // Stays grouped by consecutive nights.
  const STAY_GROUPS = [];
  DAYS.forEach((d, di) => {
    if (!d.stay) return;
    const last = STAY_GROUPS[STAY_GROUPS.length - 1];
    if (last && last.key === d.stay) last.nights.push(di); else STAY_GROUPS.push({ key: d.stay, nights: [di] });
  });
  STAY_GROUPS.forEach((g) => {
    const s = STAYS[g.key], d = DAYS[g.nights[0]];
    ITEMS.push({ type: "stay", id: g.key, key: `stay-${g.key}`, title: s.name, cat: "stays", eyebrow: "Stay",
      area: `${clean(ELEV[d.date].town)}, ${d.region === "yunnan" ? "Yunnan" : "Sichuan"}`, dayIdx: g.nights[0], nights: g.nights, region: d.region });
  });

  function media(item) {
    const ph = PHOTOS[item.type === "stay" ? `stay-${item.id}` : item.id];
    if (ph) return `<img src="${esc(ph.src)}" alt="" loading="lazy" decoding="async">`;
    const d = DAYS[item.dayIdx];
    const kind = item.art || (item.cat === "mountains" ? "peaks" : item.cat === "towns" ? "village" : item.cat === "stays" ? SCENE[d.date] : "plateau");
    return sceneArt(item.key, kind, { flags: item.cat === "sacred" || (FLAGS_DAYS.has(d.date) && kind === "plateau") });
  }

  function cardFoot(item) {
    if (item.type === "stay") {
      const n = item.nights.length, s = STAYS[item.id];
      return `${icon("moon")}<span>${n} night${n > 1 ? "s" : ""}${s.meals ? ` · ${esc(s.meals.replace(/ \(.*\)/, ""))}` : ""}</span>`;
    }
    return `${icon(STATUS_ICON[item.status])}<span>${esc(PLACE_STATUS[item.status])}</span>`;
  }

  function card(item, size = "") {
    const d = DAYS[item.dayIdx];
    const when = item.type === "stay"
      ? (item.nights.length > 1 ? `${dayNum(d.date)}–${dayNum(DAYS[item.nights.at(-1)].date)} Nov` : `Night of ${short(d)}`)
      : `${short(d)} · ${d.label}`;
    return `<a class="card ${size} ${item.region} st-${item.status || "stay"}" href="#${item.key}" data-key="${item.key}">
      <span class="card-media">${media(item)}</span>
      <span class="card-panel">
        <span class="eyebrow">${esc(item.eyebrow)}</span>
        <span class="card-title">${esc(item.title)}</span>
        ${item.zh ? `<span class="card-zh" lang="zh">${esc(clean(item.zh))}</span>` : ""}
        <span class="meta">
          ${item.area ? `<span>${icon("map-pin")}${esc(item.area)}</span>` : ""}
          <span>${icon("calendar-days")}${esc(when)}</span>
        </span>
        <span class="card-foot">${cardFoot(item)}${avatars(crewOn(d.date))}</span>
      </span>
    </a>`;
  }

  /* =====================================================================
     Crew
     ===================================================================== */
  const crewOn = (date) => CREW.filter((c) => !c.until || c.until >= date);
  const crewIdx = (c) => CREW.indexOf(c);
  const avatar = (c, size = "") => `<span class="av av${crewIdx(c)} ${size}" title="${esc(c.name)}">${esc(c.name[0])}</span>`;
  const avatars = (list, size = "") => `<span class="avs">${list.map((c) => avatar(c, size)).join("")}</span>`;
  const names = (list) => list.length === CREW.length ? "The whole crew" : list.map((c) => c.name).join(", ").replace(/, ([^,]*)$/, " & $1");
  function crewBlock(date) {
    const on = crewOn(date), leaving = CREW.filter((c) => c.until === date);
    return `<div class="crew">
      ${avatars(on, "lg")}
      <span><b>${esc(names(on))}</b>${leaving.length ? `<small>${leaving.map((c) => `${esc(c.name)} flies out today`).join(" · ")}</small>` : `<small>${on.map((c) => esc(c.name)).join(" · ")}</small>`}</span>
    </div>`;
  }

  /* =====================================================================
     TODAY
     ===================================================================== */
  function renderToday() {
    const el = $("#v-today .content");
    const prog = tripProgress(), where = whereNow();
    let title, lede, focusDay;
    if (phase === "before") {
      const n = Math.round((parse(FIRST) - parse(nowParts.date)) / 864e5);
      title = n === 1 ? "Tomorrow" : `${n} days to go`;
      lede = "Fourteen nights from Chengdu over the Kham highlands to Meili, Shangri-La and the Tea Horse Road. Here's how it starts.";
      focusDay = 0;
    } else if (phase === "after") {
      title = "Journey complete"; lede = "Fourteen nights, from the Sichuan basin to Erhai Lake. Everything's still here to look back on."; focusDay = DAYS.length - 1;
    } else {
      const d = DAYS[todayIdx];
      title = "Today"; lede = `${dowLong(d.date)} ${dayNum(d.date)} November. ${d.summary}`; focusDay = todayIdx;
    }
    const d = DAYS[focusDay];
    const items = ITEMS.filter((it) => it.type === "place" && it.dayIdx === focusDay);
    const stay = ITEMS.find((it) => it.type === "stay" && it.nights.includes(focusDay));

    el.innerHTML = `
      <h1 class="display">${esc(title)}</h1>
      <p class="lede">${esc(lede)}</p>

      <a class="progress-card ${d.region}" href="#route">
        <span class="pc-top"><span class="eyebrow">${phase === "during" ? `${esc(d.label)} · ${short(d)}` : phase === "before" ? "Starts Friday 6 November" : "6 – 20 November 2026"}</span>${icon("chevron-right")}</span>
        <span class="pc-where">${icon(phase === "during" ? "locate-fixed" : "route")}<b>${esc(where ? where.label : phase === "before" ? "Chengdu, Sichuan" : "Kunming, Yunnan")}</b></span>
        <span class="bar"><i style="width:${(prog * 100).toFixed(1)}%"></i></span>
        <span class="pc-foot"><span>${Math.round(prog * 100)}% of the journey</span><span>See the route</span></span>
      </a>
      ${where ? `<p class="fine">${icon("info")}Estimated from the date and time in China, not GPS.</p>` : ""}
      ${crewBlock(d.date)}

      ${d.flags ? `<a class="notice" href="#day-${d.date}">${icon("triangle-alert")}<span><b>To confirm.</b> ${esc(d.flags[0])}</span></a>` : ""}

      ${items.length ? `<h2 class="section-title">${phase === "during" ? "Places today" : phase === "before" ? "First stops" : "Last stops"}</h2>
        <div class="cards">${items.map((it) => card(it)).join("")}</div>` : ""}
      ${stay ? `<h2 class="section-title">${phase === "during" ? "Tonight" : "Where you'll sleep first"}</h2><div class="cards">${card(stay)}</div>` :
        `<h2 class="section-title">Tonight</h2><p class="empty">${icon("bed-double")}No hotel on file for this night. Add the onward plan once it's confirmed.</p>`}
      <a class="text-link" href="#day-${d.date}">Open ${esc(d.label.toLowerCase())} in full ${icon("arrow-up-right")}</a>
    `;
  }

  /* =====================================================================
     ROUTE — the itinerary with progress
     ===================================================================== */
  function renderRoute() {
    const el = $("#v-route .content");
    const prog = tripProgress(), where = whereNow();
    el.innerHTML = `
      <h1 class="display">Route</h1>
      <p class="lede">Chengdu to Kunming in ${DAYS.length} days. Your position is estimated from the date and time in China.</p>
      <div class="route-progress">
        <span class="bar"><i style="width:${(prog * 100).toFixed(1)}%"></i></span>
        <span class="rp-foot"><span>Chengdu</span><span>${Math.round(prog * 100)}% travelled</span><span>Kunming</span></span>
      </div>
      <figure class="profile">
        <div class="profile-scroll"><svg id="profile" role="group" aria-label="Altitude of each night's stay"></svg></div>
        <figcaption>Altitude where you sleep each night, in metres. Approximate, from general references.</figcaption>
      </figure>
      <ol class="itinerary">${DAYS.map((d, i) => routeRow(d, i, where)).join("")}</ol>
    `;
    renderProfile();
  }

  function routeRow(d, i, where) {
    const state = phase === "after" || (phase === "during" && i < todayIdx) ? "past" : i === todayIdx ? "now" : "next";
    const stops = d.route.map(clean);
    const st = STAYS[d.stay];
    let stopsHtml = `<ol class="stops">${stops.map((s, k) => {
      let cls = state === "past" ? "done" : "";
      if (state === "now" && where && k <= Math.floor(where.segment)) cls = "done";
      return `<li class="${cls} ${d.route[k].endsWith("?") ? "uncertain" : ""}">${esc(s)}</li>`;
    }).join("")}</ol>`;
    if (state === "now" && where) {
      const pct = stops.length > 1 ? (where.segment / (stops.length - 1)) * 100 : 100;
      stopsHtml = `<span class="live"><span class="live-bar"><i style="width:${pct.toFixed(1)}%"></i><b style="left:${pct.toFixed(1)}%"></b></span>
        <span class="live-label">${icon("locate-fixed")}${esc(where.label)}</span></span>` + stopsHtml;
    }
    return `<li class="row ${state} ${d.region}">
      <a href="#day-${d.date}" class="row-link">
        <span class="row-date"><b>${dayNum(d.date)}</b><small>${dow(d.date)}</small></span>
        <span class="row-main">
          <span class="row-label">${esc(d.label)}${state === "now" ? ` · <em>Today</em>` : ""}${d.flags ? ` · <span class="warn">${icon("triangle-alert")}To confirm</span>` : ""}</span>
          <span class="row-title">${esc(d.title)}</span>
          ${stopsHtml}
          ${st ? `<span class="row-stay">${icon("bed-double")}${esc(st.name)}</span>` : ""}
        </span>
        <span class="row-thumb">${sceneArt(d.date, SCENE[d.date], { flags: FLAGS_DAYS.has(d.date) })}</span>
      </a>
    </li>`;
  }

  function renderProfile() {
    const svg = $("#profile"); if (!svg) return;
    const W = 560, H = 170, padL = 30, padR = 12, top = 22, bottom = 34;
    const x = (i) => padL + (i * (W - padL - padR)) / (DAYS.length - 1);
    const y = (m) => top + (1 - m / 5000) * (H - top - bottom);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    let out = "";
    for (const g of [1000, 2000, 3000, 4000]) out += `<line class="pf-grid" x1="${padL}" x2="${W - padR}" y1="${y(g)}" y2="${y(g)}"/><text class="pf-gl" x="${padL - 6}" y="${y(g) + 3}" text-anchor="end">${g / 1000}k</text>`;
    const pts = DAYS.map((d, i) => [x(i), y(ELEV[d.date].m)]);
    const path = pts.map((pt, i) => (i ? "L" : "M") + pt[0].toFixed(1) + " " + pt[1].toFixed(1)).join(" ");
    out += `<path class="pf-area" d="${path} L${x(DAYS.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z"/><path class="pf-line" d="${path}"/>`;
    DAYS.forEach((d, i) => {
      const e = ELEV[d.date];
      if (e.high) out += `<line class="pf-peak" x1="${x(i)}" x2="${x(i)}" y1="${y(e.m)}" y2="${y(e.high)}"/><text class="pf-pl" x="${x(i)}" y="${y(e.high) - 5}" text-anchor="middle">${e.high.toLocaleString()}</text>`;
      out += `<a href="#day-${d.date}" aria-label="${short(d)}, ${esc(clean(e.town))}, about ${e.m.toLocaleString()} metres"><circle class="pf-dot ${i === todayIdx ? "now" : ""}" cx="${x(i)}" cy="${y(e.m)}" r="${i === todayIdx ? 6 : 4}"/>
        <text class="pf-day" x="${x(i)}" y="${H - bottom + 16}" text-anchor="middle">${dayNum(d.date)}</text></a>`;
    });
    svg.innerHTML = out;
  }

  /* =====================================================================
     PLACES — catalogue with filters
     ===================================================================== */
  let filter = "all";
  function renderPlaces() {
    const el = $("#v-places .content");
    const counts = Object.fromEntries(Object.keys(CATS).map((c) => [c, ITEMS.filter((it) => it.cat === c).length]));
    el.innerHTML = `
      <h1 class="display">Places</h1>
      <p class="lede">Every stop on the route and every place you'll sleep. Tap a card for the full guide.</p>
      <div class="chips" role="radiogroup" aria-label="Filter places">
        <button role="radio" aria-checked="true" data-filter="all">All <span>${ITEMS.length}</span></button>
        ${Object.entries(CATS).map(([k, c]) => `<button role="radio" aria-checked="false" data-filter="${k}">${icon(c.icon)}${c.label} <span>${counts[k]}</span></button>`).join("")}
      </div>
      <div class="cards grid" id="placeCards"></div>
    `;
    $(".chips", el).addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]"); if (!b) return;
      filter = b.dataset.filter; drawPlaceCards();
      b.scrollIntoView({ inline: "center", block: "nearest", behavior: reduceMotion ? "instant" : "smooth" });
    });
    drawPlaceCards();
  }
  function drawPlaceCards() {
    $$("#v-places .chips button").forEach((b) => b.setAttribute("aria-checked", b.dataset.filter === filter));
    const list = ITEMS.filter((it) => filter === "all" || it.cat === filter).sort((a, b) => a.dayIdx - b.dayIdx || (a.type === "stay") - (b.type === "stay"));
    $("#placeCards").innerHTML = list.map((it) => card(it)).join("");
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
      <p class="lede">How to travel, look and photograph on this route.</p>
      <h2 class="section-title">The crew</h2>
      <ul class="crew-list">${CREW.map((c) => `<li>${avatar(c, "lg")}<span><b>${esc(c.name)}</b><small>${esc(c.leaves || "6 – 20 November, the whole way")}</small></span></li>`).join("")}</ul>
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
        <p>${icon("camera")}<span>Card images are generated landscape illustrations until real photos are added. Icons by Lucide (ISC licence).</span></p>
      </footer>
    `;
    const update = () => { $("#gearProgress").textContent = `${Object.values(state).filter(Boolean).length} of ${total} packed`; };
    el.addEventListener("change", (e) => {
      const cb = e.target.closest("input[data-item]"); if (!cb) return;
      state[cb.dataset.item] = cb.checked; try { localStorage.setItem(GEAR_KEY, JSON.stringify(state)); } catch {} update();
    });
    $("#gearReset").addEventListener("click", () => { state = {}; try { localStorage.removeItem(GEAR_KEY); } catch {} $$("input[data-item]", el).forEach((c) => (c.checked = false)); update(); });
    update();
  }

  /* =====================================================================
     DETAIL — the expanded card (place, stay or day)
     ===================================================================== */
  const sec = (title, ic, body) => body ? `<section class="dsec"><h3>${icon(ic)}${title}</h3>${body}</section>` : "";
  const ul = (a) => a && a.length ? `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
  const para = (t) => t ? `<p>${esc(t)}</p>` : "";

  function hero(item) {
    const ph = PHOTOS[item.type === "stay" ? `stay-${item.id}` : item.id];
    return `<div class="d-hero">${media(item)}
      <a class="d-back" href="${lastView()}" aria-label="Back">${icon("chevron-left")}</a>
      ${ph ? `<span class="d-credit">${esc(ph.credit)}</span>` : ""}</div>`;
  }

  function placeDetail(id) {
    const P = PLACES[id], item = ITEMS.find((it) => it.key === `place-${id}`), d = DAYS[item.dayIdx];
    return `${hero(item)}
    <div class="d-sheet">
      <p class="eyebrow">${esc(P.kind)}</p>
      <h1 class="d-title">${esc(P.name)}</h1>
      ${P.zh ? `<p class="d-zh" lang="zh">${esc(clean(P.zh))}</p>` : ""}
      <ul class="d-meta">
        ${item.area ? `<li>${icon("map-pin")}<span>${esc(item.area)}</span></li>` : ""}
        <li>${icon("calendar-days")}<a href="#day-${d.date}">${short(d)} · ${esc(d.label)}</a></li>
        <li class="st-${P.status}">${icon(STATUS_ICON[P.status])}<span>${esc(PLACE_STATUS[P.status])}</span></li>
      </ul>
      <div class="d-actions">
        ${P.map ? `<a class="btn primary" href="${esc(P.map)}" target="_blank" rel="noopener">${icon("navigation")}Search in Amap</a>` : ""}
        ${P.zh ? `<button class="btn" type="button" data-copy="${esc(clean(P.zh).split(" · ")[0])}" data-copy-label="Chinese name copied">${icon("copy")}Copy Chinese name</button>` : ""}
      </div>
      <p class="d-about">${esc(P.about)}</p>
      ${sec("History & context", "history", para(P.history))}
      ${sec("What to look for", "eye", ul(P.look))}
      ${sec("What to do", "footprints", ul(P.todo))}
      ${sec("Photography", "camera", ul(P.photo))}
      ${sec("Food to look for", "utensils", para(P.food))}
      ${sec("Restaurant leads", "coffee", P.eat ? `<p class="fine">Leads, not reservations. Check the Chinese name and that it's open on the day.</p><ul class="leads">${P.eat.map(([n, t, u]) =>
        `<li><b>${esc(n)}</b><span>${esc(t)}</span>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">Listing ${icon("external-link")}</a>` : ""}</li>`).join("")}</ul>` : "")}
      ${sec("Care & cautions", "shield-alert", ul(P.care))}
      ${sec("Sources", "book-open", P.sources ? `<ul class="links">${P.sources.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ${icon("external-link")}</a></li>`).join("")}</ul>` : "")}
      <p class="fine">From the location field guide v1.4. Amap links are keyword searches; check you've picked the right result.</p>
    </div>`;
  }

  function stayPanel(key) {
    const s = STAYS[key];
    const facts = [["clock", "Check-in", s.checkin], ["clock", "Check-out", s.checkout], ["utensils", "Meals", s.meals], ["calendar-days", "Booked", s.dates]].filter((f) => f[2]);
    return `<ul class="d-meta">
        <li>${icon("map-pin")}<span>${esc(s.address)}</span></li>
        ${facts.map(([ic, k, v]) => `<li>${icon(ic)}<span><b>${k}</b> ${esc(v)}</span></li>`).join("")}
        ${s.phone ? `<li>${icon("phone")}<a href="tel:${esc(s.phone.replace(/[^\d+]/g, ""))}">${esc(s.phone)}</a></li>` : ""}
      </ul>
      <div class="d-actions">
        <a class="btn primary" href="${esc(s.map)}" target="_blank" rel="noopener">${icon("navigation")}Find in Amap</a>
        <button class="btn" type="button" data-copy="${esc(s.address)}" data-copy-label="Address copied">${icon("copy")}Copy address</button>
      </div>
      ${s.note ? `<p class="d-note">${icon("info")}<span>${esc(s.note)}</span></p>` : ""}
      ${s.nearby ? `<section class="dsec"><h3>${icon("compass")}Nearby</h3><ul class="nearby">${s.nearby.map(([n, u, dist]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}${dist ? ` <small>${esc(dist)}</small>` : ""}</a></li>`).join("")}</ul><p class="fine">Amap keyword searches, not pins.</p></section>` : ""}`;
  }

  function stayDetail(key) {
    const item = ITEMS.find((it) => it.key === `stay-${key}`), s = STAYS[key];
    return `${hero(item)}
    <div class="d-sheet">
      <p class="eyebrow">Stay · ${item.nights.length} night${item.nights.length > 1 ? "s" : ""}</p>
      <h1 class="d-title">${esc(s.name)}</h1>
      ${s.sub ? `<p class="d-zh">${esc(s.sub)}</p>` : ""}
      ${stayPanel(key)}
      <section class="dsec"><h3>${icon("calendar-days")}Nights</h3><ul class="links">${item.nights.map((i) => `<li><a href="#day-${DAYS[i].date}">${short(DAYS[i])} · ${esc(DAYS[i].title)}</a></li>`).join("")}</ul></section>
      <p class="fine">From the booking vouchers. The illustration shows the area, not the hotel.</p>
    </div>`;
  }

  function dayDetail(date) {
    const i = DAYS.findIndex((d) => d.date === date), d = DAYS[i];
    const items = ITEMS.filter((it) => it.type === "place" && it.dayIdx === i);
    const stay = ITEMS.find((it) => it.type === "stay" && it.nights.includes(i));
    const e = ELEV[d.date], prev = DAYS[i - 1], next = DAYS[i + 1];
    return `<div class="d-hero">${sceneArt(d.date, SCENE[d.date], { flags: FLAGS_DAYS.has(d.date) })}
      <a class="d-back" href="${lastView()}" aria-label="Back">${icon("chevron-left")}</a></div>
    <div class="d-sheet">
      <p class="eyebrow">${esc(d.label)} · ${dowLong(d.date)} ${dayNum(d.date)} November${i === todayIdx ? " · Today" : ""}</p>
      <h1 class="d-title">${esc(d.title)}</h1>
      <ol class="stops big">${d.route.map((r) => `<li class="${r.endsWith("?") ? "uncertain" : ""}">${esc(clean(r))}</li>`).join("")}</ol>
      <ul class="d-meta">
        <li>${icon("mountain")}<span>${esc(d.altitude || `Sleep around ${e.m.toLocaleString()} m in ${clean(e.town)}`)}</span></li>
        <li>${icon("map-pin")}<span>${d.region === "yunnan" ? "Yunnan" : "Sichuan"}</span></li>
      </ul>
      ${crewBlock(d.date)}
      ${d.flags ? `<div class="notice static">${icon("triangle-alert")}<span><b>Needs confirmation.</b> ${d.flags.map(esc).join(" ")}</span></div>` : ""}
      <p class="d-about">${esc(d.summary)}</p>
      ${sec("Focus", "eye", para(d.focus))}
      ${d.options ? sec("Options", "route", `<ul class="opts">${d.options.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("")}</ul>`) : ""}
      ${sec("Notes", "info", ul(d.notes))}
      ${items.length ? `<h2 class="section-title">Places</h2><div class="cards rail">${items.map((it) => card(it, "small")).join("")}</div>` : ""}
      <h2 class="section-title">Tonight</h2>
      ${stay ? `<div class="cards">${card(stay)}</div>` : `<p class="empty">${icon("bed-double")}No booking on file. The expedition ends in Kunming; add the onward plan once it's confirmed.</p>`}
      <nav class="d-pager" aria-label="Other days">
        ${prev ? `<a href="#day-${prev.date}">${icon("chevron-left")}<span><small>${short(prev)}</small>${esc(prev.title)}</span></a>` : "<span></span>"}
        ${next ? `<a class="nx" href="#day-${next.date}"><span><small>${short(next)}</small>${esc(next.title)}</span>${icon("chevron-right")}</a>` : ""}
      </nav>
    </div>`;
  }

  /* =====================================================================
     Routing — views and detail pages live in the URL hash
     ===================================================================== */
  const VIEWS = ["today", "route", "places", "guide"];
  let view = "today";
  const lastView = () => "#" + view;
  const scrollMemo = {};
  let booted = false;

  function setView(v) {
    view = v;
    VIEWS.forEach((n) => $(`#v-${n}`).classList.toggle("on", n === v));
    $$(".tabbar a").forEach((a) => a.toggleAttribute("aria-current", a.dataset.view === v));
  }

  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    const det = $("#detail");
    let html = null, region = "sichuan";
    const it = ITEMS.find((x) => x.key === h);
    if (it && it.type === "place") { html = placeDetail(it.id); region = it.region; }
    else if (it && it.type === "stay") { html = stayDetail(it.id); region = it.region; }
    else if (h.startsWith("day-") && DAYS.some((d) => d.date === h.slice(4))) { html = dayDetail(h.slice(4)); region = DAYS.find((d) => d.date === h.slice(4)).region; }

    const apply = () => {
      // Exactly one element may carry the shared "hero" name in each state.
      $$(".vt").forEach((m) => m.classList.remove("vt"));
      if (html) {
        if (det.hidden) scrollMemo[view] = window.scrollY;
        det.innerHTML = html; det.className = "detail " + region; det.hidden = false; det.scrollTop = 0;
        document.body.classList.add("has-detail");
      } else {
        const wasDetail = !det.hidden;
        det.hidden = true; det.innerHTML = "";
        document.body.classList.remove("has-detail");
        const v = VIEWS.includes(h) ? h : view;
        const changed = v !== view;
        setView(v);
        window.scrollTo(0, changed ? 0 : (wasDetail ? scrollMemo[v] || 0 : window.scrollY));
        // Closing: let the hero shrink back into the card it came from.
        const back = lastCard && $(`#v-${v} a.card[data-key="${lastCard}"] .card-media`);
        if (back) back.classList.add("vt");
      }
    };
    // Expand: the tapped card's image grows into the detail hero (where supported).
    const toggling = !!html !== !det.hidden;
    if (toggling && document.startViewTransition && !reduceMotion && booted) {
      const t = document.startViewTransition(apply);
      t.ready.catch(() => {}); t.finished.catch(() => {});
    } else apply();
  }

  // Mark the tapped card's image so the view transition morphs it into the hero.
  let lastCard = null;
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
    try { await navigator.clipboard.writeText(b.dataset.copy); }
    catch { const ta = Object.assign(document.createElement("textarea"), { value: b.dataset.copy }); document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
    toast(b.dataset.copyLabel || "Copied");
  });

  /* ---------- Icons in static markup ---------- */
  $$("[data-icon]").forEach((el) => el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)));

  /* ---------- Boot ---------- */
  renderToday();
  renderRoute();
  renderPlaces();
  renderGuide();
  setView(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "today");
  route();
  booted = true;
})();
