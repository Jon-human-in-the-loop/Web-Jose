# Services Pain Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic services carousel in `public/index.html` with a pain calculator (interactive, user-driven hourly rate) + 3 pain-first premium service cards.

**Architecture:** Single-file modification — all CSS (embedded `<style>`), HTML (replace `#servicios` section entirely), and JS (append to existing `<script>`) live in `public/index.html`. No new files needed. No build tools.

**Tech Stack:** Vanilla JS, HTML5, embedded CSS. Existing `setLang()` and `goTo()` functions reused as-is.

---

### Task 1: Create feature branch

**Files:** none

- [ ] **Step 1: Create and switch to feature branch**
```bash
cd "D:\002.Repositorios\Web-Jose"
git checkout -b feat/services-pain-redesign
```
Expected: `Switched to a new branch 'feat/services-pain-redesign'`

---

### Task 2: Add CSS for calculator and updated service cards

**Files:**
- Modify: `public/index.html` — `<style>` tag, after the `.srv-arrow{...}` rule (around line 132)

- [ ] **Step 1: In `public/index.html`, find the line containing `.srv-arrow{font-size:1.3rem;color:var(--dim)...}` and insert the following CSS block immediately after it:**

```css
/* CALCULATOR */
.calc-block{margin-bottom:80px;}
.calc-tasks{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:40px;}
.calc-task-item{display:flex;align-items:center;gap:12px;padding:16px 20px;border:1px solid var(--border);border-radius:4px;cursor:pointer;transition:border-color .2s,background .2s;user-select:none;}
.calc-task-item:hover{border-color:#333;}
.calc-task-item.checked{border-color:var(--accent);background:rgba(232,255,71,.04);}
.calc-task-item input[type="checkbox"]{display:none;}
.calc-task-check{width:18px;height:18px;border:1.5px solid var(--border);border-radius:3px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.calc-task-item.checked .calc-task-check{background:var(--accent);border-color:var(--accent);}
.calc-task-check::after{content:'✓';font-size:.7rem;color:#080808;opacity:0;transition:opacity .2s;}
.calc-task-item.checked .calc-task-check::after{opacity:1;}
.calc-task-label{flex:1;font-size:.88rem;color:var(--dim);line-height:1.4;transition:color .2s;}
.calc-task-item.checked .calc-task-label{color:#f2f2f2;}
.calc-task-hours{font-size:.75rem;color:var(--dim);white-space:nowrap;padding:3px 8px;border:1px solid var(--border);border-radius:2px;}
.calc-options{display:flex;align-items:flex-end;gap:48px;margin-bottom:40px;flex-wrap:wrap;}
.calc-option-group{display:flex;flex-direction:column;gap:12px;}
.calc-option-label{font-size:.75rem;color:var(--dim);font-weight:600;letter-spacing:1px;text-transform:uppercase;}
.calc-team-btns{display:flex;gap:8px;}
.calc-team-btn{padding:8px 20px;background:none;border:1px solid var(--border);border-radius:4px;color:var(--dim);font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;}
.calc-team-btn.on{background:var(--accent);border-color:var(--accent);color:#080808;}
.calc-rate-input{padding:8px 16px;background:var(--surface);border:1px solid var(--border);border-radius:4px;color:#f2f2f2;font-size:.85rem;font-weight:700;width:120px;font-family:inherit;}
.calc-rate-input:focus{outline:none;border-color:var(--accent);}
.calc-result{padding:32px 40px;background:var(--surface);border:1px solid var(--border);border-radius:6px;margin-bottom:40px;}
.calc-numbers{display:flex;gap:48px;margin-bottom:24px;flex-wrap:wrap;}
.calc-number .n{font-size:2.5rem;font-weight:900;color:var(--accent);letter-spacing:-1px;}
.calc-number .t{font-size:.8rem;color:var(--dim);margin-top:4px;}
.calc-result-label{font-size:.8rem;color:var(--dim);margin-bottom:12px;}
.calc-tags{display:flex;gap:10px;flex-wrap:wrap;}
.calc-tag{padding:6px 14px;border:1px solid var(--accent);border-radius:3px;font-size:.78rem;font-weight:700;color:var(--accent);opacity:0;transform:translateY(4px);transition:all .3s;}
.calc-tag.visible{opacity:1;transform:translateY(0);}
.calc-scroll-cta{font-size:.85rem;color:var(--dim);cursor:pointer;text-decoration:underline;text-underline-offset:3px;transition:color .2s;background:none;border:none;padding:0;font-family:inherit;}
.calc-scroll-cta:hover{color:#f2f2f2;}
/* UPDATED SERVICE CARD ELEMENTS */
.srv-badge{font-size:.72rem;font-weight:700;color:var(--accent);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;}
.srv-pain{font-size:clamp(1.4rem,2.2vw,2rem);font-weight:800;letter-spacing:-.3px;line-height:1.1;}
.srv-body{color:var(--dim);font-size:.88rem;line-height:1.85;padding-top:8px;margin-bottom:16px;}
.srv-metric{font-size:.78rem;color:var(--accent);padding:8px 0;border-top:1px solid var(--border);}
.srv-premium-intro{padding:24px 0 16px;}
.srv-premium-intro p{font-size:.9rem;color:var(--dim);}
.srv-premium-intro strong{color:var(--accent);}
@media(max-width:768px){
  .calc-tasks{grid-template-columns:1fr;}
  .calc-options{flex-direction:column;gap:24px;}
  .calc-numbers{gap:24px;}
  .calc-result{padding:24px;}
}
```

