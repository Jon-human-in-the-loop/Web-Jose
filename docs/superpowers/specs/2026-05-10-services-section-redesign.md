# Spec: Services Section Redesign
**Date:** 2026-05-10
**Project:** HELIX AI Growth Agency — public/index.html
**Status:** Approved for implementation

---

## Context

The current services section lists 4 generic services (Voz y Chatbots, IA Generativa, Automatización, Infraestructura Web) in a feature-based format — what HELIX does and what technologies it uses. This fails to communicate business value or trigger urgency in the target client.

**Target client:** PyME/startup owner, 5–50 employees, wants to scale without hiring more people.
**Business model:** Entry projects $1K–3K USD → expand to $8K+ over time ("land and expand").

---

## What Changes

The section `id="servicios"` in `public/index.html` is fully replaced with two new subsections:

1. **Pain Calculator** — interactive block showing hours/money lost per week
2. **3 Premium Services** — pain-first cards with real case study metrics

Everything else on the page stays untouched.

---

## Section 1: Pain Calculator

### Position
Replaces the current services section. Appears before the 3 service cards.

### Markup structure
```
#servicios
  .calc-header         ← title + subtitle
  .calc-tasks          ← 8 checkboxes with task labels + hours/week
  .calc-team           ← team size selector (1, 3, 5, 10, 20)
  .calc-rate           ← hourly rate input (user-defined, default $5)
  .calc-result         ← dynamic output (hidden until ≥1 task selected)
    .calc-hours        ← "Tu equipo pierde X horas/semana"
    .calc-cost         ← "~$Y USD mensuales en trabajo improductivo"
    .calc-services     ← "Para eliminar esto necesitás: [service tags]"
  .calc-cta            ← scroll anchor to services
```

### Copy

**Title (ES):** "¿Cuánto pierde tu empresa haciendo esto manualmente?"
**Title (EN):** "How much is your business losing doing this manually?"

**Subtitle (ES):** "Seleccioná las tareas que tu equipo todavía hace a mano y vé el impacto real — en horas y dinero."
**Subtitle (EN):** "Select the tasks your team still does manually and see the real impact — in hours and money."

### 8 Tasks (data-driven)

| id | Label ES | Label EN | Hours/week | Resolving service |
|----|----------|----------|------------|-------------------|
| t1 | Responder mensajes y emails | Reply to messages & emails | 8 | agente |
| t2 | Calificar leads y prospects | Qualify leads & prospects | 6 | agente |
| t3 | Agendar reuniones y follow-ups | Schedule meetings & follow-ups | 4 | agente |
| t4 | Responder preguntas repetitivas | Answer repetitive questions | 7 | agente |
| t5 | Publicar y responder en redes | Publish & respond on social media | 6 | contenido |
| t6 | Insertar datos entre sistemas | Insert data between systems | 5 | ecosistema |
| t7 | Generar reportes y dashboards | Generate reports & dashboards | 4 | ecosistema |
| t8 | Procesar facturas y documentos | Process invoices & documents | 3 | ecosistema |

### Team size multiplier
Buttons: 1 · 3 · 5 · 10 · 20 (default: 5)

### Hourly rate input
A text input field where the user enters what they pay per hour (in USD).

- **Label ES:** "¿Cuánto pagás por hora de empleado? (USD)"
- **Label EN:** "How much do you pay per employee hour? (USD)"
- **Placeholder:** "ej: 5"
- **Default value:** 5 (pre-filled, editable)
- **Type:** `number`, min: 1, max: 500
- Updates the result in real time on `input` event (no submit needed)

### Calculation logic (JavaScript)
```
selectedHours = sum of hours for checked tasks
weeklyHours   = selectedHours × teamSize
monthlyCost   = weeklyHours × 4 × hourlyRate   // user-defined rate
```

### Dynamic result display
- Hidden by default, appears when ≥1 task is checked
- Shows: hours/week, monthly cost in USD
- Shows which services are needed based on checked tasks:
  - If any of t1–t4 checked → show "🤖 Agente de Ventas IA" tag
  - If t5 checked → show "🎬 Fábrica de Contenido IA" tag
  - If any of t6–t8 checked → show "⚙️ Ecosistema Digital Completo" tag

**Result copy (ES):**
> "Para eliminar estas [X] horas de pérdida semanal necesitás: [service tags]"

**Result copy (EN):**
> "To eliminate these [X] weekly hours of loss you need: [service tags]"

