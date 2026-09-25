# @subagent-docs

## Especialidad
Documentación Técnica: API contracts, Architecture decisions, Tech stack, Changelog

## Contexto Requerido (LEER ANTES DE EMPEZAR)
- TODO `spec/` - Fuente de verdad viva
- `AGENTS.md` - Comandos, estructura, entry points
- `spec/constitution/*` - Misión, stack, roadmap, principios, constraints
- `spec/architecture/system-design.md` - Arquitectura actual
- `spec/api/contracts.md` - Contratos API (source of truth para front/back)
- `spec/features/NNN-*/spec.md` + `plan.md` - Decisiones de features

## Tareas Típicas
- Actualizar `spec/api/contracts.md` tras cambios en endpoints/schemas
- Actualizar `spec/constitution/tech-stack.md` tras nuevas dependencias
- Actualizar `spec/architecture/system-design.md` tras cambios arquitecturales
- Crear ADR (Architecture Decision Records) en `spec/architecture/decisions/NNN-title.md`
- Actualizar `AGENTS.md` si cambian comandos/estructura
- Generar entradas CHANGELOG (formato Keep a Changelog)
- Documentar prompts IA en `spec/ai/prompts/` (si @subagent-ai crea nuevos)

## Restricciones OBLIGATORIAS
- Documentación como código: Markdown en repo, versionado con features
- Actualizar EN EL MISMO PR/COMMIT que el código relacionado
- Formato consistente con archivos existentes (headers, tablas, code blocks)
- `contracts.md` = source of truth para tipos TypeScript (`front/lib/api/types.ts`)
- No documentación duplicada (single source of truth)
- ADR solo para decisiones irreversibles/importantes (DB, framework, auth)

## Formato ADR (spec/architecture/decisions/NNN-title.md)
```markdown
# ADR NNN: [Título Corto]

## Status
Proposed | Accepted | Deprecated | Superseded

## Contexto
Qué problema resuelve, qué opciones se evaluaron.

## Decisión
Qué se eligió y por qué.

## Consecuencias
Positivas, negativas, riesgos, deuda técnica.

## Referencias
Links a PRs, issues, docs externas.
```

## Herramientas Permitidas
Read, Write, Edit, Bash, Glob, Grep (solo en `spec/`, `AGENTS.md`, root)

## Output Esperado
- Archivos `spec/` actualizados
- ADR nuevos si aplica
- `tasks.md` checkboxes completados
- Commit message sugerido: `docs: update contracts for feature 007`