- [ ] **Step 2: Open `public/index.html` in browser. Open DevTools → Console tab. Verify zero CSS errors.**

---

### Task 3: Replace `#servicios` HTML

**Files:**
- Modify: `public/index.html` — replace entire `<section id="servicios">...</section>` block

- [ ] **Step 1: Find `<section id="servicios">` in `public/index.html` (around line 524). Select from that opening tag to the matching `</section>` closing tag (around line 542).**

- [ ] **Step 2: Replace the entire block with:**

```html
<section id="servicios">
  <div class="srv-header">
    <div>
      <div class="label fi" data-es="Sistemas de crecimiento" data-en="Growth systems">Sistemas de crecimiento</div>
      <h2 class="big fi" style="margin-bottom:0">
        <span data-es="Lo que perdés" data-en="What you're losing">Lo que perdés</span><br>
        <em data-es="haciendo esto manual" data-en="doing this manually">haciendo esto manual</em>
      </h2>
    </div>
    <p class="sub fi" data-es="Seleccioná las tareas que tu equipo todavía hace a mano y vé el impacto real — en horas y dinero." data-en="Select the tasks your team still does manually and see the real impact — in hours and money.">Seleccioná las tareas que tu equipo todavía hace a mano y vé el impacto real — en horas y dinero.</p>
  </div>

  <!-- CALCULATOR -->
  <div class="calc-block fi">
    <div class="calc-tasks" id="calcTasks">
      <div class="calc-task-item" data-hours="8" data-service="agente" onclick="calcToggle(this)">
        <div class="calc-task-check"></div>
        <span class="calc-task-label" data-es="Responder mensajes y emails" data-en="Reply to messages & emails">Responder mensajes y emails</span>
        <span class="calc-task-hours">8h/sem</span>
      </div>
      <div class="calc-task-item" data-hours="6" data-service="agente" onclick="calcToggle(this)">
        <div class="calc-task-check"></div>
        <span class="calc-task-label" data-es="Calificar leads y prospects" data-en="Qualify leads & prospects">Calificar leads y prospects</span>
        <span class="calc-task-hours">6h/sem</span>
      </div>
      <div class="calc-task-item" data-hours="4" data-service="agente" onclick="calcToggle(this)">
        <div class="calc-task-check"></div>
        <span class="calc-task-label" data-es="Agendar reuniones y follow-ups" data-en="Schedule meetings & follow-ups">Agendar reuniones y follow-ups</span>
        <span class="calc-task-hours">4h/sem</span>
      </div>
      <div class="calc-task-item" data-hours="7" data-service="agente" onclick="calcToggle(this)">
        <div class="calc-task-check"></div>
        <span class="calc-task-label" data-es="Responder preguntas repetitivas" data-en="Answer repetitive questions">Responder preguntas repetitivas</span>
        <span class="calc-task-hours">7h/sem</span>
      </div>
      <div class="calc-task-item" data-hours="6" data-service="contenido" onclick="calcToggle(this)">
        <div class="calc-task-check"></div>
        <span class="calc-task-label" data-es="Publicar y responder en redes" data-en="Publish & respond on social media">Publicar y responder en redes</span>
        <span class="calc-task-hours">6h/sem</span>
      </div>
      <div class="calc-task-item" data-hours="5" data-service="ecosistema" onclick="calcToggle(this)">
        <div class="calc-task-check"></div>
        <span class="calc-task-label" data-es="Insertar datos entre sistemas" data-en="Insert data between systems">Insertar datos entre sistemas</span>
        <span class="calc-task-hours">5h/sem</span>
      </div>
      <div class="calc-task-item" data-hours="4" data-service="ecosistema" onclick="calcToggle(this)">
        <div class="calc-task-check"></div>
        <span class="calc-task-label" data-es="Generar reportes y dashboards" data-en="Generate reports & dashboards">Generar reportes y dashboards</span>
        <span class="calc-task-hours">4h/sem</span>
      </div>
      <div class="calc-task-item" data-hours="3" data-service="ecosistema" onclick="calcToggle(this)">
        <div class="calc-task-check"></div>
        <span class="calc-task-label" data-es="Procesar facturas y documentos" data-en="Process invoices & documents">Procesar facturas y documentos</span>
        <span class="calc-task-hours">3h/sem</span>
      </div>
    </div>

    <div class="calc-options">
      <div class="calc-option-group">
        <span class="calc-option-label" data-es="Tamaño del equipo" data-en="Team size">Tamaño del equipo</span>
        <div class="calc-team-btns">
          <button class="calc-team-btn" data-size="1" onclick="calcSetTeam(this)">1</button>
          <button class="calc-team-btn" data-size="3" onclick="calcSetTeam(this)">3</button>
          <button class="calc-team-btn on" data-size="5" onclick="calcSetTeam(this)">5</button>
          <button class="calc-team-btn" data-size="10" onclick="calcSetTeam(this)">10</button>
          <button class="calc-team-btn" data-size="20" onclick="calcSetTeam(this)">20</button>
        </div>
      </div>
      <div class="calc-option-group">
        <label class="calc-option-label" for="calcRate" data-es="Costo por hora de empleado (USD)" data-en="Employee hourly cost (USD)">Costo por hora de empleado (USD)</label>
        <input class="calc-rate-input" id="calcRate" type="number" min="1" max="500" value="5" oninput="calcUpdate()">
      </div>
    </div>

    <div class="calc-result" id="calcResult" style="display:none">
      <div class="calc-numbers">
        <div class="calc-number">
          <div class="n" id="calcHoursVal">0</div>
          <div class="t" data-es="horas perdidas por semana" data-en="hours lost per week">horas perdidas por semana</div>
        </div>
        <div class="calc-number">
          <div class="n" id="calcCostVal">$0</div>
          <div class="t" data-es="USD mensuales en trabajo improductivo" data-en="USD monthly in unproductive work">USD mensuales en trabajo improductivo</div>
        </div>
      </div>
      <div class="calc-result-services">
        <div class="calc-result-label" data-es="Para eliminar estas pérdidas necesitás:" data-en="To eliminate these losses you need:">Para eliminar estas pérdidas necesitás:</div>
        <div class="calc-tags">
          <span class="calc-tag" id="tag-agente">🤖 Agente de Ventas IA</span>
          <span class="calc-tag" id="tag-contenido">🎬 Fábrica de Contenido IA</span>
          <span class="calc-tag" id="tag-ecosistema">⚙️ Ecosistema Digital Completo</span>
        </div>
      </div>
      <div style="margin-top:20px">
        <button class="calc-scroll-cta" onclick="document.getElementById('srv-premium').scrollIntoView({behavior:'smooth'})" data-es="Estos sistemas eliminan cada una de estas tareas →" data-en="These systems eliminate each of these tasks →">Estos sistemas eliminan cada una de estas tareas →</button>
      </div>
    </div>
  </div>

  <!-- 3 PREMIUM SERVICES -->
  <div id="srv-premium">
    <div class="srv-premium-intro fi" id="srvIntro" style="display:none">
      <p><strong id="srvIntroText"></strong></p>
    </div>

    <div class="srv-row glow-card" onclick="goTo('contacto');playSound('click')" onmouseenter="playSound('hover')">
      <div class="srv-idx">01</div>
      <div>
        <div class="srv-badge" data-es="Más popular · Desde $1.500 USD" data-en="Most popular · From $1,500 USD">Más popular · Desde $1.500 USD</div>
        <div class="srv-pain" data-es="Perdés ventas porque no respondés a tiempo" data-en="You lose sales because you don't respond in time">Perdés ventas porque no respondés a tiempo</div>
      </div>
      <div>
        <p class="srv-body" data-es="El 78% de los clientes le compra al primero que responde. Un agente IA atiende WhatsApp, email e Instagram en segundos, califica cada lead, agenda reuniones y hace seguimiento — sin que nadie de tu equipo toque nada." data-en="78% of customers buy from whoever responds first. An AI agent handles WhatsApp, email and Instagram in seconds, qualifies every lead, schedules meetings and follows up — without your team touching anything.">El 78% de los clientes le compra al primero que responde. Un agente IA atiende WhatsApp, email e Instagram en segundos, califica cada lead, agenda reuniones y hace seguimiento — sin que nadie de tu equipo toque nada.</p>
        <div class="srv-metric" data-es="→ Demo disponible · Caso real: 14+ apps integradas, zero transferencias manuales" data-en="→ Demo available · Real case: 14+ apps integrated, zero manual transfers">→ Demo disponible · Caso real: 14+ apps integradas, zero transferencias manuales</div>
      </div>
      <div class="srv-arrow">↗</div>
    </div>

    <div class="srv-row glow-card" onclick="goTo('contacto');playSound('click')" onmouseenter="playSound('hover')">
      <div class="srv-idx">02</div>
      <div>
        <div class="srv-badge" data-es="Desde $1.000 USD" data-en="From $1,000 USD">Desde $1.000 USD</div>
        <div class="srv-pain" data-es="No publicás suficiente para ser relevante" data-en="You don't publish enough to stay relevant">No publicás suficiente para ser relevante</div>
      </div>
      <div>
        <p class="srv-body" data-es="Necesitás presencia diaria para competir, pero crear contenido te roba 15+ horas por semana. Un sistema IA genera videos, posts y copy — adaptados a tu marca — y los publica solo, en todos tus canales." data-en="You need daily presence to compete, but creating content steals 15+ hours per week. An AI system generates videos, posts and copy — adapted to your brand — and publishes them automatically across all your channels.">Necesitás presencia diaria para competir, pero crear contenido te roba 15+ horas por semana. Un sistema IA genera videos, posts y copy — adaptados a tu marca — y los publica solo, en todos tus canales.</p>
        <div class="srv-metric" data-es="→ Caso real: −85% costos de producción · 100+ piezas por semana vs 2–3 antes" data-en="→ Real case: −85% production costs · 100+ pieces per week vs 2–3 before">→ Caso real: −85% costos de producción · 100+ piezas por semana vs 2–3 antes</div>
      </div>
      <div class="srv-arrow">↗</div>
    </div>

    <div class="srv-row glow-card" onclick="goTo('contacto');playSound('click')" onmouseenter="playSound('hover')">
      <div class="srv-idx">03</div>
      <div>
        <div class="srv-badge" data-es="Para escalar · Desde $3.000 USD" data-en="To scale · From $3,000 USD">Para escalar · Desde $3.000 USD</div>
        <div class="srv-pain" data-es="Tus herramientas no se hablan y tu equipo paga el precio" data-en="Your tools don't talk to each other and your team pays the price">Tus herramientas no se hablan y tu equipo paga el precio</div>
      </div>
      <div>
        <p class="srv-body" data-es="Usás 8+ herramientas que funcionan como islas. Cada dato se copia a mano, cada proceso depende de una persona. Construimos el sistema operativo digital de tu negocio — web, automatizaciones e IA — integrado y autónomo." data-en="You use 8+ tools that work as islands. Every piece of data is copied manually, every process depends on one person. We build the digital operating system for your business — web, automations and AI — integrated and autonomous.">Usás 8+ herramientas que funcionan como islas. Cada dato se copia a mano, cada proceso depende de una persona. Construimos el sistema operativo digital de tu negocio — web, automatizaciones e IA — integrado y autónomo.</p>
        <div class="srv-metric" data-es="→ Caso real: 14+ apps conectadas · 99.99% uptime · zero intervención humana" data-en="→ Real case: 14+ apps connected · 99.99% uptime · zero human intervention">→ Caso real: 14+ apps conectadas · 99.99% uptime · zero intervención humana</div>
      </div>
      <div class="srv-arrow">↗</div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Open `public/index.html` in browser. Verify the section renders: calculator tasks visible, team buttons visible, service cards visible below.**

---

### Task 4: Add calculator JavaScript

**Files:**
- Modify: `public/index.html` — existing `<script>` tag at bottom of file

- [ ] **Step 1: Find the closing `</script>` tag at the bottom of `public/index.html`. Insert this block immediately before it:**

```js
// ─── CALCULATOR ───────────────────────────────────────────────
(function() {
  let calcTeamSize = 5;

  function getCheckedTasks() {
    return Array.from(document.querySelectorAll('.calc-task-item.checked'));
  }

  function calcWeeklyHours(tasks, teamSize) {
    return tasks.reduce(function(sum, el) {
      return sum + parseInt(el.dataset.hours, 10);
    }, 0) * teamSize;
  }

  function calcMonthlyCost(weeklyHours, rate) {
    return weeklyHours * 4 * rate;
  }

  function getRequiredServices(tasks) {
    var seen = {};
    var services = [];
    tasks.forEach(function(el) {
      var s = el.dataset.service;
      if (!seen[s]) { seen[s] = true; services.push(s); }
    });
    return services;
  }

  function formatCost(n) {
    return '$' + Math.round(n).toLocaleString('es-AR');
  }

  window.calcToggle = function(el) {
    el.classList.toggle('checked');
    calcUpdate();
  };

  window.calcSetTeam = function(btn) {
    calcTeamSize = parseInt(btn.dataset.size, 10);
    document.querySelectorAll('.calc-team-btn').forEach(function(b) {
      b.classList.remove('on');
    });
    btn.classList.add('on');
    calcUpdate();
  };

  window.calcUpdate = function() {
    var tasks    = getCheckedTasks();
    var rateEl   = document.getElementById('calcRate');
    var rate     = rateEl ? (parseFloat(rateEl.value) || 5) : 5;
    var weekly   = calcWeeklyHours(tasks, calcTeamSize);
    var monthly  = calcMonthlyCost(weekly, rate);
    var services = getRequiredServices(tasks);
    var result   = document.getElementById('calcResult');
    var intro    = document.getElementById('srvIntro');

    if (tasks.length === 0) {
      if (result) result.style.display = 'none';
      if (intro)  intro.style.display  = 'none';
      return;
    }

    if (result) result.style.display = 'block';

    var hoursEl = document.getElementById('calcHoursVal');
    var costEl  = document.getElementById('calcCostVal');
    if (hoursEl) hoursEl.textContent = weekly + 'h';
    if (costEl)  costEl.textContent  = formatCost(monthly);

    ['agente', 'contenido', 'ecosistema'].forEach(function(s) {
      var tag = document.getElementById('tag-' + s);
      if (!tag) return;
      if (services.indexOf(s) !== -1) tag.classList.add('visible');
      else tag.classList.remove('visible');
    });

    if (intro) {
      var currentLang = localStorage.getItem('lang') || 'es';
      var introText = document.getElementById('srvIntroText');
      if (introText) {
        introText.textContent = currentLang === 'en'
          ? 'Based on your selection, these systems eliminate your ' + weekly + 'h/week of loss:'
          : 'Basado en tu selección, estos sistemas eliminan tus ' + weekly + 'h/sem de pérdida:';
      }
      intro.style.display = 'block';
    }
  };
})();
// ─── END CALCULATOR ───────────────────────────────────────────
```

- [ ] **Step 2: Open DevTools → Console. Reload page. Verify zero JS errors.**

- [ ] **Step 3: Click the first checkbox ("Responder mensajes y emails"). Verify:**
  - Item gets accent border and background
  - Checkmark appears (✓)
  - Result block (`#calcResult`) becomes visible
  - `calcHoursVal` shows `40h` (8h × 5 people default)
  - `calcCostVal` shows `$800` (40h × 4 weeks × $5)
  - `#tag-agente` becomes visible (has class `visible`)

