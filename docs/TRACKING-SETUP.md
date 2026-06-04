# Guía: activar tracking (Google Analytics, Meta Pixel, etc.)

> **Para la IA:** Cuando el usuario diga algo como _"estoy listo para agregar Google Analytics / Meta Pixel / el tracking"_, seguí esta guía. Todo el sistema de consentimiento ya está construido y es compatible con RGPD/GDPR — **solo falta pegar los IDs**. No hace falta tocar HTML ni regenerar páginas para activar el tracking básico: todo vive en un único archivo compartido.

---

## TL;DR (lo único obligatorio)

1. Abrí **`public/js/atelier.js`**.
2. Buscá el bloque `var TRACKING = {` (cerca del comentario `FILL THESE IN WHEN READY`).
3. Pegá los IDs entre las comillas. Dejá `""` en los que no uses.
4. Guardá y redeployá (es un sitio estático en Vercel — basta con subir el cambio).

```js
var TRACKING = {
  ga4:       "G-XXXXXXXXXX",   // Google Analytics 4   (categoría: analytics)
  gtm:       "GTM-XXXXXXX",    // Google Tag Manager    (categoría: analytics)
  metaPixel: "1234567890"      // Meta / Facebook Pixel (categoría: marketing)
};
```

Eso es todo. Los scripts se cargan **solo si** el visitante aceptó la categoría correspondiente. Si quedan en `""`, no se carga nada.

---

## Cómo funciona (contexto para la IA)

- **Archivo único:** toda la lógica de consentimiento + carga de tracking está en `public/js/atelier.js`, dentro del IIFE marcado `COOKIE CONSENT + TRACKING GATE`. Ese archivo se incluye en **todas** las páginas (index, portfolio, las 20 páginas de proyectos, faq, privacy, terms). Por eso **cambiar los IDs no requiere regenerar nada**.
- **Estilos** del banner/panel: `public/css/atelier.css` (selectores `.cookie-consent`, `.cc-row`, `.cc-switch`, etc.). No hace falta tocarlos para activar tracking.
- **Estado de consentimiento:** se guarda en `localStorage` con la clave `atelierConsent` como JSON:
  ```json
  { "necessary": true, "analytics": false, "marketing": false, "ts": 0 }
  ```
- **Mapeo categoría → proveedor:**
  | Categoría  | Carga                         |
  |------------|-------------------------------|
  | analytics  | `ga4`, `gtm`                  |
  | marketing  | `metaPixel`                   |
  | necessary  | (siempre activa, no carga nada)|
- **Cargadores ya implementados:** `loadGA4()`, `loadGTM()`, `loadMetaPixel()` (snippets oficiales, con protección anti-doble-carga). La función `apply(state)` decide qué cargar según el consentimiento. En el arranque: si el visitante ya consintió, se reaplica en silencio; si no, se muestra el banner.

---

## API pública (para eventos / casos avanzados)

```js
AtelierConsent.open()             // reabrir el panel de preferencias (ya cableado en el footer de todas las páginas)
AtelierConsent.get()              // → {necessary, analytics, marketing, ts}
AtelierConsent.has("analytics")   // → true/false
AtelierConsent.has("marketing")   // → true/false
AtelierConsent.set({ analytics:true, marketing:false })  // setear desde código
```

**Disparar eventos solo con consentimiento** (ejemplos):

```js
// Meta Pixel — evento de lead al enviar el formulario de contacto
if (AtelierConsent.has("marketing") && window.fbq) fbq("track", "Lead");

// GA4 — evento personalizado
if (AtelierConsent.has("analytics") && window.gtag) gtag("event", "audit_request");
```

> **Ya está cableado:** el formulario de contacto (`submitForm()` en `public/index.html`) tiene un **hueco preparado** dentro del bloque `if(res.ok){...}` (buscá el comentario `HUECO PREPARADO · eventos de conversión`). Dispara `fbq('track','Lead')` y `gtag('event','generate_lead')` automáticamente cuando el tracking esté activo y el visitante haya consentido — **no hay que tocar nada ahí** al activar. Para más eventos, seguí el mismo patrón gated.