### CTA below result
**ES:** "Estos sistemas eliminan cada una de estas tareas →" (smooth scroll to #srv-premium)
**EN:** "These systems eliminate each of these tasks →"

---

## Section 2: 3 Premium Services

### Position
Immediately below the calculator, with anchor `id="srv-premium"`.

### Layout
3 cards in a column (desktop: full-width rows, same `.srv-row` grid pattern as current). Each card has:
- Badge (tag + price)
- Pain headline (large, accent color)
- Body copy
- Real case study metric
- CTA button

### Service 1 — Agente de Ventas IA

**Badge ES:** `Más popular · Desde $1.500 USD`
**Badge EN:** `Most popular · From $1,500 USD`

**Pain headline ES:** "Perdés ventas porque no respondés a tiempo"
**Pain headline EN:** "You lose sales because you don't respond in time"

**Body ES:** "El 78% de los clientes le compra al primero que responde. Un agente IA atiende WhatsApp, email e Instagram en segundos, califica cada lead, agenda reuniones y hace seguimiento — sin que nadie de tu equipo toque nada."
**Body EN:** "78% of customers buy from whoever responds first. An AI agent handles WhatsApp, email and Instagram in seconds, qualifies every lead, schedules meetings and follows up — without your team touching anything."

**Case metric ES:** "→ Demo disponible · Caso real: 14+ apps integradas, zero transferencias manuales"
**Case metric EN:** "→ Demo available · Real case: 14+ apps integrated, zero manual transfers"

**CTA ES:** "Quiero este agente →"
**CTA EN:** "I want this agent →"

---

### Service 2 — Fábrica de Contenido IA

**Badge ES:** `Desde $1.000 USD`
**Badge EN:** `From $1,000 USD`

**Pain headline ES:** "No publicás suficiente para ser relevante"
**Pain headline EN:** "You don't publish enough to stay relevant"

**Body ES:** "Necesitás presencia diaria para competir, pero crear contenido te roba 15+ horas por semana. Un sistema IA genera videos, posts y copy — adaptados a tu marca — y los publica solo, en todos tus canales."
**Body EN:** "You need daily presence to compete, but creating content steals 15+ hours per week. An AI system generates videos, posts and copy — adapted to your brand — and publishes them automatically across all your channels."

**Case metric ES:** "→ Caso real: −85% costos de producción · 100+ piezas por semana vs 2–3 antes"
**Case metric EN:** "→ Real case: −85% production costs · 100+ pieces per week vs 2–3 before"

**CTA ES:** "Quiero esta fábrica →"
**CTA EN:** "I want this factory →"

---

### Service 3 — Ecosistema Digital Completo

**Badge ES:** `Para escalar · Desde $3.000 USD`
**Badge EN:** `To scale · From $3,000 USD`

**Pain headline ES:** "Tus herramientas no se hablan y tu equipo paga el precio"
**Pain headline EN:** "Your tools don't talk to each other and your team pays the price"

**Body ES:** "Usás 8+ herramientas que funcionan como islas. Cada dato se copia a mano, cada proceso depende de una persona. Construimos el sistema operativo digital de tu negocio — web, automatizaciones e IA — integrado y autónomo."
**Body EN:** "You use 8+ tools that work as islands. Every piece of data is copied manually, every process depends on one person. We build the digital operating system for your business — web, automations and AI — integrated and autonomous."

**Case metric ES:** "→ Caso real: 14+ apps conectadas · 99.99% uptime · zero intervención humana"
**Case metric EN:** "→ Real case: 14+ apps connected · 99.99% uptime · zero human intervention"

**CTA ES:** "Quiero este ecosistema →"
**CTA EN:** "I want this ecosystem →"

---

## What Does NOT Change

- Nav mega-menu (secondary services stay there, untouched)
- Hero section
- Problems section
- Social proof / testimonials
- Methodology section
- FAQ / Contact
- All other CSS variables and design tokens

---

## Implementation Notes

- All new elements use existing CSS variables (`--accent`, `--dim`, `--border`, `--surface`, `--bg`)
- Calculator logic is pure vanilla JS, embedded in `<script>` tag at bottom of file
- Bilingual: all copy uses existing `data-es` / `data-en` attribute pattern
- `setLang()` function already handles switching — no changes needed to it
- Calculator result section: use `style="display:none"` toggled by JS (not CSS class) to avoid FOUC
- All 3 CTA buttons → `goTo('contacto')` (same as current services)
- Mobile: calculator checkboxes stack to 1 column, service cards stack to 1 column

---

## Verification Checklist

- [ ] Calculator shows correct hours/week and monthly cost for all task combinations
- [ ] Service tags in result update correctly when tasks are checked/unchecked
- [ ] Language switching (ES/EN) works on all new copy
- [ ] CTA scroll anchor lands on service 1 card
- [ ] Mobile layout renders correctly at 375px
- [ ] No existing sections broken
- [ ] Commit on new branch `feat/services-pain-redesign`