- [ ] **Step 4: Click team size button "10". Verify:**
  - `calcHoursVal` updates to `80h`
  - `calcCostVal` updates to `$1.600`

- [ ] **Step 5: Change hourly rate input to `10`. Verify:**
  - `calcCostVal` updates to `$3.200` (80h × 4 × $10)

- [ ] **Step 6: Check "Publicar y responder en redes". Verify `#tag-contenido` becomes visible.**

- [ ] **Step 7: Check "Insertar datos entre sistemas". Verify `#tag-ecosistema` becomes visible.**

- [ ] **Step 8: Uncheck all tasks. Verify result block hides.**

---

### Task 5: Verify language switching

**Files:** No changes — verification only

- [ ] **Step 1: Click EN button in nav. Verify section title changes to "What you're losing / doing this manually".**

- [ ] **Step 2: Verify task labels switch to English (e.g. "Reply to messages & emails").**

- [ ] **Step 3: Verify team/rate labels switch: "Team size" and "Employee hourly cost (USD)".**

- [ ] **Step 4: Check any task. Verify result labels switch: "hours lost per week", "USD monthly in unproductive work", "To eliminate these losses you need:".**

- [ ] **Step 5: Verify scroll CTA switches to "These systems eliminate each of these tasks →".**

- [ ] **Step 6: Verify service card badges, pain headlines, body text and metrics all switch to English.**

