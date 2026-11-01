// Light on the mountain: a fixed 3D view from a known viewpoint towards the
// main peak, lit for any time of the stop's day. Everything is computed on the
// phone from small elevation files in terrain/ (no network).
//
// Terrain: ~100 m grid from SRTM-derived Terrain Tiles (Mapzen / AWS open data).
// Viewpoint and peak coordinates are approximate (general references), nudged
// on the grid so the mountain is in clear view; each view's note says where.
// Results are a modelled estimate for a clear sky, never a forecast.
// `date` is the day the sun is computed for; `when` is the stay shown to the reader
// (the sun moves well under a minute a day, so one date covers a two-day stay).
"use strict";

const LIGHT3D = {
  siguniang: [
    { id: "siguniang", tab: "Rilong", date: [2026, 11, 8], when: "8–9 Nov", title: "Yaomei Feng from above Rilong", dir: "looking north-east",
      camLL: [30.990, 102.850], up: 6, peakLL: [31.106, 102.902], peak: "Yaomei Feng", m: "6,250 m",
      dem: "terrain/siguniang.png", grid: { lon0: 102.55, lat1: 31.3, w: 601, h: 551 }, out: 4200, snow: 4700, hfov: 52,
      note: "From the open slope just south-east of Rilong, near where the road from Balang Pass comes in. The hotel in Shuangqiao Village sits too low in the valley to see the main peak in this model." },
  ],
  yading: [
    { id: "chonggu", tab: "Chonggu", date: [2026, 11, 13], when: "13 Nov", title: "Chenresig from Chonggu", dir: "looking south",
      camLL: [28.440, 100.355], up: 6, peakLL: [28.395, 100.350], peak: "Chenresig", m: "6,032 m",
      dem: "terrain/yading.png", grid: { lon0: 100.05, lat1: 28.7, w: 601, h: 551 }, out: 4600, snow: 4900, hfov: 66,
      note: "On the shorter route, about 5 km north of the summit. Placed on the open slope just east of the monastery; right beside it, nearby slopes hide most of the peak." },
    { id: "luorong", tab: "Luorong", date: [2026, 11, 13], when: "13 Nov", title: "Jambeyang from Luorong Pasture", dir: "looking south-west",
      camLL: [28.385, 100.373], up: 6, peakLL: [28.357, 100.356], peak: "Jambeyang", m: "5,958 m",
      dem: "terrain/yading.png", grid: { lon0: 100.05, lat1: 28.7, w: 601, h: 551 }, out: 4600, snow: 4900, hfov: 62,
      note: "Only on the longer route, about 3.5 km from the summit." },
  ],
  meili: [
    { id: "meili", tab: "Feilai", date: [2026, 11, 15], when: "14–15 Nov", title: "Kawagebo from Feilai", dir: "looking west",
      camLL: [28.443, 98.873], up: 25, peakLL: [28.438, 98.683], peak: "Kawagebo", m: "6,740 m",
      dem: "terrain/meili.png", grid: { lon0: 98.45, lat1: 28.68, w: 701, h: 531 }, out: 4500, snow: 4600, hfov: 58,
      note: "About 19 km across the Mekong gorge from the summit; the hotel is in the same area." },
  ],
  lijiang: [
    { id: "jade", tab: "Blue Moon Valley", date: [2026, 11, 17], when: "17 Nov", title: "Jade Dragon from Blue Moon Valley", dir: "looking south-west",
      camLL: [27.115, 100.249], up: 6, peakLL: [27.099, 100.176], peak: "Shanzidou", m: "5,596 m",
      dem: "terrain/jade.png", grid: { lon0: 99.9, lat1: 27.35, w: 601, h: 551 }, out: 3200, snow: 4500, hfov: 54,
      note: "From the valley floor near the lakes, about 7 km from the main summit. Forested foothills hide the lower slopes, so only the snowy crest shows above them." },
  ],
};

