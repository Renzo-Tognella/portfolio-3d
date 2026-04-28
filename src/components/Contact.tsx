"use client";

export function Contact() {
  return (
    <section id="contact" className="relative w-full py-28 md:py-36">
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* Heading */}
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Conecte-se
            </span>
          </div>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Vamos{" "}
            <span
              className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent"
              style={{ filter: "drop-shadow(0 0 20px rgba(99,102,241,0.3))" }}
            >
              Conversar
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Interessado em trabalhar juntos? Estou aberto a oportunidades e colaborações.
          </p>
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <div className="h-1 w-1 rounded-full bg-accent" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left: CTA + links */}
          <div className="flex flex-col justify-center lg:col-span-2">
            <p className="text-lg leading-relaxed text-foreground">
              Seja para discutir uma oportunidade, colaborar em um projeto ou apenas
              trocar ideias sobre engenharia de software — minha caixa de entrada está
              sempre aberta.
            </p>
            <p className="mt-4 text-muted">
              Respondo em até 48h.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="mailto:renzo.tognella@gmail.com"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </a>
              <a
                href="https://github.com/Renzo-Tognella"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.02] px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-accent/50 hover:text-accent hover:bg-accent/5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/renzo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.02] px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-accent/50 hover:text-accent hover:bg-accent/5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Right: Glass form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-3xl border p-8 md:p-10"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                borderColor: "rgba(255,255,255,0.06)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 24px 48px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground/80">
                      Nome
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/80">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground/80">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-colors resize-none"
                    placeholder="Sua mensagem..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25"
                >
                  Enviar mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