- [ ] **Step 7: Click ES. Verify all text reverts to Spanish.**

---

### Task 6: Mobile verification

**Files:** No changes — verification only

- [ ] **Step 1: Open DevTools → Toggle device toolbar → set to 375px width.**

- [ ] **Step 2: Verify calculator tasks stack to 1 column (not 2).**

- [ ] **Step 3: Verify team buttons and rate input stack vertically.**

- [ ] **Step 4: Verify result block has no horizontal scroll.**

- [ ] **Step 5: Verify 3 service cards are readable. Check that `.srv-row` grid collapses correctly (handled by existing responsive CSS at line ~373).**

---

### Task 7: Commit and push

**Files:** `public/index.html`

- [ ] **Step 1: Verify no console errors in browser (desktop + mobile DevTools).**

- [ ] **Step 2: Stage and commit:**
```bash
git add public/index.html
git commit -m "feat: replace services section with pain calculator and 3 premium services"
```
Expected output: `[feat/services-pain-redesign ...] feat: replace services section with pain calculator and 3 premium services`

- [ ] **Step 3: Push branch:**
```bash
git push -u origin feat/services-pain-redesign
```

---

## Self-Review Against Spec

| Spec requirement | Task that covers it |
|---|---|
| Calculator: 8 tasks with correct hours + service mapping | Task 3 HTML |
| Team size selector (1/3/5/10/20, default 5) | Task 3 HTML |
| User-defined hourly rate input, default $5, real-time | Task 3 HTML + Task 4 JS |
| Result hidden until ≥1 task selected | Task 4 JS (`tasks.length === 0` check) |
| Hours formula: selectedHours × teamSize | Task 4 JS `calcWeeklyHours()` |
| Cost formula: weeklyHours × 4 × rate | Task 4 JS `calcMonthlyCost()` |
| Service tags appear per matching task | Task 4 JS, tag mapping |
| Scroll CTA → `#srv-premium` | Task 3 HTML `scrollIntoView` |
| 3 service cards: badge, pain, body, metric, CTA | Task 3 HTML |
| Prices: $1K, $1.5K, $3K | Task 3 HTML badges |
| All text bilingual (data-es / data-en) | Task 3 HTML, Task 5 verification |
| Mobile responsive | Task 2 CSS + Task 6 verification |
| New branch `feat/services-pain-redesign` | Task 1 |
| No other sections modified | Only `#servicios` replaced |
