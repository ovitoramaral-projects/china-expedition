// Approximate coordinates [lat, lon] from general geographic references, NOT
// verified pins. Used only for rough straight-line distances from where you
// sleep to each place; the page always says so and links to Amap for routes.
// Stays are located by their voucher address (village / street level).
"use strict";
const GEO = {
  stays: {
    chengdu:   [30.6555, 104.0830], // Dongsheng St, near Chunxi Road
    siguniang: [31.0050, 102.8330], // Shuangqiao Village, Rilong
    danba:     [30.9230, 101.8620], // Jiaju village, viewing platform No. 1
    tagong:    [30.3240, 101.5200], // Tagong town, Provincial Hwy 215
    yajiang:   [30.0310, 101.0150], // Yajiang town centre
    daocheng:  null,                // street address not in the booking email
    deqin:     [28.4430, 98.8730],  // Feilai Temple area
    shangrila: [27.8210, 99.7060],  // Dukezong Old Town
    lijiang:   [26.8790, 100.2340], // Old Town, Big Waterwheel entrance
    shaxi:     [26.3180, 99.8530],  // Sideng Village
    dali:      [25.6400, 100.2050], // Dazhuang Village, Taihe, Xiaguan
  },
  places: {
    siguniang: [31.0100, 102.8650], shuangqiao: [31.0300, 102.8250],
    danba: [30.8820, 101.8900], jiaju: [30.9230, 101.8620], zhonglu: [30.8930, 101.9250], suopo: [30.8650, 101.9180],
    tagongGrass: [30.3200, 101.5250], tagongMonastery: [30.3236, 101.5205],
    meili: [28.4430, 98.8730], feilai: [28.4430, 98.8730],
    dukezong: [27.8210, 99.7060], songzanlin: [27.8740, 99.7070], napa: [27.8850, 99.6400],
    lijiangOld: [26.8760, 100.2350], blackDragon: [26.8860, 100.2310], wangu: [26.8730, 100.2320],
    baisha: [26.9500, 100.2220], shuhe: [26.9200, 100.2050], jadeDragon: [27.0500, 100.2200], blueMoon: [27.1000, 100.2400], impression: [27.1200, 100.2000],
    shaxi: [26.3180, 99.8530], shibaoshan: [26.4000, 99.8400],
    erhai: [25.6150, 100.2400], daliOld: [25.6920, 100.1600], xizhou: [25.8500, 100.1300], zhoucheng: [25.8800, 100.1000],
  },
  // Places passed on the drive in: no distance from that night's stay.
  enRoute: ["dujiangyan", "wolong", "gunong", "muya", "heishicheng", "litang", "changqing"],
};
