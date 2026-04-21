const SKILL_CATEGORIES = [
  {
    name: "Frontend",
    skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Python", "SQL", "PostgreSQL", "REST", "GraphQL"],
  },
  {
    name: "DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
  },
  {
    name: "Tools",
    skills: ["Git", "Linux", "Neovim", "Figma", "Blender"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        Skills
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {SKILL_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent-secondary">
              {cat.name}
            </h3>
            <ul className="space-y-2">
              {cat.skills.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
