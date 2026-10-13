import { Suspense } from "react";
import { getAllTreks } from "@/lib/treks";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrekExplorer } from "@/components/treks/TrekExplorer";
import { TrekCard } from "@/components/treks/TrekCard";
import { DevNotice } from "@/components/ui/DevNotice";
import { photos } from "@/data/images";

export const metadata = pageMetadata({
  title: "Explore Himalayan Treks",
  description:
    "Browse guided treks in Himachal Pradesh and Uttarakhand. Filter by region, difficulty, duration and season, then view full itineraries.",
  path: "/treks",
  image: photos.summitView,
});

export default function TreksPage() {
  const catalog = getAllTreks();
  const hasSamples = catalog.some((t) => t.status === "sample");

  return (
    <>
      <PageHeader
        eyebrow="Explore treks"
        title="Find the trail"
        titleMuted="that fits you."
        intro="Search by name or place, filter by region, difficulty, duration and season, and open any trek for its full day-by-day plan."
      />
      <section className="pb-24">
        <div className="container-page">
          {hasSamples && (
            <DevNotice className="mb-6">
              Some treks are marked as sample data (status: &quot;sample&quot; in src/data/treks.ts). Review and verify them before launch.
            </DevNotice>
          )}
          {/* Fallback renders the full catalog for no-JS and first paint; the explorer takes over once loaded. */}
          <Suspense
            fallback={
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.map((t) => (
                  <li key={t.id}>
                    <TrekCard trek={t} />
                  </li>
                ))}
              </ul>
            }
          >
            <TrekExplorer catalog={catalog} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
