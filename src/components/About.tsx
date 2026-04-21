export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        Sobre
      </h2>

      <div className="grid gap-12 md:grid-cols-5">
        <div className="md:col-span-3">
          <p className="text-lg leading-relaxed text-foreground">
            Software Engineer com experiência em{" "}
            <span className="text-accent">sistemas distribuídos</span>,{" "}
            <span className="text-accent-secondary">cloud native</span> e{" "}
            developer experience.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Focado em construir sistemas que escalam, com código limpo e
            documentação que importa. Acredito que engenharia de qualidade
            começa com requisitos claros e decisões explícitas.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="mb-4 font-mono text-sm uppercase tracking-wider text-accent">
              Quick Facts
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2">
                <span className="text-accent">&#9656;</span>
                Baseado em Brasil
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">&#9656;</span>
                Full-stack com foco em backend
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">&#9656;</span>
                Cloud: AWS, Docker, Kubernetes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">&#9656;</span>
                Open source contributor
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
