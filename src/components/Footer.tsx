export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 py-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-mono text-sm text-muted">
          &copy; {year} renzo<span className="text-accent">.</span>dev
        </p>
        <p className="text-xs text-muted/50">
          Built with Next.js + React Three Fiber
        </p>
      </div>
    </footer>
  );
}
