# Spec Folder - Project Specification for AI Agents

Esta carpeta contiene toda la especificación técnica del proyecto **PM2-Ivan-Baez** diseñada para ser consumida por agentes IA y sub-agentes especializados.

## Estructura

```
spec/
├── constitution/           # Fundamentos inmutables del proyecto
│   ├── mission.md         # Qué construimos, para quién, principios, qué no es
│   ├── tech-stack.md      # Stack completo: front, back, DB, IA, comandos, env vars
│   ├── roadmap.md         # Features hechas + planificadas (con numeración NNN)
│   ├── principles.md      # Principios de diseño/arquitectura (8 principios)
│   └── constraints.md     # Límites duros NO negociables (technical guardrails)
│
├── architecture/          # Diseño del sistema
│   ├── system-design.md   # Diagramas, flujo datos, capas, patrones, extensión
│   └── decisions/         # ADR (Architecture Decision Records) - crear según necesidad
│
├── api/                   # Contratos de API (Source of Truth)
│   ├── contracts.md       # Endpoints, schemas, códigos, versionado, CORS
│   └── types.ts           # Tipos TypeScript compartidos front/back + Zod schemas
│
├── features/              # Especificación por feature (una carpeta por feature)
│   ├── TEMPLATE/          # Plantillas: spec.md, plan.md, tasks.md
│   └── 007-validation-sanitization/  # Ejemplo feature real
│       ├── spec.md        # Qué, por qué, criterios aceptación
│       ├── plan.md        # Cómo: archivos, endpoints, DB, testing, deploy
│       └── tasks.md       # Checklist atómico + sub-tareas para sub-agentes
│
├── agents/                # Definiciones de agentes y sub-agentes
│   ├── registry.md        # Catálogo completo: orchestrator + 6 sub-agentes
│   ├── backend.md         # @subagent-backend: Node/Express/Mongo/OpenAI
│   ├── frontend.md        # @subagent-frontend: Next.js/React/TS/Axios
│   ├── ai.md              # @subagent-ai: OpenAI SDK, prompts, RAG, function calling
│   ├── qa.md              # @subagent-qa: Jest, supertest, coverage, lint
│   ├── docs.md            # @subagent-docs: contracts, ADR, tech-stack, changelog
│   └── devops.md          # @subagent-devops: CI/CD, Docker, health checks, deploy
│
└── ai/                    # (Crear cuando @subagent-ai genere prompts)
    └── prompts/           # System prompts versionados, function calling schemas
```

## Cómo Usar

### 1. Contexto Inicial (Orchestrator)
```bash
# Leer en orden:
spec/constitution/mission.md
spec/constitution/tech-stack.md
spec/constitution/constraints.md
spec/architecture/system-design.md
spec/api/contracts.md
```

### 2. Nueva Feature
```bash
# 1. Crear carpeta
mkdir spec/features/NNN-nombre-corto

# 2. Copiar templates
cp spec/features/TEMPLATE/spec.md  spec/features/NNN-nombre-corto/
cp spec/features/TEMPLATE/plan.md  spec/features/NNN-nombre-corto/
cp spec/features/TEMPLATE/tasks.md spec/features/NNN-nombre-corto/

# 3. Rellenar spec.md → plan.md → tasks.md
# 4. Invocar sub-agentes según tasks.md
```

### 3. Invocar Sub-agentes
```markdown
@subagent-backend: Implementar service + controller + routes para feature NNN
@subagent-frontend: Implementar componentes + API client para feature NNN
@subagent-qa: Tests unitarios service + integration API para NNN
@subagent-docs: Actualizar contracts.md + tech-stack.md para NNN
```

### 4. Sub-agentes Especializados
Cada uno en `spec/agents/*.md` define:
- Qué archivos leer ANTES de empezar
- Qué tareas típicas hace
- Restricciones obligatorias
- Patrones de código base
- Herramientas permitidas
- Output esperado

## Convenciones

- **NNN** = número secuencial 3 dígitos (001, 002, 007, 015...)
- **kebab-case** para nombres de carpetas features
- **Source of truth**: `spec/api/types.ts` + `spec/api/contracts.md`
- **Documentación como código**: Actualizar EN EL MISMO PR que el código
- **ADR** solo para decisiones irreversibles (DB, framework, auth, deploy)

## Comandos Útiles

```bash
# Ver features existentes
ls spec/features/

# Ver roadmap actual
cat spec/constitution/roadmap.md

# Ver contratos API
cat spec/api/contracts.md

# Ver agentes disponibles
cat spec/agents/registry.md
```

---

**Mantenido por**: @subagent-docs (actualizaciones) + Orchestrator (nuevas features)
**Última actualización**: 2024-08-31