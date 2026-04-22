# About Section — Redesign Spec

## Visão Geral

Seção "Sobre" cinematográfica com padrão dark premium para Backend Software Engineer. Surge após transição "Dive Into Screen" do Hero.

---

## Inspiracoes (Pesquisa Real)

### Top 5 Referências
1. **Brittany Chiang** (brittanychiang.com) — Gold standard. Seções numeradas, timeline vertical, dark navy, clean typography
2. **Max Milkin** (maxmilkin.com) — Awwwards SOTD. Letter-by-letter reveals, scroll counters, magazine editorial
3. **Josh W. Comeau** (joshwcomeau.com) — Mais criativo. Interactive map, audio, unit toggles
4. **Mono Digital** (mono-digital.ru) — Near-black, GSAP, horizontal slider, teal accents
5. **DevCraft Dribbble** (dribbble.com/shots/27145524) — Glassmorphism + dark + electric blue

---

## Layout Proposto — 5 Blocos

### Bloco 1: Terminal Bio (topo)
```
┌─────────────────────────────────────────────┐
│ visitor@portfolio:~$ cat about.md           │
│                                             │
│ > name: "Renzo Tognella de Rosa"           │
│ > role: "Backend Software Engineer"        │
│ > company: "Tradener"                      │
│ > location: "Curitiba, PR — Brasil"        │
│ > education: "Sistemas de Informação, UTFPR│
│ >               (Jul/2027)"                │
│ > focus: "Sistemas distribuídos, APIs,     │
│ >         gestão de risco energético"      │
│ visitor@portfolio:~$ █                      │
└─────────────────────────────────────────────┘
```
- Font: JetBrains Mono / Geist Mono
- Typewriter animation com blinking cursor
- Syntax highlighting colors (prompt=verde, strings=amber, keys=indigo)
- Fundo: `rgba(255,255,255,0.02)` com border `rgba(255,255,255,0.06)`

### Bloco 2: Stat Cards (3 colunas)
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ 3+       │  │ 50+      │  │ IEEE     │
│ anos exp │  │ prop/dia │  │ LARS/SBR │
│          │  │ Modulus  │  │ 2023     │
└──────────┘  └──────────┘  └──────────┘
```
- Glass cards: `backdrop-filter: blur(16px)`, `rgba(255,255,255,0.04)` bg
- Counter animation on scroll (0 → valor final)
- Borda glow sutil no accent color
- Hover: lift + glow increase

### Bloco 3: Bio Narrativa (split-screen)
```
┌────────────────────────┬───────────────────┐
│                        │                   │
│  Texto narrativo       │  Glass card com   │
│  sobre experiência     │  quick facts:     │
│  e filosofia           │  • Backend-focused│
│                        │  • IEEE Research  │
│                        │  • Freelance      │
│                        │  • Team Lead exp  │
└────────────────────────┴───────────────────┘
```
- Esquerda: Texto com `text-accent` highlights, scroll reveal
- Direita: Glass card com ícones SVG

### Bloco 4: Timeline de Carreira (vertical)
```
2024 ────● Backend Engineer @ Tradener
          │ Sistema de faturamento, gestão de risco
          │ Lead interino 3 meses
          │
2023 ────● Coautor IEEE LARS/SBR
          │ Estimação 3D com Kinect
          │ C++ / Python / Computer Vision
          │
2023 ────● Freelance — Modulus Engenharia
          │ SaaS com pipeline LLM
          │ ~50 propostas/dia
          │
2022 ────● Início UTFPR
          │ Sistemas de Informação
