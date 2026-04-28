# Deep Research: Skills Criativas & Project Unboxing

> **Projeto:** Portfolio 3D — Renzo Tognella  
> **Stack:** Next.js 16, React Three Fiber, GSAP, Tailwind CSS v4  
> **Data:** 2026-04-27  
> **Objetivo:** Substituir a seção de skills atual (barras de progresso 2×2) por algo memorável; transformar o showcase de projetos em uma experiência de "unboxing" teatral.

---

## 1. Análise do Estado Atual

### Skills (`src/components/Skills.tsx`)
- **Padrão:** Cards 2×2 com barras de progresso horizontais, cores por categoria (indigo/cyan/amber/rose).
- **Interações:** Mouse parallax leve, SVG stroke-dashoffset draw-on, stagger reveal via IntersectionObserver.
- **Problema:** Barras de progresso são o padrão de 2015. Não diferenciam um portfolio 3D de um template WordPress. O visitante esquece 10 segundos depois.

### Projects (`src/components/Projects.tsx`)
- **Padrão:** Layout alternado left/right com scroll-driven clip-path reveal, visuais CSS/SVG estáticos por projeto, tech pills.
- **Interações:** Scroll progress mapeado para clip-path inset, translateY fade-in, stagger de highlights.
- **Problema:** Muito bom para um portfolio comum, mas falta o momento "wow". Não há interação direta do usuário com o projeto — ele só assiste o scroll acontecer.

---

## 2. Skills: 6 Conceitos Diferenciados (com Referências)

### 2.1 Constelação de Habilidades 3D (Skill Galaxy)
**Conceito:** Cada skill é um nó em uma rede 3D de partículas. Categorias formam clusters de cor. Conexões sutis entre skills relacionadas (ex: Rails ↔ REST APIs ↔ PostgreSQL). O usuário orbita a câmera com o mouse.

**Referências:**
- **GitHub Skills Graph** — network de dependências/repos (conceito de grafo relacional).
- **Neo4j Browser** — visualização de grafos 3D com force-directed layout.
- **Awwwards: Active Theory** — usam redes de nodes 3D em vários projetos (`activetheory.net`).

**Implementação no seu stack:**
- React Three Fiber + `@react-three/drei` (Stars, Line, Sphere).
- `@react-three/fiber` com `useFrame` para animação contínua.
- `d3-force-3d` ou implementação própria de force-directed layout para posicionar nodes.
- Cores: manter o sistema indigo/cyan/amber/rose já definido.
- Interação: `OrbitControls` limitado (apenas rotação horizontal), hover expande node e mostra tooltip com porcentagem.

**Por que funciona:** Transforma skills abstratas em um *universo* que o visitante explora. Alinha perfeitamente com o tema "Connected Workspace" do seu portfolio.

---

### 2.2 Skill Tree RPG (Árvore de Talentos)
**Conceito:** Interface de árvore de talentos como em Path of Exile ou World of Warcraft. Cada categoria é uma "branch". Skills são nodes que o usuário "desbloqueia" ao scrollar (animam de bloqueado → desbloqueado com brilho).

**Referências:**
- **Path of Exile Skill Tree** — o mais icônico; 1,300+ nodes em árvore radial massiva.
- **codebucks27/Next.js-Creative-Portfolio-Website** (386⭐) — usa tema de wizard/mago com modelos 3D de chapéu e cajado. Já prova que temática RPG funciona em portfolio Next.js + Three.js.
- **WoW Dragonflight Talent Tree** — UI moderna com conexões curvas e nodes hexagonais.

**Implementação no seu stack:**
- SVG ou Canvas 2D para a árvore (mais leve que 3D puro para este caso).
- GSAP ScrollTrigger para "desbloquear" nodes sequencialmente conforme o usuário scrolla.
- Cada node pode ter um ícone SVG customizado (já feito no seu Skills atual).
- Efeito de "unlock": partículas douradas, sombra de brilho CSS, som de click (opcional, via Web Audio API).

**Por que funciona:** Gamification instantânea. Backend engineers entendem metaforicamente — é um *tech tree* de carreira. Diferente de 99% dos portfolios.

---

