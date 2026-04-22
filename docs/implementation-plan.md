# Implementation Plan: Dive Into Screen + About Redesign

## Ordem de Execução

### Fase 1: Fundação (scroll infrastructure)
1. Instalar GSAP + ScrollTrigger (se não tiver)
2. Criar `ScrollManager.tsx` — gerencia scroll progress (0-1) via GSAP ScrollTrigger
3. Refatorar Hero.tsx — GSAP pin + scroll spacer (400vh)
4. Testar: scroll deve pinar o Canvas e emitir progress 0-1

### Fase 2: Scroll-Driven Camera
1. Criar `DiveCamera.tsx` — camera keyframes com lerpVectors + damp
2. Integrar com ScrollManager progress
3. Mapear progress → camera position + FOV (ver tabela em dive-into-screen.md)
4. Testar: camera deve ir de isométrica → zoom no monitor suavemente

### Fase 3: Monitor Turn-On + RenderTexture
1. Atualizar monitor principal no Scene3D — adicionar RenderTexture no screen
2. Implementar emissiveMap com turn-on progress (0→1 conforme câmera se aproxima)
3. Criar conteúdo R3F dentro do monitor (preview do About com Text, shapes)
4. Testar: monitor deve acender com glow e mostrar conteúdo

### Fase 4: 3D → HTML Transition
1. Criar About overlay HTML — posicionado atrás do Canvas
2. Implementar crossfade: Canvas opacity (1→0.15) + About opacity (0→1) no scroll 80-100%
3. Testar: transição contínua e fluida

### Fase 5: About Section Redesign
1. Terminal Bio block com typewriter animation
2. Stat Cards com counter animation
3. Bio Narrativa split-screen
4. Timeline de Carreira vertical
5. Tech Stack bento grid
6. Scroll reveal animations para cada bloco

### Fase 6: Polimento
1. Parallax no Canvas pós-transição
2. Performance profiles (desktop/mobile/low-end)
3. `prefers-reduced-motion` support
4. Responsividade mobile
5. Build test + deploy

---

## Dependências a Instalar
```bash
npm install gsap @gsap/react
# @react-three/drei já tem RenderTexture
# @react-three/postprocessing pode ser necessário para Bloom (verificar se Three.js 0.184 suporta)
```

---

## Arquivos a Criar/Modificar

### Novos
- `src/components/ScrollManager.tsx` — GSAP ScrollTrigger wrapper
- `src/components/DiveCamera.tsx` — scroll-driven camera animator
- `src/components/MonitorScreen.tsx` — RenderTexture + turn-on effect
- `src/components/about/TerminalBio.tsx`
- `src/components/about/StatCards.tsx`
- `src/components/about/BioNarrative.tsx`
- `src/components/about/CareerTimeline.tsx`
- `src/components/about/TechGrid.tsx`

### Modificar
- `src/components/Hero.tsx` — GSAP pin + scroll integration
- `src/components/Scene3D.tsx` — Monitor recebe RenderTexture, camera removida
- `src/components/About.tsx` — Redesenho completo
- `src/app/globals.css` — Novas keyframes (typewriter, counter, timeline-reveal)
- `src/app/page.tsx` — Estrutura de scroll sections

---

## Risks & Mitigations

| Risco | Mitigação |
|-------|-----------|
| RenderTexture pesada em mobile | Profile tier: mobile usa resolução 960×540 ou sem texture |
| GSAP ScrollTrigger + R3F conflict | Usar ref para progress, não state (evita re-renders) |
| Bloom incompatível com Three.js 0.184 | Fallback: emissive intensity sem post-processing |
| 400vh spacer afeta SEO/layout | Usar GSAP pin ao invés de spacer manual |
| Monitor posição muda se cena é alterada | Keyframes da câmera usam position relativa ao monitor |
