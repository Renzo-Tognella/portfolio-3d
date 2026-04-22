# Dive Into Screen — Design Spec

## Visão Geral

O usuário scrolla → a câmera se aproxima do monitor principal (em frente ao teclado) → a tela acende progressivamente → o conteúdo da seção About aparece "dentro" do monitor → transição contínua para o HTML real da seção About → Canvas fica fixo no background com parallax sutil.

---

## Decisões de Design

| Decisão | Escolha |
|---------|---------|
| Monitor portal | Principal (em frente ao teclado) |
| Transição | Contínua e fluida |
| Canvas pós-transição | Fixo no background (parallax sutil) |
| Conteúdo no monitor | Preview da seção About |
| Monitor antes do scroll | Tela preta — acende conforme câmera se aproxima |
| About section | Redesenhar com padrão cinematográfico |

---

## Fases do Scroll (0-100%)

```
Scroll 0%    → Cena isométrica completa, texto hero visível, monitor preto
Scroll 15%   → Texto hero começa fade out
Scroll 25%   → Texto hero totalmente invisível, câmera começa a mover
Scroll 40%   → Monitor acende (glow crescente), conteúdo About aparece na tela
Scroll 60%   → Câmera muito próxima do monitor, tela preenche 70% do viewport
Scroll 80%   → Tela do monitor preenche viewport inteiro, About preview domina
Scroll 90%   → Crossfade: Canvas fade-out + HTML About fade-in (sobreposto)
Scroll 100%  → Canvas no background com parallax, seção About é conteúdo principal
```

---

## Arquitetura Técnica

### Stack
- **Scroll driver**: GSAP ScrollTrigger com `pin: true` + `scrub: 1.5`
- **Camera**: `useFrame` + `Vector3.lerpVectors()` + `MathUtils.damp()` para suavidade
- **Monitor texture**: `@react-three/drei` `RenderTexture` com `emissiveMap`
- **Turn-on effect**: `emissiveIntensity` animado + `toneMapped={false}` + Bloom
- **Transição 3D→HTML**: Opacity crossfade entre Canvas e div HTML

### Camadas HTML
```
<div class="hero-scroll-section">  ← GSAP pin target, height: 400vh
  <canvas>                          ← position: sticky, top: 0, z-index: 2
  <div class="about-overlay">       ← position: absolute, z-index: 1
</div>
```

### Camera Keyframes
| Progress | Position X | Position Y | Position Z | FOV  | LookAt    |
|----------|-----------|-----------|-----------|------|-----------|
| 0.00     | 8.0       | 6.5       | 8.0       | 36°  | (0, 1, 0) |
| 0.25     | 5.0       | 3.5       | 5.0       | 34°  | (0, 1, 0) |
| 0.50     | 2.0       | 1.8       | 2.5       | 32°  | (0, 1, 0) |
| 0.75     | 0.3       | 1.1       | 1.2       | 28°  | (0, 1, 0) |
| 1.00     | 0.0       | 1.0       | 0.5       | 24°  | (0, 1, 0) |

### Monitor Turn-On Curve
| Progress | Emissive Intensity | Emissive Color |
|----------|-------------------|---------------|
| 0.00     | 0.0               | #000000       |
| 0.30     | 0.0               | #000000       |
| 0.40     | 0.3               | #1a1a3e       |
| 0.50     | 0.8               | #4488ff       |
| 0.60     | 1.2               | #6366f1       |
| 0.80+    | 1.0               | #6366f1       |

---

## RenderTexture (Conteúdo no Monitor)

### O que aparece na tela
- Background: `#0d1117` (GitHub dark)
- Título "Sobre" com animação typewriter
- Bio resumida do Renzo
- Mini stat cards (anos de experiência, projetos, etc.)
- Tudo usando `@react-three/drei` `<Text>`, shapes

### Props da RenderTexture
```tsx
<RenderTexture
  attach="emissiveMap"
  width={1920}
  height={1080}
  samples={8}
  anisotropy={16}
>
```

---

## Transição 3D → HTML

### Mecanismo
1. Scroll progress 0.80 → Canvas `opacity` começa a diminuir (1 → 0)
2. Simultaneamente, About overlay `opacity` aumenta (0 → 1)
3. Conteúdo About é posicionado para alinhar com onde o monitor estava
4. Ao completar (progress 1.0), Canvas fica `opacity: 0.15` no background

### Parallax pós-transição
- Canvas permanece `position: fixed` com `opacity: 0.15`
- Transform: `translateY(scrollY * -0.05)` — parallax sutil
- Seção About scrolla normalmente sobre o Canvas

---

## Perfis de Performance
- **Desktop**: RenderTexture 1920×1080, Bloom ativo, damp lambda=5
- **Mobile**: RenderTexture 960×540, Bloom desativado, damp lambda=3
- **Low-end**: Sem RenderTexture (monitor mostra cor sólida), sem Bloom

---

## Referências Técnicas
- [drei ScrollControls](https://drei.pmnd.rs/docs/scroll-controls)
- [drei RenderTexture](https://docs.pmnd.rs/drei/core/render-texture)
- [Maxime Heckel — Scroll Animations with R3F](https://blog.maximeheckel.com/posts/scroll-based-animations-with-react-three-fiber/)
- [Maxime Heckel — Camera Animation with R3F](https://blog.maximeheckel.com/posts/camera-animation-with-react-three-fiber/)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Three.js MathUtils](https://threejs.org/docs/#api/en/math/MathUtils)