### 2.3 Orbes de Skill Flutuantes (3D Floating Orbs)
**Conceito:** Esferas 3D flutuantes em um espaço escuro. Tamanho da esfera = proficiência. Cor = categoria. As esferas têm shaders customizados (iridescente, fresnel glow, ou wireframe pulsante). Ao clicar, a esfera expande e mostra detalhes.

**Referências:**
- **Bruno Simon (bruno-simon.com)** — usa esferas interativas e objetos 3D físicos. O próprio site é um carro que você dirige.
- **Lusion Labs (labs.lusion.co)** — experiências WebGL com shaders avançados e partículas.
- **Awwwards SOTD: Oryzo AI** — orbes 3D com iridescência (`lusion.co/projects/oryzo_ai`).

**Implementação no seu stack:**
- R3F + `MeshDistortMaterial` do drei (ondulação orgânica).
- `shaderMaterial` customizado com fresnel glow (fácil de implementar, 20 linhas de GLSL).
- Layout em "anel orbital": categorias em anéis concêntricos, skills em órbita lenta.
- Física leve com `@react-three/cannon` (colisão suave entre esferas) ou apenas animação senoidal.

**Por que funciona:** Visualmente impressionante em WebGL. A analogia de "planetas de conhecimento" é forte. Fácil de adaptar ao seu tema escuro atual.

---

### 2.4 Isometric Skill City (Cidade Isométrica)
**Conceito:** Cada skill é um prédio/em em uma cidade isométrica 3D. Backend = distrito industrial (torres de servidor). Dados = data center com luzes pulsantes. Infra = zona de containers Docker. Qualidade & IA = lab de pesquisa com hologramas.

**Referências:**
- **Awwwards: Synthetics Human (Lusion)** — cidades isométricas 3D.
- **Instagram/Behance trend** — "isometric city illustrations" aplicadas a tech stacks.
- **GitHub: github.com/CodeChenxi** — portfolio com cidade isométrica Three.js.

**Implementação no seu stack:**
- R3F com câmera ortográfica isométrica (`makeDefault` com `position={[10, 10, 10]}` e `orthographic`).
- Blocos low-poly (Box geometries com materiais diferentes) — leve, performático.
- GSAP para hover effects (prédio sobe, luzes acendem).
- Mapa de calor: skills com maior proficiência têm prédios maiores ou mais luzes.

**Por que funciona:** Narrativa forte. O visitante "caminha" pela sua stack. Conecta com o tema "workspace" do seu portfolio.

---

### 2.5 Terminal Skill Matrix (Expansão do Terminal Bio)
**Conceito:** Expande o terminal já existente no About. `cat skills.json` exibe uma matriz animada no terminal. Cada skill é uma linha com uma "progress bar" feita de caracteres ASCII (██████░░░░). Ao carregar, o terminal "typea" as linhas com efeito de cursor.

**Referências:**
- **Seu próprio About.tsx** — já tem o terminal bio implementado. É a evolução natural.
- **NeoFetch / HyFetch** — output ASCII art com barras de stats no terminal.
- **GitHub: holman/spark** — gráficos de sparkline no terminal.
- **Awwwards: Menawer Journey** — terminal aesthetic pesado.

**Implementação no seu stack:**
- Reusar o componente `TerminalBio` existente. Adicionar um segundo bloco ou expandir o atual.
- Animação de typing por linha com `setTimeout` ou GSAP `staggerTo`.
- Barras de progresso em ASCII com caracteres Unicode block (U+2588 a U+2591).
- Cores ANSI via Tailwind classes (text-indigo-400, text-cyan-400, etc.).
- Easter egg: comando `neofetch` que exibe um ASCII art do seu avatar.

**Por que funciona:** Consistência com o design system existente. Backend engineers *amam* terminal aesthetic. É diferente sem ser forçado.

---

### 2.6 Radar Chart Animado (Spider Web 3D)
**Conceito:** Gráfico de radar em 3D com múltiplos eixos. Cada categoria é um eixo. A área preenchida pulsa suavemente. O usuário pode rotacionar o radar para ver de diferentes ângulos.

**Referências:**
- **FIFA/EA FC Player Cards** — radar de atributos é o padrão ouro para visualizar habilidades.
- **Dribbble: "Radar Chart UI"** — dezenas de variações criativas.
- **Three.js examples: "Parametric Geometry"** — base para formas 3D dinâmicas.

