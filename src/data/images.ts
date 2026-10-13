import type { Photo } from "@/types/trek";

/**
 * Stock photography from Unsplash (free to use under the Unsplash License).
 * These are atmospheric placeholders and are NOT photos of the specific treks
 * or of your own groups. Replace them with your own trail photos before launch
 * — authentic photos build far more trust.
 *
 * To use your own photos: put files in /public/photos and use e.g.
 * { src: "/photos/kedarkantha-summit.jpg", alt: "…" }.
 */
const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const photos = {
  hero: { src: u("1661623031407-23d1115e671c"), alt: "Trekkers walking along a snowy Himalayan ridge in soft morning light" },
  snowClimb: { src: u("1642498709557-b1bd711dd68b"), alt: "Two trekkers climbing a snow-covered slope" },
  tentMeadow: { src: u("1712597802047-62eacd764209"), alt: "A tent pitched on a grassy hilltop with mountains behind" },
  riverValley: { src: u("1652501834567-937de29c4533"), alt: "A river winding through a deep mountain valley" },
  alpineLake: { src: u("1651317720959-2ee65b345736"), alt: "A high alpine lake ringed by snow and mountains" },
  snowSummitGroup: { src: u("1673356728302-0905d20cf836"), alt: "Trekkers gathered on a snow-covered summit" },
  meadow: { src: u("1669362590089-b715e797c293"), alt: "An open grassy meadow with mountains in the distance" },
  pinesSnowPeak: { src: u("1623591609259-19c86d6ca734"), alt: "Pine forest below a snow-covered peak" },
  himachalValley: { src: u("1628699543232-dc241b48a4b3"), alt: "A green mountain pasture beneath clouds and forested ridges" },
  pinesMountain: { src: u("1565610468500-adc61f362be5"), alt: "Tall pine trees in front of a mountainside" },
  cloudHillside: { src: u("1689676474552-3c5df0ec6b56"), alt: "A green hillside wrapped in drifting clouds" },
  sunsetRange: { src: u("1641310045101-fd176a42cd44"), alt: "A mountain range glowing at sunset" },
  tentForest: { src: u("1618772446265-3f9f8e6f8487"), alt: "Pine-covered valley beneath dramatic clouds and snow peaks" },
  sunriseRidge: { src: u("1644076253748-80c43d1894a6"), alt: "Sunrise breaking over a snowy ridge" },
  ridgePair: { src: u("1611231832033-c3d79cbf2777"), alt: "Two trekkers on a wide snow-covered ridge" },
  forestRiver: { src: u("1611523658822-385aa008324c"), alt: "A forest trail beside a mountain river" },
  summitView: { src: u("1578048117504-495014256835"), alt: "A view across snow-covered summits under a blue sky" },
  snowFieldWalk: { src: u("1606827417145-8fdbbebf15fd"), alt: "A snowy clearing in a pine forest with mountains beyond" },
  tentSnow: { src: u("1628841290657-c272f3e87fff"), alt: "Colourful tents pitched in a snowy forest campsite" },
  hikerSnowPeaks: { src: u("1745599773063-c141d883e073"), alt: "A trekker resting on a snow slope looking out at the mountains" },
  snowyTrees: { src: u("1584693070556-9e54aa1244b1"), alt: "Evergreen trees on snowy ground beneath mountains" },
  personOnMountain: { src: u("1669807935395-3bc80395a951"), alt: "A trekker with arms outstretched above a sea of clouds" },
  twoWalkers: { src: u("1552590854-7a7d89b018ff"), alt: "Trekkers on a grassy ridge above the clouds" },
  moonRange: { src: u("1740217078264-02829267ff8f"), alt: "A mountain range at dusk with the moon above" },
} satisfies Record<string, Photo>;
