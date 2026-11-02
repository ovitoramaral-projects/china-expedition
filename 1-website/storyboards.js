// Storyboards per stop (destination id from destinations.js), from the user's
// "China Expedition Storyboard: Complete End to End" PDF (sent 2 Nov 2026 in 3 parts).
// Frames cut from each board's drawings to exactly 4:3 (see .claude/skills/cinematic-storyboard);
// titles, descriptions and shot notes transcribed from the boards. `board` names the source
// board (Litang and Yading both live on the Yading stop).
// Not used yet: the cover and the 16-panel route overview (its panels are wide and small).
"use strict";
const STORYBOARDS = {
  "danba": [
    {
      "src": "assets/storyboards/danba-1.jpg",
      "board": "Jiaju & Danba",
      "title": "Arrival: the village in its landscape",
      "about": "A wide establishing view of Jiaju village, stone houses scattered on the hillside, mountains behind.",
      "shot": "Sigma 17–40mm @ 17mm · wide, high vantage point · static (tripod) · soft morning light, possible mist"
    },
    {
      "src": "assets/storyboards/danba-2.jpg",
      "board": "Jiaju & Danba",
      "title": "Daily life: a moment at home",
      "about": "An intimate portrait of a local resident working at the doorway, in everyday traditional clothing.",
      "shot": "Sirui 55mm T1.2 · medium, eye level · static or slight handheld · natural side light, soft and directional"
    },
    {
      "src": "assets/storyboards/danba-3.jpg",
      "board": "Jiaju & Danba",
      "title": "Architecture: stone, wood and detail",
      "about": "A close study of traditional Jiaju architecture: texture, woodwork and hand-built details.",
      "shot": "Sigma 17–40mm @ 35–40mm · close-up, low angle · static · side light for texture and depth"
    },
    {
      "src": "assets/storyboards/danba-4.jpg",
      "board": "Jiaju & Danba",
      "title": "Village paths: people in the space",
      "about": "A villager walking the narrow paths, giving the village its human scale.",
      "shot": "Sigma 17–40mm @ 24mm · medium-wide, behind the subject · slow follow (handheld or gimbal) · soft, diffused daylight"
    },
    {
      "src": "assets/storyboards/danba-5.jpg",
      "board": "Jiaju & Danba",
      "title": "Portrait: generations",
      "about": "A close portrait with character and a sense of place. Always ask permission and be respectful.",
      "shot": "Sirui 55mm T1.2 · close-up, eye level · static · soft directional natural light"
    },
    {
      "src": "assets/storyboards/danba-6.jpg",
      "board": "Jiaju & Danba",
      "title": "Textures: traces of daily life",
      "about": "Drying crops, tools, wood and stone: the material culture of the village.",
      "shot": "Sigma 17–40mm @ 40mm (or Sirui 55mm) · close-up with context · static or slight handheld · side light for texture and form"
    },
    {
      "src": "assets/storyboards/danba-7.jpg",
      "board": "Jiaju & Danba",
      "title": "Land and people: a shared life",
      "about": "Farm work with traditional houses behind, tying people, land and architecture together.",
      "shot": "Sigma 17–40mm @ 24–28mm · wide, eye level · static or slow handheld · natural daylight, possibly late afternoon"
    },
    {
      "src": "assets/storyboards/danba-8.jpg",
      "board": "Jiaju & Danba",
      "title": "Closing: village at dusk",
      "about": "Back to the wide village view: the end of the day and the larger landscape.",
      "shot": "Sigma 17–40mm @ 17–28mm · wide · static (tripod) · golden or soft evening light, long shadows"
    }
  ],
  "tagong": [
    {
      "src": "assets/storyboards/tagong-1.jpg",
      "board": "Tagong & Muya",
      "title": "Arrival on the plateau",
      "about": "The road rises onto the Tibetan plateau: vast grasslands and distant snow peaks as you approach Tagong.",
      "shot": "Sigma 17–40mm @ 17mm · wide, high vantage point · from the vehicle or static · natural daylight, dramatic clouds"
    },
    {
      "src": "assets/storyboards/tagong-2.jpg",
      "board": "Tagong & Muya",
      "title": "Prayer flags in the wind",
      "about": "Prayer flags in the strong mountain wind, with the plateau and snow mountains behind.",
      "shot": "Sigma 17–40mm @ 28mm · medium-wide, low angle · static or slight handheld · side or back light, texture in the fabric"
    },
    {
      "src": "assets/storyboards/tagong-3.jpg",
      "board": "Tagong & Muya",
      "title": "Tagong Monastery",
      "about": "A monk walking towards Tagong Monastery: the architecture's scale within the landscape.",
      "shot": "Sigma 17–40mm @ 24mm · wide, eye level · static · soft daylight, slightly overcast"
    },
    {
      "src": "assets/storyboards/tagong-4.jpg",
      "board": "Tagong & Muya",
      "title": "Yaks and herding life",
      "about": "A herder with yaks on the open plateau: people, animals and the land.",
      "shot": "Sigma 17–40mm @ 40mm (or Sirui 55mm) · medium, behind the subject · slow follow (handheld) · warm tones, soft contrast"
    },
    {
      "src": "assets/storyboards/tagong-5.jpg",
      "board": "Tagong & Muya",
      "title": "Portrait of a local resident",
      "about": "Character, expression and a sense of place. Always ask permission and be respectful.",
      "shot": "Sirui 55mm T1.2 · close-up, eye level · static · natural side light, soft and directional"
    },
    {
      "src": "assets/storyboards/tagong-6.jpg",
      "board": "Tagong & Muya",
      "title": "Monastery details",
      "about": "Religious practice and material culture: texture, colour and everyday devotion.",
      "shot": "Sirui 55mm T1.2 (or Sigma @ 40mm) · close-up · static or slow push-in · soft light, focused on texture"
    },
    {
      "src": "assets/storyboards/tagong-7.jpg",
      "board": "Tagong & Muya",
      "title": "Everyday life around the monastery",
      "about": "Traditional clothing, work, and spiritual and daily life together.",
      "shot": "Sigma 17–40mm @ 35mm · medium, eye level · handheld follow or static · soft, atmospheric daylight"
    },
    {
      "src": "assets/storyboards/tagong-8.jpg",
      "board": "Tagong & Muya",
      "title": "Sunset on the plateau",
      "about": "The plateau in warm light at the end of the day: stillness and reflection.",
      "shot": "Sigma 17–40mm @ 28mm · wide, low angle · static (tripod) · golden hour, long shadows"
    }
  ],
  "yading": [
    {
      "src": "assets/storyboards/litang-1.jpg",
      "board": "Litang",
      "title": "Arrival in Litang",
      "about": "The town at the foot of the plateau with snow mountains beyond: the high-altitude setting.",
      "shot": "Sigma 17–40mm @ 17mm · wide, eye level · from the vehicle or static · crisp, clear daylight"
    },
    {
      "src": "assets/storyboards/litang-2.jpg",
      "board": "Litang",
      "title": "Town street life",
      "about": "Locals, shopfronts and traditional architecture: Litang's living culture.",
      "shot": "Sigma 17–40mm @ 28mm · medium-wide, eye level · static or slow handheld · daylight, soft shadows"
    },
    {
      "src": "assets/storyboards/litang-3.jpg",
      "board": "Litang",
      "title": "Changqingchunke'er Temple",
      "about": "The monastery's scale within the town, with the mountains beyond.",
      "shot": "Sigma 17–40mm @ 24mm · wide, low angle · static · soft, atmospheric daylight"
    },
    {
      "src": "assets/storyboards/litang-4.jpg",
      "board": "Litang",
      "title": "A monk in daily life",
      "about": "A quiet moment of everyday devotion, observed respectfully from a distance.",
      "shot": "Sirui 55mm T1.2 · medium, behind the subject · slow follow (handheld) · directional light, soft contrast"
    },
    {
      "src": "assets/storyboards/litang-5.jpg",
      "board": "Litang",
      "title": "Details of faith and materials",
      "about": "Religious objects and traditional materials: texture, colour and craft.",
      "shot": "Sirui 55mm T1.2 · close-up · static · natural side light, soft and directional"
    },
    {
      "src": "assets/storyboards/litang-6.jpg",
      "board": "Litang",
      "title": "Hands at work",
      "about": "Hands in everyday action: the details of daily life and personal devotion.",
      "shot": "Sirui 55mm T1.2 · close-up · static or slight handheld · soft light, emphasise texture"
    },
    {
      "src": "assets/storyboards/litang-7.jpg",
      "board": "Litang",
      "title": "A local resident",
      "about": "A portrait in their own environment. Always ask permission and be respectful.",
      "shot": "Sigma @ 35mm (or Sirui 55mm) · medium, eye level · static · soft natural daylight"
    },
    {
      "src": "assets/storyboards/litang-8.jpg",
      "board": "Litang",
      "title": "Town and mountains at dusk",
      "about": "The town at the end of the day, the plateau mountains in warm evening light.",
      "shot": "Sigma 17–40mm @ 24mm · wide, elevated viewpoint · static (tripod) · golden hour, long shadows"
    },
    {
      "src": "assets/storyboards/yading-1.jpg",
      "board": "Yading",
      "title": "First view of the snow peaks",
      "about": "Entering the valley: the first sight of Yading's peaks and the scale of the landscape.",
      "shot": "Sigma 17–40mm @ 17mm · wide, high vantage point · static (tripod) · soft, dramatic daylight"
    },
    {
      "src": "assets/storyboards/yading-2.jpg",
      "board": "Yading",
      "title": "On the alpine trail",
      "about": "A lone hiker: the journey into the mountains and the human scale within it.",
      "shot": "Sigma 17–40mm @ 28mm · medium-long, behind the subject · slow follow (handheld) · soft, slightly overcast"
    },
    {
      "src": "assets/storyboards/yading-3.jpg",
      "board": "Yading",
      "title": "Pearl Lake reflection",
      "about": "The snow peaks reflected in still water: a moment of calm and silence.",
      "shot": "Sigma 17–40mm @ 24mm · wide, eye level · static (tripod) · soft daylight, clear or partly cloudy"
    },
    {
      "src": "assets/storyboards/yading-4.jpg",
      "board": "Yading",
      "title": "A small figure in a vast landscape",
      "about": "A small human silhouette against immense mountains: standing in a sacred place.",
      "shot": "Sigma 17–40mm @ 35mm · wide, low angle · static · daylight, clouds and atmosphere"
    },
    {
      "src": "assets/storyboards/yading-5.jpg",
      "board": "Yading",
      "title": "Rock, ice and water",
      "about": "The textures and raw beauty of the alpine environment.",
      "shot": "Sigma 17–40mm @ 40mm · close-up detail · static or slow push-in · soft light, emphasise texture"
    },
    {
      "src": "assets/storyboards/yading-6.jpg",
      "board": "Yading",
      "title": "A moment of rest",
      "about": "Resting on the trail, taking in the view and the quiet of the mountains.",
      "shot": "Sirui 55mm T1.2 · medium, side or behind · static · soft, contemplative daylight"
    },
    {
      "src": "assets/storyboards/yading-7.jpg",
      "board": "Yading",
      "title": "Prayer flags and stones",
      "about": "Prayer flags and mani stones: the spiritual presence in this landscape.",
      "shot": "Sigma 17–40mm @ 28mm · medium, low angle · static or slight handheld · side light, texture and colour"
    },
    {
      "src": "assets/storyboards/yading-8.jpg",
      "board": "Yading",
      "title": "Evening atmosphere (or cloudy alternative)",
      "about": "Changing light on the peaks at the end of the day; if cloudy, the moody atmosphere and moving cloud.",
      "shot": "Sigma 17–40mm @ 24mm (or 35mm) · wide · static (timelapse option) · golden hour or moody overcast"
    }
  ],
  "meili": [
    {
      "src": "assets/storyboards/meili-1.jpg",
      "board": "Meili",
      "title": "Before sunrise: silhouettes",
      "about": "The Feilai viewpoint before sunrise, stupas in silhouette and the Meili range beyond.",
      "shot": "Sigma 17–40mm @ 17mm · wide, low angle · static (tripod) · pre-sunrise, dramatic sky"
    },
    {
      "src": "assets/storyboards/meili-2.jpg",
      "board": "Meili",
      "title": "People waiting: quiet anticipation",
      "about": "People waiting at the viewpoint, sharing the moment as first light approaches.",
      "shot": "Sigma 17–40mm @ 28mm · medium-wide, behind the subjects · static or slight handheld · blue hour, soft ambient light"
    },
    {
      "src": "assets/storyboards/meili-3.jpg",
      "board": "Meili",
      "title": "First light on Kawagebo",
      "about": "The first golden light on Kawagebo and the surrounding peaks.",
      "shot": "Sigma 17–40mm at the long end (the board says 44mm; or 35mm) · medium, eye level · static (tripod) · golden sunrise light"
    },
    {
      "src": "assets/storyboards/meili-4.jpg",
      "board": "Meili",
      "title": "Prayer flags in the wind",
      "about": "Prayer flags with the Meili range beyond: spiritual practice and landscape.",
      "shot": "Sigma 17–40mm @ 24mm · close-up, low angle · static or slight handheld · side light, crisp morning"
    },
    {
      "src": "assets/storyboards/meili-5.jpg",
      "board": "Meili",
      "title": "Feilai Temple: viewpoint architecture",
      "about": "The temple's traditional architecture and its relationship with the sacred mountains.",
      "shot": "Sigma 17–40mm @ 17mm · wide, eye level · static (tripod) · soft, clear morning light"
    },
    {
      "src": "assets/storyboards/meili-6.jpg",
      "board": "Meili",
      "title": "Portrait of a local pilgrim",
      "about": "A respectful portrait showing devotion and a deep connection to this place. Ask first.",
      "shot": "Sirui 55mm T1.2 · close-up, eye level · static · soft morning light, gentle contrast"
    },
    {
      "src": "assets/storyboards/meili-7.jpg",
      "board": "Meili",
      "title": "Broad mountain panorama",
      "about": "The scale of the range and its layered mountains and valleys.",
      "shot": "Sigma 17–40mm @ 17mm · wide, high vantage point · static (tripod) · clear, atmospheric morning light"
    },
    {
      "src": "assets/storyboards/meili-8.jpg",
      "board": "Meili",
      "title": "Cloudy weather: an alternative view",
      "about": "Even with clouds, the scene works: shifting mist and layered mountains.",
      "shot": "Sigma 17–40mm @ 40mm (or 28mm) · wide, eye level · static (tripod) · overcast, dramatic clouds"
    }
  ],
  "shangrila": [
    {
      "src": "assets/storyboards/shangrila-1.jpg",
      "board": "Songzanlin",
      "title": "Approaching the monastery",
      "about": "Songzanlin on the hillside, framed by mountains and wetlands.",
      "shot": "Sigma 17–40mm @ 17mm · wide, high vantage point · static · soft, atmospheric morning light"
    },
    {
      "src": "assets/storyboards/shangrila-2.jpg",
      "board": "Songzanlin",
      "title": "Layered architecture",
      "about": "White walls, golden roofs and traditional Tibetan details.",
      "shot": "Sigma 17–40mm @ 28–35mm · medium-wide, low angle · static · side light, strong contrast"
    },
    {
      "src": "assets/storyboards/shangrila-3.jpg",
      "board": "Songzanlin",
      "title": "A monk in the courtyard",
      "about": "The everyday rhythm of monastic life, from a respectful distance.",
      "shot": "Sirui 55mm T1.2 (or Sigma @ 40mm) · medium, eye level · slow follow (handheld) · soft shadows"
    },
    {
      "src": "assets/storyboards/shangrila-4.jpg",
      "board": "Songzanlin",
      "title": "Doorway details",
      "about": "Doors and painted woodwork: craftsmanship, symbolism and time.",
      "shot": "Sirui 55mm T1.2 · close-up detail · static · side light, rich texture"
    },
    {
      "src": "assets/storyboards/shangrila-5.jpg",
      "board": "Songzanlin",
      "title": "Butter lamps (where permitted)",
      "about": "Butter lamps inside a permitted area: the monastery's living devotion.",
      "shot": "Sirui 55mm T1.2 · close-up, eye level · static · low, warm light"
    },
    {
      "src": "assets/storyboards/shangrila-6.jpg",
      "board": "Songzanlin",
      "title": "Pilgrims and everyday life",
      "about": "Pilgrims and local people on the grounds: faith and everyday life together.",
      "shot": "Sigma 17–40mm @ 35mm · medium, eye level · handheld, observational · soft, directional daylight"
    },
    {
      "src": "assets/storyboards/shangrila-7.jpg",
      "board": "Songzanlin",
      "title": "Wider view from above",
      "about": "The monastery within Shangri-La's landscape of town and mountains.",
      "shot": "Sigma 17–40mm @ 17–24mm · wide, high vantage point · static (tripod) · late afternoon, warm and clear"
    },
    {
      "src": "assets/storyboards/shangrila-8.jpg",
      "board": "Songzanlin",
      "title": "Late day atmosphere",
      "about": "The monastery in warm light at the end of the day.",
      "shot": "Sigma 17–40mm @ 28mm · wide · static · golden hour, long shadows"
    }
  ],
  "lijiang": [
    {
      "src": "assets/storyboards/lijiang-1.jpg",
      "board": "Lijiang",
      "title": "Jade Dragon Snow Mountain",
      "about": "The mountain's scale above the valley and the Lijiang region.",
      "shot": "Sigma 17–40mm @ 17mm · wide, high vantage point · static (tripod) · cold, clear morning light"
    },
    {
      "src": "assets/storyboards/lijiang-2.jpg",
      "board": "Lijiang",
      "title": "Black Dragon Pool",
      "about": "Jade Dragon reflected in the pool: architecture, nature and culture together.",
      "shot": "Sigma 17–40mm @ 24mm · wide, eye level · static (tripod) · soft morning light, calm water"
    },
    {
      "src": "assets/storyboards/lijiang-3.jpg",
      "board": "Lijiang",
      "title": "Lijiang Ancient Town streets",
      "about": "Architecture, shops and people moving through the old town.",
      "shot": "Sigma 17–40mm @ 28mm · medium-wide, eye level · slow handheld follow · soft, diffused daylight"
    },
    {
      "src": "assets/storyboards/lijiang-4.jpg",
      "board": "Lijiang",
      "title": "Naxi architectural details",
      "about": "Ornament in wood and stone: craft and symbolism.",
      "shot": "Sirui 55mm T1.2 · close-up detail · static · soft side light"
    },
    {
      "src": "assets/storyboards/lijiang-5.jpg",
      "board": "Lijiang",
      "title": "A local resident",
      "about": "A craftsperson at work: skill and character. Always ask permission.",
      "shot": "Sirui 55mm T1.2 · close-up, eye level · static · soft, warm side light"
    },
    {
      "src": "assets/storyboards/lijiang-6.jpg",
      "board": "Lijiang",
      "title": "Tradition and modernity",
      "about": "Visitors, shops and everyday life in the old town.",
      "shot": "Sigma 17–40mm @ 35mm · medium, eye level · handheld, observational · mixed light and shadow"
    },
    {
      "src": "assets/storyboards/lijiang-7.jpg",
      "board": "Lijiang",
      "title": "Baisha village and mountain context",
      "about": "Traditional Naxi houses and the mountain landscape.",
      "shot": "Sigma 17–40mm @ 17–24mm · wide · static or slow handheld · soft daylight"
    },
    {
      "src": "assets/storyboards/lijiang-8.jpg",
      "board": "Lijiang",
      "title": "Dusk over Lijiang",
      "about": "Rooftops at dusk with Jade Dragon in silhouette.",
      "shot": "Sigma 17–40mm @ 24mm · wide, high vantage point · static (tripod) · golden hour, warm evening light"
    }
  ],
  "shaxi": [
    {
      "src": "assets/storyboards/shaxi-1.jpg",
      "board": "Shaxi",
      "title": "The old market square: morning",
      "about": "The old square, its ancient tree and everyday morning life.",
      "shot": "Sigma 17–40mm @ 17mm · wide, high vantage point · static (tripod) · soft, warm morning light"
    },
    {
      "src": "assets/storyboards/shaxi-2.jpg",
      "board": "Shaxi",
      "title": "Narrow streets: everyday life",
      "about": "The scale, textures and daily life of the old streets.",
      "shot": "Sigma 17–40mm @ 24mm · medium-wide, eye level · slow follow (handheld) · side light and shadows"
    },
    {
      "src": "assets/storyboards/shaxi-3.jpg",
      "board": "Shaxi",
      "title": "Local craftsperson at work",
      "about": "Traditional skills and the continuity of local craft.",
      "shot": "Sirui 55mm T1.2 · medium close-up, eye level · static or slight handheld · soft side light"
    },
    {
      "src": "assets/storyboards/shaxi-4.jpg",
      "board": "Shaxi",
      "title": "Textures and details",
      "about": "Weathered wood, stone, door hardware and worn thresholds.",
      "shot": "Sigma @ 40mm (or Sirui 55mm) · close-up detail · static · raking side light, texture and contrast"
    },
    {
      "src": "assets/storyboards/shaxi-5.jpg",
      "board": "Shaxi",
      "title": "Market activity: people and exchange",
      "about": "Local people, produce and the connections that keep the town alive.",
      "shot": "Sigma 17–40mm @ 28mm · medium, eye level · handheld, observational · soft, open daylight"
    },
    {
      "src": "assets/storyboards/shaxi-6.jpg",
      "board": "Shaxi",
      "title": "Portrait of a local resident",
      "about": "Character, expression and a sense of place. Always ask permission.",
      "shot": "Sirui 55mm T1.2 · close-up, eye level · static · soft, directional side light"
    },
    {
      "src": "assets/storyboards/shaxi-7.jpg",
      "board": "Shaxi",
      "title": "Tea Horse Road bridge",
      "about": "The historic bridge, linking the town's past and present.",
      "shot": "Sigma 17–40mm @ 24mm · wide, low angle (from river level) · static (tripod) · warm daylight, depth and layers"
    },
    {
      "src": "assets/storyboards/shaxi-8.jpg",
      "board": "Shaxi",
      "title": "Evening light: a quiet ending",
      "about": "Warm evening light over the old town.",
      "shot": "Sigma 17–40mm @ 17mm · wide, high vantage point · static (tripod) · golden hour, long shadows"
    }
  ],
  "dali": [
    {
      "src": "assets/storyboards/dali-1.jpg",
      "board": "Erhai & Dali",
      "title": "Dawn across Erhai Lake",
      "about": "Mist on the water and layered mountains: the mood for the final chapter.",
      "shot": "Sigma 17–40mm @ 17mm · wide, eye level · static (tripod) · soft morning light, mist, warm tones"
    },
    {
      "src": "assets/storyboards/dali-2.jpg",
      "board": "Erhai & Dali",
      "title": "Lakeside village reflections",
      "about": "White walls and dark rooflines reflected in still water.",
      "shot": "Sigma 17–40mm @ 24mm · wide, eye level · static or slow pan · gentle side light, clear reflections"
    },
    {
      "src": "assets/storyboards/dali-3.jpg",
      "board": "Erhai & Dali",
      "title": "Everyday life on the lake",
      "about": "A fisherman at work: people and the water.",
      "shot": "Sirui 55mm T1.2 · medium, eye level · static or slow follow (handheld) · side or back morning light"
    },
    {
      "src": "assets/storyboards/dali-4.jpg",
      "board": "Erhai & Dali",
      "title": "Agricultural landscape",
      "about": "Farmers working the fields around Erhai: the seasonal rhythm.",
      "shot": "Sigma 17–40mm @ 35mm · medium-wide, low angle · static or slow handheld · warm, textured daylight"
    },
    {
      "src": "assets/storyboards/dali-5.jpg",
      "board": "Erhai & Dali",
      "title": "Bai architecture details",
      "about": "Rooflines, ornament and the texture of local building materials.",
      "shot": "Sigma @ 40mm (or Sirui 55mm) · close-up detail · static · side light, soft shadows"
    },
    {
      "src": "assets/storyboards/dali-6.jpg",
      "board": "Erhai & Dali",
      "title": "Street life in Dali",
      "about": "Local people and visitors: the town as a living place, not a postcard.",
      "shot": "Sigma 17–40mm @ 28mm · wide or medium, eye level · slow handheld · contrast and atmosphere"
    },
    {
      "src": "assets/storyboards/dali-7.jpg",
      "board": "Erhai & Dali",
      "title": "Final reflection on the water",
      "about": "A quiet moment at the end of the day, the lake in warm light.",
      "shot": "Sigma 17–40mm @ 24mm · wide, eye level · static (tripod) · golden hour, soft and calm"
    },
    {
      "src": "assets/storyboards/dali-8.jpg",
      "board": "Erhai & Dali",
      "title": "Journey ending",
      "about": "Towards Kunming: a last view from the road or train, looking back at Yunnan.",
      "shot": "Sigma @ 28mm (X-T5 or Osmo Action 6) · wide, from inside the vehicle · static or slow handheld · warm evening light, farewell mood"
    }
  ]
};
