/** Locks page scroll while a modal surface (menu, drawer, lightbox) is open. */
export function setScrollLock(locked: boolean) {
  document.body.style.overflow = locked ? "hidden" : "";
}

/** Today's date as yyyy-mm-dd in the visitor's local time zone. */
export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
