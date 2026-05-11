# Spec: Agente Demo Section — iPhone Mockup
**Date:** 2026-05-11
**Project:** HELIX AI Growth Agency — public/index.html
**Status:** Approved for implementation

---

## Context

After the 3 premium service cards, the visitor has read about the "Agente de Ventas IA" but hasn't seen it in action. This section bridges the gap between claim and proof — showing the actual agent conversation flow inside a realistic iPhone 17 Pro mockup with a video placeholder.

**Narrative position in the page:**
Hero → Problemas → Servicios → **[Agente Demo ← NEW]** → Resultados → Metodología → FAQ

---

## What Gets Added

One new section `id="agente-demo"` inserted in `public/index.html` immediately before `<section id="resultados">`. No existing sections are modified.

---

## Layout

### Desktop (≥ 768px) — Split layout, two columns

```
┌─────────────────────────────────────────────────────────────┐
│  [LABEL]  Agente de Ventas IA                               │
│                                                             │
│  "Tu agente cierra          ╔═══════════╗                   │
│   ventas mientras           ║           ║ ← badge "< 2s"   │
│   dormís"                   ║   VIDEO   ║                   │
│                             ║           ║                   │
│  ✓ Responde en segundos     ║           ║ ← badge "24/7"   │
│  ✓ Califica y agenda solo   ║           ║                   │
│  ✓ Escala o pasa al humano  ╚═══════════╝                   │
│                          iPhone 17 Pro PNG frame            │
│  [CTA → Quiero mi agente]                                   │
└─────────────────────────────────────────────────────────────┘
```

- Left column: 45% width — label + headline + 3 bullets + CTA button
- Right column: 55% width — iPhone mockup with floating badges
- Gap: 80px between columns
- Section padding: 120px top/bottom (same as other sections)

### Mobile (< 768px) — Single column, stacked

```
  iPhone mockup (top, 80% max-width, centered)
  Label
  Headline
  3 bullets
  CTA
```

---

## Copy

### Label
- **ES:** `Agente en acción`
- **EN:** `Agent in action`

### Headline
- **ES:** `Tu agente cierra ventas mientras dormís`
- **EN:** `Your agent closes sales while you sleep`

### 3 Feature Bullets
| # | ES | EN |
|---|----|----|
| 1 | ✓ Responde en segundos, 24/7 | ✓ Responds in seconds, 24/7 |
| 2 | ✓ Califica leads y agenda reuniones solo | ✓ Qualifies leads and books meetings alone |
| 3 | ✓ Escala al humano cuando es necesario | ✓ Escalates to human when needed |

### CTA Button
- **ES:** `Quiero mi agente →`
- **EN:** `I want my agent →`
- Action: `goTo('contacto')` (same as all other CTAs)

---

## iPhone Mockup — Technical Implementation

### Frame
- Source: PNG with transparent background from mockups-design.com or webmobilefirst.com
- Stored at: `public/assets/iphone17pro.png` (to be added manually by user)
- Fallback: a plain CSS rounded rectangle with `border: 2px solid var(--border)` if image not present

### Video
- Element: `<video autoplay muted loop playsinline>`
- Source: `public/assets/agente-demo.mp4` (placeholder until user provides video)
- Placeholder state: dark background `#111` with a centered pulsing dot animation until video is added
- The video is absolutely positioned behind the PNG frame, clipped to the screen area

### CSS Technique
```
.iphone-wrap {
  position: relative;
  width: 280px;   /* fixed width matching mockup proportions */
}
.iphone-screen {
  position: absolute;
  top: [X]px;     /* offset to align with screen area of the PNG */
  left: [X]px;
  width: [X]px;
  height: [X]px;
  border-radius: 36px;
  overflow: hidden;
  background: #111;
}
.iphone-frame {
  position: relative;
  z-index: 2;
  width: 100%;
  pointer-events: none;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```
- Exact pixel offsets for the screen area are measured from the downloaded PNG dimensions

---

## Floating Metric Badges

Two badges positioned absolutely over the iPhone mockup:

| Badge | Value | Position |
|-------|-------|----------|
| `< 2s` + label "tiempo de respuesta" | top-right of phone, offset outward | `top: 15%; right: -60px` |
| `24/7` + label "disponible siempre" | bottom-right of phone, offset outward | `bottom: 25%; right: -60px` |

### Badge Styling
```css
.demo-badge {
  position: absolute;
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: 999px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.demo-badge-value {
  font-weight: 900;
  color: var(--accent);
  font-size: 1rem;
}
.demo-badge-label {
  font-size: .72rem;
  color: var(--dim);
}
```
- On mobile: badges hidden (`display: none`) to avoid overflow

---

## HTML Structure

