/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TREK CATALOG — single source of truth for every card, filter, count,
 *  destination page and trek detail page on the site.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  ⚠️  ALL ENTRIES BELOW ARE ILLUSTRATIVE SAMPLES (status: "sample").
 *
 *  They follow commonly published route outlines so the site can be previewed,
 *  but they are NOT your confirmed itineraries. Before launch, for each trek:
 *    1. Confirm or rewrite the itinerary, durations, difficulty and seasons.
 *    2. Add your real price (`pricePerPerson`, in INR) — or leave it undefined
 *       to show "Contact us for pricing".
 *    3. Add your real inclusions / exclusions (empty = "to be confirmed").
 *    4. Add verified altitude / distance figures if you want them shown.
 *    5. Replace the stock photos with your own.
 *    6. Change `status` to "verified" to remove the sample notice.
 *
 *  Deliberately left out of the samples: prices, altitudes, distances, departure
 *  dates and inclusions — these must come from you.
 */
import type { Faq, PackingGroup, Trek, TrekPackage } from "@/types/trek";
import { photos } from "@/data/images";

/* ── Shared helpers for sample content ────────────────────────────────────── */

const groupPackage = (summary?: string): TrekPackage => ({
  id: "group",
  name: "Group departure",
  summary: summary ?? "Join a small group on a scheduled departure. Dates are shared on enquiry.",
  inclusions: [],
});

const privatePackage: TrekPackage = {
  id: "private",
  name: "Private / custom group",
  summary:
    "For friends, families or teams who want their own dates and pace. Details are planned together on WhatsApp.",
  inclusions: [],
};

const basePacking = (winter: boolean): PackingGroup[] => [
  {
    category: "Clothing",
    items: [
      "Moisture-wicking base layers",
      "Fleece or insulated mid-layer",
      winter ? "Warm down or synthetic jacket" : "Light insulated jacket",
      "Waterproof shell jacket",
      "Trekking pants (avoid jeans)",
      winter ? "Thermal inners, warm cap and insulated gloves" : "Sun cap and light gloves",
      "Woollen and cotton socks",
    ],
  },
  {
    category: "Footwear",
    items: [
      "Broken-in trekking shoes with good grip",
      "Light camp footwear",
      ...(winter ? ["Gaiters (ask your guide if needed)"] : []),
    ],
  },
  {
    category: "Equipment",
    items: [
      "Backpack (around 40–60 L) with rain cover",
      "Small day pack",
      "Trekking pole",
      "Headlamp with spare batteries",
      "Reusable water bottles",
    ],
  },
  {
    category: "Personal essentials",
    items: [
      "Sunscreen, lip balm and UV-protection sunglasses",
      "Personal medicines and a small first-aid kit",
      "Quick-dry towel and basic toiletries",
      "Energy snacks",
    ],
  },
  {
    category: "Documents",
    items: ["Government photo ID (original and a copy)", "Any medical or fitness forms requested by your guide"],
  },
];

const commonFaqs = (difficulty: Trek["difficulty"]): Faq[] => [
  {
    question: "Can beginners join?",
    answer:
      difficulty === "Easy"
        ? "Usually yes, if you are in reasonable health and can walk for several hours. Share your experience on WhatsApp and we'll talk through whether this trek suits you."
        : "Some prior hiking experience helps. Share your fitness and trekking background on WhatsApp and we'll be honest about whether this trek is a good fit.",
  },
  {
    question: "What is included in the package?",
    answer:
      "Inclusions are confirmed for each departure. Ask on WhatsApp and you'll receive the full list, along with what is not included, before you book.",
  },
  {
    question: "What happens if the weather changes?",
    answer:
      "Mountain weather is unpredictable. The guide may change, shorten or pause the route for safety. Ask about the specific weather and refund policy for your departure before booking.",
  },
  {
    question: "How do I book?",
    answer:
      "Send an enquiry on WhatsApp from this page. You'll get available dates, final pricing and the booking process directly from your guide. Nothing is confirmed until you hear back.",
  },
];

/* ── Catalog ──────────────────────────────────────────────────────────────── */

