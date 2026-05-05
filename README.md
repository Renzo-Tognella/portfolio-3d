# Renzo — Portfolio 3D

Portfolio pessoal com cena 3D interativa construída com **Next.js**, **React Three Fiber** e **GSAP**.

## ✨ Features

- **Cena 3D interativa** — Mesa de escritório com monitor, teclado, livros clicáveis, gavetas de projetos, objetos decorativos
- **"Dive Into Screen"** — Câmera scroll-driven que mergulha da visão isométrica até o monitor
- **Monitor com conteúdo dinâmico** — Slides de About → Skills → Projects renderizados via Canvas 2D
- **Device tier detection** — Qualidade gráfica adaptativa (high/medium/low) baseada na GPU
- **Dark theme premium** — Paleta `#0a0a0f` com glassmorphism, indigo accent, animações cinematográficas
- **Seções completas** — About, Experiência, Skills, Contato
- **Static export** — Deploy no GitHub Pages

## 🛠 Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (static export) |
| 3D | React Three Fiber + Three.js 0.184 |
| UI | Tailwind CSS 4 |
| Animação | GSAP + ScrollTrigger |
| Tipagem | TypeScript 5.9 |

## 🚀 Rodando localmente

```bash
npm install
npm run dev
# → http://localhost:3000
```

Build de produção:

```bash
npm run build
# output estático em out/
```

## 📁 Estrutura

```
src/
├── app/           # Next.js App Router
├── components/    # React + R3F components
│   ├── Scene3D.tsx    # Cena 3D principal (mesa, monitor, objetos)
│   ├── Hero.tsx       # GSAP ScrollTrigger + Dive Camera
│   ├── About.tsx      # Terminal bio, stats, timeline
│   ├── Experiencia.tsx # Projetos com scroll-reveal
│   ├── Skills.tsx     # Glass cards com skill bars
│   └── Contact.tsx    # Formulário funcional
├── hooks/         # useCanvasTexture, etc.
└── data/          # Dados compartilhados (skills, projetos, perfil)
```

## 🔧 Deploy

Configurado para GitHub Pages via GitHub Actions (`.github/workflows/deploy-pages.yml`).
Base path: `/portfolio-3d` (ajuste em `next.config.ts` se usar domínio próprio).

---

Feito com ☕ em Curitiba.
