# HELIX AI — Growth Agency Website

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
</p>

<p align="center">
  Sitio institucional de <strong>HELIX AI Growth Agency</strong> — automatización, inteligencia artificial y ecosistemas digitales integrados.
</p>

---

## Vista general

Landing page institucional con chatbot de ventas IA integrado, portfolio de proyectos bilingüe (ES/EN) y diseño dark de alto impacto.

**Páginas incluidas:**
- `/` — Landing principal con propuesta de valor, servicios, casos de éxito y contacto
- `/portfolio` — Grilla de los 10 proyectos con páginas de detalle individuales
- `/faq` — Preguntas frecuentes
- `/privacy` y `/terms` — Páginas legales

---

## Chatbot de ventas IA

El sitio incluye un asistente conversacional entrenado como vendedor de la agencia:

- Responde en el idioma del usuario (ES, EN, PT, etc.)
- Maneja objeciones, califica leads y ejecuta el cierre automáticamente
- **Proveedor principal:** Cohere `command-r-plus-08-2024`
- **Fallback automático:** Groq `llama-3.1-8b-instant`
- Sin dependencias externas de frontend — Vanilla JS puro

---

## Proyectos en el portfolio

| # | Proyecto | Resultado |
|---|----------|-----------|
| 01 | Sistema Producción Video IA | −85% costos · 100+ variaciones/semana |
| 02 | Ecosistema Agentes IA (14+ apps) | Cero transferencias manuales de datos |
| 03 | Self-Healing n8n | 99.99% uptime · cero intervención DevOps |
| 04 | CruxAnalytics — BI + XAI | Análisis de semanas resuelto en 2 horas |
| 05 | E-commerce Alto Tráfico | 10K+ req simultáneos · zero SQL injections |
| 06 | Business Case Analyzer | 20+ escenarios financieros en 1 sesión |
| 07 | PoC Persona Digital IA | 16 referentes analizados · riesgo mitigado |
| 08 | ClawSuite Security | 47 vulnerabilidades → cero críticas |
| 09 | Kultur Atelier Branding | 100% coherencia en 2 sedes · 5+ líneas merch |
| 10 | Entremares E-commerce Multiidioma | Venta 24/7 en Portugal y España |

---

## Stack

```
Frontend    →  HTML5 · CSS3 · Vanilla JS · Inter Tight (Google Fonts)
API         →  Node.js serverless (/api)
IA          →  Cohere API + Groq (fallback)
Deploy      →  Vercel
```

---

## Variables de entorno

```env
COHERE_API_KEY=your_cohere_api_key
GROQ_API_KEY=your_groq_api_key
```

---

## Desarrollo por

[**Vanguard Crux**](https://www.vanguardcrux.com/) — Estrategia, diseño e implementación.

---

<p align="center">© 2026 HELIX AI Growth Agency</p>
