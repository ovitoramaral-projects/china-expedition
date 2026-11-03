// Trip data for the China Expedition itinerary page.
// Sources: knowledge/itinerary_working.txt (route + day text) and the hotel
// booking vouchers (dates, addresses). Where the two disagree, the day carries
// a `flags` entry instead of silently picking one.
// Amap links are KEYWORD SEARCHES, not verified pins.

const amap = (keyword, city) =>
  "https://uri.amap.com/search?keyword=" + encodeURIComponent(keyword) +
  "&view=map&src=chinaexpedition&callnative=1" +
  (city ? "&city=" + encodeURIComponent(city) : "");

const C = {
  chengdu: "成都市",
  xiaojin: "小金县 四川省",
  danba: "丹巴县 四川省",
  kangding: "康定市 四川省",
  yajiang: "雅江县 四川省",
  daocheng: "稻城县 四川省",
  deqin: "德钦县 云南省",
  shangrila: "香格里拉市 云南省",
  lijiang: "丽江市 云南省",
  jianchuan: "剑川县 云南省",
  dali: "大理市 云南省",
};

const STAYS = {
  chengdu: {
    name: "Poshpacker Chengdu Flipflop Hostel",
    sub: "Taikoo Li / Chunxi Road Metro Station",
    address: "No. 98 Dongsheng Street, Jinjiang District, Chengdu",
    dates: "two rooms: Vitor & Ricardo 6 → 8 Nov, Ikho & Nia 7 → 8 Nov",
    phone: "+86 028-62500185",
    checkin: "After 14:00", checkout: "Before 12:00",
    meals: "No breakfast",
    map: amap("Poshpacker Chengdu Flipflop Hostel", C.chengdu),
    nearby: [
      ["春熙路 Chunxi Road", amap("春熙路", C.chengdu), "≈420–620 m (listing figure)"],
      ["太古里 Taikoo Li", amap("成都远洋太古里", C.chengdu), "≈650 m (listing figure)"],
      ["IFS", amap("成都国际金融中心", C.chengdu), "≈630 m (listing figure)"],
    ],
    note: "Two rooms on two vouchers: Vitor & Ricardo arrive 6 Nov (booked 6–8 Nov); Ikho & Nia arrive 7 Nov (booked 7–8 Nov). Airport pickup available for a fee — contact the hostel at least 72 h before arrival.",
  },
  siguniang: {
    name: "Qianyu Cloud Lodge",
    sub: "Oxygen-supply smart mountain stay",
    address: "No. 44, Village Group 1, Shuangqiao Village, Xiaojin, Sichuan",
    dates: "Nov 8 → Nov 9",
    checkin: "After 14:00", checkout: "Before 12:00",
    meals: "Breakfast included (Nov 9)",
    map: amap("Qianyu Cloud Lodge 双桥村", C.xiaojin),
    nearby: [
      ["双桥沟 Shuangqiao Valley", amap("双桥沟", C.xiaojin)],
      ["双桥村 Shuangqiao Village", amap("双桥村", C.xiaojin)],
    ],
  },
  danba: {
    name: "Danba Starry Sky Photography Meisu",
    sub: "No. 1 Observation Deck",
    address: "Beside Viewing Platform No. 1, Jiaju Tibetan Village, Danba, Sichuan",
    dates: "Nov 9 → Nov 10",
    checkin: "After 14:00", checkout: "Before 12:00",
    meals: "Breakfast included (Nov 10)",
    map: amap("Danba Starry Sky Photography Meisu 丹巴", C.danba),
    nearby: [
      ["甲居藏寨 Jiaju Tibetan Village", amap("甲居藏寨", C.danba)],
      ["丹巴县城 Danba town", amap("丹巴县城", C.danba)],
    ],
    note: "The voucher address places this stay in Jiaju village itself, not Danba town.",
  },
  tagong: {
    name: "Kangding Tagong Prairie Mandala Hotel",
    address: "South side of the road, 50 m east of the Airport Road junction, Provincial Highway 215, Tagong Town, Kangding",
    dates: "Nov 10 → Nov 11",
    checkin: "After 14:00", checkout: "Before 12:00",
    meals: "Breakfast included (Nov 11)",
    map: amap("Kangding Tagong Prairie Mandala Hotel", C.kangding),
    nearby: [
      ["塔公寺 Tagong Monastery", amap("塔公寺", C.kangding)],
      ["塔公草原 Tagong Grassland", amap("塔公草原", C.kangding)],
    ],
    note: "Package lists an oxygen concentrator overnight.",
  },
  yajiang: {
    name: "Home Inn (Muya Plaza, Yajiang)",
    address: "No. 35 Jiefanghou Street, Yajiang, Sichuan",
    dates: "Nov 11 → Nov 12",
    checkin: "After 12:00", checkout: "Before 12:00",
    meals: "No meals",
    map: amap("Home Inn 雅江", C.yajiang),
    nearby: [["雅江县城 Yajiang town", amap("雅江县城", C.yajiang)]],
  },
  daocheng: {
    name: "Daocheng Yading Huajing Wenlan Hotel",
    address: "稻城亚丁华景文澜酒店",
    dates: "Nov 12 → Nov 14",
    phone: "0836-696-6888 (reservations)",
    meals: "Breakfast 7:00–9:00",
    map: amap("稻城亚丁华景文澜酒店", C.daocheng),
    nearby: [
      ["稻城亚丁景区 Yading Reserve", amap("稻城亚丁景区", C.daocheng)],
      ["稻城县城 Daocheng town", amap("稻城县城", C.daocheng)],
    ],
    note: "The booking email gives no street address, so the Chinese hotel name is shown to copy instead. Booked by the organiser (川越旅行) and paid by the tour leader.",
  },
  deqin: {
    name: "Meili Yunjing Mountain Lodge",
    address: "No. 15, Feilai Temple, Jushui Villagers Committee, Shengping Town, Deqin, Yunnan",
    dates: "Nov 14 → Nov 15",
    checkin: "After 14:00", checkout: "Before 12:00",
    meals: "Breakfast included (Nov 15)",
    map: amap("Meili Yunjing Mountain Lodge 德钦", C.deqin),
    nearby: [
      ["飞来寺 Feilai Temple", amap("飞来寺", C.deqin)],
      ["梅里雪山 Meili Snow Mountain", amap("梅里雪山", C.deqin)],
    ],
  },
  shangrila: {
    name: "Shangri-La Yunbian View Homestay",
    address: "No. 23, Cuolang, Dukezong Ancient Town, Jiantang Town",
    dates: "Nov 15 → Nov 16",
    phone: "+86 133 8887 3873",
    checkin: "After 14:00", checkout: "Before 12:00",
    meals: "No breakfast",
    map: amap("香格里拉云边观景民宿", C.shangrila),
    nearby: [
      ["独克宗古城 Dukezong Old Town", amap("独克宗古城", C.shangrila)],
      ["龟山公园 Guishan Park (prayer wheel)", amap("龟山公园", C.shangrila)],
    ],
    note: "Room has an oxygen generator and floor heating. Old-town lanes are the natural walking area.",
  },
  lijiang: {
    name: "Lijiang Yueshang Snow View Hotel — XUE SHAN INN",
    sub: "Old Town Dashuiche store",
    address: "No. 2 Jinjia Lane, Xi'an Subdistrict, Gucheng District, Lijiang",
    dates: "Nov 16 → Nov 18 (two 1-night vouchers)",
    phone: "+86 159 8795 0892",
    checkin: "After 14:00", checkout: "Before 14:00",
    meals: "No meals",
    map: amap("丽江悦尚雪景酒店", C.lijiang),
    nearby: [
      ["丽江古城 Lijiang Old Town", amap("丽江古城", C.lijiang)],
      ["大水车 Big Waterwheel", amap("大水车", C.lijiang)],
      ["黑龙潭公园 Black Dragon Pool", amap("黑龙潭公园", C.lijiang)],
    ],
  },
  shaxi: {
    name: "Dream Creek B&B",
    address: "No. 72, Sideng Village, Shaxi Town, Jianchuan, Yunnan",
    dates: "Nov 18 → Nov 19",
    phone: "+86 138 8728 5289",
    checkin: "After 14:00", checkout: "Before 12:00",
    meals: "Breakfast included (Nov 19)",
    map: amap("Dream Creek B&B 沙溪梦溪客栈", C.jianchuan),
    nearby: [
      ["寺登街 Sideng Street", amap("寺登街", C.jianchuan)],
      ["沙溪古镇 Shaxi Old Town", amap("沙溪古镇", C.jianchuan)],
      ["欧阳大院 Ouyang Courtyard", amap("欧阳大院", C.jianchuan)],
    ],
  },
  dali: {
    name: "Dali Pear Blossom Sea View Homestay",
    address: "No. 22, Village Group 8, Dazhuang Village, Taihe Subdistrict, Xiaguan, Dali",
    dates: "Nov 19 → Nov 20",
    phone: "+86 193 8723 6017",
    checkin: "After 14:00", checkout: "Before 12:00",
    meals: "Breakfast included (Nov 20)",
    map: amap("大理梨花海景民宿", C.dali),
    nearby: [
      ["大庄村 Dazhuang Village", amap("大庄村", C.dali)],
      ["洱海 Erhai Lake", amap("洱海", C.dali)],
      ["大理古城 Dali Old Town (drive)", amap("大理古城", C.dali)],
    ],
    note: "This is in Xiaguan, NOT Dali Ancient Town — don't assume the old town is walkable.",
  },
};

