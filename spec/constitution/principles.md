# Principios de Diseño y Arquitectura

## 1. Separación de Responsabilidades Estricta
- **Frontend** = Solo presentación + estado de UI + llamadas API
- **Backend** = Lógica de negocio + persistencia + integración IA
- **Nunca** lógica de negocio en componentes React
- **Nunca** HTML/CSS en controladores Express

## 2. API First / Contract First
- Definir endpoints en `spec/api/contracts.md` antes de implementar
- Versionado obligatorio: `/api/v1/`
- Respuestas consistentes: `{ success: boolean, data: T, error?: string }`

## 3. Type Safety End-to-End
- TypeScript estricto en frontend
- JSDoc + tipos en backend (no TS, pero documentado)
- Tipos compartidos via `spec/api/types.ts` (fuente de verdad)

## 4. IA como Capa de Servicio, No Magia
- `assistantService.js` encapsula todo lo de OpenAI
- Prompts versionados en `spec/ai/prompts/`
- Fallbacks determinísticos si IA falla
- Logging de tokens/costos por request

## 5. Datos Verificables
- Campo `verified: boolean` obligatorio en Movie
- Campo `source: string` trazable
- No datos "alucinados" en base de datos principal

## 6. Performance Perceptible
- Server Components por defecto (Next.js App Router)
- Client Components solo donde hay interactividad real
- Imágenes optimizadas (next/image o lazy load nativo)
- Bundle < 100KB gzipped inicial

## 7. Accesibilidad Base
- Semantic HTML siempre
- Focus visible en elementos interactivos
- Contraste AA mínimo
- ARIA labels en chatbot y formularios

## 8. Observabilidad Mínima
- Morgan en backend (dev)
- Console.log estructurado en servicios clave
- Error boundary en frontend con reporte