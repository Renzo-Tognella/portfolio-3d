"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "Sobre" },
  { href: "#experience", label: "Experiência" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contato" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight text-foreground"
        >
          renzo<span className="text-accent">.</span>dev
        </Link>

        {/* Desktop nav */}
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

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full border border-accent bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white sm:inline-flex"
          >
            Contato
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex flex-col gap-1 p-2 sm:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[2px] w-5 bg-foreground transition-all duration-300 ${
                mobileOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-foreground transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-foreground transition-all duration-300 ${
                mobileOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-14 z-40 bg-background/95 backdrop-blur-xl transition-transform duration-300 sm:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col items-center justify-center gap-8 pt-20">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-4 rounded-full border border-accent bg-accent/10 px-6 py-2.5 text-base font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Contato
          </a>
        </nav>
      </div>
    </header>
  );
}