const DAYS = [
  {
    date: "2026-11-06", label: "Arrival", region: "sichuan",
    title: "Arrive in Chengdu",
    route: ["Chengdu"],
    summary: "Transfer to the hostel and check in. Keep the evening relaxed after the journey.",
    focus: "Arrival, rest — and if energy permits, an evening walk around Chunxi Road or Taikoo Li.",
    stay: "chengdu",
    notes: ["Vitor & Ricardo arrive today (room booked 6–8 Nov). Ikho & Nia join on 7 Nov (room booked 7–8 Nov).", "Flights out: Ricardo departs 5 Nov 18:00, Vitor 5 Nov 20:35 (CET). Arrival times in Chengdu not given."],
    flags: ["Nia's flight departs 6 Nov 00:25 (arrival time not given), but her room is booked from 7 Nov. Check when she lands and whether she needs the night of 6 Nov."],
  },
  {
    date: "2026-11-07", label: "Day 1", region: "sichuan",
    title: "Chengdu city day",
    route: ["Chengdu"],
    summary: "Explore the neighbourhood and enjoy your first Sichuan meal.",
    focus: "Street life, food and preparation.",
    notes: ["Ikho lands at 11:00 (departed 7 Nov, 00:40). Nia joins today too."],
    stay: "chengdu",
  },
  {
    date: "2026-11-08", label: "Day 2", region: "sichuan",
    title: "Into the mountains",
    route: ["Chengdu", "Dujiangyan", "Wolong", "Siguniang"],
    summary: "Travel via Dujiangyan and Wolong, crossing the Balang Mountain area, to the Siguniangshan region.",
    focus: "The transition from the Sichuan basin to the high mountains.",
    notes: ["Dujiangyan and Wolong are route stops — no specific site or panda-centre visit is confirmed."],
    stay: "siguniang",
  },
  {
    date: "2026-11-09", label: "Day 3", region: "sichuan",
    title: "Siguniang scenery, on to Danba",
    route: ["Siguniang", "Shuangqiao Valley", "Danba"],
    summary: "Mountain scenery before continuing to Danba. Shuangqiao Valley is the main sightseeing option (shuttle buses + walking paths).",
    focus: "Alpine landscapes, mountain villages and the journey into Danba.",
    stay: "danba",
  },
  {
    date: "2026-11-10", label: "Day 4", region: "sichuan",
    title: "Jiaju Tibetan Village and up to Tagong",
    route: ["Danba", "Jiaju", "Tagong"],
    summary: "Visit Jiaju's hillside Tibetan houses, then continue up onto the plateau to Tagong.",
    focus: "Jiarong Tibetan architecture, village life and the cultural transition into Kham.",
    stay: "tagong",
  },
  {
    date: "2026-11-11", label: "Day 5", region: "sichuan",
    title: "Plateau monasteries to Yajiang",
    route: ["Tagong", "Gunong", "Muya Great Temple", "Heishicheng", "Yajiang"],
    summary: "Pastoral plateau landscapes, stopping around Gunong and Muya Great Temple. Tagong Monastery is worth fitting in if the schedule permits.",
    focus: "Tibetan Buddhist life, monasteries, prayer flags, herding culture and highland scenery.",
    stay: "yajiang",
  },
  {
    date: "2026-11-12", label: "Day 6", region: "sichuan",
    title: "Over the high plateau via Litang",
    route: ["Yajiang", "Litang", "Changqingchunke'er Temple", "Shangri-La?"],
    altitude: "Litang ≈ 3,950 m",
    summary: "Cross the high plateau via Litang and visit Changqingchunke'er Temple.",
    focus: "High-altitude Tibetan town life and religious practice.",
    stay: "daocheng",
    flags: [
      "Itinerary text ends the day in \"Shangri-La\", but the hotel booking is in Daocheng/Yading from 12 Nov. Confirm the real overnight town and drive sequence with the organiser/driver.",
    ],
  },
  {
    date: "2026-11-13", label: "Day 7", region: "sichuan",
    title: "Yading Nature Reserve",
    route: ["Yading"],
    altitude: "Long hike up to ≈4,600–4,700 m",
    summary: "Full day in Yading's high-altitude landscape. Confirm the walking route with your guide.",
    focus: "Alpine lakes, snow peaks and the expedition's major mountain experience.",
    options: [
      ["Easier", "Pearl Lake route — the less demanding option."],
      ["Hard", "Milk Lake + Five-Color Lake — ≈10–11 km round trip, a serious high-altitude outing. Don't force it if you feel unwell."],
    ],
    stay: "daocheng",
  },
  {
    date: "2026-11-14", label: "Day 8", region: "yunnan",
    title: "Towards Deqin & Meili",
    route: ["Shangri-La?", "Deqin"],
    summary: "Travel towards Deqin and the Meili Snow Mountain area through changing highland scenery.",
    focus: "Mountain travel and the approach to the eastern Himalaya.",
    stay: "deqin",
    flags: [
      "Itinerary says \"Shangri-La → Deqin\", but you'd be leaving the Daocheng/Yading hotel this morning. Confirm the start point and drive time.",
    ],
  },
  {
    date: "2026-11-15", label: "Day 9", region: "yunnan",
    title: "Meili Snow Mountain, back to Shangri-La",
    route: ["Deqin", "Feilai Temple viewpoints", "Shangri-La"],
    summary: "Time at the Meili viewpoints around Feilai Temple, then return to Shangri-La.",
    focus: "Mountain panoramas, changing light and communities around sacred peaks.",
    stay: "shangrila",
  },
  {
    date: "2026-11-16", label: "Day 10", region: "yunnan",
    title: "Songzanlin Monastery, then Lijiang",
    route: ["Shangri-La", "Songzanlin Monastery", "Lijiang"],
    summary: "Visit Songzanlin, one of Yunnan's most important Tibetan Buddhist monasteries, then drive to Lijiang.",
    focus: "Monastery architecture, religious life, and the move into Naxi cultural territory.",
    notes: ["Nia is dropped at Diqing Shangri-La airport today and leaves the trip here."],
    flags: ["Nia's flight is at 08:50, so the airport drop has to come first thing, before Songzanlin. Agree the morning order with the driver."],
    stay: "lijiang",
  },
  {
    date: "2026-11-17", label: "Day 11", region: "yunnan",
    title: "Blue Moon Valley & Impression Lijiang",
    route: ["Lijiang", "Blue Moon Valley", "Impression Lijiang show", "Lijiang"],
    summary: "A Jade Dragon Snow Mountain day without the summit: Blue Moon Valley's turquoise lakes, waterfalls and mountain views, then the Impression Lijiang show, a large outdoor performance of traditional music and dance with the snow mountain as its backdrop. No glacier cable car to 4,500 m.",
    focus: "Landscape photography at the lakes, then Naxi music and dance against the mountain.",
    options: [
      ["Chosen", "Blue Moon Valley, then the Impression Lijiang show."],
      ["Not doing", "The summit cable car to around 4,500 m: crowded and very high."],
      ["Not chosen", "Yuhu & Baisha villages, the quieter cultural alternative. Still nearby if plans change."],
    ],
    notes: ["Book show tickets and confirm the showtime and transfer with the driver."],
    stay: "lijiang",
  },
  {
    date: "2026-11-18", label: "Day 12", region: "yunnan",
    title: "Shaxi Ancient Town",
    route: ["Lijiang", "Shaxi"],
    summary: "Historic Tea Horse Road settlement. Explore the old streets, market square and surrounding villages at a slower pace.",
    focus: "Everyday local life, trade-route history and a quieter documentary rhythm.",
    stay: "shaxi",
  },
  {
    date: "2026-11-19", label: "Day 13", region: "yunnan",
    title: "Erhai Lake and Dali",
    route: ["Shaxi", "Erhai Lake", "Dali"],
    summary: "Depending on timing, explore lakeside villages and farmland before settling in Dali.",
    focus: "Bai cultural landscapes, farming, the lake — a contrast with the plateau.",
    stay: "dali",
  },
  {
    date: "2026-11-20", label: "Day 14", region: "yunnan",
    title: "Dali to Kunming, the last day",
    route: ["Dali", "Kunming"],
    summary: "Morning transfer to Kunming, arriving in the afternoon.",
    focus: "Closing the journey.",
    stay: null,
    notes: ["Flights home: Ikho 20:50 from Kunming; Ricardo at midnight (night of 20 → 21 Nov); Vitor 21 Nov 08:30 from Kunming."],
    flags: ["No Kunming hotel is booked for tonight, but Vitor's flight is 21 Nov 08:30. He needs a bed near the airport (and Ricardo somewhere to wait until midnight)."],
  },
];

