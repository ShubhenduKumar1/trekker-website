/** Shown only while Next.js Draft Mode is on (inside /admin's Live Preview / Preview button) — never for a normal visitor. */
export function DraftModeBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] bg-amber-500 py-1.5 text-center text-xs font-semibold text-white">
      Draft preview — this may include unpublished changes
    </div>
  );
}