---

## Agregar OTROS proveedores (TikTok, LinkedIn, Hotjar, etc.)

Patrón a seguir dentro del mismo IIFE en `public/js/atelier.js`:

1. Agregar el ID al objeto `TRACKING` (ej. `tiktok: ""`).
2. Agregar un flag en `var loaded = {...}` (ej. `tiktok:false`).
3. Escribir una función `loadTikTok(id)` con el snippet oficial (copiar el patrón de `loadMetaPixel`, con guard `if(loaded.tiktok || !id) return; loaded.tiktok=true;`).
4. En `function apply(s){ ... }`, invocarla bajo la categoría correcta:
   - analytics → Hotjar, Clarity, GA, GTM
   - marketing → TikTok, LinkedIn Insight, Google Ads, Meta
5. Si es una categoría nueva (no analytics/marketing), agregar también una fila al panel: en `build()` sumar `catRow("xxx", false, !!s.xxx)` y los textos en `TXT.es`/`TXT.en` (`xxxT` título, `xxxD` descripción), y en `DEFAULTS`.

---

## Actualizar la Política de Privacidad (recomendado al activar)

**Ya está preparado:** en `privacy.html` y `public/privacy.html`, la **sección 9** ya describe el sistema de consentimiento, y hay una **sección 9.1 comentada** (busca `PÁRRAFO PREPARADO`) con el detalle de Google/Meta. Para activarla: **descomentá el bloque `<!-- ... -->`** en AMBOS archivos (mantenelos iguales) y ajustá la lista de proveedores a los que uses realmente. (`privacy.html` es solo español; no usa `data-es/data-en`.)

El texto del bloque preparado es el siguiente (por si hay que reponerlo):

**ES:**
> **Cookies de terceros y analítica.** Con tu consentimiento utilizamos Google Analytics 4 (Google LLC) para entender el uso del sitio y Meta Pixel (Meta Platforms, Inc.) para medir y optimizar campañas publicitarias. Estas herramientas pueden instalar cookies y procesar datos de uso. Podés cambiar o retirar tu consentimiento en cualquier momento desde el enlace **"Preferencias de cookies"** en el pie de página.

**EN:**
> **Third-party cookies & analytics.** With your consent we use Google Analytics 4 (Google LLC) to understand site usage and Meta Pixel (Meta Platforms, Inc.) to measure and optimize advertising. These tools may set cookies and process usage data. You can change or withdraw your consent at any time via the **"Cookie preferences"** link in the footer.

---

## Checklist de verificación (después de pegar IDs)

- [ ] Visitante nuevo: aparece el banner; al **Aceptar todo** se cargan los scripts (verificar en DevTools → Network: `gtag/js`, `fbevents.js`).
- [ ] **Rechazar**: NO debe aparecer ninguna request de tracking.
- [ ] **Configurar** → activar solo *Analíticas* → Guardar: carga GA/GTM pero **no** Meta Pixel.
- [ ] Recargar como visitante que ya consintió: sin banner, pero el tracking se reaplica.
- [ ] Footer → **"Preferencias de cookies"** reabre el panel reflejando lo guardado.
- [ ] En GA4 (Realtime) y/o Meta Events Manager se ve el `PageView`.
- [ ] Política de privacidad actualizada y desplegada.

---

## Notas

- Es un sitio **estático** (sin build): editar `atelier.js` y desplegar a Vercel basta. No hay `package.json` ni paso de compilación.
- Las páginas de proyecto se generan con `node generate-projects.js`, pero **no** hace falta regenerarlas para cambiar IDs de tracking (el tracking vive en `atelier.js`, no en el HTML generado).
- Si en el futuro se quiere bloquear/condicionar también algo del lado servidor (`api/chat.js`), eso es aparte y no lo cubre este gate de front-end.