const ARC = [
  ["Tibetan highland communities", "Danba, Jiaju, Tagong, Muya, Litang — village life, pastoral culture, Buddhist practice, daily routines."],
  ["Mountains & sacred landscapes", "Siguniang, Yading, Meili — the scale of the plateau, changing weather, the cultural meaning of mountains."],
  ["Living Buddhist traditions", "Tagong Monastery, Muya Great Temple, Changqingchunke'er, Songzanlin — architecture alongside people and practice."],
  ["Tea Horse Road & Yunnan", "Lijiang, Shaxi, Dali — Naxi and Bai landscapes, trade history, village life, contemporary tourism."],
];

const PRACTICAL = [
  ["Weather & roads", "November can bring snow, ice and sudden temperature drops on high mountain roads. Keep flexibility on plateau driving days."],
  ["Altitude", "Yading is the most demanding hiking day. Confirm the route with your guide and don't force the long hike if unwell."],
  ["Photography", "Prioritise people and everyday activity over ticking off landmarks. Tagong, Litang, Songzanlin and Shaxi are strong cultural anchors."],
  ["Amap links", "Every map link is a keyword search, not a verified pin. Pick the correct result in Amap before starting navigation."],
  ["Timings", "Departure times, stop durations and local detours aren't specified — confirm them with the driver or guide."],
];

