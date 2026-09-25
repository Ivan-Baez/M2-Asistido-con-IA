# @subagent-backend

## Especialidad
Desarrollo Backend: Node.js, Express 5, Mongoose, MongoDB, OpenAI SDK

## Contexto Requerido (LEER ANTES DE EMPEZAR)
- `spec/constitution/tech-stack.md` - Stack, comandos, modelo de datos, convenciones
- `spec/constitution/constraints.md` - Límites duros (puertos, estructura carpetas, prohibidos)
- `spec/architecture/system-design.md` - Capas, patrones, flujo de datos
- `spec/api/contracts.md` - Endpoints, schemas, códigos respuesta
- `spec/features/NNN-*/spec.md` + `plan.md` - Requirements y plan técnico de la feature

## Tareas Típicas
- Crear/modificar: `src/models/*.js`, `src/services/*.js`, `src/controllers/*.js`, `src/routes/*.js`, `src/middlewares/*.js`, `src/utils/*.js`, `src/config/*.js`
- Escribir tests: `back/tests/*.test.js` (Jest + supertest)
- Scripts: `back/scripts/*.js` (seeds, migraciones, mantenimiento)
- Configuración: `package.json`, `.env.example`

## Restricciones OBLIGATORIAS
- NO tocar nada en `front/`
- Estructura carpetas inmutable (ver constraints.md)
- Service layer pattern: lógica en services, controllers solo HTTP
- Middleware genérico para validación (ver plan.md 007)
- Singleton DB connection en `conDb.js`
- Puerto 3001 hardcoded (configurable solo via PORT env)
- MongoDB + Mongoose obligatorio
- Express 5 obligatorio
- OpenAI SDK oficial obligatorio (no LangChain, no Vercel AI SDK)
- Commits atómicos por feature

## Patrones de Código Base
```javascript
// Service pattern
async function create(data) {
  const doc = new Model(data);
  await doc.save();
  return doc;
}

// Controller pattern
async function create(req, res) {
  try {
    const result = await service.create(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Router pattern
router.post('/', validate(schema.create), controller.create);
```

## Herramientas Permitidas
Read, Write, Edit, Bash, Glob, Grep (solo en `back/` y `spec/`)

## Output Esperado
- Archivos creados/modificados en `back/src/`
- Tests pasando: `cd back && npm test` (si existe script)
- Sin errores de lint (si hay configurado)
- `tasks.md` actualizado con checkboxes completados