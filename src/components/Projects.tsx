const PROJECTS = [
  {
    title: "TheSearch",
    description:
      "Plataforma de busca e agregação de dados com arquitetura distribuída e pipeline de processamento em tempo real.",
    tech: ["TypeScript", "Next.js", "AWS", "Docker"],
    github: "https://github.com/Renzo-Tognella/TheSearch",
    live: "#",
  },
  {
    title: "EvoArena",
    description:
      "Simulação evolutiva em Unity com algoritmos genéticos e neuroevolution. Benchmarks de stress com 10K+ épocas.",
    tech: ["C#", "Unity", "Python", "ML-Agents"],
    github: "https://github.com/Renzo-Tognella/EvoArena",
    live: "#",
  },
  {
    title: "Hermes Agent",
    description:
      "Sistema de engenharia de software com IA — doc-first, multi-agent, governance. Profile SE-Chief.",
    tech: ["TypeScript", "Python", "Docker", "MCP"],
    github: "https://github.com/Renzo-Tognella/TheSearch",
    live: "#",
  },
];

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        Projetos
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {PROJECTS.map((project) => (
          <article
            key={project.title}
            className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
          >
            <h3 className="text-xl font-bold text-foreground">
              {project.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-xs text-accent"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex gap-4">
              <a
                href={project.github}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                GitHub &rarr;
              </a>
              <a
                href={project.live}
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                Live &rarr;
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