export const treks: Trek[] = [
  {
    id: "triund",
    slug: "triund-trek",
    name: "Triund Trek",
    state: "Himachal Pradesh",
    location: "Dharamshala, Kangra",
    summary:
      "A short ridge-top trek above McLeod Ganj with wide views of the Dhauladhar range — a gentle introduction to Himalayan trails.",
    description: [
      "Triund is a grassy ridge above McLeod Ganj that looks straight across at the Dhauladhar range. The trail climbs through oak and rhododendron forest before opening onto the ridge.",
      "It is a popular first trek: short, well marked and rewarding, with an evening and sunrise on the ridge.",
    ],
    routeSummary: "McLeod Ganj / Dharamkot → Triund ridge → return",
    startPoint: "McLeod Ganj / Dharamkot",
    endPoint: "McLeod Ganj / Dharamkot",
    durationDays: 2,
    difficulty: "Easy",
    difficultyNote: "A steady uphill walk on a well-used trail, with a steeper final section.",
    fitnessNote: "Comfortable walking for 4–6 hours with breaks.",
    bestSeasons: ["Spring", "Autumn", "Winter"],
    seasonLabel: "Mar – Jun, Sep – Dec",
    coverImage: photos.tentMeadow,
    gallery: [photos.tentMeadow, photos.sunsetRange, photos.pinesMountain],
    itinerary: [
      {
        day: 1,
        title: "Climb to Triund ridge",
        route: "McLeod Ganj / Dharamkot → Triund",
        startLocation: "McLeod Ganj",
        endLocation: "Triund",
        description:
          "Meet in McLeod Ganj for a briefing, then climb through forest to the Triund ridge. Evening on the ridge with views of the Dhauladhar range.",
      },
      {
        day: 2,
        title: "Sunrise and descent",
        route: "Triund → McLeod Ganj",
        startLocation: "Triund",
        endLocation: "McLeod Ganj",
        description:
          "Watch the sunrise over the valley, then descend the same trail back to McLeod Ganj. Departure as per the confirmed schedule.",
      },
    ],
    packages: [groupPackage(), privatePackage],
    inclusions: [],
    exclusions: [],
    packingList: basePacking(false),
    faqs: [
      ...commonFaqs("Easy"),
      {
        question: "Is Triund suitable for a first trek?",
        answer:
          "It is commonly done as a first trek. The final stretch is steep, so take it at a steady pace and carry enough water.",
      },
    ],
    featured: true,
    status: "sample",
  },
  {
    id: "hampta-pass",
    slug: "hampta-pass-trek",
    name: "Hampta Pass Trek",
    state: "Himachal Pradesh",
    location: "Manali, Kullu – Lahaul",
    summary:
      "Cross from the green Kullu valley into the stark landscapes of Lahaul — a dramatic crossover trek with river valleys and a high pass.",
    description: [
      "The Hampta Pass trek is known for its contrast: forested Kullu valley on one side, the dry, high-desert landscape of Lahaul on the other.",
      "Days follow a river valley through meadows and boulder fields before the pass crossing, which is the longest day of the trek.",
    ],
    routeSummary: "Manali → Jobra → Chika → Balu ka Ghera → Hampta Pass → Shea Goru → Chatru → Manali",
    startPoint: "Manali",
    endPoint: "Manali",
    durationDays: 5,
    difficulty: "Moderate",
    difficultyNote: "Includes river crossings, boulder sections and a long pass-crossing day.",
    fitnessNote: "Regular cardio training for several weeks before the trek is recommended.",
    accommodationType: "Tents (to be confirmed)",
    bestSeasons: ["Summer", "Monsoon"],
    seasonLabel: "Jun – Sep",
    coverImage: photos.riverValley,
    gallery: [photos.riverValley, photos.summitView, photos.tentForest],
    itinerary: [
      {
        day: 1,
        title: "Manali to Jobra, walk to Chika",
        route: "Manali → Jobra → Chika",
        startLocation: "Manali",
        endLocation: "Chika",
        description:
          "Drive from Manali up to the trailhead at Jobra and walk a short, easy section to the first campsite at Chika beside the river.",
      },
      {
        day: 2,
        title: "Chika to Balu ka Ghera",
        route: "Chika → Balu ka Ghera",
        startLocation: "Chika",
        endLocation: "Balu ka Ghera",
        description:
          "Follow the river valley through meadows and boulder sections, with stream crossings, to the camp at Balu ka Ghera.",
      },
      {
        day: 3,
        title: "Cross Hampta Pass to Shea Goru",
        route: "Balu ka Ghera → Hampta Pass → Shea Goru",
        startLocation: "Balu ka Ghera",
        endLocation: "Shea Goru",
        description:
          "An early start for the climb to Hampta Pass, then a steep descent into the Lahaul side to camp at Shea Goru. This is the longest day of the trek.",
      },
      {
        day: 4,
        title: "Shea Goru to Chatru",
        route: "Shea Goru → Chatru",
        startLocation: "Shea Goru",
        endLocation: "Chatru",
        description:
          "Walk down the valley to Chatru. A visit to Chandratal may be possible depending on road conditions — confirm when you enquire.",
      },
      {
        day: 5,
        title: "Return to Manali",
        route: "Chatru → Manali",
        startLocation: "Chatru",
        endLocation: "Manali",
        description: "Drive back to Manali over Rohtang Pass or through the Atal Tunnel, as per the confirmed plan.",
      },
    ],
    packages: [groupPackage(), privatePackage],
    inclusions: [],
    exclusions: [],
    packingList: basePacking(false),
    faqs: [
      ...commonFaqs("Moderate"),
      {
        question: "Are there river crossings?",
        answer:
          "Yes, the route usually involves stream and river crossings, which vary with the season and time of day. Your guide will advise on footwear and timing.",
      },
    ],
    featured: true,
    status: "sample",
  },
  {
    id: "bhrigu-lake",
    slug: "bhrigu-lake-trek",
    name: "Bhrigu Lake Trek",
    state: "Himachal Pradesh",
    location: "Manali, Kullu",
    summary:
      "A short, steep climb through forest and wide alpine meadows to a high-altitude lake above Manali.",
    description: [
      "Bhrigu Lake sits in a bowl high above the Kullu valley. The route climbs quickly from forest into open meadows with views of the Pir Panjal range.",
      "Because the trek gains height quickly, it needs good fitness despite its short length.",
    ],
    routeSummary: "Manali → Gulaba → meadow campsites → Bhrigu Lake → Vashisht",
    startPoint: "Manali",
    endPoint: "Manali",
    durationDays: 4,
    difficulty: "Moderate",
    difficultyNote: "Short but steep, with quick altitude gain.",
    fitnessNote: "Good stamina for steady climbs; prior hiking experience helps.",
    accommodationType: "Tents (to be confirmed)",
    bestSeasons: ["Summer", "Autumn"],
    seasonLabel: "May – Oct",
    coverImage: photos.alpineLake,
    gallery: [photos.alpineLake, photos.himachalValley, photos.pinesMountain],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Manali",
        route: "Manali",
        endLocation: "Manali",
        description: "Arrive in Manali, meet your guide for a briefing and gear check, and rest for the climb ahead.",
      },
      {
        day: 2,
        title: "Gulaba to the meadow campsite",
        route: "Manali → Gulaba → meadow camp",
        startLocation: "Gulaba",
        endLocation: "Meadow campsite",
        description: "Drive to Gulaba and climb through forest into open meadows to the first campsite.",
      },
      {
        day: 3,
        title: "Bhrigu Lake and back to camp",
        route: "Meadow camp → Bhrigu Lake → camp",
        startLocation: "Meadow campsite",
        endLocation: "Lower campsite",
        description:
          "Climb to Bhrigu Lake, spend time at the lake, then return to a lower campsite. Exact camps depend on the confirmed itinerary.",
      },
      {
        day: 4,
        title: "Descend to Vashisht",
        route: "Camp → Vashisht → Manali",
        startLocation: "Lower campsite",
        endLocation: "Manali",
        description: "Descend through forest to Vashisht and continue to Manali for departure.",
      },
    ],
    packages: [groupPackage()],
    inclusions: [],
    exclusions: [],
    packingList: basePacking(false),
    faqs: commonFaqs("Moderate"),
    status: "sample",
  },
  {
    id: "kedarkantha",
    slug: "kedarkantha-trek",
    name: "Kedarkantha Trek",
    state: "Uttarakhand",
    location: "Sankri, Uttarkashi",
    summary:
      "A classic winter summit trek through snow-laden pine forests to a summit with sweeping views of Garhwal peaks.",
    description: [
      "Kedarkantha is one of the best-known winter treks in Uttarakhand. The trail climbs from the village of Sankri through pine and oak forest to campsites in snowy clearings.",
      "Summit day starts before dawn and ends with wide views over the Garhwal Himalaya.",
    ],
    routeSummary: "Dehradun → Sankri → Juda ka Talab → Kedarkantha Base → Summit → Sankri → Dehradun",
    startPoint: "Dehradun",
    endPoint: "Dehradun",
    durationDays: 6,
    difficulty: "Moderate",
    difficultyNote: "Steady climbs on snow in winter; summit day is long and starts early.",
    fitnessNote: "Regular cardio training for several weeks before the trek is recommended.",
    accommodationType: "Guesthouse and tents (to be confirmed)",
    bestSeasons: ["Winter", "Spring"],
    seasonLabel: "Dec – Apr",
    coverImage: photos.snowSummitGroup,
    gallery: [photos.snowSummitGroup, photos.tentSnow, photos.snowyTrees],
    itinerary: [
      {
        day: 1,
        title: "Dehradun to Sankri",
        route: "Dehradun → Sankri",
        startLocation: "Dehradun",
        endLocation: "Sankri",
        description: "A long, scenic mountain drive from Dehradun to the village of Sankri, the base for the trek.",
      },
      {
        day: 2,
        title: "Sankri to Juda ka Talab",
        route: "Sankri → Juda ka Talab",
        startLocation: "Sankri",
        endLocation: "Juda ka Talab",
        description: "Climb through pine and oak forest to the campsite near the small lake of Juda ka Talab.",
      },
      {
        day: 3,
        title: "Juda ka Talab to Kedarkantha Base",
        route: "Juda ka Talab → Kedarkantha Base",
        startLocation: "Juda ka Talab",
        endLocation: "Kedarkantha Base",
        description: "A shorter walk through forest clearings to base camp, with the summit ridge in view.",
      },
      {
        day: 4,
        title: "Summit day",
        route: "Kedarkantha Base → Summit → lower camp",
        startLocation: "Kedarkantha Base",
        endLocation: "Lower campsite",
        description:
          "A pre-dawn start for the summit climb. Summit attempts always depend on weather, snow conditions and the guide's judgement. Descend to a lower camp afterwards.",
      },
      {
        day: 5,
        title: "Return to Sankri",
        route: "Camp → Sankri",
        startLocation: "Lower campsite",
        endLocation: "Sankri",
        description: "Descend through forest and villages back to Sankri.",
      },
      {
        day: 6,
        title: "Sankri to Dehradun",
        route: "Sankri → Dehradun",
        startLocation: "Sankri",
        endLocation: "Dehradun",
        description: "Drive back to Dehradun as per the confirmed schedule.",
      },
    ],
    packages: [groupPackage(), privatePackage],
    inclusions: [],
    exclusions: [],
    packingList: basePacking(true),
    faqs: [
      ...commonFaqs("Moderate"),
      {
        question: "How cold does it get?",
        answer:
          "In winter, nights at camp are well below freezing. Layering is essential — use the packing list on this page and confirm the final list with your guide.",
      },
    ],
    featured: true,
    status: "sample",
  },
  {
    id: "dayara-bugyal",
    slug: "dayara-bugyal-trek",
    name: "Dayara Bugyal Trek",
    state: "Uttarakhand",
    location: "Raithal, Uttarkashi",
    summary:
      "Wide high-altitude meadows that turn green in summer and white in winter, with open views of the Garhwal ranges.",
    description: [
      "Dayara Bugyal is one of the largest high-altitude meadows in Uttarakhand. The trail climbs from village farmland through forest to open grassland.",
      "It suits first-time trekkers looking for big views without technical sections.",
    ],
    routeSummary: "Dehradun → Raithal → Gui → Dayara Bugyal → Raithal → Dehradun",
    startPoint: "Dehradun",
    endPoint: "Dehradun",
    durationDays: 6,
    difficulty: "Easy",
    difficultyNote: "Gradual gradients on a clear trail; snow in winter adds effort.",
    fitnessNote: "Comfortable walking for 5–6 hours on consecutive days.",
    accommodationType: "Guesthouse and tents (to be confirmed)",
    bestSeasons: ["Winter", "Summer", "Autumn"],
    seasonLabel: "Most of the year",
    coverImage: photos.meadow,
    gallery: [photos.meadow, photos.cloudHillside, photos.sunriseRidge],
    itinerary: [
      {
        day: 1,
        title: "Dehradun to Raithal",
        route: "Dehradun → Raithal",
        startLocation: "Dehradun",
        endLocation: "Raithal",
        description: "Drive from Dehradun along the Bhagirathi valley to the village of Raithal.",
      },
      {
        day: 2,
        title: "Raithal to Gui",
        route: "Raithal → Gui",
        startLocation: "Raithal",
        endLocation: "Gui",
        description: "Climb through farmland and forest to the campsite at Gui.",
      },
      {
        day: 3,
        title: "Gui to Dayara Bugyal",
        route: "Gui → Dayara Bugyal",
        startLocation: "Gui",
        endLocation: "Dayara Bugyal",
        description: "The forest opens out onto the vast Dayara meadow. Camp with views of the surrounding ranges.",
      },
      {
        day: 4,
        title: "Explore the meadows",
        route: "Dayara Bugyal → viewpoint → camp",
        startLocation: "Dayara Bugyal",
        endLocation: "Campsite",
        description:
          "Walk higher across the meadows to a viewpoint, conditions permitting, and return to camp. The exact plan is set by your guide.",
      },
      {
        day: 5,
        title: "Descend to Raithal",
        route: "Camp → Raithal",
        startLocation: "Campsite",
        endLocation: "Raithal",
        description: "Descend through forest back to Raithal.",
      },
      {
        day: 6,
        title: "Raithal to Dehradun",
        route: "Raithal → Dehradun",
        startLocation: "Raithal",
        endLocation: "Dehradun",
        description: "Drive back to Dehradun as per the confirmed schedule.",
      },
    ],
    packages: [groupPackage()],
    inclusions: [],
    exclusions: [],
    packingList: basePacking(true),
    faqs: commonFaqs("Easy"),
    status: "sample",
  },
  {
    id: "brahmatal",
    slug: "brahmatal-trek",
    name: "Brahmatal Trek",
    state: "Uttarakhand",
    location: "Lohajung, Chamoli",
    summary:
      "A winter ridge trek past frozen lakes and through oak forest, with close views of Trishul and Nanda Ghunti.",
    description: [
      "Brahmatal is a winter trek in the Chamoli district, known for its ridge walks, forest trails and frozen lakes.",
      "From the ridge, trekkers often get close views of big Garhwal peaks such as Trishul and Nanda Ghunti, weather permitting.",
    ],
    routeSummary: "Kathgodam → Lohajung → Bekaltal → Brahmatal → Lohajung → Kathgodam",
    startPoint: "Kathgodam",
    endPoint: "Kathgodam",
    durationDays: 6,
    difficulty: "Moderate",
    difficultyNote: "Snow walking and ridge sections in winter.",
    fitnessNote: "Regular cardio training for several weeks before the trek is recommended.",
    accommodationType: "Guesthouse and tents (to be confirmed)",
    bestSeasons: ["Winter"],
    seasonLabel: "Dec – Mar",
    coverImage: photos.pinesSnowPeak,
    gallery: [photos.pinesSnowPeak, photos.snowFieldWalk, photos.ridgePair],
    itinerary: [
      {
        day: 1,
        title: "Kathgodam to Lohajung",
        route: "Kathgodam → Lohajung",
        startLocation: "Kathgodam",
        endLocation: "Lohajung",
        description: "A long drive through the Kumaon hills to the base village of Lohajung.",
      },
      {
        day: 2,
        title: "Lohajung to Bekaltal",
        route: "Lohajung → Bekaltal",
        startLocation: "Lohajung",
        endLocation: "Bekaltal",
        description: "Walk through villages and oak forest to the campsite near Bekaltal lake.",
      },
      {
        day: 3,
        title: "Bekaltal to Brahmatal camp",
        route: "Bekaltal → Brahmatal",
        startLocation: "Bekaltal",
        endLocation: "Brahmatal camp",
        description: "Climb onto the ridge and continue to the campsite near Brahmatal.",
      },
      {
        day: 4,
        title: "Brahmatal top and descent",
        route: "Brahmatal → Brahmatal top → camp",
        startLocation: "Brahmatal camp",
        endLocation: "Lower campsite",
        description:
          "An early climb to the high point above the lake for views, conditions permitting, then descend to a lower camp.",
      },
      {
        day: 5,
        title: "Return to Lohajung",
        route: "Camp → Lohajung",
        startLocation: "Lower campsite",
        endLocation: "Lohajung",
        description: "Descend through forest back to Lohajung.",
      },
      {
        day: 6,
        title: "Lohajung to Kathgodam",
        route: "Lohajung → Kathgodam",
        startLocation: "Lohajung",
        endLocation: "Kathgodam",
        description: "Drive back to Kathgodam as per the confirmed schedule.",
      },
    ],
    packages: [groupPackage(), privatePackage],
    inclusions: [],
    exclusions: [],
    packingList: basePacking(true),
    faqs: commonFaqs("Moderate"),
    status: "sample",
  },
];