```
- Linha vertical com glow nodes
- Animação: nodes aparecem sequencialmente no scroll
- Cores: accent indigo para nodes, muted para linhas

### Bloco 5: Tech Stack Grid (bento-style)
```
┌─────────────────┬──────────┬──────────┐
│ Ruby on Rails   │ Python   │ Java     │
│ ████████████░   │ ██████░  │████████░ │
├─────────┬───────┴──────────┴──────────┤
│ PostgreSQL │ Redis     │ Docker       │
│ ██████████ │ ████████  │ ████████     │
├───────────┴───────────┴──────────────┤
│ AWS  │ Git  │ CI/CD  │ Clean Arch    │
│ ████ │ ████ │ ████   │ ████████      │
└──────────────────────────────────────┘
```
- Bento grid assimétrico
- Glass cards com accent border no topo
- Skill bars animados no scroll

---

## Animações

### Scroll Reveal
- Cada bloco tem `IntersectionObserver` com stagger 150ms
- Fade-in + translateY(20px → 0)
- Easing: `cubic-bezier(0.215, 0.61, 0.355, 1)` (premium)

### Counter Animation (Stats)
- GSAP ScrollTrigger → countUp de 0 ao valor
- Duração: 2s, ease: power2.out
- Trigger: quando stat card entra viewport

### Typewriter (Terminal)
- CSS animation: `steps()` para caracteres
- Cursor blinking: `animation: blink 1s step-end infinite`
- Delay de início: 500ms após bloco visível

### Timeline Nodes
- Sequential reveal: cada node aparece 200ms após o anterior
- Linha connecting "desenha" entre nodes (height: 0 → auto)
- Glow pulse no node ativo

---

## Paleta de Cores (consistente com Hero)

```
Background:     #0a0a0f
Surface:        rgba(15, 15, 25, 0.8)
Card/Glass:     rgba(255, 255, 255, 0.04)
Border:         rgba(255, 255, 255, 0.08)
Text Primary:   #e2e8f0
Text Muted:     #94a3b8
Accent:         #6366f1
Accent Glow:    #818cf8
Terminal BG:    #0d1117
Terminal Text:  #58a6ff
Success:        #34d399
Warning:        #fbbf24
```

---

## Dados Reais (do Currículo)

```typescript
const aboutData = {
  name: "Renzo Tognella de Rosa",
  role: "Backend Software Engineer",
  company: "Tradener",
  location: "Curitiba, PR — Brasil",
  education: "Sistemas de Informação, UTFPR (Jul/2027)",
  research: "IEEE LARS/SBR 2023 — 3D Estimation with Kinect",
  freelance: "Modulus Engenharia — SaaS Platform",
  
  stats: [
    { value: 3, suffix: "+", label: "anos de experiência" },
    { value: 50, suffix: "+", label: "propostas/dia (Modulus)" },
    { value: 1, suffix: "", label: "publicação IEEE" },
    { value: 3, suffix: "", label: "meses como lead interino" },
  ],
  
  timeline: [
    {
      year: "2024",
      title: "Backend Engineer @ Tradener",
      description: "Faturamento, gestão de risco, APIs PLD. Lead interino por 3 meses.",
      tags: ["Rails", "PostgreSQL", "Redis", "Docker"],
    },
    {
      year: "2023",
      title: "Coautor — IEEE LARS/SBR",
      description: "Estimação de centro 3D com Kinect RGB-D. C++ e Python.",
      tags: ["C++", "Python", "Computer Vision"],
    },
    {
      year: "2023",
      title: "Freelance — Modulus Engenharia",
      description: "SaaS com pipeline LLM, ~50 propostas/dia, analytics.",
      tags: ["Rails", "Python", "LLMs", "PostgreSQL"],
    },
    {
      year: "2022",
      title: "UTFPR — Sistemas de Informação",
      description: "Início da graduação. Previsão conclusão: Jul/2027.",
      tags: [],
    },
  ],
  
  bio: "Backend Software Engineer no setor energético, construindo sistemas de faturamento e gestão de risco que processam milhões em transações. Pesquisador publicado no IEEE em visão computacional. Acredito que engenharia de qualidade começa com requisitos claros, código testável e documentação que importa.",
};
```

---

## Responsividade

- **Desktop (lg+)**: Terminal full-width, stats 3-col, bio split-screen, timeline vertical
- **Tablet (md)**: Stats 2-col, bio stacked, timeline vertical compacto
- **Mobile (sm)**: Terminal scroll horizontal, stats 1-col, timeline simplified
