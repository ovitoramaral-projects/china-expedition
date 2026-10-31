// Place guide — content from knowledge/location_field_guide_v1.4.md.
// status: "planned"     = named in the current working itinerary
//         "unconfirmed" = named in the itinerary, but the exact site/Chinese name
//                         still needs confirming with the operator
//         "optional"    = nearby place from the older supplier route or the guide's
//                         suggestions; NOT in the current plan unless confirmed
// Amap links are keyword searches, not verified pins.

const PLACE_STATUS = {
  planned: "On the plan",
  unconfirmed: "Exact site to confirm",
  optional: "Optional, not in current plan",
};

const PLACES = {
  /* ---------------- Nov 8 ---------------- */
  dujiangyan: {
    name: "Dujiangyan", zh: "都江堰", kind: "Route stop", status: "unconfirmed",
    map: amap("都江堰景区", "都江堰市 四川省"),
    about: "A passage point on the way from Chengdu towards Wolong and Siguniang.",
    care: ["The itinerary doesn't say how long you stop or which site. Ask whether it's a brief transit stop or a proper visit."],
  },
  wolong: {
    name: "Wolong", zh: "卧龙", kind: "Route stop", status: "unconfirmed",
    map: amap("卧龙自然保护区", "汶川县 四川省"),
    about: "Named as a route stop before Siguniang, crossing the Balang Mountain area.",
    care: ["No reserve facility, village or visitor centre is specified. Don't assume a panda-centre visit unless the operator confirms it."],
  },
  siguniang: {
    name: "Mount Siguniang", zh: "四姑娘山", kind: "Mountain area", status: "planned",
    map: amap("四姑娘山", C.xiaojin),
    about: "A mountain group in Xiaojin County, western Sichuan. The experience is less about a summit and more about seeing the scale of the terrain through valleys, forest, rock, streams and changing weather.",
    history: "The area sits where high-mountain ecosystems meet Tibetan and Qiang cultural landscapes. Valley routes, grazing areas, settlement patterns and seasonal weather shape how people move through it. The park treats Shuangqiao, Changping and Haizi valleys as separate visitor areas with their own tickets.",
    todo: ["Rilong / Siguniangshan town: a short evening walk, a meal and preparation. It's a mountain gateway, not a place for a late night before a cold outdoor day."],
    food: "Hot noodle soups, yak or beef dishes, Tibetan-style momos, warming hotpot, stir-fried vegetables with rice. Ask the driver or hotel for a family restaurant that's open near where you're staying.",
    care: [
      "Cold, wind, snow and ice can arrive quickly. Keep gloves, hat and a waterproof/windproof layer accessible, not buried in luggage.",
      "If headache, nausea, unusual fatigue, dizziness or breathlessness develops, tell the guide rather than pushing on.",
    ],
    sources: [["Siguniangshan official site", "https://www.sgns.cn/en/index.php?Itemid=312&option=com_gantry5&view=custom"]],
  },

  /* ---------------- Nov 9 ---------------- */
  shuangqiao: {
    name: "Shuangqiao Valley", zh: "双桥沟", kind: "Scenic valley", status: "planned",
    map: amap("双桥沟", C.xiaojin),
    about: "A long valley with many named scenic points, reached by the official sightseeing bus and permitted paths. The main sightseeing option in the Siguniang area. It's a scenic-valley visit, not a long independent trek.",
    look: [
      "Layered ridgelines and the way cloud hides and reveals the peaks.",
      "Transitions between forest, open slopes, water and exposed rock.",
      "Bridges, roads and shuttle stops as evidence of how visitors move through the valley.",
      "Small details (frost, bark, water, wind-shaped plants) that say more about conditions than a postcard panorama.",
    ],
    todo: ["Use the sightseeing bus to cover the length of the valley, then spend your time at the stops with different kinds of view. Ask the guide which stops are open and how long the bus waits."],
    photo: [
      "Establishing frame: a broad valley view, ridges off-centre, with foreground for depth.",
      "Layer study: the long end of the zoom to compress ridgelines and passing cloud.",
      "Human scale: include a person only when naturally present and with consent.",
      "Detail frame: water, frost, rock texture or a bridge to break up the panoramas.",
      "Weather frame: if cloud moves across a peak, hold position and shoot a short sequence.",
    ],
    care: [
      "The park notice effective 1 April 2026 lists entry 08:00–15:00 for Shuangqiao. Recheck before travel.",
      "Don't leave marked paths for a better frame or stand on frozen edges.",
    ],
    sources: [
      ["Official ticketing", "https://www.sgns.cn/en/index.php?Itemid=379&option=com_gantry5&view=custom"],
      ["Geopark: Shuangqiao geosite", "https://www.sgnsgeopark.cn/en/index.php?Itemid=293&catid=19&id=533%3A2022-01-01-12-00-9&option=com_content&view=article"],
    ],
  },
  danba: {
    name: "Danba", zh: "丹巴", kind: "County town", status: "planned",
    map: amap("丹巴县城", C.danba),
    about: "The county and transport hub in Ganzi Prefecture. Jiaju, Zhonglu and Suopo are separate villages nearby, not interchangeable names for one attraction. The area is known for hillside stone-and-earth houses and watchtowers.",
    history: "The villages belong to the Jiarong (Gyarong) Tibetan cultural region. The stone watchtowers stand inside living villages; their original role (defence, storage, family status) is still debated, so don't present one explanation as certain.",
    todo: ["If time allows more than one village, do one village panorama and one closer walk rather than racing through three similar photo stops.", "Dadu River gorge: a roadside landscape on the approach, only if the driver confirms a safe pull-off."],
    food: "Sichuan/Tibetan home-style food: yak or beef stew, noodle soup, dumplings, potatoes, seasonal vegetables, rice. At a village guesthouse, ask ahead whether dinner is included.",
    care: ["Hillside roads are narrow. Don't stand in the road to photograph passing vehicles.", "Remote area: expect delays, limited English and patchy mobile coverage."],
    sources: [["Danba villages overview", "https://www.travelchinaguide.com/cityguides/sichuan/garze/danba-tibetan-villages.htm"], ["Danba location guide", "https://www.fieldguidetochina.com/places/danba/"]],
  },

  /* ---------------- Nov 10 ---------------- */
  jiaju: {
    name: "Jiaju Tibetan Village", zh: "甲居藏寨", kind: "Village", status: "planned",
    map: amap("甲居藏寨", C.danba),
    about: "A tiered hillside settlement of traditional Jiarong Tibetan houses above the valley. Your Danba guesthouse is in Jiaju itself, beside Viewing Platform No. 1.",
    look: [
      "Whitewashed walls and coloured details near the rooflines.",
      "The stepped spread of houses down the slope.",
      "Terraced fields, orchards and the mountain and valley behind.",
      "The difference between the designated viewpoint and the quieter lived-in parts of the village.",
    ],
    photo: ["One wide frame that places the village in the landscape, then architectural details from public paths."],
    care: [
      "It's a home landscape, not a film set. Ask before photographing residents, dress-up activities, interiors or courtyards.",
      "No close-up photos of children without a guardian's consent.",
    ],
  },
  zhonglu: {
    name: "Zhonglu Tibetan Village", zh: "中路藏寨", kind: "Village", status: "optional",
    map: amap("中路藏寨", C.danba),
    about: "Hillside stone houses spread along the slope, several kilometres northeast of Danba town. Quieter and more dispersed than a compact old town. From the older supplier route.",
    look: ["Houses along the slope rather than one dense street.", "How houses, terraces, orchards and the valley fit together.", "Watchtowers seen in relation to ordinary houses.", "Late-afternoon light on the hillside, if the schedule allows."],
    care: ["Don't enter homes, courtyards or towers unless explicitly invited."],
  },
  suopo: {
    name: "Suopo Watchtowers", zh: "梭坡古碉群", kind: "Historic towers", status: "optional",
    map: amap("梭坡古碉群", C.danba),
    about: "Clusters of stone watchtowers among inhabited houses and terraced slopes. From the older supplier route.",
    look: ["The towers' vertical silhouettes against the hillside.", "Differences between towers and houses in form and position.", "How the river valley explains why towers sit on particular slopes."],
    care: ["Don't climb, enter or touch a tower without explicit permission. They may be on private property."],
  },
  tagongGrass: {
    name: "Tagong Grassland", zh: "塔公草原", kind: "Grassland", status: "planned",
    map: amap("塔公草原", C.kangding),
    about: "Broad plateau grassland with mountains, prayer flags, herds and roadside settlements.",
    look: ["The wide landscape against small signs of daily use.", "Weather as part of the scene: wind, low cloud, frost and shifting light."],
    food: "Tibetan-style noodle soup, momos, yak or beef, tsampa (roasted barley flour), butter tea or sweet milk tea. Try butter tea as a tradition, not as something you must like. If altitude dulls your appetite, choose a simple hot meal and carry snacks.",
    care: ["Plateau stops feel much colder than the town temperature, especially in wind.", "Don't approach herds or dogs without asking the herder. Never block paths for a photo."],
  },
  tagongMonastery: {
    name: "Tagong Monastery", zh: "塔公寺", kind: "Monastery", status: "unconfirmed",
    map: amap("塔公寺", C.kangding),
    about: "An important cultural stop in Tagong, included in the itinerary \"if the schedule permits\". Confirm that it's included and how much time you have.",
    history: "This stretch crosses the cultural landscape of Kham, with active Tibetan Buddhist institutions and pastoral settlements. A monastery's significance isn't just its age or style; it's part of a living religious network.",
    care: ["Walk calmly, follow the local direction around prayer objects, and never interrupt prayer for a photograph."],
  },

  /* ---------------- Nov 11 ---------------- */
  gunong: {
    name: "Gunong", kind: "Plateau stop", status: "unconfirmed",
    about: "Named as a plateau stop. The itinerary gives no Chinese name, access point or viewpoint.",
    care: ["Ask the operator for the Chinese name or a map pin before treating it as a confirmed place."],
  },
  muya: {
    name: "Muya Great Temple", zh: "木雅大寺?", kind: "Temple", status: "unconfirmed",
    map: amap("木雅大寺", C.kangding),
    about: "Listed in the itinerary without a Chinese name or site details. The Amap link searches 木雅大寺, the guide's best match, which is not confirmed.",
    care: ["Get the exact Chinese name from the operator. Until then, don't rely on the map pin or attach history to it."],
  },
  heishicheng: {
    name: "Heishicheng", zh: "黑石城?", kind: "Route stop", status: "unconfirmed",
    map: amap("黑石城", C.yajiang),
    about: "Named on the route to Yajiang, without enough detail to identify the exact attraction. The Amap link is the guide's best-match search.",
    care: ["Ask for the Chinese name and location. Don't confuse it with similarly named places elsewhere."],
  },

  /* ---------------- Nov 12 ---------------- */
  litang: {
    name: "Litang", zh: "理塘", kind: "Plateau town", status: "planned",
    map: amap("理塘县", "理塘县 四川省"),
    about: "A high-plateau Tibetan town at around 3,950 m. The focus is town life and religious practice.",
    care: ["Take it slowly at this altitude.", "The day's sequence after Litang (\"Shangri-La\" vs the Daocheng hotel) is unresolved. Confirm overnight town and drive time."],
  },
  changqing: {
    name: "Changqingchunke'er Temple", zh: "长青春科尔寺?", kind: "Monastery", status: "unconfirmed",
    map: amap("长青春科尔寺", "理塘县 四川省"),
    about: "Listed by romanized name only. The Amap link searches the guide's best-match Chinese name.",
    care: ["Ask the operator for the Chinese name and map pin.", "Follow posted photography rules and ask before photographing monks or worshippers."],
  },

  /* ---------------- Nov 13 ---------------- */
  yading: {
    name: "Yading Nature Reserve", zh: "稻城亚丁", kind: "Nature reserve", status: "planned",
    map: amap("稻城亚丁景区", C.daocheng),
    about: "Not one viewpoint but a high-altitude reserve centred on three sacred peaks: Xiannairi, Yangmaiyong and Xiaruoduoji. Much of it is above about 3,900 m.",
    history: "The lakes and peaks sit in a Tibetan cultural landscape linked to pilgrimage and religious meaning; they're more than scenic targets.",
    todo: [
      "Shorter route: shuttle → Zhaguanbeng → Chonggu area → Pearl Lake → return. Allow time for weather and walking slowly.",
      "Longer route, only if conditions and health permit: shuttle → Chonggu → electric cart (if running) → Luorong Pasture → Milk Lake / Five-Color Lake → back before the official turn-back time.",
    ],
    food: "Don't count on a restaurant on the trail; there are only limited snack stalls. Carry water and a packed lunch from town. Eat a familiar, light breakfast before starting.",
    care: [
      "Recent guides report a 14:30 turn-back checkpoint for the high-lake route. Confirm the rule for your date.",
      "Snow or ice makes boardwalks and loose trail slippery. Use grippy footwear and poles if useful; keep hands free on steep parts.",
      "Oxygen is not a substitute for descending or getting medical help if altitude illness is suspected.",
      "Keep a warm layer, waterproof shell, gloves, sun protection and a spare battery accessible. Cold drains batteries fast.",
      "Stay on permitted trails. Don't swim in or throw anything into the lakes, disturb shrines, or treat prayer flags as decoration. Carry out all rubbish.",
    ],
    sources: [["Yading route & altitude guide", "https://en.chinanetz.info/provinces/sichuan/nature/daocheng-yading"], ["Yading route guide", "https://chengdujourneys.com/en/guides/yading-guide"]],
  },
  chonggu: {
    name: "Chonggu Monastery", zh: "冲古寺", kind: "Monastery", status: "planned",
    map: amap("冲古寺", C.daocheng),
    about: "A key point on the shorter route toward Pearl Lake.",
    care: ["Treat it as a religious site, not a foreground object. Observe signs and ask before photographing worshippers or interiors."],
  },
  pearl: {
    name: "Pearl Lake", zh: "珍珠海", kind: "Lake · easier route", status: "planned",
    map: amap("珍珠海", C.daocheng),
    about: "The shorter walk from the Chonggu area: water, forest and the sacred mountain behind.",
    look: ["How water, forest and mountain relate.", "Reflections only if conditions allow; don't count on still water.", "A mix of wide views, shoreline details and the textures of the path."],
    photo: ["Prioritise the relationship between water and mountain over a centred reflection."],
    care: ["\"Shorter\" doesn't mean low or easy. You're still high: watch for symptoms and don't rush."],
  },
  luorong: {
    name: "Luorong Pasture", zh: "洛绒牛场", kind: "Meadow · longer route", status: "planned",
    map: amap("洛绒牛场", C.daocheng),
    about: "A high meadow and viewing area on the longer route, with the open meadow against the mountain wall.",
    look: ["Trails, streams and grazing land.", "How the weather changes the peaks over minutes."],
    photo: ["Use the meadow as foreground and protect detail in bright cloud."],
  },
  milkLake: {
    name: "Milk Lake & Five-Color Lake", zh: "牛奶海 · 五色海", kind: "Lakes · hard route", status: "planned",
    map: amap("牛奶海", C.daocheng),
    about: "The demanding extension: a steep climb from Luorong Pasture to lakes at roughly 4,500–4,700 m. About 10–11 km round trip.",
    photo: ["Plan for cold hands, battery drain and changing weather. Keep the camera accessible, but don't race to photograph every lake."],
    care: [
      "Decide on the day with the guide, taking into account acclimatisation, weather, access rules and how everyone feels. Fitness doesn't prevent altitude illness.",
      "Don't go higher if symptoms are developing; get help and descend as staff direct.",
      "A shorter route with attentive observation is a valid outcome, not a failure.",
    ],
  },

  /* ---------------- Nov 14–15 ---------------- */
  meili: {
    name: "Meili Snow Mountain", zh: "梅里雪山", kind: "Sacred mountain", status: "planned",
    map: amap("梅里雪山", C.deqin),
    about: "The sacred range above Deqin, viewed mainly from the Feilai Temple area. Not part of the original supplier route; added in the current plan.",
    care: ["Visibility depends on weather. A sunrise view is never guaranteed."],
  },
  feilai: {
    name: "Feilai Temple viewpoints", zh: "飞来寺", kind: "Viewpoint", status: "planned",
    map: amap("飞来寺", C.deqin),
    about: "The viewpoint area named in the itinerary for Meili. Your lodge is right here (No. 15, Feilai Temple).",
    photo: ["Make a stable wide composition, then a tighter frame of the mountain layers if visible.", "Secure the tripod in wind and don't block other visitors."],
    care: ["Confirm where the driver plans to stop and how much time you have for sunrise or sunset."],
  },
  dukezong: {
    name: "Dukezong Old Town", zh: "独克宗古城", kind: "Old town", status: "planned",
    map: amap("独克宗古城", C.shangrila),
    about: "The historic Tibetan settlement at the heart of Shangri-La (around 3,300 m). Your homestay is inside it. Moonlight Square and the giant prayer wheel are the landmarks.",
    history: "A major fire in 2014 led to substantial rebuilding. Read it as a living place where heritage, restoration and tourism overlap; don't assume every building is untouched or ancient.",
    look: ["Street patterns, wooden buildings, shopfronts and how squares are used.", "How residents and visitors share the same streets."],
    food: "Yak hotpot or stew, momos, thukpa/thenthuk noodles, tsampa, highland barley cake, butter tea (salty and buttery, not sweet; try a small cup first). Matsutake only when in season and the restaurant can explain the source.",
    eat: [
      ["Ani's Kitchen 阿妮厨房", "Level 1, No. 1 Chicika Street. Tibetan dishes incl. yak hotpot and butter tea; publishes its own hours. Best-supported lead.", "https://www.shangri-la.com/yunnan/shangrila/dining/restaurants/anis-kitchen/"],
      ["Zambala 扎巴拉藏餐", "No. 24 Yinuomulang, near the north gate. Tibetan hotpot, momos, thukpa.", "https://www.tripadvisor.com/Restaurant_Review-g670561-d21248488-Reviews-Zambala_Tibetan_Restaurant-Shangri_La_County_Diqing_Tibetan_Autonomous_Prefectur.html"],
      ["Yin Tong Snacks 银同便民小吃店", "No. 32 Yiruomulang. Tibetan snacks and yak hotpot.", "https://www.chinahighlights.com/shangri-la/food-restaurant.htm"],
    ],
    care: ["Walk clockwise around prayer wheels and stupas where that's the local custom; follow the flow of worshippers.", "Take your first evening gently after the high passes."],
  },

  /* ---------------- Nov 16 ---------------- */
  songzanlin: {
    name: "Songzanlin Monastery", zh: "噶丹松赞林寺", kind: "Monastery", status: "planned",
    map: amap("噶丹松赞林寺", C.shangrila),
    about: "One of the most important Tibetan Buddhist monasteries in Yunnan, nicknamed the \"Little Potala\" for its hillside architecture.",
    history: "Founded in 1679 under the patronage of the Fifth Dalai Lama; belongs to the Gelug school.",
    look: ["The monastery in the wider landscape and, if access permits, with Lamuyangcuo Lake.", "Rooflines, courtyards, stairs and thresholds of a working religious complex.", "Where visitor circulation differs from spaces used for worship."],
    photo: ["Start with a landscape frame that sets the monastery in context.", "If the lake reflection appears, make it one option, not the whole story.", "Record ambient sound only where permitted."],
    care: ["Some halls prohibit photography. Follow all signs.", "Ask before photographing monks or worshippers. Dress modestly; don't block entrances.", "Don't touch religious objects or use prayer wheels as props.", "Stairs are steep: go slowly and use handrails.", "Eat in town; don't count on a full lunch at the monastery."],
    sources: [["Songzanlin visitor notes", "https://www.shangri-la-yunnan.com/attractions/songzanlin-monastery/"], ["Shangri-La overview", "https://www.visit-yunnan.com/en/destinations/shangri-la"]],
  },
  napa: {
    name: "Napa Lake", zh: "纳帕海", kind: "Wetland", status: "optional",
    map: amap("纳帕海", C.shangrila),
    about: "A seasonal plateau wetland near Shangri-La. In November it won't look like summer photographs. From the older supplier route.",
    care: ["Stay in designated areas and don't approach wildlife or livestock for a photo."],
  },

  /* ---------------- Nov 17 ---------------- */
  jadeDragon: {
    name: "Jade Dragon Snow Mountain", zh: "玉龙雪山", kind: "Mountain", status: "planned",
    map: amap("玉龙雪山", C.lijiang),
    about: "The plan prefers viewpoints with the mountain behind the town instead of automatically taking the glacier cable car (up to about 4,506 m).",
    todo: [
      "Skipping the cable car: Black Dragon Pool for the classic view if it's clear, then Baisha or Shuhe for a quieter walk, then the old town late afternoon.",
      "Taking the cable car: prioritise the mountain and Blue Moon Valley, then see if there's time for Yuhu Village.",
    ],
    care: ["The cable car means a rapid move to very high altitude and can be cancelled for weather. Oxygen is no guarantee against altitude illness.", "Don't assume the mountain will be visible. Keep the plan flexible."],
  },
  blackDragon: {
    name: "Black Dragon Pool", zh: "黑龙潭公园", kind: "Viewpoint · park", status: "planned",
    map: amap("黑龙潭公园", C.lijiang),
    about: "North of the old town: water, bridges, pavilions and the classic view of Jade Dragon Snow Mountain. Part of the complex dates to the Qing period (built or expanded in 1737).",
    care: ["Check the current entry/maintenance fee and the visibility on the day."],
    sources: [["Black Dragon Pool", "https://www2.chinadiscovery.com/yunnan/lijiang/black-dragon-pool.html"]],
  },
  wangu: {
    name: "Wangu Pavilion", zh: "万古楼", kind: "Viewpoint", status: "planned",
    map: amap("万古楼", C.lijiang),
    about: "A viewpoint over the old town. Confirm access and the time needed to climb up.",
    care: ["If cloud has closed in, the mountain won't be visible from here."],
  },
  baisha: {
    name: "Baisha", zh: "白沙古镇", kind: "Naxi village", status: "planned",
    map: amap("白沙古镇", C.lijiang),
    about: "A quieter Naxi settlement north of Lijiang with views toward the mountain. It was the earlier centre of Mu-family power before the move to Dayan (today's old town).",
    care: ["Confirm which mural or heritage site the driver intends."],
  },
  lijiangOld: {
    name: "Lijiang Old Town", zh: "丽江古城", kind: "Old town", status: "planned",
    map: amap("丽江古城", C.lijiang),
    about: "The historic Naxi town of canals and lanes, UNESCO-listed and heavily shaped by tourism. Your hotel is at the Big Waterwheel (Dashuiche) entrance.",
    history: "Lijiang became a major centre on the Tea Horse Road, linking Yunnan with Tibetan regions. Its Naxi heritage includes Dongba traditions, and the water system and street layout are part of that heritage, not decoration.",
    todo: ["Walk Sifang Street, then leave the busiest commercial lanes to see how the water channels and residential lanes connect.", "Mu Mansion 木府: for the history of the Mu hereditary rulers, if time and tickets allow."],
    food: "Lijiang baba (flatbread, sweet or savoury), chicken with matsutake or other mushrooms when in season and clearly identified, yak/beef hotpot, crossing-the-bridge noodles, local goat cheese.",
    photo: ["Early or late light on architecture; details of channels, bridges and woodwork; street life."],
    care: ["Stone lanes are slippery after rain or frost.", "Watch for bikes, scooters and delivery vehicles even in pedestrian areas.", "Ask before photographing Dongba rituals, residents or interiors."],
  },
  shuhe: {
    name: "Shuhe Old Town", zh: "束河古镇", kind: "Old town", status: "optional",
    map: amap("束河古镇", C.lijiang),
    about: "A historic settlement of lanes, springs and courtyard houses: a slower, quieter walk than Lijiang, and still a lived-in place.",
  },
  blueMoon: {
    name: "Blue Moon Valley", zh: "蓝月谷", kind: "Valley", status: "optional",
    map: amap("蓝月谷", C.lijiang),
    about: "Turquoise water below the snow mountain. Part of the cable-car version of the day.",
    photo: ["Don't over-saturate the water until it looks artificial."],
    care: ["Stay on paths; don't enter the water or restricted areas."],
  },

  /* ---------------- Nov 18 ---------------- */
  shaxi: {
    name: "Shaxi Old Town", zh: "沙溪古镇", kind: "Tea Horse Road town", status: "planned",
    map: amap("沙溪古镇", C.jianchuan),
    about: "A historic market town roughly halfway between Dali and Lijiang, with an unusually well-preserved square. Bai and Yi are the main cultural groups. Your B&B is in Sideng Village, right in the historic core.",
    history: "A market settlement on the Tea Horse Road. Its square, temple and theatre show the practical infrastructure of trade: where people met, traded, worshipped and performed. The road was a network of regional markets and paths, not a single romantic trail.",
    todo: [
      "Sideng Market Square 寺登街: start here and watch how the square is used now.",
      "The old theatre stage: part of the square's civic and performance life.",
      "Xingjiao Temple 兴教寺: a Ming-period Bai Buddhist temple. Check opening hours and photo rules.",
      "Yujin Bridge and the lanes around town: how town, river crossing and routes connect.",
      "A village walk beyond the commercial lanes, with the guide's advice.",
    ],
    photo: ["A quiet wide frame of the square before it fills up, if timing allows.", "Stay long enough to see the place change through the day."],
    food: "Shaxi local noodles, ersi/erkuai, seasonal vegetables and Bai home-style dishes. The Monday market won't match your Wednesday visit.",
    eat: [
      ["sunyata Shaxi 既下山·沙溪店", "115 Sideng Street. Polished sit-down, Yunnan/Bai-influenced; pricier.", "https://www.trip.com/restaurant/jianchuan-2025134/"],
      ["Xipi Private Kitchen 西皮私厨小酒馆", "17 Guzong Lane, south Sideng Street. Brunch, noodles, rice dishes; check split hours.", "https://www.trip.com/restaurant/jianchuan-2025134/"],
    ],
    care: ["Old paving is uneven and slippery.", "Watch for motorbikes in the lanes.", "Ask before photographing homes, shopkeepers or craft work."],
    sources: [["Shaxi: Destination Lijiang", "https://www.destinationlijiang.com/en/destinations/item/34333/shaxi-old-town"]],
  },
  shibaoshan: {
    name: "Shibaoshan", zh: "石宝山", kind: "Temples & grottoes", status: "optional",
    map: amap("石宝山", C.jianchuan),
    about: "Forested sandstone hills with temples and Buddhist rock carvings; the Shizhongshan Grottoes hold Nanzhao-era carvings. From the older supplier route.",
    care: ["Never touch, rub, wet or flash the carvings where prohibited.", "Ask whether a visit means the grottoes, a temple or just a viewpoint; they aren't interchangeable."],
    sources: [["Shibaoshan", "https://www.lonelyplanet.com/points-of-interest/shibaoshan/1621445"]],
  },

  /* ---------------- Nov 19 ---------------- */
  erhai: {
    name: "Erhai Lake", zh: "洱海", kind: "Lake", status: "planned",
    map: amap("洱海", C.dali),
    about: "Lakeside villages, farmland and views to the mountains. Look for the balance between lake ecology, farming, village life and tourism, not only the reflection.",
    look: ["Shoreline and water level, farm plots, village streets.", "How residents use the lake edge compared with visitors.", "Small scenes of work and movement you can shoot without stopping somewhere unsafe."],
    care: ["If cycling: confirm route, helmet, bike condition, traffic and return time. Never use a camera while riding; pull fully off the route.", "Lakeside wind feels colder than the streets. Keep a layer handy and protect gear from dust and moisture."],
  },
  xizhou: {
    name: "Xizhou", zh: "喜洲古镇", kind: "Bai town", status: "optional",
    map: amap("喜洲古镇", C.dali),
    about: "A Bai settlement in the Erhai basin with courtyard houses and a market. From the older supplier route.",
    food: "Xizhou baba, a baked flatbread with sweet or savoury filling, from a bakery or market stall. Three-course tea at a Bai courtyard if the guide can fit it in.",
    care: ["Ask which courtyard is open; not every historic-looking house is a public attraction."],
  },
  zhoucheng: {
    name: "Zhoucheng", zh: "周城村", kind: "Tie-dye village", status: "optional",
    map: amap("周城村", C.dali),
    about: "A Bai village known for tie-dye. If a workshop is operating, ask for a demonstration of the resist-dye process. From the older supplier route.",
    care: ["Ask before photographing artisans. Clarify what a workshop fee covers and whether dyes are natural."],
  },
  daliOld: {
    name: "Dali Old Town", zh: "大理古城", kind: "Old town", status: "planned",
    map: amap("大理古城", C.dali),
    about: "Old-town street grid, market and lanes. Your homestay is in Dazhuang Village / Xiaguan, not here, so check the driving route.",
    history: "The Erhai basin was the political heartland of the Nanzhao kingdom and then the Dali Kingdom (founded 937), connecting southwest China with wider trade routes.",
    todo: ["Three Pagodas: optional, if time and tickets are confirmed."],
    food: "Rushan (Bai goat-milk cheese, often grilled), Xizhou baba, Yunnan rice noodles.",
    eat: [["Xinghua Village 杏花村饭店", "165 Yu'er Road. Stewed carp, rushan, three-delicacy noodles. Listing may be dated.", "https://www.travelchinaguide.com/cityguides/yunnan/dali/dining.htm"]],
  },
};