const Light3D = (() => {
  const R = Math.PI / 180, STEP = 0.001, K = 1 / (2 * 6371000 / 0.87);

  /* ---------- sun (NOAA-style, China time UTC+8) ---------- */
  function sunPos(lat, lon, [y, m, d], minLocal) {
    const ms = Date.UTC(y, m - 1, d) + (minLocal - 480) * 60000;
    const jd = ms / 864e5 + 2440587.5, T = (jd - 2451545) / 36525;
    const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T), e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const C = Math.sin(M * R) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * R) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * R) * 0.000289;
    const om = 125.04 - 1934.136 * T, lam = L0 + C - 0.00569 - 0.00478 * Math.sin(om * R);
    const eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(om * R);
    const dec = Math.asin(Math.sin(eps * R) * Math.sin(lam * R));
    const yv = Math.tan(eps / 2 * R) ** 2;
    const eot = 4 / R * (yv * Math.sin(2 * L0 * R) - 2 * e * Math.sin(M * R) + 4 * e * yv * Math.sin(M * R) * Math.cos(2 * L0 * R) - .5 * yv * yv * Math.sin(4 * L0 * R) - 1.25 * e * e * Math.sin(2 * M * R));
    const utcMin = ((minLocal - 480) % 1440 + 1440) % 1440;
    const tst = ((utcMin + eot + 4 * lon) % 1440 + 1440) % 1440, ha = (tst / 4 - 180) * R, la = lat * R;
    const zen = Math.acos(Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(ha));
    const az = ((Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(la) - Math.tan(dec) * Math.cos(la)) / R) + 180 + 360) % 360;
    let el = 90 - zen / R;
    if (el > -2) { const x = Math.max(el, -1.9); el += 1.02 / Math.tan((x + 10.3 / (x + 5.11)) * R) / 60; }
    return { az, el };
  }
  const hm = (m) => { m = Math.round(m); return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
  const compass = (a) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(a / 45) % 8];
  const adiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
  const rel = (a, b) => ((a - b + 540) % 360) - 180;

  /* sky and light colours by sun elevation */
  const KEYS = [-12, -6, -3, 0, 3, 8, 20, 45];
  const SUNC = [[0,0,0],[0,0,0],[.55,.10,.08],[1.5,.42,.2],[2.3,1.1,.55],[2.9,2.15,1.5],[3.3,2.95,2.6],[3.5,3.3,3.05]];
  const ZEN = [[.004,.006,.016],[.02,.035,.09],[.05,.085,.2],[.09,.16,.34],[.12,.23,.48],[.14,.3,.62],[.14,.33,.72],[.14,.33,.74]];
  const HSUN = [[.008,.01,.022],[.07,.07,.15],[.32,.18,.2],[.85,.42,.24],[.95,.62,.4],[.82,.78,.72],[.66,.75,.86],[.6,.72,.88]];
  const HAWAY = [[.008,.01,.022],[.05,.07,.14],[.2,.17,.28],[.4,.33,.45],[.48,.48,.58],[.58,.65,.78],[.6,.7,.84],[.6,.72,.88]];
  const EXPO = [9, 6, 3.2, 1.45, 1.0, .82, .72, .7];
  function key(arr, e) {
    if (e <= KEYS[0]) return arr[0];
    for (let k = 1; k < KEYS.length; k++) if (e <= KEYS[k]) {
      const f = (e - KEYS[k - 1]) / (KEYS[k] - KEYS[k - 1]), a = arr[k - 1], b = arr[k];
      return Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * f) : a + (b - a) * f;
    }
    return arr[arr.length - 1];
  }

  /* ---------- state for the view on screen ---------- */
  let V, H, W, NR, dx, dy, ci, cj, camZ, OUT, normals, mask, litArr, nIdx, cam, pin, SUMMIT, FACE, BELOW, root;
  const sunAt = (m) => sunPos(V.camLL[0], V.camLL[1], V.date, m);
  const demCache = {};
  function loadDem(src) {
    if (demCache[src]) return Promise.resolve(demCache[src]);
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
        const g = cv.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, img.width, img.height).data;
        const out = new Float32Array(img.width * img.height);
        for (let i = 0, p = 0; i < out.length; i++, p += 4) out[i] = d[p] * 256 + d[p + 1]; // metres = R*256 + G
        res(demCache[src] = out);
      };
      img.onerror = () => rej(new Error("terrain file missing"));
      img.src = src;
    });
  }
  function sample(j, i) {
    if (j < 0 || i < 0 || j >= W - 1 || i >= NR - 1) return OUT;
    const j0 = j | 0, i0 = i | 0, fj = j - j0, fi = i - i0, p = i0 * W + j0;
    const a = H[p], b = H[p + 1], c = H[p + W], d = H[p + W + 1];
    return (a + (b - a) * fj) * (1 - fi) + (c + (d - c) * fj) * fi;
  }
  // Soft shadow towards the sun, with Earth curvature: 1 = in sun, 0 = blocked.
  function lit(j, i, h0, sj, si, tanE) {
    let m = 1e9, d = 40;
    while (d < 90000) {
      const terr = sample(j + sj * d, i - si * d);
      const ray = h0 + 4 + d * tanE + d * d * K;
      const a = (ray - terr) / d;
      if (a < m) { m = a; if (m < -0.007) return 0; }
      if (ray > 7000) break;
      d += d < 1500 ? 50 : d * 0.03;
    }
    const v = 0.5 + m / 0.012;
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }
  function sunVec(s) {
    const e = s.el * R, a = s.az * R;
    return { x: Math.sin(a) * Math.cos(e), y: Math.cos(a) * Math.cos(e), z: Math.sin(e), tanE: Math.tan(e), sj: Math.sin(a) / dx, si: Math.cos(a) / dy };
  }

  /* ---------- WebGL (one context, reused across stops) ---------- */
  let canvas, gl, PT, PS, vaoT, vaoS, bufs = [], litBuf;
  const VS_T = `#version 300 es
in vec3 p; in vec3 n; in float l; in float h;
uniform mat4 vp; out vec3 vn; out float vl; out float vh; out float vd; out vec3 vw;
void main(){ vn=n; vl=l; vh=h; vw=p; vd=length(p.xy); gl_Position=vp*vec4(p,1.); }`;
  const FS_T = `#version 300 es
precision highp float;
in vec3 vn; in float vl; in float vh; in float vd; in vec3 vw;
uniform vec3 sun, sunC, zen, hSun, hAway, eye; uniform float expo, snowH;
out vec4 o;
float hash(vec2 q){ return fract(sin(dot(q, vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec3 n=normalize(vn); float slope=n.z;
  float nz=hash(floor(vw.xy/60.))*.5+hash(floor(vw.xy/17.))*.5;
  vec3 valley=vec3(.26,.22,.17), forest=vec3(.055,.08,.05), alpine=vec3(.17,.155,.135), rock=vec3(.2,.19,.18), snow=vec3(.86,.89,.93);
  vec3 a=mix(valley,forest,smoothstep(2500.,2900.,vh));
  a=mix(a,alpine,smoothstep(snowH-700.,snowH-300.,vh));
  float sn=smoothstep(snowH-100.+nz*350.,snowH+350.,vh)*smoothstep(.32,.6,slope+nz*.12);
  a=mix(a,rock,smoothstep(snowH-300.,snowH,vh)); a=mix(a,snow,sn);
  float dif=max(dot(n,sun),0.);
  vec3 amb=(zen*.75+mix(hAway,hSun,.5)*.35)*(.55+.45*slope);
  vec3 c=a*(sunC*dif*vl+amb);
  vec3 dir=normalize(vw-eye);
  float t=1.-exp(-vd/110000.);
  vec2 sh=normalize(sun.xy+1e-5); float tw=pow(max(dot(normalize(dir.xy+1e-5),sh),0.),3.);
  c=mix(c,mix(hAway,hSun,tw)*.9,t*.6);
  c*=expo; c=1.-exp(-c); c=pow(c,vec3(1./2.2));
  o=vec4(c,1.);
}`;
  const VS_S = `#version 300 es
in vec2 q; out vec2 uv; void main(){ uv=q; gl_Position=vec4(q,.9999,1.); }`;
  const FS_S = `#version 300 es
precision highp float;
in vec2 uv; uniform vec3 fw, rt, upv, sun, sunC, zen, hSun, hAway; uniform vec2 tn; uniform float expo, sunVis;
out vec4 o;
void main(){
  vec3 d=normalize(fw+uv.x*tn.x*rt+uv.y*tn.y*upv);
  float e=max(d.z,0.);
  vec2 sh=normalize(sun.xy+1e-5); float tw=pow(max(dot(normalize(d.xy+1e-5),sh)*.5+.5,0.),4.);
  vec3 c=mix(mix(hAway,hSun,tw),zen,pow(e,.45));
  float cs=max(dot(d,sun),0.);
  c+=sunC*(pow(cs,600.)*.6+pow(cs,40.)*.08+pow(cs,6.)*.03)*sunVis;
  c+=sunC*step(.99996,cs)*6.*sunVis;
  c*=expo; c=1.-exp(-c); c=pow(c,vec3(1./2.2));
  o=vec4(c,1.);
}`;
  function prog(vs, fs) {
    const p = gl.createProgram();
    for (const [t, s] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      gl.attachShader(p, sh);
    }
    gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); }
    return { p, u };
  }
  function initGL() {
    if (gl) return true;
    canvas = document.createElement("canvas");
    canvas.className = "l3d-canvas";
    gl = canvas.getContext("webgl2", { antialias: true });
    if (!gl) return false;
    PT = prog(VS_T, FS_T); PS = prog(VS_S, FS_S);
    vaoS = gl.createVertexArray(); gl.bindVertexArray(vaoS);
    const sb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, sb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const ql = gl.getAttribLocation(PS.p, "q"); gl.enableVertexAttribArray(ql); gl.vertexAttribPointer(ql, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    return true;
  }

  function build() {
    W = V.grid.w; NR = V.grid.h; OUT = V.out;
    dx = STEP * 111320 * Math.cos(V.camLL[0] * R); dy = STEP * 110574;
    cj = (V.camLL[1] - V.grid.lon0) / STEP; ci = (V.grid.lat1 - V.camLL[0]) / STEP;
    camZ = sample(cj, ci) + V.up;

    let best = -1, bi = 0, bj = 0;
    const ki = (V.grid.lat1 - V.peakLL[0]) / STEP, kj = (V.peakLL[1] - V.grid.lon0) / STEP;
    for (let i = Math.round(ki - 25); i < ki + 25; i++) for (let j = Math.round(kj - 25); j < kj + 25; j++) if (H[i * W + j] > best) { best = H[i * W + j]; bi = i; bj = j; }
    SUMMIT = { i: bi, j: bj, h: best };
    const sx = (bj - cj) * dx, sy = (ci - bi) * dy, sd = Math.hypot(sx, sy);
    const bearing = ((Math.atan2(sx, sy) / R) + 360) % 360;
    const elev = Math.atan2(best - sd * sd * K - camZ, sd) / R;
    cam = { bearing, pitch: elev - Math.atan(0.3 * Math.tan(V.hfov / 2 * R) * 0.75) / R };

    const N = W * NR, pos = new Float32Array(N * 3), nor = new Float32Array(N * 3);
    normals = nor;
    for (let i = 0; i < NR; i++) for (let j = 0; j < W; j++) {
      const k = i * W + j, x = (j - cj) * dx, y = (ci - i) * dy;
      pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = H[k] - (x * x + y * y) * K;
      const hx = (H[i * W + Math.min(j + 1, W - 1)] - H[i * W + Math.max(j - 1, 0)]) / (2 * dx);
      const hy = (H[Math.max(i - 1, 0) * W + j] - H[Math.min(i + 1, NR - 1) * W + j]) / (2 * dy);
      const L = Math.hypot(hx, hy, 1);
      nor[k * 3] = -hx / L; nor[k * 3 + 1] = -hy / L; nor[k * 3 + 2] = 1 / L;
    }
    // Only triangles inside the view cone (plus everything right around the camera).
    const half = V.hfov / 2 + 14, idx = [];
    mask = new Uint8Array(N);
    for (let i = 0; i < NR - 1; i++) for (let j = 0; j < W - 1; j++) {
      const x = (j + .5 - cj) * dx, y = (ci - i - .5) * dy;
      if (Math.hypot(x, y) > 400 && adiff(((Math.atan2(x, y) / R) + 360) % 360, bearing) > half) continue;
      const k = i * W + j;
      idx.push(k, k + W, k + 1, k + 1, k + W, k + W + 1);
      mask[k] = mask[k + 1] = mask[k + W] = mask[k + W + 1] = 1;
    }
    nIdx = idx.length;
    litArr = new Float32Array(N);

    // Grid points the camera can see: the mountain face, and the valley below you.
    const seen = (k) => {
      const i = (k / W) | 0, j = k % W, z = H[k] + 15;
      for (let f = 0.04; f < 0.97; f += 0.02) if (sample(cj + (j - cj) * f, ci + (i - ci) * f) > camZ + (z - camZ) * f) return false;
      return true;
    };
    FACE = []; BELOW = [];
    for (let i = 0; i < NR; i += 2) for (let j = 0; j < W; j += 2) {
      const k = i * W + j; if (!mask[k]) continue;
      if (H[k] > best - 1300 && Math.hypot((j - bj) * dx, (bi - i) * dy) < 6000 && seen(k)) FACE.push(k);
      else if (H[k] < camZ - 250 && Math.hypot(pos[k * 3], pos[k * 3 + 1]) < 12000 && seen(k)) BELOW.push(k);
    }

    bufs.forEach((b) => gl.deleteBuffer(b)); bufs = [];
    if (vaoT) gl.deleteVertexArray(vaoT);
    vaoT = gl.createVertexArray(); gl.bindVertexArray(vaoT);
    const attr = (name, data, size, usage) => {
      const b = gl.createBuffer(); bufs.push(b); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, usage || gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(PT.p, name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0); return b;
    };
    attr("p", pos, 3); attr("n", nor, 3); attr("h", H, 1); litBuf = attr("l", litArr, 1, gl.DYNAMIC_DRAW);
    const ib = gl.createBuffer(); bufs.push(ib); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(idx), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    pin = [sx, sy, best - sd * sd * K + 40];
  }

  function matrices() {
    const asp = canvas.clientWidth / canvas.clientHeight;
    const b = cam.bearing * R, p = cam.pitch * R;
    const fw = [Math.sin(b) * Math.cos(p), Math.cos(b) * Math.cos(p), Math.sin(p)];
    const rt = [Math.cos(b), -Math.sin(b), 0];
    const up = [rt[1] * fw[2] - rt[2] * fw[1], rt[2] * fw[0] - rt[0] * fw[2], rt[0] * fw[1] - rt[1] * fw[0]];
    const tx = Math.tan(V.hfov / 2 * R), ty = tx / asp, near = 2.5, far = 150000, eye = [0, 0, camZ];
    const dot = (a, c) => a[0] * c[0] + a[1] * c[1] + a[2] * c[2];
    const Vm = [rt[0], up[0], -fw[0], 0, rt[1], up[1], -fw[1], 0, rt[2], up[2], -fw[2], 0, -dot(rt, eye), -dot(up, eye), dot(fw, eye), 1];
    const P = [1 / tx, 0, 0, 0, 0, 1 / ty, 0, 0, 0, 0, -(far + near) / (far - near), -1, 0, 0, -2 * far * near / (far - near), 0];
    const M = new Float32Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += P[k * 4 + r] * Vm[c * 4 + k]; M[c * 4 + r] = s; }
    return { M, fw, rt, up, tx, ty, eye };
  }
  function draw(m) {
    if (!canvas.isConnected || !canvas.clientWidth) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.round(canvas.clientWidth * dpr), ch = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    gl.viewport(0, 0, cw, ch);
    const s = sunAt(m), v = sunVec(s);
    if (s.el < -3.2) litArr.fill(0);
    else for (let k = 0, N = W * NR; k < N; k++) {
      if (!mask[k]) continue;
      const ndl = normals[k * 3] * v.x + normals[k * 3 + 1] * v.y + normals[k * 3 + 2] * v.z;
      litArr[k] = ndl <= 0 ? 0 : lit(k % W, (k / W) | 0, H[k], v.sj, v.si, v.tanE);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, litBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, litArr);
    const mt = matrices(), sun = [v.x, v.y, v.z];
    const sunC = key(SUNC, s.el), zen = key(ZEN, s.el), hS = key(HSUN, s.el), hA = key(HAWAY, s.el), ex = key(EXPO, s.el);
    gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.useProgram(PS.p); gl.bindVertexArray(vaoS);
    let U = PS.u;
    gl.uniform3fv(U.fw, mt.fw); gl.uniform3fv(U.rt, mt.rt); gl.uniform3fv(U.upv, mt.up); gl.uniform2f(U.tn, mt.tx, mt.ty);
    gl.uniform3fv(U.sun, sun); gl.uniform3fv(U.sunC, sunC); gl.uniform3fv(U.zen, zen); gl.uniform3fv(U.hSun, hS); gl.uniform3fv(U.hAway, hA);
    gl.uniform1f(U.expo, ex); gl.uniform1f(U.sunVis, s.el > -1 ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(PT.p); gl.bindVertexArray(vaoT);
    U = PT.u;
    gl.uniformMatrix4fv(U.vp, false, mt.M); gl.uniform3fv(U.sun, sun); gl.uniform3fv(U.sunC, sunC); gl.uniform3fv(U.zen, zen);
    gl.uniform3fv(U.hSun, hS); gl.uniform3fv(U.hAway, hA); gl.uniform3fv(U.eye, mt.eye); gl.uniform1f(U.expo, ex); gl.uniform1f(U.snowH, V.snow);
    gl.drawElements(gl.TRIANGLES, nIdx, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
    hud(m, s, v, mt);
  }

  /* ---------- reading the day from the model ---------- */
  function side(s) {
    const r = rel(s.az, cam.bearing), a = Math.abs(r);
    if (a >= 120) return { where: "behind you", light: "front-lit", k: "front" };
    if (a >= 55) return { where: r > 0 ? "on your right" : "on your left", light: "side-lit", k: "side" };
    return { where: "behind the mountain", light: "backlit", k: "back" };
  }
  function fraction(list, v) {
    if (!list.length) return 0;
    let n = 0;
    for (const k of list) {
      const ndl = normals[k * 3] * v.x + normals[k * 3 + 1] * v.y + normals[k * 3 + 2] * v.z;
      if (ndl > 0.08 && lit(k % W, (k / W) | 0, H[k], v.sj, v.si, v.tanE) > 0.5) n++;
    }
    return n / list.length;
  }
  function analyse() {
    const DAY = [];
    for (let m = 360; m <= 1170; m += 5) {
      const s = sunAt(m), v = sunVec(s), ok = s.el > -3.2;
      DAY.push({ m, s,
        summit: ok ? lit(SUMMIT.j, SUMMIT.i, SUMMIT.h, v.sj, v.si, v.tanE) : 0,
        you: ok ? lit(cj, ci, camZ, v.sj, v.si, v.tanE) : 0,
        face: ok ? fraction(FACE, v) : 0,
        below: ok ? fraction(BELOW, v) : 0 });
    }
    const first = (f, from = 0) => DAY.find((d) => d.m >= from && f(d));
    const last = (f) => [...DAY].reverse().find(f);
    const rise = first((d) => d.s.el > -0.833), set = last((d) => d.s.el > -0.833);
    const noon = DAY.reduce((a, d) => (d.s.el > a.s.el ? d : a), DAY[0]).m;
    const summitOn = first((d) => d.summit > 0.5), summitOff = last((d) => d.summit > 0.5);
    const faceOn = first((d) => d.face >= 0.6);
    let faceOff = faceOn && first((d) => d.face < 0.35, Math.max(faceOn.m + 30, noon));
    if (faceOff && summitOff && faceOff.m > summitOff.m - 30) faceOff = null;
    const youOn = first((d) => d.you > 0.5), youOff = last((d) => d.you > 0.5);
    const belowOn = BELOW.length > 40 ? first((d) => d.below >= 0.5) : null;
    const blue = first((d) => d.s.el > -6);
    const warmth = (e) => (e < 2 ? 1.2 : e < 10 ? 1.7 : e < 20 ? 1.25 : 1);
    const score = (d) => d.face * warmth(d.s.el) * ({ front: 1, side: 1.1, back: 0.35 })[side(d.s).k];
    const mean = (a) => (a.length ? a.reduce((x, d) => x + score(d), 0) / a.length : 0);
    const am = mean(DAY.filter((d) => d.m >= rise.m && d.m < noon)), pm = mean(DAY.filter((d) => d.m >= noon && d.m <= set.m));
    const sunUp = DAY.filter((d) => d.s.el > 0);
    const bestD = sunUp.reduce((a, d) => (score(d) > score(a) ? d : a), sunUp[0]);
    const amSide = side(sunAt(rise.m + 45)), pmSide = side(sunAt(set.m - 45));
    const warm = (d) => d && d.s.el < 2.5;
    const B = (m) => `<b>${hm(m)}</b>`;
    const cap = (t) => t[0].toUpperCase() + t.slice(1);

    const mom = [];
    if (blue) mom.push([blue.m, "Blue hour", "Soft, even blue light before the sun."]);
    if (summitOn) mom.push([summitOn.m, "First light on the summit", warm(summitOn) ? "Expect pink-orange alpenglow while everything below is still in shade." : "The top catches the sun before the slopes below."]);
    if (faceOn && faceOn.m < noon) mom.push([faceOn.m, "Face mostly lit", side(faceOn.s).k === "back" ? "Lit from above by a high sun behind the peak: bright but flat." : faceOn.s.el < 8 ? `Still low, warm sun, ${side(faceOn.s).light}.` : `${cap(side(faceOn.s).light)}, sun ${Math.round(faceOn.s.el)}° high.`]);
    if (bestD) mom.push([bestD.m, "Best modelled light", `Most of the face in sun, ${side(bestD.s).light}${bestD.s.el < 10 ? ", warm and low" : ""}.`]);
    if (youOn && youOn.m - rise.m > 20) mom.push([youOn.m, "Sun reaches you", "The ridge behind you stops shading the viewpoint."]);
    if (belowOn) mom.push([belowOn.m, "Valley below leaves the shade", "Contrast between snow and valley drops from here."]);
    if (faceOff) mom.push([faceOff.m, "Face turns away from the sun", "Light goes flat, then shade or backlight."]);
    if (youOff && set.m - youOff.m > 15) mom.push([youOff.m, "Sun drops behind the ridges for you", "Early shade at the viewpoint."]);
    if (summitOff) mom.push([summitOff.m, "Last light on the summit", pmSide.k === "back" ? "Backlit from here: a bright rim, not alpenglow." : "Warm last light on the top."]);
    mom.sort((a, b) => a[0] - b[0]);

    let head, tone;
    if (Math.max(am, pm) < 0.12) { head = "The side you see stays mostly in shade."; tone = "shade"; }
    else if (bestD.m < noon) { head = am > pm * 1.25 ? "Go in the morning." : "Morning is a little better."; tone = "am"; }
    else { head = pm > am * 1.25 ? "Go in the afternoon." : "Afternoon is a little better."; tone = "pm"; }

    const P = [];
    let p1 = `<b>${head}</b> In the morning the sun is ${amSide.where}, so the face you see is ${amSide.light}.`;
    if (summitOn) p1 += ` First light touches the summit around ${B(summitOn.m)}${warm(summitOn) ? " as alpenglow" : ""}.`;
    if (faceOn && faceOn.m < noon) p1 += side(faceOn.s).k === "back" ? ` By about ${B(faceOn.m)} a high sun lights it from above, but flatly.` : ` Most of the face is lit by about ${B(faceOn.m)}.`;
    else if (tone === "shade") p1 += " In November the sun stays low in the south, so this side gets little direct light: think silhouettes and glowing ridges.";
    P.push(p1);
    const bits = [];
    if (belowOn) { const d9 = DAY.find((d) => d.m === 540); bits.push(`The valley below you stays in shade until about ${B(belowOn.m)}${d9 ? ` (at 09:00 about ${Math.round((1 - d9.below) * 100)}% of it is still dark)` : ""}.`); }
    if (youOn && youOn.m - rise.m > 20) bits.push(`You're in shade yourself until about ${B(youOn.m)}: bring warm layers.`);
    if (bits.length) P.push(`<b>Shadows.</b> ${bits.join(" ")}${belowOn && tone === "am" ? " Lit snow above a dark valley is what gives the morning shot its depth. Expose for the snow." : ""}`);
    const moves = { "behind you": "round behind you", "on your right": "round to your right", "on your left": "round to your left" };
    let p3 = `<b>Afternoon.</b> The sun moves ${moves[pmSide.where] || pmSide.where}, so the face becomes ${pmSide.light}.`;
    if (faceOff) p3 += ` From about ${B(faceOff.m)} it turns away from the sun.`;
    if (youOff && set.m - youOff.m > 15) p3 += ` The sun drops behind the ridges for you at about ${B(youOff.m)}.`;
    if (summitOff) p3 += pmSide.k === "back" ? ` Last light leaves the summit around ${B(summitOff.m)}, seen from behind: expect silhouettes and a bright sky.` : ` Last warm light on the summit around ${B(summitOff.m)}.`;
    P.push(p3);
    if (bestD) P.push(`<b>Best modelled moment:</b> about ${B(bestD.m)}, ${side(bestD.s).light}${bestD.s.el < 10 ? " in low, warm light" : ""}.`);

    const strip = DAY.map((d) => {
      const c = d.s.el < -6 ? "night" : d.face > 0.5 ? (d.s.el < 8 ? "warm" : "sun") : d.s.el < 0 && d.summit < 0.5 ? "blue" : d.summit > 0.5 && d.s.el < 3 ? "glow" : "shade";
      return `<i class="${c}"></i>`;
    }).join("");
    return { P, mom, strip, start: summitOn ? summitOn.m + 10 : bestD ? bestD.m : 540 };
  }

  /* ---------- markup ---------- */
  function hud(m, s, v, mt) {
    const q = (sel) => root.querySelector(sel);
    q(".l3d-time").textContent = hm(m);
    q(".l3d-sun").textContent = s.el > -0.8 ? `Sun ${Math.max(0, Math.round(s.el))}° · ${compass(s.az)}` : `Sun ${Math.round(s.el)}°, below horizon`;
    const k = side(s).light;
    q(".l3d-tag").textContent = s.el < -6 ? "Night" : s.el < -0.8 ? "Blue hour" : k[0].toUpperCase() + k.slice(1) + (s.el < 8 && k !== "backlit" ? " · golden" : "");
    const ok = s.el > -3.2;
    const sum = ok && lit(SUMMIT.j, SUMMIT.i, SUMMIT.h, v.sj, v.si, v.tanE) > 0.5;
    const you = ok && lit(cj, ci, camZ, v.sj, v.si, v.tanE) > 0.5;
    q(".l3d-status").innerHTML = `<span><i class="${sum ? "on" : ""}"></i>Summit ${sum ? "in sun" : "in shade"}</span><span><i class="${you ? "on" : ""}"></i>You ${you ? "in sun" : "in shade"}</span>`;
    const x = pin[0], y = pin[1], z = pin[2] - mt.eye[2], f = x * mt.fw[0] + y * mt.fw[1] + z * mt.fw[2];
    const p = q(".l3d-pin");
    if (f > 0) {
      const sx = (x * mt.rt[0] + y * mt.rt[1] + z * mt.rt[2]) / f / mt.tx, sy = (x * mt.up[0] + y * mt.up[1] + z * mt.up[2]) / f / mt.ty;
      p.style.left = `${(sx * .5 + .5) * 100}%`; p.style.top = `${(.5 - sy * .5) * 100}%`; p.hidden = false;
    } else p.hidden = true;
    root.querySelectorAll(".l3d-moments [data-m]").forEach((b) => b.setAttribute("aria-current", Math.abs(+b.dataset.m - m) < 3));
  }
  function shell(views, i) {
    const v = views[i], d = v.date;
    return `<div class="l3d-head">
        <span class="label">Light on the mountain · 3D model</span>
        <h3>${v.title}</h3>
        <p class="l3d-meta">${v.dir[0].toUpperCase() + v.dir.slice(1)} · ${v.when} · modelled terrain, clear sky</p>
        ${views.length > 1 ? `<p class="l3d-views">${views.map((x, k) => `<button type="button" class="tlink" data-l3dview="${k}" aria-pressed="${k === i}">${x.tab}</button>`).join("")}</p>` : ""}
      </div>
      <div class="l3d-frame">
        <div class="l3d-hud"><b class="l3d-time">--:--</b><span class="l3d-sun"></span></div>
        <span class="l3d-tag"></span>
        <span class="l3d-pin" hidden>${v.peak}<br><small>${v.m}</small></span>
        <div class="l3d-status"></div>
        <div class="l3d-wait">Building the terrain…</div>
      </div>
      <div class="l3d-track">
        <div class="l3d-strip" aria-hidden="true"></div>
        <input type="range" class="l3d-range" min="360" max="1170" step="1" value="480" aria-label="Time of day on ${d[2]} Nov">
        <div class="l3d-ticks"><span>06</span><span>09</span><span>12</span><span>15</span><span>18</span></div>
        <div class="l3d-legend"><span><i class="warm"></i>Face in warm sun</span><span><i class="sun"></i>In sun</span><span><i class="shade"></i>In shade</span><span><i class="blue"></i>Blue hour</span></div>
        <button type="button" class="tlink l3d-play">Play the day</button>
      </div>
      <div class="l3d-verdict"><p class="l3d-meta">Working out the day…</p></div>
      <ul class="l3d-moments"></ul>
      <p class="l3d-meta l3d-note">${v.note} Terrain is a ~100 m grid (SRTM-derived Terrain Tiles, Mapzen / AWS open data); summits sit 100–250 m below the official heights shown. An estimate for a clear sky: times can be a few minutes off.</p>`;
  }

  /* ---------- mounting ---------- */
  let views = null, viewIdx = 0, busy = false, playing = false, lastTick = 0, pending = 0, io = null;
  const range = () => root.querySelector(".l3d-range");
  const request = () => { if (pending || busy) return; pending = requestAnimationFrame(() => { pending = 0; draw(+range().value); }); };
  function stopPlay() { playing = false; const b = root && root.querySelector(".l3d-play"); if (b) b.textContent = "Play the day"; }
  function tick(ts) {
    if (!playing || !root.isConnected) return stopPlay();
    if (ts - lastTick > 90) {
      lastTick = ts; const v = +range().value + 4;
      if (v > 1170) return stopPlay();
      range().value = v; draw(v);
    }
    requestAnimationFrame(tick);
  }
  async function open(el, list, i) {
    if (busy) return;
    stopPlay();
    root = el; views = list; viewIdx = i; V = list[i];
    el.innerHTML = shell(list, i);
    const frame = el.querySelector(".l3d-frame"), wait = el.querySelector(".l3d-wait");
    if (!initGL()) { wait.textContent = "This browser can't draw the 3D view (WebGL 2 needed)."; return; }
    frame.prepend(canvas);
    canvas.setAttribute("aria-label", `Modelled view ${V.dir} towards ${V.peak}, lit for the chosen time`);
    busy = true;
    try {
      H = await loadDem(V.dem);
      await new Promise((r) => setTimeout(r, 30));
      build();
      const a = analyse();
      el.querySelector(".l3d-verdict").innerHTML = a.P.map((p) => `<p>${p}</p>`).join("");
      el.querySelector(".l3d-strip").innerHTML = a.strip;
      el.querySelector(".l3d-moments").innerHTML = a.mom.map(([m, t, d]) => `<li><button type="button" class="tlink" data-m="${m}">${hm(m)}</button><span><span class="l3d-mt">${t}</span><span class="l3d-meta">${d}</span></span></li>`).join("");
      range().value = a.start;
      busy = false;
      draw(a.start);
      wait.remove();
      el.dataset.ready = V.id;
    } catch (err) { busy = false; wait.textContent = "Couldn't build the view: " + err.message; }
  }
  // Wire events once, at document level.
  document.addEventListener("input", (e) => { if (root && e.target.classList?.contains("l3d-range") && root.contains(e.target)) request(); });
  document.addEventListener("click", (e) => {
    if (!root || !root.contains(e.target)) return;
    const vb = e.target.closest("[data-l3dview]");
    if (vb) return open(root, views, +vb.dataset.l3dview);
    const mb = e.target.closest("[data-m]");
    if (mb) { range().value = mb.dataset.m; request(); root.querySelector(".l3d-frame").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" }); return; }
    const pb = e.target.closest(".l3d-play");
    if (pb) {
      if (playing) return stopPlay();
      playing = true; pb.textContent = "Pause";
      if (+range().value >= 1165) range().value = 360;
      requestAnimationFrame(tick);
    }
  });
  window.addEventListener("resize", () => { if (root && root.isConnected && !busy && V) request(); });

  // Called after a stop page renders: builds the view once it scrolls near.
  function attach(scope) {
    if (io) io.disconnect();
    const el = scope.querySelector("[data-l3d]");
    if (!el) return;
    const list = LIGHT3D[el.dataset.l3d];
    if (!list) return;
    el.innerHTML = shell(list, 0);
    if (!("IntersectionObserver" in window)) return void open(el, list, 0);
    io = new IntersectionObserver((ents) => {
      if (ents.some((x) => x.isIntersecting)) { io.disconnect(); io = null; open(el, list, 0); }
    }, { rootMargin: "300px 0px" });
    io.observe(el);
  }
  return { attach };
})();
