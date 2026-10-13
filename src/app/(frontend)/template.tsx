/** Restrained page transition: a short CSS fade on each navigation (no JS needed, honours reduced motion). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