**Implementação no seu stack:**
- R3F com `BufferGeometry` customizado ou `Shape` + `ExtrudeGeometry`.
- Animação de "draw" da área do radar via GSAP (scale from center).
- Múltiplas camadas: uma para cada categoria, com transparência.
- Grid hexagonal no fundo para reforçar o tema tech.

**Por que funciona:** Familiar para gamers (FIFA radar) mas raro em portfolios. Dados densos em pouco espaço.

---

## 3. Projects: 6 Conceitos de Unboxing Teatral

### 3.1 Scroll-Driven Caixa 3D (The Box)
**Conceito:** Cada projeto é representado por uma caixa 3D fechada (cubo ou caixa de presente). Ao scrollar, a caixa gira, a tampa se levanta, e o conteúdo "emerge" — screenshots, descrição, links. O efeito é físico, com mola (spring animation).

**Referências:**
- **Apple Product Pages** (iPhone, MacBook) — scroll unboxing é o padrão ouro da Apple. Cada scroll desdobra uma nova camada do produto.
- **Lusion: "Choo Choo World"** — caixas e presentes 3D interativos.
- **Awwwards: Porsche Dream Machine (Lusion)** — revele sequencial com física.

**Implementação no seu stack:**
- R3F com `BoxGeometry` para a caixa. A tampa é um `Box` separado com pivot no eixo de rotação.
- GSAP ScrollTrigger com `scrub: true` para vincular a rotação/abertura ao scroll.
- `@react-three/drei` `Html` para renderizar o conteúdo textual dentro da cena 3D (ou sobrepor HTML via `position: absolute`).
- Materiais: glassmorphism na caixa (`MeshTransmissionMaterial` do drei) ou cardboard texture procedural.

**Por que funciona:** A metáfora de "abrir um projeto" é literal. Satisfação táctil visual. Diferente de qualquer scroll-reveal padrão.

---

### 3.2 Blueprint → Realidade (Architectural Unfold)
**Conceito:** O projeto começa como um wireframe 3D/azul (blueprint). Ao scrollar/interagir, as linhas ganham cor, texturas aparecem, e o projeto "se constrói" em tempo real. Como ver um prédio sendo erguido em câmera rápida.

**Referências:**
- **Autodesk / SketchUp** — flythrough de construção.
- **Awwwards: Devin AI (Lusion)** — transições de wireframe para realidade.
- **Game dev: "The Finals"** — mapas que se constroem proceduralmente.

**Implementação no seu stack:**
- R3F com `EdgedGeometry` ou `Wireframe` material para a fase blueprint.
- Transição via GSAP: `material.wireframe = false` + `material.opacity` tween.
- Para projetos web (Tradener, Modulus): usar mockups de dashboard como texturas em planos 3D.
- Para o IEEE: usar point cloud 3D que ganha cor (já tem isso no visual atual, pode expandir).

**Por que funciona:** Metaforicamente mostra o *processo* de construção, não só o resultado. Engenharia em ação.

---

### 3.3 Origami Card Unfold (Desdobramento de Origami)
**Conceito:** Cada projeto é um card que começa dobrado (origami). Ao clicar/scrollar, o card se desdobra em múltiplas seções: título, descrição, highlights, tech stack, links. Cada dobra é uma animação CSS 3D.

**Referências:**
- **Paper.js** — biblioteca de geometria para origami digital.
- **Awwwards: "Off Menu" (Petr Knoll)** — manipulação de papel e dobras.
- **Google I/O Material Design** — cards com elevação e sombras dinâmicas.

**Implementação no seu stack:**
- CSS 3D transforms (`rotateX`, `rotateY`, `transform-origin`) — surpreendentemente poderoso para origami.
- GSAP Flip plugin para animar entre estados dobrado/desdobrado.
- Ou R3F com `PlaneGeometry` segmentada e animação de vértices para dobras realistas.
- Sombra dinâmica que se ajusta conforme o card se abre.

**Por que funciona:** Elemento de surpresa. O usuário não espera que um card "se desdobre". Baixo custo de implementação para o impacto visual.

---

### 3.4 Layered Peel (Casca de Cebola)
**Conceito:** O projeto está coberto por camadas que precisam ser "descascadas". Cada camada é uma informação diferente: camada 1 = nome do cliente/indústria, camada 2 = problema resolvido, camada 3 = stack técnico, camada 4 = resultado/impacto. O usuário scrolla para "rasgar" cada camada.

