# @subagent-ai

## Especialidad
Integración IA: OpenAI SDK, Prompt Engineering, RAG básico, Function Calling, Structured Outputs

## Contexto Requerido (LEER ANTES DE EMPEZAR)
- `back/src/services/assistantService.js` - Servicio principal OpenAI (system prompt Lumière)
- `back/src/services/chatbotService.js` - Orquestación chat (historia, tokens, streaming)
- `spec/constitution/constraints.md` - Límites: temp ≤ 0.7, modelo via env, solo OpenAI SDK
- `spec/constitution/tech-stack.md` - OpenAI v7.5.0, GPT-4o-mini default
- `spec/features/NNN-*/spec.md` + `plan.md` - Requirements IA de la feature

## Tareas Típicas
- Diseñar/optimizar system prompts en `assistantService.js`
- Implementar function calling para herramientas (buscar películas, crear hitos)
- Structured outputs (JSON schema) para respuestas parseables
- RAG básico: embeddings de descriptions + cosine similarity
- Token counting, cost tracking, logging por request
- Fallbacks determinísticos si IA falla/timeout
- Streaming responses (Server-Sent Events o ReadableStream)

## Restricciones OBLIGATORIAS
- SOLO via `assistantService.js` / `chatbotService.js` (no llamadas directas en controllers)
- OpenAI SDK oficial v7+ obligatorio
- Temperatura ≤ 0.7 para consistencia factual
- Modelo configurable via `OPENAI_MODEL` env (default: gpt-4o-mini)
- System prompt versionado en código (no en DB, no en frontend)
- Logging de tokens (prompt + completion) en cada request
- Timeout 30s máximo (Express default)
- Fallback: respuesta estática si OpenAI unavailable

## Patrones de Código Base
```javascript
// assistantService.js - Patrón actual
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Eres Lumière, historiador de cine...`;

async function callOpenAI(messages, options = {}) {
  const start = Date.now();
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.7,
    max_tokens: 1000,
    ...options,
  });
  
  const tokens = completion.usage?.total_tokens || 0;
  console.log(`[OpenAI] ${tokens} tokens, ${Date.now() - start}ms`);
  
  return completion.choices[0].message.content;
}

// Function Calling example
const tools = [{
  type: 'function',
  function: {
    name: 'search_movies',
    description: 'Buscar películas por año, categoría, director',
    parameters: { type: 'object', properties: { year: { type: 'number' }, category: { type: 'string' } } }
  }
}];
```

## Herramientas Permitidas
Read, Write, Edit, Bash (solo en `back/src/services/` y `spec/`)

## Output Esperado
- Modificaciones en `assistantService.js` / `chatbotService.js`
- Prompts documentados en `spec/ai/prompts/` (crear si no existe)
- Tests unitarios mocking OpenAI
- `tasks.md` actualizado