# Registro de Agentes y Sub-agentes

## Agente Principal: Orchestrator
**Rol**: Coordinar todo el ciclo de vida de features. Recibe requests del usuario, delega a sub-agentes, consolida resultados.

**Responsabilidades**:
- Leer `spec/constitution/*` para contexto del proyecto
- Leer `spec/features/NNN-*/spec.md` para requirements
- Crear/actualizar `plan.md` y `tasks.md`
- Invocar sub-agentes en orden correcto
- Verificar completitud antes de marcar feature como done

**Herramientas**: Read, Write, Edit, Bash, Glob, Grep, Task (sub-agentes)

---

## Sub-agentes Especializados

### @subagent-backend
**Especialidad**: Backend Node.js/Express/MongoDB
**Contexto**: `spec/constitution/tech-stack.md`, `spec/architecture/system-design.md`, `spec/api/contracts.md`

**Tareas típicas**:
- Crear/modificar models, services, controllers, routes, middlewares
- Escribir tests unitarios (Jest) e integration (supertest)
- Configurar DB, migraciones, seeds
- Optimizar queries Mongoose, índices

**Restricciones**:
- NO tocar frontend
- Seguir patterns: service layer, middleware validation, controller thin
- Usar callbacks/async-await consistente con codebase actual

---

### @subagent-frontend
**Especialidad**: Frontend Next.js 14/React 18/TypeScript
**Contexto**: `spec/constitution/tech-stack.md`, `spec/architecture/system-design.md`, `spec/api/contracts.md`, `spec/api/types.ts`

**Tareas típicas**:
- Crear/modificar Server/Client Components en `app/`
- Implementar hooks, utils, API clients
- Estilos CSS (global + modules)
- Validación Zod, formularios, estado UI
- Accesibilidad, responsive

**Restricciones**:
- NO tocar backend
- Server Components por defecto, Client solo si interactividad real
- TypeScript strict, no `any`
- Axios para API calls

---

### @subagent-ai
**Especialidad**: Integración OpenAI / Prompts / RAG
**Contexto**: `back/src/services/assistantService.js`, `back/src/services/chatbotService.js`, `spec/constitution/constraints.md`

**Tareas típicas**:
- Diseñar/optimizar system prompts
- Implementar function calling, structured outputs
- RAG básico (embeddings + similarity search)
- Token counting, cost tracking, fallbacks

**Restricciones**:
- Solo via `assistantService.js` / `chatbotService.js`
- Temperatura ≤ 0.7
- Modelo configurable via env
- Logging de tokens por request

---

### @subagent-qa
**Especialidad**: Testing y Calidad
**Contexto**: `spec/constitution/tech-stack.md` (comandos test), `spec/features/NNN-*/tasks.md`

**Tareas típicas**:
- Escribir tests unitarios (Jest backend, Vitest/Jest frontend)
- Tests integration API (supertest)
- Tests E2E críticos (Playwright - futuro)
- Verificar cobertura, linting, typecheck

**Restricciones**:
- Usar frameworks existentes (Jest configurado en challenge-testing)
- Tests rápidos (< 5s unit, < 30s integration)
- Mocks para OpenAI, DB (en unit tests)

---

### @subagent-docs
**Especialidad**: Documentación Técnica
**Contexto**: Todo `spec/`, `AGENTS.md`, `README.md` (si existe)

**Tareas típicas**:
- Actualizar `contracts.md` tras cambios API
- Actualizar `tech-stack.md` tras nuevas deps
- Actualizar `system-design.md` tras cambios arquitectura
- Generar CHANGELOG entries
- Documentar decisions (ADR ligeros en `spec/architecture/decisions/`)

**Restricciones**:
- Documentación como código (markdown en repo)
- Actualizar EN EL MISMO PR que el código
- Formato consistente con archivos existentes

---

### @subagent-devops
**Especialidad**: Build, Deploy, CI/CD, Infra
**Contexto**: `package.json` scripts, `.env.example`, `spec/constitution/constraints.md`

**Tareas típicas**:
- Configurar CI (GitHub Actions / GitLab CI)
- Dockerfiles para front/back
- Variables entorno, secrets management
- Health checks, logging, monitoring básico
- Scripts de deploy

**Restricciones**:
- No cambiar arquitectura sin approval
- Mantener compatibilidad con comandos actuales (`npm run dev`, `npm start`)

---

## Cómo Invocar Sub-agentes

Desde el Orchestrator (o usuario), usar sintaxis:

```
@subagent-backend: Implementar service + controller + routes para feature 007
@subagent-frontend: Implementar componentes + API client para feature 007
@subagent-qa: Escribir tests unitarios service + integration API para 007
@subagent-docs: Actualizar contracts.md + tech-stack.md para 007
```

**Orden recomendado para features**:
1. `@subagent-backend` (API lista)
2. `@subagent-frontend` (consume API)
3. `@subagent-qa` (testea ambos)
4. `@subagent-docs` (documenta)
5. `@subagent-devops` (si hay cambios deploy)

---

## Comunicación Entre Agentes

- **Contexto compartido**: Archivos en `spec/` (source of truth)
- **Handoffs**: Un agente escribe/actualiza `spec/features/NNN-*/tasks.md` con checkboxes para el siguiente
- **Bloqueos**: Si un agente necesita algo de otro, añade nota en `tasks.md` con `@subagent-otro:`
- **Decisiones**: Registrar en `spec/architecture/decisions/NNN-decision.md` si hay trade-offs

---

## Template para Nuevo Sub-agente

Si necesitas un sub-agente especializado nuevo, crea archivo en `spec/agents/`:

```markdown
# @subagent-[nombre]

## Especialidad
[Dominio específico]

## Contexto Requerido
[Archivos spec que debe leer]

## Tareas Típicas
- [Tarea 1]
- [Tarea 2]

## Restricciones
- [Restricción 1]
- [Restricción 2]

## Herramientas Permitidas
[Listado de tools: Read, Write, Edit, Bash, etc.]
```