// Which places belong to which day (by date).
const DAY_PLACES = {
  "2026-11-08": ["dujiangyan", "wolong", "siguniang"],
  "2026-11-09": ["shuangqiao", "danba"],
  "2026-11-10": ["jiaju", "tagongGrass", "tagongMonastery", "zhonglu", "suopo"],
  "2026-11-11": ["gunong", "muya", "heishicheng"],
  "2026-11-12": ["litang", "changqing"],
  "2026-11-13": ["yading", "chonggu", "pearl", "luorong", "milkLake"],
  "2026-11-14": ["meili"],
  "2026-11-15": ["feilai", "dukezong"],
  "2026-11-16": ["songzanlin", "napa"],
  "2026-11-17": ["jadeDragon", "blackDragon", "wangu", "baisha", "lijiangOld", "shuhe", "blueMoon"],
  "2026-11-18": ["shaxi", "shibaoshan"],
  "2026-11-19": ["erhai", "daliOld", "xizhou", "zhoucheng"],
};

// Shared field protocols (guide §16).
const FIELD = [
  ["Photography", ["Make a context frame before details.", "Sigma 17–40mm: wide end for spatial relationships, long end for compressed layers and details. Sirui 55mm for details and portraits, with consent.", "Osmo Action only where safe and permitted; never in restricted religious interiors.", "Keep batteries warm, carry spare storage, back up daily when you can.", "No shot is worth a fall, breaking access rules or interrupting religious activity."]],
  ["People & sacred spaces", ["Ask permission for close portraits and private activities, and accept a no without negotiating.", "Follow signs about photography, shoes, clothing and movement.", "Don't touch religious objects or enter private areas.", "Describe people as individuals in a setting; don't generalise from one encounter to a whole group."]],
  ["Altitude & mountain roads", ["Ascend cautiously; fitness alone doesn't prevent altitude illness.", "Don't go higher with worsening symptoms; get local medical help and descend as advised.", "November brings snow, ice, wind and fast temperature swings. Keep road plans flexible.", "A shorter outing is not a failure."]],
  ["Field notes for each stop", ["Date and time · Chinese name or pin · weather and light · sounds and movement · three observed details · one question to research later · consent or access limits · photo file names."]],
];
