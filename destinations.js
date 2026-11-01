// Destinations: the itinerary grouped by where you are, not by stop.
// days   = itinerary days spent (wholly or partly) here
// stay   = STAYS key for the night(s) here
// lead   = PLACES id whose history/food/cautions describe the destination
// places = everything you can visit from here (PLACES ids), in route order
// voucher = rendered booking pages in vouchers/ (kept out of git)
"use strict";
const DESTS = [
  { id: "chengdu", name: "Chengdu", zh: "成都", region: "sichuan",
    days: ["2026-11-06", "2026-11-07"], stay: "chengdu", lead: null, places: [], voucher: 4,
    voucherLabels: ["Ikho & Anastasia's room · 7–8 Nov", "", "Vitor & Ricardo's room · 6–8 Nov", ""],
    intro: "The arrival city and a soft start: rest, street life around Chunxi Road and Taikoo Li, a first Sichuan meal, and preparation before the mountains." },
  { id: "siguniang", name: "Siguniang", zh: "四姑娘山", region: "sichuan",
    days: ["2026-11-08", "2026-11-09"], stay: "siguniang", lead: "siguniang", places: ["dujiangyan", "wolong", "siguniang", "shuangqiao"], voucher: 2 },
  { id: "danba", name: "Danba & Jiaju", zh: "丹巴 · 甲居", region: "sichuan",
    days: ["2026-11-09", "2026-11-10"], stay: "danba", lead: "danba", places: ["danba", "jiaju", "zhonglu", "suopo"], voucher: 2 },
  { id: "tagong", name: "Tagong", zh: "塔公", region: "sichuan",
    days: ["2026-11-10", "2026-11-11"], stay: "tagong", lead: "tagongGrass", places: ["tagongGrass", "tagongMonastery"], voucher: 2,
    intro: "The first night on the plateau proper, at around 3,700 m: open grassland, prayer flags, herds and Tagong Monastery, in the cultural landscape of Kham." },
  { id: "yajiang", name: "Yajiang", zh: "雅江", region: "sichuan",
    days: ["2026-11-11"], stay: "yajiang", lead: null, places: ["gunong", "muya", "heishicheng"], voucher: 2,
    intro: "An overnight stop at the end of a long plateau day through pastoral country, past Gunong, the Muya Great Temple and the Heishicheng area." },
  { id: "yading", name: "Litang, Daocheng & Yading", zh: "理塘 · 稻城亚丁", region: "sichuan",
    days: ["2026-11-12", "2026-11-13"], stay: "daocheng", lead: "yading", places: ["litang", "changqing", "yading", "chonggu", "pearl", "luorong", "milkLake"], voucher: 2 },
  { id: "meili", name: "Deqin & Meili", zh: "德钦 · 梅里雪山", region: "yunnan",
    days: ["2026-11-14", "2026-11-15"], stay: "deqin", lead: "meili", places: ["meili", "feilai"], voucher: 2,
    intro: "The approach to the eastern Himalaya: the sacred Meili range above Deqin, watched from the Feilai Temple viewpoints, where your lodge stands." },
  { id: "shangrila", name: "Shangri-La", zh: "香格里拉", region: "yunnan",
    days: ["2026-11-15", "2026-11-16"], stay: "shangrila", lead: "dukezong", places: ["dukezong", "songzanlin", "napa"], voucher: 2 },
  { id: "lijiang", name: "Lijiang", zh: "丽江", region: "yunnan",
    days: ["2026-11-16", "2026-11-17"], stay: "lijiang", lead: "lijiangOld", places: ["lijiangOld", "blueMoon", "impression", "jadeDragon", "blackDragon", "wangu", "baisha", "shuhe"], voucher: 2 },
  { id: "shaxi", name: "Shaxi", zh: "沙溪", region: "yunnan",
    days: ["2026-11-18"], stay: "shaxi", lead: "shaxi", places: ["shaxi", "shibaoshan"], voucher: 1 },
  { id: "dali", name: "Erhai & Dali", zh: "洱海 · 大理", region: "yunnan",
    days: ["2026-11-19", "2026-11-20"], stay: "dali", lead: "daliOld", places: ["erhai", "daliOld", "xizhou", "zhoucheng"], voucher: 1 },
  { id: "kunming", name: "Kunming", zh: "昆明", region: "yunnan",
    days: ["2026-11-20"], stay: null, lead: null, places: [], voucher: 0,
    intro: "The end of the road: a morning transfer from Dali, arriving in the afternoon. No hotel or onward booking is in the files yet." },
];
