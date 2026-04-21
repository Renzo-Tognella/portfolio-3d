export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
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