const GEAR = [
  ["Main camera", ["Fujifilm X-T5", "Sigma 17–40mm F1.8", "Sirui 55mm T1.2", "ND filter (1–5 stops)", "Pro-Mist 1/8 filter (strength to confirm)", "Tripod"]],
  ["Action camera", ["DJI Osmo Action 6 (Essential Combo)", "FOV Boost Lens", "Utility Frame", "ND Filter Set", "Osmo Action Handlebar Mount", "Osmo Action Dual-Direction Mini Handlebar Mount"]],
];

// Approximate elevation (m) of each night's sleeping place, from general
// geographic references — NOT from the trip files. `high` = the day's highest
// point: Litang and the Yading lakes are named in the itinerary; the passes,
// Muya and Blue Moon Valley follow PEAK in destinations.js (general references).
const ELEV = {
  "2026-11-06": { town: "Chengdu", m: 500 },
  "2026-11-07": { town: "Chengdu", m: 500 },
  "2026-11-08": { town: "Shuangqiao", m: 3100, high: 4480, highLabel: "Balang pass" },
  "2026-11-09": { town: "Jiaju", m: 2000 },
  "2026-11-10": { town: "Tagong", m: 3700 },
  "2026-11-11": { town: "Yajiang", m: 2600, high: 3800, highLabel: "Muya grasslands" },
  "2026-11-12": { town: "Daocheng?", m: 3750, high: 3950, highLabel: "Litang" },
  "2026-11-13": { town: "Daocheng?", m: 3750, high: 4700, highLabel: "Yading lakes" },
  "2026-11-14": { town: "Feilai Temple", m: 3400, high: 4290, highLabel: "Baima pass" },
  "2026-11-15": { town: "Shangri-La", m: 3200, high: 4290, highLabel: "Baima pass" },
  "2026-11-16": { town: "Lijiang", m: 2400 },
  "2026-11-17": { town: "Lijiang", m: 2400, high: 3000, highLabel: "Blue Moon Valley" },
  "2026-11-18": { town: "Shaxi", m: 2100 },
  "2026-11-19": { town: "Dali", m: 2000 },
  "2026-11-20": { town: "Kunming", m: 1900 },
};

// The crew (first names only). `until` = last day with the group.
// Flights as the user gave them on 3 Nov 2026. "out" is the departure from home (local
// time there; only Vitor's was given with a time zone); arrival times in Chengdu are not
// known except Ikho's. "back" is the flight home. Not checked against any ticket.
const CREW = [
  { name: "Vitor",
    out: { date: "2026-11-05", time: "20:35", note: "CET" },
    back: { date: "2026-11-21", time: "08:30", from: "from Kunming" } },
  { name: "Ricardo", until: "2026-11-20",
    out: { date: "2026-11-05", time: "18:00" },
    back: { date: "2026-11-21", time: "00:00", note: "midnight, night of 20 → 21 Nov" } },
  { name: "Ikho", from: "2026-11-07", until: "2026-11-20",
    out: { date: "2026-11-07", time: "00:40", note: "lands in Chengdu 11:00" },
    back: { date: "2026-11-20", time: "20:50", from: "from Kunming" } },
  { name: "Nia", from: "2026-11-07", until: "2026-11-16",
    out: { date: "2026-11-06", time: "00:25" },
    back: { date: "2026-11-16", time: "08:50", from: "from Diqing Shangri-La" } },
  { name: "Cary", role: "Driver", note: "With us for the whole itinerary" },
];
