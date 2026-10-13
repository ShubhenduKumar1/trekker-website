"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/format";
import { setScrollLock } from "@/lib/dom";

const SHAPE: Record<GalleryItem["shape"], string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

export function Gallery({ items, title = "Moments from the trail." }: { items: GalleryItem[]; title?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastIndex = useRef(0);

  const open = (i: number) => {
    lastIndex.current = i;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  // Native <dialog>: provides focus containment, Escape-to-close and an inert background.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      setScrollLock(true);
    }
    if (index === null && dialog.open) dialog.close();
    if (index !== null) lastIndex.current = index;
  }, [index]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setScrollLock(false);
      setIndex(null);
      triggerRefs.current[lastIndex.current]?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  if (!items.length) return null;
  const current = index !== null ? items[index] : null;

  return (
    <section aria-labelledby="gallery-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="gallery-title"
          eyebrow="Gallery"
          title={title}
          titleMuted="A glimpse of life on the trail."
          intro="Sunrises, forest paths, snowfields and campsites."
        />

        <ul className="mt-14 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4 md:gap-4 lg:auto-rows-[14rem]">
          {items.map((item, i) => (
            <Reveal as="li" key={item.src} delay={(i % 4) * 0.06} y={20} className={cn("relative", SHAPE[item.shape])}>
              <button
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                type="button"
                onClick={() => open(i)}
                className="group relative block size-full overflow-hidden rounded-[1.4rem] bg-canvas"
                aria-label={`View larger: ${item.caption}`}
              >
                <SafeImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={item.shape === "wide" ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.05] motion-reduce:transition-none"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 text-left text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {item.caption}
                  <Expand className="size-4 shrink-0" />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current ? `Photo: ${current.caption}` : "Photo viewer"}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/90"
      >
        {current && (
          <div className="flex h-full flex-col text-white" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="text-sm text-white/70" aria-live="polite">
                {index! + 1} / {items.length}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Close photo viewer"
              >
                <X className="size-5" />
              </button>
            </div>
            <figure className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 sm:px-16">
              <div className="relative min-h-0 flex-1">
                <SafeImage key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
              </div>
              <figcaption className="py-4 text-center text-sm text-white/80">{current.caption}</figcaption>
            </figure>
            <div className="pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between sm:inset-x-4">
              <button
                type="button"
                onClick={() => step(-1)}
                className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Next photo"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
