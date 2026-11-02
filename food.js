// Restaurants you've picked, by destination id (see destinations.js).
// Add as many as you like; they appear first under "Food" on that stop's page,
// above the research leads from the field guide.
//
//   name   English or local name (required)
//   zh     Chinese name — shown and used for the Amap search if no `map` is given
//   note   what to order, opening hours, why it's good
//   link   any web link: Dianping, Xiaohongshu, Trip.com, a blog post...
//   map    an Amap link if you have the exact place; otherwise one is built from zh/name
//
// Example:
//   shaxi: [
//     { name: "Old Theatre Inn café", zh: "古戏台客栈", note: "Coffee on the square, good at sunset", link: "https://..." },
//   ],
"use strict";
const FOOD = {
  // From the trip planning table (days, budgets, dishes). Details checked online where a
  // listing exists; hours and queues change, so confirm on the day.
  chengdu: [
    { name: "Mawangzi (Ma's Kitchen)", zh: "马旺子·川小馆", note: "Fri 6 Nov, first dinner. Sichuan classics; Michelin-listed, so expect a queue from opening (listed 11:00–14:00, 17:00–20:30). Budget ¥100–150 per person.", link: "https://guide.michelin.com/sg/zh_CN/chengdu-municipality/chengdu/restaurant/ma-s-kitchen" },
    { name: "Xiaomingtang", zh: "小名堂担担甜水面", note: "Sat 7 Nov. Zhong dumplings, dan dan noodles and sweet-water noodles. Several branches. Budget ¥15–20 per person.", link: "https://explorepartsunknown.com/sichuan/eat-like-bourdain-sichuan/" },
    { name: "Shu Daxia hotpot", zh: "蜀大侠火锅", note: "Sat 7 Nov. Sichuan hotpot from a martial-arts-themed Chengdu chain with many branches. Budget ¥80–150 per person.", link: "https://nz.trip.com/restaurant/china/chengdu/detail/restaurant-31853846" },
  ],
  siguniang: [
    { name: "Liji Brother Stewed Noodles, Dujiangyan", note: "Sun 8 Nov, breakfast on the drive. Not found online and no Chinese name in the plan: ask the driver.", map: amap("炖面", "都江堰市") },
    { name: "Lunch at the Wolong panda base", note: "Sun 8 Nov. The plan names the stop, not a restaurant.", map: amap("卧龙 熊猫", "汶川县 四川省") },
    { name: "Tibetan café or yak-meat hotpot", zh: "牦牛肉火锅", note: "Sun 8 Nov, dinner in Siguniang town. The plan names the style, not a place." },
    { name: "Abalang Tibetan Garden Restaurant", zh: "阿巴郎·藏式花园餐厅", note: "Mon 9 Nov, breakfast. Reviews mention yak hotpot and highland-barley yogurt cake; one review places it in Changping Valley rather than Shuangqiao, so confirm where it is.", link: "https://ae.trip.com/restaurant/china/xiaojin/detail/restaurant-78677991" },
  ],
  danba: [
    { name: "Weizhiyuan", zh: "丹巴味之源餐厅", note: "Mon 9 Nov, dinner in Danba. Not found online; the Chinese name is from the plan." },
  ],
  tagong: [
    { name: "A Tibetan guesthouse restaurant", zh: "藏餐", note: "Tue 10 Nov. The plan names the style, not a place." },
  ],
};
