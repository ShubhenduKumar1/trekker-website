/**
 * One-time migration: reads the existing static content (src/data/*.ts,
 * src/config/site.ts) and writes it into Payload, so the sample treks and
 * current settings carry over instead of being retyped by hand in /admin.
 *
 * Run once a real DATABASE_URI is set:
 *   npm run migrate:seed
 *
 * Safe to re-run against an empty database; NOT idempotent — running it
 * twice against a database that already has this content will duplicate it.
 *
 * Runs as a plain ESM script via tsx (not `payload run`) because Node's
 * CJS loader can't require() @payloadcms/richtext-lexical's ESM-with-
 * top-level-await build (ERR_REQUIRE_ASYNC_MODULE on Node 24). `.mts` makes
 * Node use its real ESM loader instead, which handles that fine.
 */
import fs from "fs/promises";
import path from "path";
import process from "process";
import { getPayload } from "payload";
import { treks as sourceTreks } from "../data/treks";
import { destinations as sourceDestinations } from "../data/destinations";
import { generalFaqs } from "../data/faqs";
import { testimonials as sourceTestimonials } from "../data/testimonials";
import { gallery as sourceGallery } from "../data/gallery";
import { siteConfig } from "../config/site";
import type { Photo } from "../types/trek";

// `payload run` normally loads .env.local for you; doing that ourselves here.
// Must happen before payload.config.ts is evaluated, since it reads
// process.env.DATABASE_URI at module load time — so that import is
// deliberately dynamic (below), not static like the others.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local — fine if DATABASE_URI etc. are set another way.
}

const { default: config } = await import("../payload.config");

async function readPhotoBuffer(src: string): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Failed to fetch ${src}: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    return { buffer: Buffer.from(arrayBuffer), contentType: res.headers.get("content-type") || "image/jpeg", ext: "jpg" };
  }
  // Local file under /public, e.g. "/photos/name.jpg" or "/logo.svg".
  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  const buffer = await fs.readFile(filePath);
  const ext = path.extname(filePath).slice(1) || "jpg";
  const contentType = ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
  return { buffer, contentType, ext };
}

function slugifyForFilename(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "image"
  );
}

