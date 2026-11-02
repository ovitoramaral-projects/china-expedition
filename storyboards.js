// Storyboard boards per stop (destination id from destinations.js).
// Danba & Jiaju: "Jiaju & Danba Village Life", supplied by the user on 2 Nov 2026 as a photo
// of the board on screen; straightened and cut into 4:3 frames. Replace with the original
// export for sharper frames (same file names).
// To add one: put the image in assets/storyboards/ and list it here.
// Every drawing frame must be exactly 4:3 (see .claude/skills/cinematic-storyboard).
//
//   lijiang: [{ src: "assets/storyboards/lijiang-1.jpg", title: "Blue Moon Valley at first light",
//              about: "what the frame shows", shot: "lens · framing · movement · light", place: "jiaju" }],
"use strict";
const STORYBOARDS = {
  danba: [
    { src: "assets/storyboards/danba-1.jpg", place: "jiaju", title: "Arrival: the village in its landscape", about: "A wide establishing view of Jiaju village, stone houses scattered on the hillside, mountains behind.", shot: "Sigma 17–40mm @ 17mm · wide, high vantage point · static (tripod) · soft morning light, possible mist" },
    { src: "assets/storyboards/danba-2.jpg", place: "jiaju", title: "Daily life: a moment at home", about: "An intimate portrait of a local resident working at the doorway, in everyday traditional clothing.", shot: "Sirui 55mm T1.2 · medium, eye level · static or slight handheld · natural side light" },
    { src: "assets/storyboards/danba-3.jpg", place: "jiaju", title: "Architecture: stone, wood and detail", about: "A close study of traditional Jiaju architecture: texture, woodwork and hand-built details.", shot: "Sigma 17–40mm @ 35–40mm · close-up, low angle · static · side light for texture and depth" },
    { src: "assets/storyboards/danba-4.jpg", place: "jiaju", title: "Village paths: people in the space", about: "A villager walking the narrow paths, giving the village its human scale.", shot: "Sigma 17–40mm @ 24mm · medium-wide, behind the subject · slow follow (handheld or gimbal) · soft, diffused daylight" },
    { src: "assets/storyboards/danba-5.jpg", place: "jiaju", title: "Portrait: generations", about: "A close portrait with character and a sense of place. Always ask permission and be respectful.", shot: "Sirui 55mm T1.2 · close-up, eye level · static · soft directional natural light" },
    { src: "assets/storyboards/danba-6.jpg", place: "jiaju", title: "Textures: traces of daily life", about: "Drying crops, tools, wood and stone: the material culture of the village.", shot: "Sigma 17–40mm @ 40mm (or 55mm) · close-up with context · static or slight handheld · side light for texture and form" },
    { src: "assets/storyboards/danba-7.jpg", place: "jiaju", title: "Land and people: a shared life", about: "Farm work with traditional houses behind, tying people, land and architecture together.", shot: "Sigma 17–40mm @ 24–28mm · wide, eye level · static or slow handheld · natural daylight, possibly late afternoon" },
    { src: "assets/storyboards/danba-8.jpg", place: "jiaju", title: "Closing: village at dusk", about: "Back to the wide village view: the end of the day and the larger landscape.", shot: "Sigma 17–40mm @ 17–28mm · wide · static (tripod) · golden hour, long shadows" },
  ],
};