**Referências:**
- **Obys Agency (obys.agency)** — transições de "rasgo" e revelação em camadas.
- **Awwwards: "Menawer Journey"** — scroll que remove camadas de UI.
- **Magazine digital: "The New York Times: Snow Fall"** — storytelling em camadas.

**Implementação no seu stack:**
- GSAP ScrollTrigger com `clip-path` animado (já usa isso, mas invertido: em vez de revelar de dentro, rasga de fora).
- Ou `mask-image` com gradiente animado.
- Cada camada pode ter uma textura diferente: papel kraft, foil metalizado, plástico translúcido (glassmorphism).

**Por que funciona:** Storytelling progressivo. O visitante ganha contexto antes de ver o projeto. Funciona bem para projetos complexos (Tradener, Modulus).

---

### 3.5 Device Mockup Theatre (Teatro de Mockups)
**Conceito:** Cada projeto é apresentado dentro de um device 3D que se "monta" na tela. Para Tradener: um dashboard em um monitor ultrawide que desliza do topo. Para Modulus: um laptop que abre. Para IEEE: um tablet de pesquisa. Os devices são modelos 3D low-poly.

**Referências:**
- **Apple Keynotes** — devices que flutuam e giram.
- **Awwwards: "Synthetic Human" (Lusion)** — devices e interfaces holográficas.
- **Samsy/Samsy.github.io** — portfolio com devices 3D.

**Implementação no seu stack:**
- Modelos 3D de devices: encontrar no Sketchfab (licença CC) ou criar com basic geometries (Box + Cylinder para laptop).
- `useGLTF` do drei para carregar models.
- GSAP timeline para montagem: base → tela → teclado → conteúdo da tela.
- A tela do device é um `Html` overlay do drei, renderizando a UI real do projeto (screenshot ou iframe).

**Por que funciona:** Contexto imediato. O device sugere o *tipo* de projeto antes mesmo de ler. Muito usado em apresentações de produto.

---

### 3.6 Shrink-Wrap Burst (Estourar a Bolha)
**Conceito:** O projeto começa coberto por uma película plástica bolha (shrink-wrap) ou filme de proteção. Ao passar o mouse ou scrollar, a película rasga, estoura, ou derrete, revelando o projeto por baixo. Satisfação ASMR visual.

**Referências:**
- **Gucci Vault / Luxury e-commerce** — unboxing de produtos com plástico e fitas.
- **Awwwards: "From Another Love"** — texturas de plástico e glassmorphism.
- **CodePen: "Plastic Wrap Shader"** — shaders de plástico com distorção.

**Implementação no seu stack:**
- Shader customizado em R3F: noise-based displacement para criar a textura de plástico enrugado.
- Interação: mouse position afeta o `uniform` de distorção (como tocar em plástico bolha).
- Scroll-triggered tear: `clip-path` ou shader `discard` baseado em scroll progress.
- Alternativa low-tech: CSS com múltiplas layers de `backdrop-filter: blur()` que se dissolvem.

**Por que funciona:** Satisfação táctil. O unboxing é um dos formatos de vídeo mais populares do YouTube por um motivo — aplica isso ao web design.

---

## 4. Referências de Portfolios Premiados (Analisados)

| Portfolio | Prêmios | Destaque | Relevância para você |
|-----------|---------|----------|----------------------|
| **Bruno Simon** (bruno-simon.com) | — | Carro 3D interativo, física Cannon.js, gamificação total | Prova que portfolios podem ser *jogos*. Seu tema de workspace pode ser um escritório 3D interativo. |
| **Lusion** (lusion.co) | Awwwards SOTD, FWA, CSSDA | Estúdio 3D com projetos imersivos, shaders avançados | Referência técnica máxima para R3F. O estilo dark/tech matcha com o seu. |
| **Obys Agency** (obys.agency) | Awwwards SOTD x múltiplos | Transições teatrais, scroll hijacking elegante, tipografia expêrimental | Padrão ouro para "unboxing" de conteúdo via scroll. |
| **codebucks27** (386⭐ GitHub) | — | Next.js + Three.js + wizard theme + Framer Motion | Stack idêntica ao seu. Prova viabilidade técnica. Tem tutorial no YouTube. |
| **Rauno Freiberg** (rauno.me) | — | Minimalismo com interação perfeita, micro-animations | Referência para "menos é mais" quando necessário. |
| **Juxtopposed** (juxtopposed.com) | — | Design experimental, contraste extremo, navegação não-convencional | Inspiração para quebrar regras de layout. |
| **Awwwards: Off Menu** (Petr Knoll) | Dev SOTD | Manipulação de papel, scroll interactions | Diretamente aplicável ao conceito de origami/layered peel. |
| **Awwwards: Carlos Prado** | — | Portfólio de desenvolvedor com 3D e transições suaves | Referência direta de concorrente/peers. |