async function run() {
  const payload = await getPayload({ config });

  const mediaCache = new Map<string, string | number>();

  async function uploadPhoto(photo: Photo): Promise<string | number> {
    const cached = mediaCache.get(photo.src);
    if (cached !== undefined) return cached;

    const { buffer, contentType, ext } = await readPhotoBuffer(photo.src);
    const doc = await payload.create({
      collection: "media",
      data: { alt: photo.alt },
      file: {
        data: buffer,
        mimetype: contentType,
        name: `${slugifyForFilename(photo.alt)}.${ext}`,
        size: buffer.length,
      },
    });
    mediaCache.set(photo.src, doc.id);
    return doc.id;
  }

  console.log(`Seeding ${sourceDestinations.length} destinations...`);
  for (const d of sourceDestinations) {
    const image = await uploadPhoto(d.image);
    const secondaryImage = await uploadPhoto(d.secondaryImage);
    await payload.create({
      collection: "destinations",
      data: {
        slug: d.slug,
        state: d.state,
        shortName: d.shortName,
        eyebrow: d.eyebrow,
        tagline: d.tagline,
        intro: d.intro,
        longIntro: d.longIntro.map((text) => ({ text })),
        image,
        secondaryImage,
      },
    });
  }

  console.log(`Seeding ${sourceTreks.length} treks...`);
  const trekIdBySlug = new Map<string, string | number>();
  for (const t of sourceTreks) {
    const coverImage = await uploadPhoto(t.coverImage);
    const gallery = [];
    for (const photo of t.gallery) {
      gallery.push({ image: await uploadPhoto(photo) });
    }
    const itinerary = [];
    for (const day of t.itinerary) {
      itinerary.push({
        day: day.day,
        title: day.title,
        route: day.route,
        startLocation: day.startLocation,
        endLocation: day.endLocation,
        description: day.description,
        distanceKm: day.distanceKm,
        trekkingHours: day.trekkingHours,
        startAltitudeM: day.startAltitudeM,
        endAltitudeM: day.endAltitudeM,
        meals: day.meals?.map((value) => ({ value })) ?? [],
        accommodation: day.accommodation,
        image: day.image ? await uploadPhoto(day.image) : undefined,
      });
    }

    const doc = await payload.create({
      collection: "treks",
      data: {
        slug: t.slug,
        name: t.name,
        state: t.state,
        location: t.location,
        summary: t.summary,
        description: t.description.map((text) => ({ text })),
        routeSummary: t.routeSummary,
        startPoint: t.startPoint,
        endPoint: t.endPoint,
        durationDays: t.durationDays,
        difficulty: t.difficulty,
        difficultyNote: t.difficultyNote,
        fitnessNote: t.fitnessNote,
        pricePerPerson: t.pricePerPerson,
        maxAltitudeM: t.maxAltitudeM,
        distanceKm: t.distanceKm,
        accommodationType: t.accommodationType,
        groupSize: t.groupSize,
        bestSeasons: t.bestSeasons,
        seasonLabel: t.seasonLabel,
        coverImage,
        gallery,
        itinerary,
        packages: t.packages.map((p) => ({
          name: p.name,
          summary: p.summary,
          pricePerPerson: p.pricePerPerson,
          inclusions: p.inclusions.map((value) => ({ value })),
          accommodation: p.accommodation,
          transportDetails: p.transportDetails,
          groupSize: p.groupSize,
          requirements: p.requirements,
        })),
        inclusions: t.inclusions.map((value) => ({ value })),
        exclusions: t.exclusions.map((value) => ({ value })),
        packingList: t.packingList.map((group) => ({
          category: group.category,
          items: group.items.map((value) => ({ value })),
        })),
        faqs: t.faqs,
        featured: t.featured ?? false,
        status: t.status,
      },
    });
    trekIdBySlug.set(t.slug, doc.id);
  }

  console.log(`Seeding ${sourceGallery.length} gallery items...`);
  for (const [index, item] of sourceGallery.entries()) {
    const image = await uploadPhoto(item);
    await payload.create({
      collection: "gallery-items",
      data: { image, caption: item.caption, shape: item.shape, order: index },
    });
  }

  console.log(`Seeding ${generalFaqs.length} FAQs...`);
  for (const [index, faq] of generalFaqs.entries()) {
    await payload.create({ collection: "faqs", data: { ...faq, order: index } });
  }

  if (sourceTestimonials.length) {
    console.log(`Seeding ${sourceTestimonials.length} testimonials...`);
    for (const t of sourceTestimonials) {
      await payload.create({ collection: "testimonials", data: t });
    }
  }

  console.log("Updating site settings...");
  const guidePortrait = siteConfig.guide.portrait ? await uploadPhoto(siteConfig.guide.portrait) : undefined;
  const logo = siteConfig.logoSrc
    ? await uploadPhoto({ src: siteConfig.logoSrc, alt: `${siteConfig.brandName} logo` })
    : undefined;

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      brandName: siteConfig.brandName,
      wordmark: siteConfig.wordmark,
      logo,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      whatsappNumber: siteConfig.whatsappNumber ?? undefined,
      email: siteConfig.email ?? undefined,
      phoneDisplay: siteConfig.phoneDisplay ?? undefined,
      baseLocation: siteConfig.baseLocation ?? undefined,
      heroTrekSlug: trekIdBySlug.get(siteConfig.heroTrekSlug),
      social: siteConfig.social,
      guide: {
        name: siteConfig.guide.name ?? undefined,
        portrait: guidePortrait,
        intro: siteConfig.guide.intro.map((text) => ({ text })),
        whyTrekking: siteConfig.guide.whyTrekking ?? undefined,
        philosophy: siteConfig.guide.philosophy ?? undefined,
        credentials: siteConfig.guide.credentials.map((value) => ({ value })),
      },
      policies: {
        terms: siteConfig.policies.terms?.map((text) => ({ text })) ?? [],
        cancellation: siteConfig.policies.cancellation?.map((text) => ({ text })) ?? [],
        emergencyContact: siteConfig.policies.emergencyContact ?? undefined,
      },
    },
  });

  console.log("Seed complete. Visit /admin to create your admin login, then review the imported content.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
