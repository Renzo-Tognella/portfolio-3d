"use client";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        Contato
      </h2>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="text-lg text-foreground">
            Interessado em trabalhar juntos?
          </p>
          <p className="mt-2 text-muted">
            Estou aberto a oportunidades e colaborações. Me mande uma mensagem.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:renzo@example.com"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Email
            </a>
            <a
              href="https://github.com/renzo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/renzo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm text-muted"
              >
                Nome
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm text-muted"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm text-muted"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none resize-none"
                placeholder="Sua mensagem..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
