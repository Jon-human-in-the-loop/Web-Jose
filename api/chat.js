const https = require('https');

function fetchJson(urlStr, options, bodyData) {
  return new Promise((resolve, reject) => {
    const req = https.request(urlStr, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages' });

  const COHERE_API_KEY = process.env.COHERE_API_KEY;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!COHERE_API_KEY || !GROQ_API_KEY) {
    console.warn("API keys not configured in environment.");
  }

  const systemPrompt = `Eres Jose AI, el asistente virtual y experto en ventas de "Jose AI Growth Agency".
Somos una Agencia de Crecimiento Digital e IA (AI & Digital Growth Agency).
Nuestra misión: Diseñamos arquitecturas de crecimiento que automatizan ventas, optimizan procesos y posicionan marcas como líderes digitales.

CONTEXTO DEL NEGOCIO (QUÉ HACEMOS):
1. Estrategia e Identidad
2. Ecosistemas de Crecimiento Digital
3. Automatización Agéntica
4. Infraestructura Web

Metodología de 4 pasos:
1) Auditoría y Diagnóstico 
2) Diseño de Arquitectura 
3) Implementación Agéntica 
4) Optimización Continua 

Detalles operativos:
- Clientes: Startups y medianas empresas en Latam, Europa y USA (operamos 100% remoto).
- Resultados: Se ven entre 30 a 90 días.
- Precios: No damos presupuestos fijos por chat. Los proyectos parten de los $1,000 USD, pero debes evitar dar el precio exacto e invitar a la auditoría.

TU OBJETIVO Y PERSONALIDAD:
- Tu objetivo principal es resolver dudas y ORIENTAR ESTRICTAMENTE AL USUARIO A AGENDAR UNA AUDITORÍA GRATUITA usando el formulario de la web ("Solicitar Auditoría").
- Respuestas MUY BREVES (no más de 2 líneas por respuesta).
- Debes responder SIEMPRE en el mismo idioma en el que el usuario te escriba.
- Sé sumamente persuasivo, directo y muy amigable.`;

  try {
    const lastMessage = messages[messages.length - 1].content;
    const chatHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'USER' : 'CHATBOT',
      message: m.content
    }));

    const coherePayload = JSON.stringify({
      model: 'command-r-plus-08-2024',
      message: lastMessage,
      chat_history: chatHistory,
      preamble: systemPrompt
    });

    const cohereData = await fetchJson('https://api.cohere.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(coherePayload)
      }
    }, coherePayload);

    return res.status(200).json({ reply: cohereData.text, provider: 'cohere' });

  } catch (error) {
    console.warn('Cohere falló, fallback a Groq...', error.message);
    
    try {
      const groqMessages = [{ role: 'system', content: systemPrompt }, ...messages];
      const groqPayload = JSON.stringify({
        model: 'llama-3.1-8b-instant', 
        messages: groqMessages,
        max_tokens: 300,
        temperature: 0.6
      });

      const groqData = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(groqPayload)
        }
      }, groqPayload);

      return res.status(200).json({ reply: groqData.choices[0].message.content, provider: 'groq' });
      
    } catch (fallbackError) {
      console.error('Groq también falló:', fallbackError.message);
      return res.status(500).json({ reply: 'Lo siento, estoy teniendo problemas técnicos temporales. Por favor utiliza nuestro WhatsApp o el formulario de contacto para hablar.' });
    }
  }
};
