// Ticket advice per place (place ids from places.js). Researched online on 2 Nov 2026
// from travel guides and booking sites, not official ticket offices, and the sources
// often disagree on prices: treat every figure as approximate and confirm on the day.
//
//   book   "ahead" = book before you go; "gate" = pay on site
//   text   the recommendation shown on the place
//   src    [label, url] pairs the advice came from
"use strict";

const TICKETS = {
  dujiangyan: {
    book: "gate",
    text: "Only needed if you go into the irrigation scenic area. About ¥80 (some guides list ¥60 out of season). Pay at the gate; the online route through the scenic area's WeChat account is built for Chinese ID cards. Bring passports.",
    src: [["Sichuan Travel Guide: Dujiangyan", "https://www.sichuantravelguide.com/dujiangyan/"]],
  },
  wolong: {
    book: "ahead",
    text: "Shenshuping panda base, about ¥90. Book 1–3 days ahead; online booking can need a Chinese phone number, so ask the organiser or driver to reserve. Show passports at entry. The Panda Tower needs its own WeChat reservation and closes on Tuesdays.",
    src: [["Travel China With Me: Chengdu panda bases", "https://travelchinawith.me/giant-panda/chengdu-panda-bases-guide/"], ["Klook: Wolong Shenshuping base", "https://www.klook.com/activity/120527-wolong-china-panda-garden-shenshuping-base/"]],
  },
  shuangqiao: {
    book: "ahead",
    text: "Each valley has its own ticket. Shuangqiao is about ¥80 entry plus ¥70 for the sightseeing bus, sometimes cheaper out of season. Book at least a day ahead (real-name, through the Aba tourism or Siguniang official WeChat); foreign passports may not work online, so ask the organiser to book. Daily visitor cap.",
    src: [["Sichuan Travel Guide: Siguniang tickets", "https://sichuantravelguide.com/siguniangshan-travel-guide/ticket-booking.html"], ["China for Travelers: Mount Siguniang", "https://chinafortravelers.com/guides/mount-siguniang/"]],
  },
  jiaju: {
    book: "gate",
    text: "About ¥50 at the Jiaju visitor centre gate, plus an optional ~¥35 shuttle to the viewpoint. You sleep inside the village, so ask the guesthouse whether staying covers or discounts entry.",
    src: [["Sichuan Travel Guide: Jiaju", "https://sichuantravelguide.com/danba/jiaju-tibetan-village.html"]],
  },
  yading: {
    book: "ahead",
    text: "Real-name entry ticket plus the compulsory shuttle bus. Chinese ID holders book online; guides say foreigners buy at the ticket office with passports, from a share of daily tickets kept for passport holders. Ask the organiser to reserve, and get there early.",
    src: [["Sichuan Travel Guide: Yading tickets", "https://www.sichuantravelguide.com/daocheng-yading/ticket-information.html"], ["KKday: Yading ticket + shuttle", "https://www.kkday.com/en/product/601843"]],
  },
  chonggu: { book: "gate", text: "Inside the Yading reserve: covered by the reserve ticket and shuttle.", src: [] },
  pearl: { book: "gate", text: "Inside the Yading reserve: covered by the reserve ticket and shuttle.", src: [] },
  luorong: { book: "gate", text: "Inside the Yading reserve: covered by the reserve ticket. Check whether the electric cart, if running, costs extra.", src: [] },
  milkLake: { book: "gate", text: "Inside the Yading reserve: covered by the reserve ticket.", src: [] },
  feilai: {
    book: "gate",
    text: "The village and temple area are free; the viewing platforms charge, with guides listing ¥40–60. Pay on site.",
    src: [["China Xian Tour: Meili Snow Mountain", "https://www.chinaxiantour.com/shangri-la-attractions/meili-snow-mountain.html"], ["East China Trip: Meili guide", "https://www.eastchinatrip.com/meili-snow-mountain-travel-guide/"]],
  },
  songzanlin: {
    book: "gate",
    text: "About ¥55 entry, or about ¥90 with the sightseeing bus and a guide. Buy at the ticket centre or through the monastery's official WeChat account.",
    src: [["Wander in China: Songzanlin", "https://wanderinchina.com/destinations/shangri-la/songzanlin-monastery/"]],
  },
  jadeDragon: {
    book: "ahead",
    text: "Blue Moon Valley sits inside the Jade Dragon Snow Mountain scenic area: entry plus the shuttle bus. Book ahead; the area caps daily visitors. A foreigner-friendly package or the organiser is easiest. Keep the Lijiang Old Town fee receipt too: guides say it's checked at the Jade Dragon ticket counter.",
    src: [["China for Travelers: Jade Dragon", "https://chinafortravelers.com/guides/jade-dragon-snow-mountain/"], ["Fabio Nodari: Jade Dragon guide", "https://www.fabionodariphoto.com/en/jade-dragon-snow-mountain-lijiang-guide/"]],
  },
  blueMoon: {
    book: "ahead",
    text: "Part of the Jade Dragon Snow Mountain scenic area ticket plus shuttle bus: book it ahead with the Impression Lijiang show. Daily visitor cap.",
    src: [["China for Travelers: Jade Dragon", "https://chinafortravelers.com/guides/jade-dragon-snow-mountain/"]],
  },
  impression: {
    book: "ahead",
    text: "Book seats ahead, about ¥190–248. About an hour, in Mandarin with English subtitles. Guides disagree on showtimes (daytime 11:00 and 14:00 vs evening), so confirm the time when you book. Bad weather can cancel it.",
    src: [["China Highlights: Impression Lijiang", "https://www.chinahighlights.com/lijiang/attraction/impression-lijiang-show.htm"], ["Klook: Impression Lijiang tickets", "https://www.klook.com/activity/7257-lijiang-impression-show-yunnan/"]],
  },
  lijiangOld: {
    book: "gate",
    text: "Old Town maintenance fee: ¥50 per person since August 2025, valid a year. There's no gate; it's checked at Black Dragon Pool and the Jade Dragon ticket counter, so keep the receipt.",
    src: [["ECNS: New ¥50 fee for Lijiang Ancient Town", "https://www.ecns.cn/m/news/society/2025-07-18/detail-ihetkhrv8787025.shtml"]],
  },
  blackDragon: {
    book: "gate",
    text: "Entry is covered by the Lijiang Old Town maintenance fee receipt.",
    src: [["ECNS: New ¥50 fee for Lijiang Ancient Town", "https://www.ecns.cn/m/news/society/2025-07-18/detail-ihetkhrv8787025.shtml"]],
  },
  shibaoshan: {
    book: "gate",
    text: "About ¥45 entry plus ¥40 for the shuttle to the grottoes (¥75 combined from the Shaxi tourist centre). Open about 8:00–17:00.",
    src: [["Lonely Planet: Shibaoshan", "https://www.lonelyplanet.com/points-of-interest/shibaoshan/1621445"], ["Travel China With Me: Shibaoshan", "https://travelchinawith.me/attractions/yunnan/dali/shibaoshan/"]],
  },
};