---

## 5. Recomendação: Roadmap de Implementação

### Fase 1: Quick Win — Terminal Skill Matrix (1-2 dias)
- Expandir o `TerminalBio` existente com `cat skills.json`.
- Barras ASCII animadas com typing effect.
- **Impacto:** Alto. Consistência imediata com o design system. Diferente sem adicionar dependências.

### Fase 2: Medium Impact — Skill Constellation 3D (3-5 dias)
- Implementar a Skill Galaxy com R3F.
- 4 clusters de cor, ~20 nodes, conexões suaves.
- OrbitControls + hover tooltips.
- **Impacto:** Muito alto. Vira *feature* do portfolio. Alguém vai compartilhar isso.

### Fase 3: High Impact — Project Unboxing (5-7 dias)
- Escolher **UM** conceito para testar: recomendo **Blueprint → Realidade** para o IEEE (já tem point cloud) ou **Device Mockup Theatre** para Tradener/Modulus.
- Implementar em R3F com GSAP ScrollTrigger.
- **Impacto:** Transforma a seção de projetos em experiência, não lista.

### Fase 4: Polish — Transições Globais (2-3 dias)
- Adicionar transições de página com GSAP (se não tiver).
- Scroll smooth com Lenis (ou nativo + GSAP).
- Loading state temático: "Booting workspace..." com terminal aesthetic.

---

## 6. Dependências Sugeridas

```bash
# Já tem:
# next, react, react-dom, three, @react-three/fiber, @react-three/drei, gsap, tailwindcss

# Adicionar para skills/projects:
npm install @react-three/postprocessing    # Efeitos de bloom/glow nas esferas
npm install lenis                           # Scroll smooth (usado por Obys, Lusion)
npm install @gsap/react                     # Hooks oficiais GSAP para React

# Opcional para skill tree/constellation:
npm install d3-force-3d                     # Force-directed layout 3D
npm install three-stdlib                    # Utilitários Three.js
```

---

## 7. Notas Técnicas

### Performance
- **R3F:** Usar `instancedMesh` para partículas/nodes (>50 objetos). `drei/Instances` simplifica.
- **GSAP:** Sempre usar `will-change: transform` e `force3D: true`. Limpar ScrollTriggers no unmount.
- **Next.js 16:** `dynamic()` com `ssr: false` para componentes R3F. Já faz isso provavelmente, mas verificar.

### Acessibilidade
- `prefers-reduced-motion`: reduzir para versões estáticas (skill galaxy → lista; unboxing → fade simples).
- `aria-label` em todos os nodes 3D interativos.
- Fallback mobile: a versão mobile do unboxing deve ser swipe-based ou auto-play.

### Tailwind v4
- O documento `perfectjob-design-system.md` mostra que você domina design tokens. Aplicar o mesmo padrão aqui: criar tokens para `--skill-node-size`, `--skill-glow-color`, `--project-unbox-duration`.

---

## 8. Conclusão

O seu portfolio já tem uma base técnica excelente (3D scene, terminal bio, scroll animations). O próximo nível não é adicionar *mais* features — é transformar as features existentes em *experiências memoráveis*.

**Skills:** Fuja das barras de progresso. A **Skill Constellation 3D** ou **Terminal Skill Matrix** são as escolhas mais alinhadas com o seu stack e aesthetic.

**Projects:** Fuja do scroll-reveal passivo. O **Blueprint → Realidade** ou **Device Mockup Theatre** transformam projetos técnicos em apresentações teatrais.

> *"O portfolio não é um currículo — é uma prova de que você pode construir experiências digitais memoráveis."*
