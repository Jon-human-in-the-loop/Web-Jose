# HELIX AI — Sitio Web Institucional

Sitio web institucional de **HELIX AI Growth Agency**, agencia de crecimiento digital especializada en automatización, inteligencia artificial y ecosistemas digitales integrados.

---

## Descripción

Sitio estático con API serverless que incluye:

- Landing page principal con propuesta de valor, servicios, casos de éxito, testimonios y formulario de contacto
- Portfolio con 10 proyectos detallados (ES/EN)
- Chatbot de ventas con IA (Cohere + Groq como fallback)
- Sistema de internacionalización ES/EN integrado
- FAQ, Política de Privacidad y Términos de Uso
- Diseño 100% responsive con carruseles móviles

---

## Estructura del proyecto

```
Web-Jose/
├── public/
│   ├── index.html              # Landing page principal
│   ├── faq.html                # Preguntas frecuentes
│   ├── portfolio.html          # Grilla de proyectos
│   ├── assets/
│   │   └── iphone17promax.png  # Demo visual del chatbot
│   ├── images/                 # Imágenes generales
│   └── projects/               # Páginas de detalle por proyecto
│       ├── 01-video-produccion.html        # Sistema Video IA (EN)
│       ├── 01-video-produccion-es.html     # Sistema Video IA (ES)
│       ├── 02-ecosistema-agentes.html      # Ecosistema Agentes IA (EN)
│       ├── 02-ecosistema-agentes-es.html
│       ├── 03-self-healing.html            # Self-Healing n8n (EN)
│       ├── 03-self-healing-es.html
│       ├── 04-cruxanalytics.html           # CruxAnalytics BI (EN)
│       ├── 04-cruxanalytics-es.html
│       ├── 05-ecommerce-trafico.html       # E-commerce Alto Tráfico (EN)
│       ├── 05-ecommerce-trafico-es.html
│       ├── 06-business-case.html           # Business Case Analyzer (EN)
│       ├── 06-business-case-es.html
│       ├── 07-persona-ia.html              # PoC Persona Digital IA (EN)
│       ├── 07-persona-ia-es.html
│       ├── 08-clawsuite.html               # ClawSuite Security (EN)
│       ├── 08-clawsuite-es.html
│       ├── 09-kultur-atelier.html          # Kultur Atelier Branding (EN)
│       ├── 09-kultur-atelier-es.html
│       ├── 10-entremares.html              # Entremares E-commerce (EN)
│       └── 10-entremares-es.html
├── api/
│   └── chat.js                 # API serverless del chatbot (Node.js)
├── docs/
│   └── superpowers/            # Documentación interna
├── privacy.html                # Política de privacidad
├── terms.html                  # Términos de uso
└── generate-projects.js        # Script generador de páginas de proyectos
```

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Tipografía | Inter Tight (Google Fonts) |
| API | Node.js (serverless) |
| IA primaria | Cohere `command-r-plus-08-2024` |
| IA fallback | Groq `llama-3.1-8b-instant` |
| Hosting | Vercel (o compatible con `/api` serverless) |
| Control de versiones | Git / GitHub |

---

## Variables de entorno

La API del chatbot requiere las siguientes variables configuradas en el entorno de despliegue:

```env
COHERE_API_KEY=tu_api_key_de_cohere
GROQ_API_KEY=tu_api_key_de_groq
```

> El sistema intenta primero Cohere. Si falla, hace fallback automático a Groq.

---

## Chatbot de ventas

El archivo `api/chat.js` implementa un asistente de ventas entrenado con:

- Descripción completa de servicios y casos de éxito
- Metodología de embudo: diagnóstico → manejo de objeciones → cierre
- Soporte multiidioma (responde en el idioma del usuario)
- Marcador `[AUDIT_BTN]` que el frontend convierte en botón de agendamiento
- Máximo 2-3 líneas por respuesta para mantener fluidez conversacional

---

## Sistema de internacionalización (i18n)

El cambio de idioma ES/EN se implementa con atributos HTML `data-es` y `data-en` procesados por la función `setLang()` en JavaScript. **Importante:** esta función escribe contenido como texto plano (`textContent`), por lo que elementos HTML embebidos dentro de spans traducibles serán eliminados al cambiar de idioma.

---

## Proyectos destacados

| # | Proyecto | Resultado clave |
|---|----------|----------------|
| 01 | Sistema Producción Video IA | −85% costos, 100+ variaciones/semana |
| 02 | Ecosistema Agentes IA (14+ apps) | Cero transferencias manuales |
| 03 | Self-Healing n8n | 99.99% uptime, cero intervención DevOps |
| 04 | CruxAnalytics | Análisis de semanas en 2 horas |
| 05 | E-commerce Alto Tráfico | 10K+ req simultáneos, zero SQL injections |
| 06 | Business Case Analyzer | 20+ escenarios financieros en 1 sesión |
| 07 | PoC Persona Digital IA | 16 referentes analizados, riesgo mitigado |
| 08 | ClawSuite Security | 47 vulnerabilidades → cero críticas |
| 09 | Kultur Atelier Branding | 100% coherencia en 2 sedes, 5+ líneas merch |
| 10 | Entremares E-commerce | Venta 24/7 en Portugal y España |

---

## Despliegue

El proyecto está diseñado para desplegarse en plataformas compatibles con sitios estáticos + funciones serverless en `/api` (Vercel, Netlify, etc.).

1. Clonar el repositorio
2. Configurar las variables de entorno `COHERE_API_KEY` y `GROQ_API_KEY`
3. Desplegar — el directorio `public/` se sirve como raíz estática y `api/` como funciones serverless

---

## Contacto

**HELIX AI Growth Agency**
Desarrollado por [Vanguard Crux](https://www.vanguardcrux.com/)
© 2026 HELIX AI Growth Agency
