(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const parse = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const dayNum = (iso) => parse(iso).getUTCDate();
  const dow = (iso) => DOW[parse(iso).getUTCDay()];

  const ICON = {
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>',
  };

  // "Today" in China time. ?date=2026-11-12 overrides it for previewing.
  const override = new URLSearchParams(location.search).get("date");
  const todayISO = /^\d{4}-\d{2}-\d{2}$/.test(override || "")
    ? override
    : new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
  const todayIdx = DAYS.findIndex((d) => d.date === todayISO);

  /* ---------- Status line ---------- */
  function renderStatus() {
    document.querySelectorAll("#status, [data-status]").forEach(setStatus);
  }
  function setStatus(el) {
    const first = DAYS[0].date, last = DAYS[DAYS.length - 1].date;
    if (todayISO < first) {
      const n = Math.round((parse(first) - parse(todayISO)) / 864e5);
      el.textContent = n === 1 ? "Leaving tomorrow" : `${n} days to go`;
    } else if (todayISO > last) {
      el.textContent = "Expedition complete";
    } else {
      const d = DAYS[todayIdx];
      el.textContent = `Today: ${d.label}, ${d.title}`;
      el.classList.add("is-live");
    }
  }

  /* ---------- Altitude profile ---------- */
  function renderProfile() {
    const svg = $("#profile");
    const W = 560, H = 210, padL = 34, padR = 14, top = 28, bottom = 44;
    const max = 5000, min = 0;
    const x = (i) => padL + (i * (W - padL - padR)) / (DAYS.length - 1);
    const y = (m) => top + (1 - (m - min) / (max - min)) * (H - top - bottom);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    let out = "";
    for (const g of [1000, 2000, 3000, 4000]) {
      out += `<line class="pf-grid" x1="${padL}" x2="${W - padR}" y1="${y(g)}" y2="${y(g)}"/>`;
      out += `<text class="pf-gridlabel" x="${padL - 6}" y="${y(g) + 3}" text-anchor="end">${g / 1000}k</text>`;
    }

    // Line coloured by region: split at the Sichuan → Yunnan boundary.
    const pts = DAYS.map((d, i) => [x(i), y(ELEV[d.date].m)]);
    const split = DAYS.findIndex((d) => d.region === "yunnan");
    const path = (a) => a.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const sich = pts.slice(0, split), yun = pts.slice(split - 1);
    const area = (a, c) => `<path class="pf-area" fill="${c}" d="${path(a)} L${a[a.length - 1][0]} ${y(0)} L${a[0][0]} ${y(0)} Z"/>`;
    out += area(sich, "var(--sich)") + area(yun, "var(--yun)");
    out += `<path class="pf-line" stroke="var(--sich)" d="${path(sich)}"/>`;
    out += `<path class="pf-line" stroke="var(--yun)" d="${path(yun)}"/>`;

    DAYS.forEach((d, i) => {
      const e = ELEV[d.date];
      if (e.high) {
        out += `<line class="pf-peak" x1="${x(i)}" x2="${x(i)}" y1="${y(e.m)}" y2="${y(e.high)}"/>`;
        out += `<text class="pf-peaklabel" x="${x(i)}" y="${y(e.high) - 6}" text-anchor="middle">${esc(e.highLabel)} ${e.high.toLocaleString()} m</text>`;
      }
    });

    DAYS.forEach((d, i) => {
      const e = ELEV[d.date];
      const color = d.region === "yunnan" ? "var(--yun)" : "var(--sich)";
      const cls = ["pf-node", i === todayIdx ? "is-today" : ""].join(" ");
      out += `<g class="${cls}" tabindex="0" role="link" data-i="${i}" aria-label="${dow(d.date)} ${dayNum(d.date)} Nov, ${esc(e.town)}, about ${e.m.toLocaleString()} metres">
        <rect x="${x(i) - 14}" y="${top - 10}" width="28" height="${H - top}" fill="transparent"/>
        <circle cx="${x(i)}" cy="${y(e.m)}" r="5" fill="${color}"/>
        <text class="pf-day" x="${x(i)}" y="${H - bottom + 18}" text-anchor="middle">${dayNum(d.date)}</text>
        <text x="${x(i)}" y="${H - bottom + 31}" text-anchor="middle">${dow(d.date).slice(0, 2)}</text>
      </g>`;
    });
    svg.innerHTML = out;

    const go = (g) => goScene(+g.dataset.i + 1);
    svg.addEventListener("click", (e) => { const g = e.target.closest(".pf-node"); if (g) go(g); });
    svg.addEventListener("keydown", (e) => {
      const g = e.target.closest(".pf-node");
      if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); go(g); }
    });

    // Tooltip-ish title for pointer users.
    svg.querySelectorAll(".pf-node").forEach((g) => {
      const d = DAYS[+g.dataset.i], e = ELEV[d.date];
      const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
      t.textContent = `${e.town} · ~${e.m.toLocaleString()} m`;
      g.prepend(t);
    });

    // On phones the profile scrolls sideways; bring today into view.
    if (todayIdx > 4) {
      const sc = $(".profile-scroll");
      requestAnimationFrame(() => { sc.scrollLeft = (todayIdx / DAYS.length) * sc.scrollWidth - sc.clientWidth / 2; });
    }
  }

  /* ---------- Date strip ---------- */
  function renderStrip() {
    $("#stripInner").innerHTML = DAYS.map((d, i) => {
      const cls = ["chip", d.region, d.flags ? "has-flag" : "", i === todayIdx ? "is-today" : ""].join(" ");
      const region = d.region === "yunnan" ? "--region:var(--yun)" : "--region:var(--sich)";
      return `<a class="${cls}" style="${region}" href="#d-${d.date}" data-i="${i}" aria-label="${d.label}, ${dow(d.date)} ${dayNum(d.date)} November${d.flags ? ", needs confirmation" : ""}">
        <small>${dow(d.date)}</small><b>${dayNum(d.date)}</b><i></i></a>`;
    }).join("");
    $("#stripInner").addEventListener("click", (e) => {
      const a = e.target.closest(".chip"); if (!a) return;
      e.preventDefault(); openDay(+a.dataset.i, true);
    });
  }

  /* ---------- Day cards ---------- */
  function stayBlock(key, d) {
    if (!key) {
      return `<div class="stay"><span class="stay-label">Tonight</span><h4>No booking on file</h4><p class="stay-note">The expedition ends in Kunming. Add the onward plan here once it's confirmed.</p></div>`;
    }
    const s = STAYS[key];
    const facts = [["In", s.checkin], ["Out", s.checkout], ["Meals", s.meals]].filter((f) => f[1]);
    return `<div class="stay">
      <div><span class="stay-label">Tonight${s.dates ? ` · booked ${esc(s.dates)}` : ""}</span>
        <h4>${esc(s.name)}</h4>${s.sub ? `<div class="stay-sub">${esc(s.sub)}</div>` : ""}</div>
      <div class="stay-addr"><span>${esc(s.address)}</span>
        <button class="btn icon-btn" type="button" data-copy="${esc(s.address)}" data-copy-label="Address copied" aria-label="Copy address">${ICON.copy}Copy</button></div>
      ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
      ${s.note ? `<p class="stay-note">${esc(s.note)}</p>` : ""}
      <div class="actions">
        <a class="btn primary" href="${esc(s.map)}" target="_blank" rel="noopener">${ICON.map}Find in Amap</a>
        ${s.phone ? `<a class="btn" href="tel:${esc(s.phone.replace(/[^\d+]/g, ""))}">${ICON.phone}${esc(s.phone.replace(/\s*\(.*\)/, ""))}</a>` : ""}
      </div>
      ${s.nearby ? `<ul class="nearby" aria-label="Nearby, opens Amap">${s.nearby.map(([n, u, dist]) =>
        `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}${dist ? `<small>${esc(dist)}</small>` : ""}</a></li>`).join("")}</ul>` : ""}
    </div>`;
  }

  /* ---------- Places ---------- */
  function placesBlock(d) {
    const ids = DAY_PLACES[d.date];
    if (!ids) return "";
    return `<div class="places"><h4 class="places-title">Places · ${ids.length}</h4><ul>${ids.map((id) => {
      const p = PLACES[id];
      return `<li><button type="button" class="place-row ${p.status}" data-place="${id}">
        <span class="pr-main"><span class="pr-name">${esc(p.name)}</span>${p.zh ? `<span class="pr-zh" lang="zh">${esc(p.zh)}</span>` : ""}</span>
        <span class="pr-meta">${esc(p.kind)}${p.status !== "planned" ? ` · <em>${esc(PLACE_STATUS[p.status])}</em>` : ""}</span>
      </button></li>`;
    }).join("")}</ul></div>`;
  }

  const list = (title, items) => items && items.length
    ? `<section><h4>${title}</h4><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></section>` : "";
  const para = (title, text) => text ? `<section><h4>${title}</h4><p>${esc(text)}</p></section>` : "";

  function openPlace(id) {
    const p = PLACES[id];
    const day = DAYS.find((d) => (DAY_PLACES[d.date] || []).includes(id));
    const sheet = $("#sheet");
    sheet.className = "sheet " + (day && day.region === "yunnan" ? "yunnan" : "sichuan");
    $("#sheetBody").innerHTML = `
      <p class="sh-meta">${esc(p.kind)}${day ? ` · ${dow(day.date)} ${dayNum(day.date)} Nov` : ""}</p>
      <h3 id="sheetTitle">${esc(p.name)}</h3>
      ${p.zh ? `<p class="sh-zh" lang="zh">${esc(p.zh)}</p>` : ""}
      <p class="sh-status ${p.status}">${esc(PLACE_STATUS[p.status])}</p>
      ${p.map ? `<div class="actions"><a class="btn primary" href="${esc(p.map)}" target="_blank" rel="noopener">${ICON.map}Search in Amap</a>
        ${p.zh ? `<button class="btn" type="button" data-copy="${esc(p.zh.replace(/[?？]/g, "").split(" · ")[0])}" data-copy-label="Chinese name copied">${ICON.copy}Copy Chinese name</button>` : ""}</div>` : ""}
      <p class="sh-about">${esc(p.about)}</p>
      ${para("History & context", p.history)}
      ${list("What to look for", p.look)}
      ${list("What to do", p.todo)}
      ${list("Photography", p.photo)}
      ${para("Food to look for", p.food)}
      ${p.eat ? `<section><h4>Restaurant leads</h4><p class="sh-fine">Leads, not reservations. Check the Chinese name and that it's open on the day.</p><ul class="eat">${p.eat.map(([n, t, u]) =>
        `<li><b>${esc(n)}</b> ${esc(t)}${u ? ` <a href="${esc(u)}" target="_blank" rel="noopener">Listing</a>` : ""}</li>`).join("")}</ul></section>` : ""}
      ${list("Care & cautions", p.care)}
      ${p.sources ? `<section><h4>Sources</h4><ul class="src">${p.sources.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}</ul></section>` : ""}
      <p class="sh-fine">From the location field guide v1.4. Amap links are keyword searches; check you've picked the right result.</p>`;
    $("#sheetBody").scrollTop = 0;
    if (!sheet.open) sheet.showModal();
  }

  function initSheet() {
    const sheet = $("#sheet");
    $("#sheetClose").addEventListener("click", () => sheet.close());
    sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); }); // backdrop tap
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-place]");
      if (b) openPlace(b.dataset.place);
    });
  }

  function renderDays() {
    const list = $("#dayList");
    list.innerHTML = DAYS.map((d, i) => {
      const past = todayIdx >= 0 ? i < todayIdx : todayISO > d.date;
      const cls = ["day", d.region, i === todayIdx ? "is-today" : "", past ? "is-past" : ""].join(" ");
      const e = ELEV[d.date];
      const alt = d.altitude || (e && e.m >= 3000 ? `Sleep ~${e.m.toLocaleString()} m` : "");
      const tags = [
        i === todayIdx ? `<span class="tag today">Today</span>` : "",
        d.flags ? `<span class="tag flag">To confirm</span>` : "",
        alt ? `<span class="tag alt">${esc(alt)}</span>` : "",
      ].join("");
      return `<li class="${cls}" id="d-${d.date}" data-i="${i}">
        <span class="dot" aria-hidden="true"></span>
        <button class="day-head" type="button" aria-expanded="false" aria-controls="b-${i}">
          <span class="day-meta"><strong>${esc(d.label)}</strong><span>${dow(d.date)} ${dayNum(d.date)} Nov</span>${tags}</span>
          <span class="day-title"><span>${esc(d.title)}</span>${ICON.chev}</span>
          <ol class="route">${d.route.map((r) => `<li class="${r.endsWith("?") ? "uncertain" : ""}">${esc(r)}</li>`).join("")}</ol>
        </button>
        <div class="day-body" id="b-${i}"><div><div class="day-inner">
          ${d.flags ? `<div class="flagbox" role="note"><b>Needs confirmation</b>${d.flags.map((f) => `<p>${esc(f)}</p>`).join("")}</div>` : ""}
          <p class="summary">${esc(d.summary)}</p>
          <p class="focus"><b>Focus.</b> ${esc(d.focus)}</p>
          ${d.options ? `<ul class="options">${d.options.map(([k, v]) => `<li><span>${esc(k)}</span>${esc(v)}</li>`).join("")}</ul>` : ""}
          ${d.notes ? `<ul class="notes">${d.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
          ${placesBlock(d)}
          ${stayBlock(d.stay, d)}
        </div></div></div>
      </li>`;
    }).join("");

    list.addEventListener("click", (e) => {
      const head = e.target.closest(".day-head");
      if (head) toggle(head.closest(".day"));
    });
    $("#flagCount").textContent = DAYS.filter((d) => d.flags).length;
  }

  function toggle(li, force) {
    const open = force ?? !li.classList.contains("is-open");
    li.classList.toggle("is-open", open);
    $(".day-head", li).setAttribute("aria-expanded", open);
    syncToggleAll();
  }

  function openDay(i, scroll, instant) {
    if (currentView !== "timeline") showView("timeline");
    const li = $(`#d-${DAYS[i].date}`);
    if (li.hidden) setFilter("all");
    toggle(li, true);
    if (scroll) {
      li.scrollIntoView({ block: "start", behavior: instant ? "instant" : "smooth" });
      history.replaceState(null, "", `#d-${DAYS[i].date}`);
    }
  }

  function syncToggleAll() {
    const visible = [...document.querySelectorAll(".day:not([hidden])")];
    const allOpen = visible.length && visible.every((li) => li.classList.contains("is-open"));
    $("#toggleAll").textContent = allOpen ? "Collapse all" : "Expand all";
  }
  $("#toggleAll").addEventListener("click", () => {
    const visible = [...document.querySelectorAll(".day:not([hidden])")];
    const open = !visible.every((li) => li.classList.contains("is-open"));
    visible.forEach((li) => toggle(li, open));
  });

  /* ---------- Filters ---------- */
  function setFilter(f) {
    document.querySelectorAll("#filters button").forEach((b) => b.setAttribute("aria-checked", b.dataset.filter === f));
    DAYS.forEach((d, i) => {
      const show = f === "all" || (f === "flags" ? !!d.flags : d.region === f);
      $(`#d-${d.date}`).hidden = !show;
      $(`.chip[data-i="${i}"]`).classList.toggle("is-hidden", !show);
      if (f === "flags" && show) toggle($(`#d-${d.date}`), true);
    });
    syncToggleAll();
  }
  $("#filters").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setFilter(b.dataset.filter); });

  /* ---------- Active chip follows scroll ---------- */
  function trackActive() {
    const chips = document.querySelectorAll(".chip");
    const nodes = document.querySelectorAll(".pf-node");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = +en.target.dataset.i;
        chips.forEach((c, j) => c.classList.toggle("is-active", i === j));
        nodes.forEach((n, j) => n.classList.toggle("is-active", i === j));
        chips[i].scrollIntoView({ block: "nearest", inline: "center" });
      });
    }, { rootMargin: "-30% 0px -65% 0px" });
    document.querySelectorAll(".day").forEach((li) => io.observe(li));
  }

  /* ---------- Stays list ---------- */
  function renderStays() {
    const seen = [];
    DAYS.forEach((d) => {
      if (!d.stay) return;
      const last = seen[seen.length - 1];
      if (last && last.key === d.stay) last.nights.push(d);
      else seen.push({ key: d.stay, nights: [d] });
    });
    $("#stayList").innerHTML = seen.map(({ key, nights }) => {
      const s = STAYS[key], a = nights[0], b = nights[nights.length - 1];
      const range = a === b ? `${dayNum(a.date)} Nov` : `${dayNum(a.date)}–${dayNum(b.date)} Nov`;
      return `<li class="${a.region}"><span class="nights">${range}<small>${nights.length} night${nights.length > 1 ? "s" : ""}</small></span>
        <span><a class="nm" href="#d-${a.date}" data-i="${DAYS.indexOf(a)}">${esc(s.name)}</a><div class="tw">${esc(ELEV[a.date].town.replace("?", ""))}</div></span>
        <a class="btn icon-btn" href="${esc(s.map)}" target="_blank" rel="noopener" aria-label="Find ${esc(s.name)} in Amap">${ICON.map}Map</a></li>`;
    }).join("");
    $("#stayList").addEventListener("click", (e) => {
      const a = e.target.closest("a.nm"); if (!a) return;
      e.preventDefault(); goScene(+a.dataset.i + 1);
    });
  }

  /* ---------- Guide ---------- */
  function renderGuide() {
    $("#arcList").innerHTML = ARC.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join("");
    $("#fieldList").innerHTML = FIELD.map(([t, items]) => `<details class="field"><summary>${esc(t)}</summary><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></details>`).join("");
    $("#practicalList").innerHTML = PRACTICAL.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join("");
  }

  /* ---------- Gear checklist (saved on this device) ---------- */
  const GEAR_KEY = "ce-gear-v1";
  function renderGear() {
    let state = {};
    try { state = JSON.parse(localStorage.getItem(GEAR_KEY)) || {}; } catch {}
    const total = GEAR.reduce((n, [, items]) => n + items.length, 0);
    $("#gearList").innerHTML = GEAR.map(([group, items]) => `<div class="gear-group"><h3>${esc(group)}</h3><ul>${
      items.map((it) => `<li><label><input type="checkbox" data-item="${esc(it)}" ${state[it] ? "checked" : ""}><span>${esc(it)}</span></label></li>`).join("")
    }</ul></div>`).join("");
    const update = () => {
      const n = Object.values(state).filter(Boolean).length;
      $("#gearProgress").textContent = `${n} of ${total} packed`;
    };
    $("#gearList").addEventListener("change", (e) => {
      const cb = e.target.closest("input[data-item]"); if (!cb) return;
      state[cb.dataset.item] = cb.checked;
      try { localStorage.setItem(GEAR_KEY, JSON.stringify(state)); } catch {}
      update();
    });
    $("#gearReset").addEventListener("click", () => {
      state = {};
      try { localStorage.removeItem(GEAR_KEY); } catch {}
      document.querySelectorAll("#gearList input").forEach((c) => (c.checked = false));
      update();
    });
    update();
  }

  /* ---------- Copy address ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"), sheet = $("#sheet");
    (sheet.open ? sheet : document.body).append(t); // keep the toast above an open sheet
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    const text = b.dataset.copy;
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    toast(b.dataset.copyLabel || "Copied");
  });

  /* =====================================================================
     JOURNEY — one immersive page per day, with a generated landscape
     ===================================================================== */

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

  function placeCards(d) {
    const ids = DAY_PLACES[d.date];
    if (!ids) return "";
    return `<section class="sc-sec"><h3>Places today <span>${ids.length}</span></h3>
      <ul class="pcards">${ids.map((id) => { const p = PLACES[id];
        return `<li><button type="button" class="pcard ${p.status}" data-place="${id}">
          <span class="pc-kind">${esc(p.kind)}</span>
          <span class="pc-name">${esc(p.name)}</span>
          ${p.zh ? `<span class="pc-zh" lang="zh">${esc(p.zh)}</span>` : ""}
          ${p.status !== "planned" ? `<span class="pc-status">${esc(PLACE_STATUS[p.status])}</span>` : ""}
        </button></li>`; }).join("")}</ul></section>`;
  }

  function coverScene() {
    return `<article class="scene cover sichuan" data-s="0" aria-label="Cover">
      <div class="scene-art">${sceneArt("cover", "peaks")}</div>
      <div class="scene-body">
        <div class="scene-head">
          <div class="mark" aria-hidden="true"><span>川</span><span class="mark-line"></span><span>滇</span></div>
          <h1>China Expedition</h1>
        </div>
        <p class="lede">6 to 20 November 2026. From Chengdu up into the Kham highlands, over to Meili and Shangri-La, then down the Tea Horse Road to Dali and Kunming.</p>
        <p class="status" data-status></p>
        <button class="btn primary begin" type="button" id="begin"></button>
        <figure class="profile">
          <div class="profile-scroll"><svg id="profile" role="group" aria-label="Altitude of each night's stay. Tap a night to open that day."></svg></div>
          <figcaption>Where you sleep each night, by altitude. Approximate town elevations from general references, not from your booking files. Dashed peaks are each day's high point.</figcaption>
        </figure>
        <p class="hint">Swipe sideways to travel day by day.</p>
      </div>
    </article>`;
  }

  function dayScene(d, i) {
    const e = ELEV[d.date], next = DAYS[i + 1];
    const alt = d.altitude || (e ? `Sleep ~${e.m.toLocaleString()} m in ${e.town.replace("?", "")}` : "");
    return `<article class="scene ${d.region} ${i === todayIdx ? "is-today" : ""}" data-s="${i + 1}" aria-label="${esc(d.label)}, ${dow(d.date)} ${dayNum(d.date)} November: ${esc(d.title)}">
      <div class="scene-art">${sceneArt(d.date, SCENE[d.date], { flags: FLAGS_DAYS.has(d.date) })}</div>
      <div class="scene-body">
        <div class="scene-head">
          <p class="sc-date"><span class="sc-num">${dayNum(d.date)}</span><span><b>${dow(d.date)}, November</b><br>${esc(d.label)}${i === todayIdx ? ` · <em>Today</em>` : ""}</span></p>
          <h2 class="sc-title">${esc(d.title)}</h2>
          <ol class="route">${d.route.map((rt) => `<li class="${rt.endsWith("?") ? "uncertain" : ""}">${esc(rt)}</li>`).join("")}</ol>
        </div>
        <p class="sc-tags">${alt ? `<span class="tag alt">${esc(alt)}</span>` : ""}${d.flags ? `<span class="tag flag">To confirm</span>` : ""}</p>
        ${d.flags ? `<div class="flagbox" role="note"><b>Needs confirmation</b>${d.flags.map((f) => `<p>${esc(f)}</p>`).join("")}</div>` : ""}
        <p class="sc-summary">${esc(d.summary)}</p>
        <p class="focus"><b>Focus.</b> ${esc(d.focus)}</p>
        ${d.options ? `<ul class="options">${d.options.map(([k, v]) => `<li><span>${esc(k)}</span>${esc(v)}</li>`).join("")}</ul>` : ""}
        ${d.notes ? `<ul class="notes">${d.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
        ${placeCards(d)}
        <section class="sc-sec"><h3>Tonight</h3>${stayBlock(d.stay, d)}</section>
        ${next ? `<button class="next-day" type="button" data-go="${i + 2}"><span>Next · ${dow(next.date)} ${dayNum(next.date)}</span><b>${esc(next.title)}</b></button>`
               : `<p class="the-end">The end of the road. Safe travels.</p>`}
      </div>
    </article>`;
  }

  let sceneIdx = 0;
  const track = () => $("#track");
  const sceneCount = DAYS.length + 1;

  function renderJourney() {
    $("#track").innerHTML = coverScene() + DAYS.map(dayScene).join("");
    $("#progress").innerHTML = DAYS.map((d, i) =>
      `<button type="button" role="tab" class="seg ${d.region}" data-go="${i + 1}" aria-label="${esc(d.label)}, ${dayNum(d.date)} November"><i></i></button>`).join("");

    const t = track();
    let raf = 0;
    t.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; onScroll(); }); }, { passive: true });
    // Vertical scroll inside a day: give the progress bar a backing once past the art.
    t.addEventListener("scroll", (e) => {
      if (e.target === t) return;
      $("#v-journey").classList.toggle("scrolled", e.target.scrollTop > e.target.firstElementChild.offsetHeight - 60);
    }, { passive: true, capture: true });
    document.addEventListener("click", (e) => {
      const g = e.target.closest("[data-go]"); if (!g) return;
      goScene(+g.dataset.go);
    });
    $("#prevScene").addEventListener("click", () => goScene(sceneIdx - 1));
    $("#nextScene").addEventListener("click", () => goScene(sceneIdx + 1));
    document.addEventListener("keydown", (e) => {
      if (currentView !== "journey" || $("#sheet").open) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goScene(sceneIdx + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goScene(sceneIdx - 1); }
    });
    window.addEventListener("resize", () => { if (currentView === "journey") goScene(sceneIdx, true); });

    const begin = $("#begin");
    begin.textContent = todayIdx >= 0 ? "Go to today" : todayISO > DAYS[DAYS.length - 1].date ? "Relive the journey" : "Begin with arrival day";
    begin.addEventListener("click", () => goScene(todayIdx >= 0 ? todayIdx + 1 : 1));
  }

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onScroll() {
    const t = track(), w = t.clientWidth || 1;
    const pos = t.scrollLeft / w;
    const idx = Math.round(pos);
    if (!reduceMotion) {
      // Parallax: each nearby scene learns how far it is from centre (-1…1).
      for (let k = Math.max(0, idx - 1); k <= Math.min(sceneCount - 1, idx + 1); k++) {
        t.children[k].style.setProperty("--p", (k - pos).toFixed(3));
      }
    }
    if (idx !== sceneIdx) setScene(idx);
  }

  function setScene(idx) {
    sceneIdx = idx;
    const sc = track().children[idx];
    if (sc) $("#v-journey").classList.toggle("scrolled", sc.scrollTop > sc.firstElementChild.offsetHeight - 60);
    document.querySelectorAll(".seg").forEach((s, j) => {
      s.classList.toggle("done", j + 1 < idx);
      s.classList.toggle("on", j + 1 === idx);
      s.setAttribute("aria-selected", j + 1 === idx);
    });
    $("#v-journey").classList.toggle("on-cover", idx === 0);
    $("#prevScene").disabled = idx === 0;
    $("#nextScene").disabled = idx === sceneCount - 1;
  }

  function goScene(i, instant) {
    i = Math.max(0, Math.min(sceneCount - 1, i));
    const t = track();
    if (currentView !== "journey") showView("journey");
    t.scrollTo({ left: i * t.clientWidth, behavior: instant || reduceMotion ? "instant" : "smooth" });
    setScene(i);
  }

  /* ---------- Views (hash routing) ---------- */
  const VIEWS = ["journey", "timeline", "stays", "guide"];
  let currentView = "";
  function showView(v) {
    if (!VIEWS.includes(v)) v = "journey";
    if (v === currentView) return;
    currentView = v;
    VIEWS.forEach((name) => { $(`#v-${name}`).hidden = name !== v; });
    document.querySelectorAll(".tabbar a").forEach((a) => {
      if (a.dataset.view === v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.body.dataset.view = v;
    if (v === "journey") requestAnimationFrame(() => goScene(sceneIdx, true));
    else if (v === "timeline" && todayIdx >= 0) requestAnimationFrame(() => $(`#d-${DAYS[todayIdx].date}`).scrollIntoView({ block: "start" }));
    else window.scrollTo(0, 0);
    if (location.hash !== "#" + v && !location.hash.startsWith("#d-")) history.replaceState(null, "", "#" + v);
  }
  function route() {
    const h = location.hash.slice(1);
    const di = DAYS.findIndex((d) => h === `d-${d.date}`);
    if (di >= 0) { showView("timeline"); openDay(di, true, true); return; }
    showView(h || "journey");
  }
  window.addEventListener("hashchange", route);

  /* ---------- Boot ---------- */
  renderJourney();
  renderStatus();
  renderStrip();
  renderDays();
  renderProfile();
  renderStays();
  renderGuide();
  renderGear();
  initSheet();
  trackActive();

  sceneIdx = todayIdx >= 0 ? todayIdx + 1 : 0;
  route();
  setScene(sceneIdx);
  if (todayIdx >= 0) { const li = $(`#d-${DAYS[todayIdx].date}`); toggle(li, true); }
})();
