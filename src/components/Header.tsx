"use client";

import Link from "next/link";

const NAV_LINKS = [
  { href: "#about", label: "Sobre" },
  { href: "#projects", label: "Projetos" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contato" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight text-foreground"
        >
          renzo<span className="text-accent">.</span>dev
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="rounded-full border border-accent bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
        >
          Contato
        </a>
      </div>
    </header>
  );
}