```html
<section id="agente-demo">
  <div class="wrap">
    <div class="demo-grid">

      <!-- LEFT: Copy -->
      <div class="demo-copy fi">
        <div class="label" data-es="Agente en acción" data-en="Agent in action">Agente en acción</div>
        <h2 class="big" data-es="Tu agente cierra ventas mientras dormís" data-en="Your agent closes sales while you sleep">
          Tu agente cierra ventas mientras dormís
        </h2>
        <ul class="demo-bullets">
          <li data-es="✓ Responde en segundos, 24/7" data-en="✓ Responds in seconds, 24/7">✓ Responde en segundos, 24/7</li>
          <li data-es="✓ Califica leads y agenda reuniones solo" data-en="✓ Qualifies leads and books meetings alone">✓ Califica leads y agenda reuniones solo</li>
          <li data-es="✓ Escala al humano cuando es necesario" data-en="✓ Escalates to human when needed">✓ Escala al humano cuando es necesario</li>
        </ul>
        <!-- Use same CTA button class as existing service CTAs in #srv-premium -->
        <button class="btn-prim fi" onclick="goTo('contacto')" data-es="Quiero mi agente →" data-en="I want my agent →">
          Quiero mi agente →
        </button>
      </div>

      <!-- RIGHT: iPhone Mockup -->
      <div class="demo-phone-wrap fi">
        <div class="iphone-wrap">
          <!-- Video screen behind frame -->
          <div class="iphone-screen">
            <video autoplay muted loop playsinline>
              <source src="assets/agente-demo.mp4" type="video/mp4">
            </video>
          </div>
          <!-- iPhone PNG frame on top -->
          <img class="iphone-frame" src="assets/iphone17pro.png" alt="iPhone 17 Pro">
          <!-- Floating badges -->
          <div class="demo-badge" style="top:15%;right:-70px">
            <span class="demo-badge-value">&lt; 2s</span>
            <span class="demo-badge-label" data-es="respuesta" data-en="response">respuesta</span>
          </div>
          <div class="demo-badge" style="bottom:25%;right:-70px">
            <span class="demo-badge-value">24/7</span>
            <span class="demo-badge-label" data-es="activo siempre" data-en="always on">activo siempre</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

---

## CSS Classes to Add

```css
/* AGENTE DEMO */
#agente-demo { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.demo-grid { display: grid; grid-template-columns: 45fr 55fr; gap: 80px; align-items: center; }
.demo-copy { display: flex; flex-direction: column; gap: 32px; }
.demo-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.demo-bullets li { color: var(--dim); font-size: .95rem; line-height: 1.5; }
.demo-phone-wrap { display: flex; justify-content: center; position: relative; }
.iphone-wrap { position: relative; width: 280px; }
.iphone-screen { position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px; border-radius: 36px; overflow: hidden; background: #111; z-index: 1; }
/* NOTE: top/left/right/bottom offsets for .iphone-screen are approximate.
   Implementer must measure the actual PNG bezel dimensions and adjust accordingly.
   Typical iPhone Pro mockup PNG at 280px wide: ~top:12% left:6% right:6% bottom:8% */
.iphone-screen video { width: 100%; height: 100%; object-fit: cover; }
.iphone-frame { position: relative; z-index: 2; width: 100%; pointer-events: none; display: block; }
.demo-badge { position: absolute; background: var(--bg); border: 1px solid var(--accent); border-radius: 999px; padding: 8px 16px; display: flex; align-items: center; gap: 8px; white-space: nowrap; z-index: 3; }
.demo-badge-value { font-weight: 900; color: var(--accent); font-size: 1rem; line-height: 1; }
.demo-badge-label { font-size: .72rem; color: var(--dim); }
@media(max-width:768px) {
  .demo-grid { grid-template-columns: 1fr; gap: 48px; }
  .demo-grid > .demo-copy { order: 2; }
  .demo-grid > .demo-phone-wrap { order: 1; }
  .iphone-wrap { width: 220px; }
  .demo-badge { display: none; }
}
```

---

## Assets Required (User Provides)

| File | Description | Status |
|------|-------------|--------|
| `public/assets/iphone17pro.png` | iPhone 17 Pro PNG, transparent background, portrait | ⏳ Pending |
| `public/assets/agente-demo.mp4` | Screen recording of AI agent conversation | ⏳ Pending |

Until assets are added, the section renders with:
- A CSS placeholder rectangle (dark rounded box) instead of the iPhone PNG
- Black screen for the video area with a subtle pulsing animation

---

## What Does NOT Change

- No existing sections modified
- No changes to nav, hero, problems, services, results, methodology, FAQ
- All existing CSS variables reused (`--accent`, `--surface`, `--bg`, `--border`, `--dim`)
- `setLang()` function handles all bilingual copy automatically (data-es / data-en pattern)

---

## Verification Checklist

- [ ] Section appears between `#servicios` and `#resultados`
- [ ] Desktop: split layout renders correctly (copy left, phone right)
- [ ] Mobile: stacks correctly (phone top, copy bottom) at 375px
- [ ] iPhone PNG overlays correctly on video element
- [ ] Video autoplays muted/looped when asset is present
- [ ] Placeholder state visible and styled when no video/PNG
- [ ] Both floating badges visible on desktop, hidden on mobile
- [ ] CTA scrolls to `#contacto`
- [ ] Language switching (ES/EN) works on all copy
- [ ] Fade-in animation (`.fi` class) triggers on scroll
